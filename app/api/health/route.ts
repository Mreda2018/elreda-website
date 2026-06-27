import packageJson from "@/package.json";

type HealthResponse = {
  status: "ok";
  timestamp: string;
  version: string;
};

export const dynamic = "force-dynamic";

export function GET() {
  const response: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: packageJson.version,
  };

  return Response.json(response, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
