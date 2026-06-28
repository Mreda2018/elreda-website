import crypto from "node:crypto";

import { revalidatePath } from "next/cache";

import { getRequiredServerEnv } from "@/lib/env.server";

type SanityWebhookBody = {
  _type?: string;
  slug?: {
    current?: string;
  };
};

type RevalidatedPath = {
  path: string;
  type?: "page" | "layout";
};

type SanitySignatureParts = {
  timestamp?: string;
  signature?: string;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseSanitySignature(header: string): SanitySignatureParts {
  return header.split(",").reduce<SanitySignatureParts>((parts, segment) => {
    const [key, value] = segment.trim().split("=");

    if (key === "t" && value) {
      return { ...parts, timestamp: value };
    }

    if (key === "v1" && value) {
      return { ...parts, signature: value };
    }

    return parts;
  }, {});
}

function isValidSignature(body: string, signatureHeader: string, secret: string): boolean {
  const { timestamp, signature } = parseSanitySignature(signatureHeader);

  if (!timestamp || !signature) {
    return false;
  }

  const digest = crypto.createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(digest, "hex");

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
}

function getLocalizedPaths(path: string): RevalidatedPath[] {
  return [{ path }, { path: `/en${path === "/" ? "" : path}` }];
}

function getRevalidationPaths(body: SanityWebhookBody): RevalidatedPath[] {
  const slug = body.slug?.current;

  switch (body._type) {
    case "service":
      return [
        ...getLocalizedPaths("/"),
        ...getLocalizedPaths("/services"),
        ...(slug ? getLocalizedPaths(`/services/${slug}`) : [{ path: "/services/[slug]", type: "page" as const }]),
      ];
    case "portfolio":
      return [
        ...getLocalizedPaths("/"),
        ...getLocalizedPaths("/portfolio"),
        ...(slug ? getLocalizedPaths(`/portfolio/${slug}`) : [{ path: "/portfolio/[slug]", type: "page" as const }]),
      ];
    case "blogPost":
      return [
        ...getLocalizedPaths("/"),
        ...getLocalizedPaths("/blog"),
        ...(slug ? getLocalizedPaths(`/blog/${slug}`) : [{ path: "/blog/[slug]", type: "page" as const }]),
      ];
    case "testimonial":
    case "teamMember":
    case "settings":
    case "redirect":
      return [{ path: "/", type: "layout" }];
    default:
      return [{ path: "/", type: "layout" }];
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("sanity-webhook-signature");

  if (!signature) {
    return new Response("Unauthorized", { status: 401 });
  }

  const secret = getRequiredServerEnv("SANITY_WEBHOOK_SECRET");

  if (!isValidSignature(body, signature, secret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: SanityWebhookBody;

  try {
    payload = JSON.parse(body) as SanityWebhookBody;
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const paths = getRevalidationPaths(payload);

  for (const item of paths) {
    if (item.type) {
      revalidatePath(item.path, item.type);
    } else {
      revalidatePath(item.path);
    }
  }

  return Response.json({
    revalidated: true,
    paths,
  });
}
