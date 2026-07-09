# Staging Deployment Plan

Status: Milestone 9.1 staging preparation. This plan is documentation only. Do
not deploy production, connect the final production domain, or commit real
secrets.

## A. Deployment Target

Use a Vercel Preview deployment as staging before production launch.

Recommended branch strategy:

- `main`: production candidate branch.
- `staging`: protected staging branch for deployment rehearsal, if the team
  wants a stable preview URL.
- Feature branches: short-lived branches that receive Vercel Preview URLs for
  review before merging to `staging` or `main`.

Preview URL strategy:

- Use Vercel-generated preview URLs for QA.
- Do not connect the final production domain to staging.
- Use a stable Vercel branch preview URL for team QA when possible.
- Treat preview URLs as temporary and not suitable for Search Console,
  advertising, public backlinks, or final canonical launch.

Preview/staging vs production:

- Preview/staging verifies build, routes, env wiring, CMS content, forms, SEO
  files, accessibility, and integrations before launch.
- Production uses the final canonical domain, production Sanity dataset,
  production Supabase, production CookieYes, production Sentry, production
  Turnstile, production Upstash, monitoring, and DNS.
- Preview/staging should never receive production-only secrets unless the team
  intentionally uses a production-like isolated test service.

## B. Vercel Project Setup

Project settings:

- Framework preset: Next.js.
- Install command: `npm ci`.
- Build command: `npm run build`.
- Output settings: Vercel default Next.js output.
- Start command: Vercel-managed Next.js runtime.
- Node version: set explicitly in Vercel project settings. The repository does
  not currently include `.nvmrc` or `.node-version`.

Environment separation:

- Configure Preview variables separately from Production variables.
- Do not copy production secrets into Preview unless explicitly approved.
- Keep private values server-only. Never add private secrets with a
  `NEXT_PUBLIC_` prefix.
- Keep `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=false` for staging.
- Keep `DISABLE_ANALYTICS=true` for staging unless consent behavior is being
  tested with a non-production analytics container.

## C. Required Staging Environment Variables

Public browser-safe variables:

| Variable | Required for staging | Recommended staging value | Must differ from production |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | The Vercel staging/preview URL under test. | Yes, unless intentionally testing production canonical behavior. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID. | Usually same project, different dataset. |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | `development` or staging dataset. | Yes, production must use `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | Same pinned API date as production. | No. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes for forms | Staging Supabase project URL. | Prefer yes. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes for forms | Staging Supabase anon key. | Prefer yes. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes for public form tests | Turnstile key for staging domain. | Prefer yes. |
| `NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY` | Optional for consent QA | Staging CookieYes key if available. | Prefer yes. |
| `NEXT_PUBLIC_GTM_ID` | Optional | Staging GTM container only. | Yes if enabled. |
| `NEXT_PUBLIC_GA4_ID` | Optional | Staging GA4 property only. | Yes if enabled. |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Staging/browser-safe Sentry DSN. | Prefer separate environment/project. |
| `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL` | Yes | `false`. | No; production should also remain false until approved. |

Private server-only variables:

| Variable | Required for staging | Recommended staging value | Must differ from production |
|---|---|---|---|
| `SANITY_API_READ_TOKEN` | Required for preview/draft checks | Viewer/read token only. | Prefer separate token. |
| `SANITY_WEBHOOK_SECRET` | Required if testing revalidation | Staging-only webhook secret. | Yes. |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for form persistence | Staging Supabase service role key. | Yes. |
| `UPLOADTHING_TOKEN` | Required if upload route is tested | Staging Uploadthing token. | Prefer yes. |
| `RESEND_API_KEY` | Optional | Omit if manual lead monitoring is used. | Prefer yes if enabled. |
| `TURNSTILE_SECRET_KEY` | Required for Turnstile tests | Secret for staging site key. | Prefer yes. |
| `UPSTASH_REDIS_REST_URL` | Required for rate-limit tests | Staging Upstash REST URL. | Prefer yes. |
| `UPSTASH_REDIS_REST_TOKEN` | Required for rate-limit tests | Staging Upstash REST token. | Prefer yes. |
| `SENTRY_DSN` | Optional | Staging server-side Sentry DSN. | Prefer separate environment/project. |
| `SENTRY_ORG` | Optional | Sentry org slug if uploading source maps. | Usually no. |
| `SENTRY_PROJECT` | Optional | Staging Sentry project if separated. | Prefer yes. |
| `SENTRY_AUTH_TOKEN` | Optional | Source-map upload token. | Prefer scoped token. |
| `SENTRY_ENVIRONMENT` | Optional | `preview` or `staging`. | Yes. |
| `DISABLE_ANALYTICS` | Yes | `true`. | Production may become `false` after consent approval. |

QA-only variable:

- `PLAYWRIGHT_BASE_URL`: set locally or in CI to the Vercel Preview URL when
  running smoke tests against staging. This is not consumed by app runtime.

## D. Staging Domain And Canonical Strategy

Recommended for staging:

- Set `NEXT_PUBLIC_SITE_URL` to the staging/preview URL under test.
- Keep the staging deployment protected from indexing.
- Do not use the production canonical domain on staging unless the specific test
  is to verify production-domain metadata before launch.

Risks of using the production canonical on staging:

- Crawlers may associate preview content with the production domain.
- Sitemap and Open Graph URLs can point to a domain that is not serving the same
  staging build.
- Search Console validation and SEO QA become ambiguous.
- Stakeholders may share preview pages that advertise production URLs.

Avoid Search Console and SEO confusion:

- Do not submit staging sitemaps.
- Do not connect staging to the final domain.
- Do not create public backlinks to staging.
- Prefer Vercel Deployment Protection for all staging previews.
- If a public staging URL is unavoidable, use a separately approved noindex
  approach before sharing it outside the team.

## E. Staging SEO Safety

Current code behavior:

- `robots.txt` allows public crawlers and disallows unsafe/internal paths.
- `sitemap.xml` uses `NEXT_PUBLIC_SITE_URL`.
- Canonical and hreflang metadata use `NEXT_PUBLIC_SITE_URL`.
- Open Graph image URLs use `NEXT_PUBLIC_SITE_URL`.
- `llms.txt` and `llms-full.txt` are publicly readable static files.

Staging recommendation:

- Protect staging with Vercel Deployment Protection.
- Use the staging `NEXT_PUBLIC_SITE_URL` for preview QA.
- Do not submit staging URLs to Search Console.
- Do not treat staging sitemap/canonical output as production until
  `NEXT_PUBLIC_SITE_URL` is switched to the final domain in Production.
- Keep staging noindexed by access control. If access control cannot be used,
  request a scoped SEO safety change before public sharing.

## F. Staging Smoke Test Checklist

Run these against the Vercel Preview URL:

| Route | Expected staging result | Notes |
|---|---|---|
| `/` | 200 | Arabic default root. |
| `/en` | 200 | English root. |
| `/robots.txt` | 200 | Confirm host/sitemap use staging URL. |
| `/sitemap.xml` | 200 | Confirm staging URL, not production URL. |
| `/llms.txt` | 200 | Static AI-readable summary. |
| `/llms-full.txt` | 200 | Static AI-readable full file. |
| `/opengraph-image` | 200 image/png | Arabic image. |
| `/en/opengraph-image` | 200 image/png | English image. |
| `/privacy` | 404 unless alias approved | Current implemented route is `/privacy-policy`. |
| `/en/privacy` | 404 unless alias approved | Current implemented route is `/en/privacy-policy`. |
| `/terms` | 200 | Draft legal copy. |
| `/en/terms` | 200 | Draft legal copy. |
| `/contact` | 200 | Arabic form. |
| `/en/contact` | 200 | English form. |
| `/quote` | 200 | Arabic form. |
| `/en/quote` | 200 | English form. |

Also verify:

- `/privacy-policy`
- `/en/privacy-policy`
- `/cookies-policy`
- `/en/cookies-policy`
- `/accessibility`
- `/en/accessibility`
- `/api/health`

## G. Integration Smoke Tests

Forms:

- Submit Contact with valid Turnstile token.
- Submit Quote with valid Turnstile token.
- Confirm both submissions persist to staging Supabase.
- Confirm invalid or missing Turnstile token is rejected.
- Confirm repeated submissions trigger Upstash rate limiting.
- Confirm honeypot submission is ignored or rejected as designed.

CMS:

- Confirm Sanity content fetches from staging/development dataset.
- Confirm no missing Sanity env logs.
- Confirm fallback content is not the normal staging state.
- Confirm long Arabic CMS content wraps without overflow.
- Test Sanity revalidation webhook if configured for staging.

Consent and analytics:

- Confirm Cookie Preferences trigger opens if CookieYes staging key exists.
- Keep analytics disabled unless using staging analytics containers.
- Confirm no production analytics data is polluted by staging traffic.

Upload and monitoring:

- If upload route is in scope, verify Uploadthing token and file policy using
  staging-safe files.
- If Sentry is enabled, send only an approved staging test error and confirm it
  lands under `preview` or `staging`.
- Confirm `/api/health` returns `200` and the expected JSON.

SEO/GEO:

- Confirm staging robots, sitemap, canonicals, hreflang, Open Graph, and llms
  files use the staging URL when `NEXT_PUBLIC_SITE_URL` is set to staging.
- Confirm no production Search Console submission is made for staging.

## H. Staging Rollback Plan

If build fails:

- Do not promote the deployment.
- Inspect Vercel build logs.
- Re-run `npm run build` locally on the same commit.
- Revert or fix the smallest commit that caused the failure.

If environment values fail:

- Confirm the variable is set in Vercel Preview, not only Production.
- Confirm public/private prefix is correct.
- Redeploy after env changes.
- Do not paste real secret values into Git, chat, screenshots, or issue text.

If forms fail:

- Confirm staging Supabase URL, anon key, and service role key.
- Confirm Turnstile site/secret pair matches the staging domain.
- Confirm Upstash REST URL/token.
- Confirm Server Action logs do not expose secret material.
- Roll back to the last stable preview commit if form persistence remains
  broken.

If Sanity content fails:

- Confirm Sanity project ID, dataset, and API version.
- Confirm staging/development dataset has required published settings content.
- Confirm read token only when draft/preview behavior is being tested.
- Confirm webhook secret and target deployment URL if revalidation is tested.

If SEO routes fail:

- Confirm `NEXT_PUBLIC_SITE_URL` is valid and points to the staging URL.
- Confirm `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, and OG
  image routes return expected statuses.
- Do not connect the production domain to work around staging URL issues.

Reverting to last stable commit:

1. Use Vercel's previous successful preview deployment for comparison.
2. Revert the problematic commit in Git with a normal revert commit.
3. Push the revert branch and let Vercel generate a new preview.
4. Re-run the staging smoke checklist before merging.
