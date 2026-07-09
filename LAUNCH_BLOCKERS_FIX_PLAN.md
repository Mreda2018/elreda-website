# Launch Blockers Fix Plan

**Date:** July 8, 2026  
**Scope:** Milestone 8.2 launch blocker execution planning.  
**Status:** Planning only. No runtime fixes are implemented in this milestone.

## Source Rules

This plan uses only launch-blocking items from:

- `LAUNCH_CHECKLIST.md` items under **Must Fix Before Launch**
- `RISK_REGISTER.md` items marked **Launch Blocker: Yes** or conditional launch blockers that apply to the approved launch scope
- `PRODUCTION_READINESS_AUDIT.md` Critical or High launch-blocking findings

Items from "Should Fix Before Launch" are excluded unless the production readiness audit also identifies them as required before launch.

## Consistency Decisions

- `robots.txt` and sitemap are launch blockers. They are listed as Must Fix and as launch-blocking SEO risks.
- `llms.txt` and `llms-full.txt` are launch blockers. `RISK_REGISTER.md` marks them conditional on GEO launch, but `SEO_GEO_PLAN.md`, `DEVELOPMENT_ROADMAP.md`, `TASKS.md`, and `SPEC_FIX_PLAN.md` define GEO and bilingual AI-readable files as project requirements.
- Legal route 404s are launch blockers. Footer-linked privacy, terms, cookies, and accessibility pages must resolve before public launch.
- Form protection is a launch blocker. Contact and Quote must have Turnstile verification and Upstash rate limiting before public production.
- Production environment verification is a launch blocker. The current audit found missing Sanity env warnings, unverified Supabase/Sentry/CookieYes env, and failing e2e status.
- Arabic remains the root locale. No `/ar` route pattern should be generated or linked; English remains under `/en`.

## Conflicts And Resolution

| Item | Source Conflict | Resolution |
|---|---|---|
| Open Graph image foundation | Must Fix in `LAUNCH_CHECKLIST.md`; non-blocking in `RISK_REGISTER.md` | Treat as launch blocker because Must Fix is authoritative for this plan. |
| Homepage and Services canonical metadata | Must Fix in `LAUNCH_CHECKLIST.md`; Services canonical non-blocking in `RISK_REGISTER.md` | Treat homepage and Services canonical metadata as launch blockers. |
| Structured data | Required before launch in `PRODUCTION_READINESS_AUDIT.md`; Should Fix in `LAUNCH_CHECKLIST.md`; non-blocking in `RISK_REGISTER.md` | Include the minimum Organization/WebSite structured data in SEO sprint because the audit explicitly marks it required before launch. |
| Form email notifications | Conditional in `RISK_REGISTER.md`; Must Fix decision in `LAUNCH_CHECKLIST.md` | Treat the decision as blocking. Implementation can be Resend after Supabase persistence or a documented manual lead-monitoring workflow. |
| Quote attachments | Non-blocking if deferred in `RISK_REGISTER.md`; Must Fix asks to confirm scope | Treat scope confirmation as blocking. Attachment implementation is required only if uploads remain in launch scope. |
| Footer service detail links | Conditional in `RISK_REGISTER.md` | Treat as blocking if the links remain public. Resolve by implementing target routes, changing public links to existing routes, or proving middleware behavior prevents 404s. |

## Sprint 8.2A: SEO/GEO Launch Files

### Goal

Complete the crawl, indexing, metadata, social sharing, and AI-readable launch foundation for Arabic root and English `/en` routes.

### Exact Launch Blockers Addressed

- Add or generate `robots.txt`.
- Add or generate sitemap.
- Add bilingual `llms.txt` and `llms-full.txt`.
- Add hreflang alternates for Arabic root and English `/en`.
- Add canonical metadata for homepage and Services page.
- Add Open Graph image foundation.
- Add the minimum structured data required by the production readiness audit.
- Verify canonical URLs use the production `NEXT_PUBLIC_SITE_URL`.

### Files Likely Affected

- `app/robots.ts` or `public/robots.txt`
- `app/sitemap.ts`
- `public/llms.txt`
- `public/llms-full.txt`
- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx`
- `app/[locale]/services/page.tsx`
- `app/[locale]/opengraph-image.tsx` or route-level `opengraph-image.tsx`
- `lib/seo/*` if shared metadata helpers are needed

### Risk Level

Medium. SEO output affects every indexed route, but the work can be implemented without changing page layouts or CMS data.

### Acceptance Criteria

- `/robots.txt` is accessible and blocks private routes such as `/api/` and `/studio/` while allowing intended public crawlers.
- Sitemap includes all approved public Arabic root and English `/en` launch routes.
- No `/ar` URLs appear in sitemap, metadata, hreflang, or generated links.
- `llms.txt` is bilingual, Arabic-first, and available at the root domain.
- `llms-full.txt` provides the extended bilingual AI-readable content index.
- Hreflang includes Arabic root, English `/en`, and `x-default` when approved.
- Homepage and Services page have production-domain canonical URLs.
- Open Graph title, description, URL, and image foundation exist.
- Minimum Organization/WebSite structured data validates.

### Tests Required

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual verification of `/robots.txt`, sitemap, `llms.txt`, `llms-full.txt`, metadata, hreflang, and OG image routes in production preview.

### Must Not Be Changed

- Do not change Arabic root or English `/en` routing.
- Do not create `/ar` routes.
- Do not redesign pages.
- Do not modify CMS schemas or CMS content.
- Do not add animations, Lenis activation, page transitions, 3D, or Spline.

## Sprint 8.2B: Legal And Footer Route Readiness

### Goal

Remove public footer/legal 404 risks and verify cookie preference access before launch.

### Exact Launch Blockers Addressed

- Implement or publish Footer-linked legal routes: privacy policy, terms, cookies policy, and accessibility.
- Configure CookieYes production key and verify Footer Cookie Preferences opens the preference center.
- Verify CookieYes consent mode behavior with production settings.
- Resolve Footer service links that point to future service detail pages if those links remain public.

### Files Likely Affected

- `app/[locale]/privacy-policy/page.tsx`
- `app/[locale]/terms/page.tsx`
- `app/[locale]/cookies-policy/page.tsx`
- `app/[locale]/accessibility/page.tsx`
- `components/layout/Footer.tsx`
- `messages/ar/*.json`
- `messages/en/*.json`
- CookieYes layout/script integration files if verification exposes a blocking issue

### Risk Level

Medium. Legal pages and Footer links are public trust surfaces; implementation should stay content-light and route-focused unless legal copy is provided.

### Acceptance Criteria

- Footer-linked legal pages resolve in Arabic root and English `/en`.
- Legal pages have basic localized metadata and accessible page structure.
- Cookie Preferences control opens CookieYes preference center with the production key.
- Analytics and tracking scripts remain consent-gated.
- Footer service links either resolve to implemented routes or are adjusted to non-404 public targets.

### Tests Required

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual footer link crawl in Arabic and English.
- Manual CookieYes preference-center verification in production preview.

### Must Not Be Changed

- Do not add unrelated legal or marketing pages.
- Do not implement full service detail pages unless approved as the selected service-link resolution.
- Do not change Footer design beyond what is necessary for route readiness.
- Do not modify CMS content.
- Do not add tracking outside CookieYes consent gating.

## Sprint 8.2C: Forms Security And Abuse Protection

### Goal

Make Contact and Quote safe for public traffic while preserving the existing Server Action and Supabase-first architecture.

### Exact Launch Blockers Addressed

- Configure Supabase production env and verify `submissions` table schema.
- Verify Contact form persists successfully in Supabase.
- Verify Quote form persists successfully in Supabase.
- Add Turnstile server verification to Contact and Quote submissions.
- Add Upstash rate limiting to Contact and Quote submissions.
- Decide and implement launch email behavior: Resend after Supabase persistence or documented manual lead-monitoring workflow.
- Confirm Uploadthing production token and Quote attachment scope if file uploads are part of launch.

### Files Likely Affected

- `app/actions/contact.ts`
- `app/actions/quote.ts`
- `app/actions/*` shared validation/security helpers
- `components/forms/ContactForm.tsx`
- `components/forms/QuoteForm.tsx`
- `lib/supabase/*`
- `lib/env.server.ts`
- `lib/env.ts`
- `lib/uploadthing/*` or `app/api/uploadthing/*` if attachments remain in launch scope
- `messages/ar/forms.json`
- `messages/en/forms.json`
- `.env.example` if documented env coverage is incomplete

### Risk Level

High. This touches security, user data, production submissions, bot protection, and operational lead handling.

### Acceptance Criteria

- Turnstile token is collected by Contact and Quote forms and verified server-side before processing.
- Submissions without a valid Turnstile token are rejected.
- Upstash rate limiting blocks repeated submissions by IP/form according to the approved limit.
- Honeypot remains present and server-validated.
- Supabase insert still happens before any email side effect.
- Service role key remains server-only.
- Contact and Quote submissions persist in production Supabase.
- Email behavior is either implemented through Resend after persistence or explicitly documented as a launch manual-monitoring workflow.
- Quote attachment behavior is either fully wired and validated or formally deferred with the UI/scope adjusted to avoid false expectations.

### Tests Required

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual valid Contact and Quote submissions against production-like env.
- Manual invalid Turnstile submission test.
- Manual repeated-submission rate-limit test.
- Supabase record inspection.
- Email status inspection if Resend is implemented.

### Must Not Be Changed

- Do not convert forms to API routes.
- Do not send email before Supabase persistence.
- Do not remove honeypot validation.
- Do not expose Supabase service role, Turnstile secret, Upstash token, or Resend key to client code.
- Do not change form layout except where required to add accessible Turnstile UI.
- Do not change unrelated form fields or content.

## Sprint 8.2D: Production Environment Verification

### Goal

Verify production and preview environment readiness before content and deployment validation.

### Exact Launch Blockers Addressed

- Configure production `NEXT_PUBLIC_SITE_URL` with the final canonical domain.
- Configure Sanity production env:
  `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`,
  `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`, and
  `SANITY_WEBHOOK_SECRET`.
- Confirm Supabase production env is present.
- Confirm Uploadthing production token when file uploads are in scope.
- Confirm Sentry DSNs and source-map upload env for production.
- Configure CookieYes production key.
- Verify no server logs for missing Sanity env.
- Verify production env does not accidentally enable smooth scrolling.

### Files Likely Affected

- `.env.example` only if required documented variables are missing.
- Deployment documentation or verification notes if the team stores an env checklist in-repo.
- No runtime files should be changed unless verification reveals a blocker in env loading.

### Risk Level

High operational risk, low code risk. Most work happens in Vercel, Sanity, Supabase, Uploadthing, Sentry, CookieYes, and monitoring dashboards.

### Acceptance Criteria

- Production and preview env vars are configured separately.
- `NEXT_PUBLIC_SITE_URL` points to the final canonical production domain.
- Production Sanity uses the `production` dataset.
- Supabase, Sentry, Uploadthing, Turnstile, Upstash, CookieYes, and analytics envs are present according to the launch checklist.
- `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=false` unless separately approved.
- Production preview logs show no missing Sanity env errors.
- Server Actions do not throw because of missing env.

### Tests Required

- `npm run build` with production-like env.
- `npm run lint`
- `npm run test:e2e` against production preview when available.
- `npm run test:a11y` against production preview when available.
- Manual `/api/health` verification.
- Manual Sentry production test event if approved.

### Must Not Be Changed

- Do not rename environment variables.
- Do not commit secrets.
- Do not move private keys into `NEXT_PUBLIC_*`.
- Do not enable Lenis, page transitions, analytics, or uploads unless their launch gates are satisfied.
- Do not change runtime behavior to mask missing env errors without documenting the launch risk.

## Sprint 8.2E: CMS/Sanity Production Readiness

### Goal

Ensure production CMS content and Sanity operational setup cannot produce blank launch pages or persistent fallback errors.

### Exact Launch Blockers Addressed

- Confirm Sanity production dataset exists and contains required published settings singleton and public content.
- Resolve missing Sanity public env loader errors.
- Prevent homepage empty-shell launch risk by treating settings singleton and home hero as required launch content.
- Define and publish the minimum Sanity production content set.
- Confirm Sanity webhook points to production `/api/revalidate` and uses `SANITY_WEBHOOK_SECRET`.

### Files Likely Affected

- Sanity Studio content in the production dataset.
- Sanity webhook/dashboard configuration.
- Optional documentation for the minimum content checklist.
- Runtime files only if a required predeploy content check is approved in a later implementation sprint.

### Risk Level

High. CMS readiness directly affects homepage, services, portfolio, blog, testimonials, footer, and contact surfaces.

### Acceptance Criteria

- Production dataset exists and is selected by production env.
- Required settings singleton is published.
- Home hero content is published and renders at `/` and `/en`.
- Homepage services, testimonials, footer/contact/social settings, and required public content are populated or intentionally approved as fallback-safe.
- Minimum service, portfolio, blog, and testimonial content for launch is defined and published.
- Sanity publish triggers successful production revalidation.
- Production preview shows no Sanity fallback errors in server logs.

### Tests Required

- `npm run build` with production-like Sanity env.
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual Sanity publish and revalidation test.
- Manual public route smoke test for CMS-backed routes.

### Must Not Be Changed

- Do not invent production CMS content in code.
- Do not weaken Sanity token separation.
- Do not expose preview/read tokens to client components.
- Do not modify schemas unless a blocker requires validation changes and is approved.
- Do not consume redirect documents unless separately scoped.

## Sprint 8.2F: Final Deployment Checklist Verification

### Goal

Run the final production readiness gate after all blocker implementation sprints are complete.

### Exact Launch Blockers Addressed

- Fix current `npm run test:e2e` failure and rerun until clean.
- Confirm UptimeRobot monitor for `/api/health`.
- Verify production build, lint, e2e, and a11y pass.
- Verify no missing Sanity env logs.
- Verify Contact and Quote submissions persist in Supabase.
- Verify Cookie Preferences opens.
- Verify canonicals and hreflang point to production domain.
- Verify Sentry receives production errors in the correct environment.
- Verify Sanity content renders without fallback errors.

### Files Likely Affected

- No runtime files expected if previous sprints are complete.
- CI workflow files only if final verification exposes a required missing launch gate.
- Deployment or operations documentation if rollback/monitoring notes need to be recorded.

### Risk Level

Medium. This sprint should be verification-heavy and code-light; any failure should be fixed in the smallest owning area.

### Acceptance Criteria

- `npm run build` passes.
- `npm run lint` passes.
- `npm run test:e2e` passes.
- `npm run test:a11y` passes.
- `/`, `/en`, `/services`, `/en/services`, `/contact`, `/en/contact`, `/quote`, `/en/quote`, and `/api/health` pass production preview smoke testing.
- UptimeRobot monitors home and `/api/health`.
- Search Console sitemap submission is ready after domain launch.
- Rollback path is documented through Vercel deployment rollback and env rollback.

### Tests Required

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual production preview smoke test.
- Manual UptimeRobot, Sentry, CookieYes, Supabase, and Sanity webhook checks.

### Must Not Be Changed

- Do not add new features during final verification.
- Do not relax tests to pass.
- Do not ignore missing env, fallback content, or form persistence failures.
- Do not launch with failing e2e or a11y results.
- Do not activate Lenis, page transitions, 3D, Spline, or advanced motion.

## Recommended Implementation Order

1. Sprint 8.2A: SEO/GEO Launch Files
2. Sprint 8.2B: Legal And Footer Route Readiness
3. Sprint 8.2C: Forms Security And Abuse Protection
4. Sprint 8.2D: Production Environment Verification
5. Sprint 8.2E: CMS/Sanity Production Readiness
6. Sprint 8.2F: Final Deployment Checklist Verification

Sprint 8.2A is the recommended first implementation sprint because it is self-contained, fixes several hard launch blockers, and does not depend on external account credentials. Sprint 8.2D and Sprint 8.2E should begin as soon as production account access is available because they unblock reliable e2e and CMS-backed verification.

## Explicitly Deferred

- High-priority visual polish not listed as launch blocking.
- Motion polish, page transitions, Lenis activation, cursor effects, 3D, Spline, and decorative scroll effects.
- CMS-managed redirect middleware unless redirects become launch-critical.
- Service detail pages unless required to resolve public Footer service-link 404s.
- Advanced analytics events beyond consent-safe launch verification.
- Portfolio and Blog image-system upgrades unless they become production blockers.
