import "server-only";

type ServerEnvKey =
  | "UPLOADTHING_TOKEN"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "RESEND_API_KEY"
  | "TURNSTILE_SECRET_KEY"
  | "UPSTASH_REDIS_REST_URL"
  | "UPSTASH_REDIS_REST_TOKEN"
  | "SANITY_API_READ_TOKEN"
  | "SANITY_WEBHOOK_SECRET"
  | "SENTRY_DSN"
  | "SENTRY_ORG"
  | "SENTRY_PROJECT"
  | "SENTRY_AUTH_TOKEN"
  | "SENTRY_ENVIRONMENT"
  | "DISABLE_ANALYTICS";

export function getRequiredServerEnv(key: ServerEnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required server environment variable: ${key}`);
  }

  return value;
}

export function getOptionalServerEnv(key: ServerEnvKey): string | undefined {
  return process.env[key] || undefined;
}
