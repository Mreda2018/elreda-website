import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

import { getOptionalServerEnv } from "@/lib/env.server";

type ProtectedFormType = "contact" | "quote";

type ProtectionResult =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      reason: "rate_limited" | "turnstile_failed";
    };

type UpstashCommandResponse = {
  result?: unknown;
  error?: string;
};

type TurnstileVerifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;

function getFirstForwardedIp(value: string | null): string | undefined {
  return value
    ?.split(",")
    .map((part) => part.trim())
    .find(Boolean);
}

async function getClientIp(): Promise<string> {
  const headerList = await headers();

  return (
    headerList.get("cf-connecting-ip") ??
    headerList.get("x-real-ip") ??
    getFirstForwardedIp(headerList.get("x-forwarded-for")) ??
    "unknown"
  );
}

function hashRateLimitSubject(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

async function runUpstashCommand(command: unknown[]): Promise<UpstashCommandResponse | null> {
  const restUrl = getOptionalServerEnv("UPSTASH_REDIS_REST_URL");
  const restToken = getOptionalServerEnv("UPSTASH_REDIS_REST_TOKEN");

  if (!restUrl || !restToken) {
    return null;
  }

  try {
    const response = await fetch(restUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${restToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as UpstashCommandResponse;
  } catch {
    return null;
  }
}

async function checkRateLimit(
  formType: ProtectedFormType,
  clientIp: string,
): Promise<boolean> {
  const subject = hashRateLimitSubject(clientIp);
  const key = `form:${formType}:${subject}`;
  const increment = await runUpstashCommand(["INCR", key]);
  const count = Number(increment?.result);

  if (!Number.isFinite(count)) {
    return false;
  }

  if (count === 1) {
    await runUpstashCommand(["EXPIRE", key, RATE_LIMIT_WINDOW_SECONDS]);
  }

  return count <= RATE_LIMIT_MAX_SUBMISSIONS;
}

async function verifyTurnstileToken(
  token: string,
  clientIp: string,
): Promise<boolean> {
  const secret = getOptionalServerEnv("TURNSTILE_SECRET_KEY");

  if (!secret || !token) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (clientIp !== "unknown") {
    body.set("remoteip", clientIp);
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as TurnstileVerifyResponse;

    return result.success === true;
  } catch {
    return false;
  }
}

export async function protectFormSubmission({
  formType,
  turnstileToken,
}: {
  formType: ProtectedFormType;
  turnstileToken: string;
}): Promise<ProtectionResult> {
  const clientIp = await getClientIp();
  const turnstilePassed = await verifyTurnstileToken(turnstileToken, clientIp);

  if (!turnstilePassed) {
    return {
      allowed: false,
      reason: "turnstile_failed",
    };
  }

  const rateLimitPassed = await checkRateLimit(formType, clientIp);

  if (!rateLimitPassed) {
    return {
      allowed: false,
      reason: "rate_limited",
    };
  }

  return {
    allowed: true,
  };
}
