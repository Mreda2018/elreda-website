# Final Deployment Checklist

Status: Sprint 8.2F final verification gate. Do not deploy from this document.
Do not add real secrets, production tokens, or dashboard-only values here.

## Current Readiness Summary

Codebase status: ready for staging deployment after local verification passes.

Production launch status: blocked until external production setup is completed
and verified in Vercel, Sanity, Supabase, CookieYes, Sentry, Turnstile, Upstash,
DNS, and monitoring dashboards.

Arabic remains the default root locale. English remains under `/en`. Do not add
or link an alternate Arabic URL prefix.

For staging preparation, use `STAGING_DEPLOYMENT_PLAN.md` and
`STAGING_QA_CHECKLIST.md` before any production launch decision.

## Remaining Launch Blockers

- Configure final production `NEXT_PUBLIC_SITE_URL` with the canonical HTTPS
  domain. Do not use a preview or staging URL unless that URL is intentionally
  the public launch domain.
- Configure all Vercel Production environment variables from `.env.example` and
  `PRODUCTION_ENVIRONMENT_CHECKLIST.md`.
- Configure Sanity production env, production dataset, required published
  singleton/content, and production `/api/revalidate` webhook.
- Confirm production logs have no missing Sanity env or fallback loader errors.
- Verify Contact and Quote submissions persist in production Supabase.
- Verify Turnstile rejects invalid/missing tokens and Upstash rate limiting
  blocks repeated submissions.
- Verify CookieYes preference center opens and analytics remain consent-gated.
- Verify Sentry receives production events in the intended environment and
  source maps upload during production builds.
- Configure UptimeRobot monitors for home and `/api/health`.
- Complete legal review for draft legal pages before public launch.
- Submit Search Console sitemap after final domain launch.

## Sprint Coverage Check

| Sprint | Area | Final deployment status |
|---|---|---|
| 8.2A | SEO/GEO launch files | Implemented locally; production domain verification still required. |
| 8.2B | Legal and Footer route readiness | Implemented locally; legal copy remains draft and needs legal review. |
| 8.2C | Forms security and abuse protection | Implemented locally; production Turnstile, Upstash, and Supabase verification still required. |
| 8.2D | Production environment verification | Env contract documented; real Vercel production values still required. |
| 8.2E | CMS/Sanity readiness | CMS readiness documented; production dataset/content/webhook still required. |
| 8.2F | Final deployment checklist | This document is the final staging/deployment gate. |

## SEO/GEO Verification

Local/code checks:

- `/robots.txt` exists through `app/robots.ts`.
- `/sitemap.xml` exists through `app/sitemap.ts`.
- `/llms.txt` exists in `public/llms.txt`.
- `/llms-full.txt` exists in `public/llms-full.txt`.
- `/opengraph-image` and `/en/opengraph-image` should return `image/png`.
- Canonical and hreflang metadata should resolve Arabic root routes and English
  `/en` routes from `NEXT_PUBLIC_SITE_URL`.

Production checks before launch:

- Confirm robots and sitemap use the final production domain.
- Confirm sitemap includes Arabic root routes and English `/en` routes only.
- Confirm no alternate Arabic URL prefix appears in metadata, sitemap, or links.
- Confirm Open Graph image routes return `200 image/png` in production.
- Confirm Search Console sitemap submission is ready after final domain launch.

## Legal Readiness

Implemented Footer-linked legal routes:

- `/privacy-policy`
- `/en/privacy-policy`
- `/terms`
- `/en/terms`
- `/cookies-policy`
- `/en/cookies-policy`
- `/accessibility`
- `/en/accessibility`

Deployment gate:

- Draft legal copy must receive legal/business approval before public launch.
- Footer legal links must be crawled in Arabic and English.
- Cookie Preferences must open the CookieYes preference center in production.
- Requested smoke aliases `/privacy` and `/en/privacy` are not currently linked
  legal routes. Use `/privacy-policy` and `/en/privacy-policy`, or approve a
  tiny alias/redirect fix in a separate scoped review.

## Forms And Security Readiness

Local/code checks:

- Contact and Quote use Server Actions.
- Honeypot fields remain present and server-validated.
- Turnstile token collection and server verification are implemented.
- Upstash rate limiting is implemented server-side.
- Supabase persistence remains server-side through the service role key.
- User-facing errors are localized and do not expose secrets.

Production checks before launch:

- Contact valid submission persists to production Supabase.
- Quote valid submission persists to production Supabase.
- Invalid or missing Turnstile token is rejected.
- Repeated submissions from one IP/form are rate-limited.
- Supabase `submissions` schema and RLS/service-role behavior are verified.
- Resend or manual lead-monitoring workflow is approved for launch.
- Uploadthing production token and attachment scope are confirmed if uploads are
  in launch scope.

## Environment Readiness

Required references:

- `.env.example`
- `PRODUCTION_ENVIRONMENT_CHECKLIST.md`

Deployment gate:

- Public values use `NEXT_PUBLIC_` only when browser-safe.
- Private tokens and secrets have no `NEXT_PUBLIC_` prefix.
- Vercel Production and Preview variables are configured separately.
- `NEXT_PUBLIC_SITE_URL` is the final canonical HTTPS domain in production.
- `NEXT_PUBLIC_SANITY_DATASET=production` in Vercel Production.
- `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=false` unless separately approved.
- `DISABLE_ANALYTICS=false` only after CookieYes, GTM, and GA4 consent behavior
  is verified.

## CMS/Sanity Readiness

Required reference:

- `SANITY_PRODUCTION_READINESS.md`

Deployment gate:

- Production Sanity dataset exists.
- Published `settings` singleton exists with `_id=settings`.
- Home hero, home services, footer/contact/social settings are populated.
- Minimum service, testimonial, portfolio, blog, and team content for launch is
  published or explicitly approved as fallback-safe.
- Preview/read token remains server-only.
- Sanity webhook points to production `/api/revalidate`.
- Sanity webhook uses `SANITY_WEBHOOK_SECRET`.
- Sanity publish triggers successful revalidation.
- Production preview logs show no Sanity env or fallback loader errors.
- Redirect documents are not relied on for launch unless redirect consumption is
  separately implemented.

## QA Readiness

Required local commands:

- `npm run build`
- `npm run lint`
- `npm run test:e2e -- --workers=1`
- `npm run test:a11y`

Required production preview checks:

- `/`
- `/en`
- `/services`
- `/en/services`
- `/contact`
- `/en/contact`
- `/quote`
- `/en/quote`
- `/api/health`

Manual viewport checks:

- 360px
- 390px
- 768px
- 1024px
- Desktop wide viewport

Manual accessibility checks:

- Keyboard navigation across Arabic and English routes.
- Skip link focuses main content.
- Visible focus states.
- Form labels, legends, live regions, success, and error states.
- Cookie Preferences keyboard access.
- Arabic and English screen reader smoke tests.

## Deployment Settings

Vercel project settings to verify:

- GitHub repository connected.
- Production branch confirmed.
- Install command: `npm ci`.
- Build command: `npm run build`.
- Start command: Vercel-managed Next.js output.
- Node version explicitly confirmed in Vercel settings. No `.nvmrc` or
  `.node-version` file is present in the repo, so the deployment owner must
  confirm a Node version compatible with this Next.js version.
- Production and Preview env variables configured separately.
- Final domain and DNS configured.
- HTTPS active before HSTS preload assumptions are relied on.

## Rollback Plan

Before launch:

- Identify the last known-good Vercel deployment.
- Confirm Vercel deployment rollback permission for the deployment owner.
- Export or screenshot production env variable names and target environments
  without exposing secret values.
- Document any env changes made on launch day.

Rollback steps:

1. Revert to the last known-good Vercel deployment.
2. Restore previous Vercel Production env values if launch env changes caused
   the issue.
3. Pause risky external webhooks or analytics changes if they caused the issue.
4. Confirm `/`, `/en`, `/api/health`, Contact, and Quote after rollback.
5. Record incident notes and the follow-up fix owner.

## Post-Launch Monitoring

Required:

- UptimeRobot home monitor.
- UptimeRobot `/api/health` monitor.
- Sentry production project receives server and client events.
- Supabase receives Contact and Quote test submissions.
- Sanity publish webhook revalidates production.
- CookieYes consent logs/settings verified.
- Analytics tags fire only after consent.
- Search Console property and sitemap submitted.
- Core Web Vitals monitored after initial traffic.

## Final Go/No-Go

Staging deployment: allowed after local verification passes.

Production deployment: no-go until every external setup item above is completed
and production preview smoke tests pass without Sanity env errors, form
persistence failures, consent failures, or monitoring gaps.
