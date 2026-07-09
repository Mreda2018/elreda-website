# Production Environment Checklist

Status: Sprint 8.2D verification contract. Do not commit real secrets to this
file, `.env.example`, or any other repository file.

## Launch Blockers Covered

- Production `NEXT_PUBLIC_SITE_URL` must use the final HTTPS canonical domain.
- Sanity production env must be configured and must stop missing-env loader logs.
- Supabase production env must be present for Contact and Quote Server Actions.
- Uploadthing production token must be confirmed when uploads are in launch scope.
- Sentry DSNs and source-map upload env must be configured for production.
- CookieYes production key must be configured before analytics is enabled.
- Turnstile and Upstash env from Sprint 8.2C must be configured for public forms.
- `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL` must remain `false` unless separately approved.

## Public Variables

These values are browser-visible. They must not contain private keys, service-role
tokens, API secrets, webhook secrets, or auth tokens.

| Variable | Production requirement | Verification |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Final canonical HTTPS domain, not localhost or preview. | Check page canonicals, hreflang, sitemap, robots, OG URLs. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Production Sanity project ID. | No missing Sanity env logs during `npm start` or production preview. |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` in Vercel Production. | CMS-backed routes render production content. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Pinned API date used by clients. | Sanity clients initialize without fallback values. |
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase project URL. | Contact and Quote Server Actions can connect. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production anon key only. | Browser-safe key; not the service role key. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for production domain. | Widget renders on Contact and Quote. |
| `NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY` | CookieYes production website key. | Banner/preference center opens from Footer. |
| `NEXT_PUBLIC_GTM_ID` | Production GTM container ID, if analytics is enabled. | Tags remain consent-gated by CookieYes. |
| `NEXT_PUBLIC_GA4_ID` | Production GA4 measurement ID, if analytics is enabled. | GA4 respects consent mode settings. |
| `NEXT_PUBLIC_SENTRY_DSN` | Browser-safe Sentry DSN, if client monitoring is enabled. | Client test event appears in production Sentry. |
| `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL` | `false` unless approved after device/accessibility QA. | Inspect Vercel env and confirm Lenis is not active. |

## Private Server Variables

These values must be configured only as server-side Vercel Environment Variables.
Never prefix them with `NEXT_PUBLIC_`.

| Variable | Production requirement | Verification |
|---|---|---|
| `SANITY_API_READ_TOKEN` | Viewer/read token only; no write/admin scope. | Preview/content checks can read required documents. |
| `SANITY_WEBHOOK_SECRET` | Strong shared secret for `/api/revalidate`. | Sanity webhook succeeds only with valid signature. |
| `SUPABASE_SERVICE_ROLE_KEY` | Production service-role key; server-only. | Inserts into `submissions` succeed from Server Actions. |
| `UPLOADTHING_TOKEN` | Production Uploadthing token if uploads are enabled. | Upload route initializes; attachment scope remains documented if deferred. |
| `RESEND_API_KEY` | Required only if Resend email is launch scope. | If omitted, manual Supabase monitoring workflow is active. |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret for production site key. | Missing/invalid token submissions are rejected. |
| `UPSTASH_REDIS_REST_URL` | Production Upstash Redis REST URL. | Repeated submissions are rate-limited. |
| `UPSTASH_REDIS_REST_TOKEN` | Production Upstash Redis REST token. | Token is server-only and rate limit calls succeed. |
| `SENTRY_DSN` | Server-side Sentry DSN. | Server errors appear in production Sentry. |
| `SENTRY_ORG` | Sentry org slug for source-map upload. | Production build uploads source maps. |
| `SENTRY_PROJECT` | Sentry project slug for source-map upload. | Production build uploads source maps. |
| `SENTRY_AUTH_TOKEN` | Source-map upload token. | Token is server-only and not logged. |
| `SENTRY_ENVIRONMENT` | `production` unless Vercel environment naming is preferred. | Events group under the intended environment. |
| `DISABLE_ANALYTICS` | `false` only after CookieYes consent gating is verified. | Analytics does not fire before consent. |

## Vercel Setup

Configure environments separately:

- Production: final live domain, production Sanity dataset, production Supabase,
  production CookieYes, production Turnstile, production Upstash, production Sentry.
- Preview: preview URLs and non-production datasets/services where available.
- Development: local values only.

Do not copy preview/staging URLs into `NEXT_PUBLIC_SITE_URL` for production unless
the team intentionally launches on that URL. Canonicals and sitemap URLs are
generated from this value.

## Post-Deploy Verification

Run these checks against the production preview or final deployment:

1. `PLAYWRIGHT_BASE_URL=https://<deployment-url> npm run test:e2e`
2. `PLAYWRIGHT_BASE_URL=https://<deployment-url> npm run test:a11y`
3. `curl -I https://<deployment-url>/api/health`
4. Open `/`, `/en`, `/contact`, `/en/contact`, `/quote`, and `/en/quote`.
5. Confirm server logs show no missing Sanity env errors.
6. Confirm `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt` use
   the intended production domain where applicable.
7. Submit one valid Contact form and confirm a Supabase `submissions` record.
8. Submit one valid Quote form and confirm a Supabase `submissions` record.
9. Submit without a Turnstile token and confirm the localized security error.
10. Exceed 5 valid submissions from one IP/form within one hour and confirm the
    localized rate-limit error.
11. Open Footer Cookie Preferences and confirm the CookieYes preference center.
12. Confirm analytics tags fire only after consent.
13. Confirm Sentry receives an approved production test event.
14. Confirm Sanity publish webhook triggers `/api/revalidate` successfully.

## Remaining Manual Values

The repository cannot supply production secrets or dashboard state. These remain
manual launch blockers until configured and verified in the deployment platforms:

- Final domain and DNS.
- Vercel Production and Preview environment variables.
- Sanity production dataset and required published content.
- Supabase production project, `submissions` table, and service role key.
- CookieYes production website key and consent mode settings.
- Turnstile production site/secret keys.
- Upstash production Redis REST URL/token.
- Sentry DSNs and source-map upload token.
- Uploadthing production token if uploads are enabled.
- UptimeRobot monitor for `/api/health`.
