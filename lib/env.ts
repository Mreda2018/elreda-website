type PublicEnvKey =
  | "NEXT_PUBLIC_SITE_URL"
  | "NEXT_PUBLIC_SANITY_PROJECT_ID"
  | "NEXT_PUBLIC_SANITY_DATASET"
  | "NEXT_PUBLIC_SANITY_API_VERSION"
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "NEXT_PUBLIC_TURNSTILE_SITE_KEY"
  | "NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY"
  | "NEXT_PUBLIC_GTM_ID"
  | "NEXT_PUBLIC_GA4_ID"
  | "NEXT_PUBLIC_SENTRY_DSN";

export function getOptionalPublicEnv(key: PublicEnvKey): string | undefined {
  return process.env[key] || undefined;
}

export function getRequiredPublicEnv(key: PublicEnvKey): string {
  const value = getOptionalPublicEnv(key);

  if (!value) {
    throw new Error(`Missing required public environment variable: ${key}`);
  }

  return value;
}
