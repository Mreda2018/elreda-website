# Production Readiness Audit

**Date:** July 8, 2026  
**Scope:** Milestone 8.1 only: pre-launch production readiness audit.  
**Mode:** Documentation only. No runtime code, page, component, CMS, token, motion,
or environment variable changes were implemented.

## Overall Verdict

The website is **not ready for production launch yet**.

The codebase is in a strong pre-launch state: `next build` passes, TypeScript
checks run through the production build, lint passes, accessibility tests pass,
server-only boundaries are mostly respected, motion is gated, and the public
route system follows the Arabic-root / English-`/en` model.

Launch is blocked by production integration and SEO readiness gaps:

- Sanity production environment variables and published CMS content are missing
  in the local audit environment, causing repeated loader errors and fallback
  rendering.
- Full e2e validation is not clean: `npm run test:e2e` currently fails one
  Chromium assertion while the dev server logs `Unexpected end of JSON input`
  and missing Sanity env errors.
- CookieYes must be configured with a production key and verified.
- Contact and Quote forms persist through Supabase, but bot protection,
  rate-limiting, upload attachment consumption, and email notification status are
  not complete.
- SEO foundations are incomplete: no `robots.txt`, sitemap, `llms.txt`,
  generated Open Graph image route, structured data, or hreflang alternates were
  found in the current app/public tree.

Recommended launch decision: **do not deploy as production live site until the
Must Fix items in `LAUNCH_CHECKLIST.md` are complete.**

## Validation Status

Commands run during this audit:

| Command | Status | Notes |
|---|---|---|
| `npm run build` | Pass | Next.js 16.2.9 production build completed. Routes are dynamic except `_not-found`. |
| `npm run lint` | Pass | ESLint completed with no reported errors. |
| `npm run test:e2e` | Fail | After clearing generated `.next/dev`, 18 passed, 1 skipped, 1 failed. Failure: Chromium contact form assertion; dev server also logged missing Sanity env and `Unexpected end of JSON input`. |
| `npm run test:a11y` | Pass | 15 passed, 1 skipped. Same missing Sanity env warnings appeared. |

Generated cache action:

- Removed `.next/dev` once after repeated transient Next dev JSON parse failures.
  This touched generated build cache only, not source.

## A. Build And Runtime

Status: **Build passes, runtime has launch risks.**

Findings:

- Next.js version is pinned to `16.2.9`.
- Production build compiles, runs TypeScript, collects page data, and generates
  route output successfully.
- TypeScript is enforced through `next build`; no separate `typecheck` script is
  present.
- Lint passes.
- Route output shows dynamic routes under `/[locale]`, plus dynamic API routes:
  `/api/health`, `/api/revalidate`, and `/api/uploadthing`.
- `app/[locale]/layout.tsx` validates locale and sets `<html lang>` and `dir`.
- `HeaderNavigation`, `Reveal`, `SmoothScroll`, and forms are scoped client
  components.
- Server-only modules use `import "server-only"` for Supabase persistence,
  Sanity loaders, preview client, and server env helpers.
- `SmoothScroll` is skipped unless `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=true`.
- `global-error.tsx` captures client global errors with Sentry.

Risks:

- `npm run test:e2e` is not clean in this audit environment.
- Missing Sanity env variables produce repeated server loader errors. The app
  catches those errors, but production must not rely on this fallback path.
- `loadHomeHero` returning `null` renders only an empty min-height shell for the
  homepage. That is safe as a fallback but unacceptable for launch content.
- Contact and Quote pages are client-action heavy and should be re-tested against
  production build with real Supabase env.

Required before launch:

- Re-run build/e2e/a11y with production-like Sanity and Supabase env.
- Confirm no dev server JSON parse errors remain.
- Add a CI status gate that includes the a11y suite, not just local PR e2e.

## B. Environment Variables

Status: **Documented, but production values are missing in this audit.**

`.env.example` covers the expected categories:

- Site URL: `NEXT_PUBLIC_SITE_URL`
- Sanity: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
  `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`,
  `SANITY_WEBHOOK_SECRET`
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`
- Uploadthing: `UPLOADTHING_TOKEN`
- Resend: `RESEND_API_KEY`
- Turnstile: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- Upstash: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- CookieYes: `NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY`
- Analytics: `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`
- Sentry: `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_ORG`,
  `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `SENTRY_ENVIRONMENT`
- Flags: `DISABLE_ANALYTICS`, `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL`

Public/private separation:

- Server-only keys are referenced through `lib/env.server.ts` and server-only
  modules.
- Supabase service role key is only used in `lib/supabase/server.ts`, which is
  server-only.
- `NEXT_PUBLIC_*` variables are used only for values intended to be public.

Risks:

- Local validation showed `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing.
- `NEXT_PUBLIC_SITE_URL` defaults to `http://localhost:3000` in page metadata
  helpers when absent. Production must set the canonical domain.
- `sanity/sanity.config.ts` falls back to `replaceid`, which is acceptable for
  Studio bootstrapping but not production validation.
- `DISABLE_ANALYTICS=true` is documented for development/preview; production
  must intentionally choose consent-gated analytics behavior.

Required before launch:

- Configure all required Vercel production env vars.
- Confirm no server action throws missing env on live Contact/Quote submission.
- Confirm the Sanity production dataset exists and has the required singleton
  settings document.

## C. SEO / GEO / Metadata

Status: **Partial foundation; not production complete.**

Findings:

- Arabic is configured as the default locale at root.
- English uses `/en` through `localePrefix: "as-needed"`.
- No `/ar` pattern was found in app routes.
- Most inner pages have localized metadata title/description, canonical URL, and
  Open Graph basics.
- Services page has localized title/description and Open Graph but does not set
  canonical metadata.
- The root layout has default site metadata.

Missing or incomplete:

- No `robots.txt` found in `public` or `app`.
- No sitemap route/file found.
- No `llms.txt` or `llms-full.txt` found in `public`.
- No `opengraph-image.tsx` route found.
- No structured data was found.
- No hreflang language alternates were found; only canonical alternates are
  present on most pages.
- Homepage does not currently define localized page-specific metadata.

Required before launch:

- Add robots, sitemap, bilingual `llms.txt`, canonical strategy, hreflang
  alternates, Open Graph image foundation, and structured organization/site
  schema.
- Add canonical metadata for Services and homepage.
- Verify every canonical uses the production `NEXT_PUBLIC_SITE_URL`.

## D. Forms And Submissions

Status: **Functional persistence foundation, not production-complete.**

Findings:

- Contact and Quote use Next Server Actions, not API routes.
- Zod validation exists for Contact and Quote payloads.
- Honeypot validation exists and is present in forms.
- Supabase persistence is implemented through a server-only service-role client.
- Supabase insert happens before any future email side effect.
- Form status components use `role="alert"` for errors and `role="status"` for
  success with `aria-atomic`.
- Contact and Quote forms use labels, autocomplete, fieldsets/legends where
  needed, and `aria-busy`.
- Uploadthing route exists with MIME/extension/size validation.

Missing or incomplete:

- Turnstile is not integrated into form UI or Server Actions.
- Upstash rate limiting is not integrated.
- Resend email notification is not integrated.
- `updateSubmissionEmailStatus` exists but is not used by current actions.
- Quote form does not consume or persist uploaded file references, despite
  Uploadthing foundation and file schemas existing.
- No production Supabase table/RLS verification is documented in code.

Required before launch:

- Add Turnstile verification and Upstash rate limiting.
- Confirm Supabase schema and service-role env in production.
- Add email notification flow after persistence, or explicitly launch without
  email and document the operational inbox workflow.
- Wire Quote file upload references if attachments are part of launch scope.
- Re-run form tests against production-like Supabase and bot protection env.

## E. Accessibility

Status: **Good automated foundation; manual launch QA still required.**

Findings:

- Skip navigation is first focus target and moves focus to `main`.
- Header active route state uses `aria-current="page"`.
- Breadcrumbs use nav/list/current-page semantics on tested routes.
- Disabled placeholder controls use `aria-disabled` and `tabIndex={-1}`.
- Forms use labels, autocomplete, `aria-busy`, fieldsets, legends, and live
  status roles.
- Reduced-motion strategy is documented and implemented for reveal/Lenis.
- Reveal uses `opacity: 0.01`, not `visibility: hidden` or `autoAlpha`.
- H1 and first hero content are not wrapped in Reveal.
- Focus outlines are visible and static.

Risks:

- Automated axe test currently verifies integration; it does not fail on
  violations yet.
- Arabic and English screen reader QA is not documented as complete.
- Cookie preferences control depends on CookieYes script availability.
- Mobile header is intentionally minimal; full mobile menu is not built.
- Long Arabic CMS content wrapping remains unverified with production content.

Required before launch:

- Manual keyboard pass on all public Arabic and English routes.
- Manual screen reader smoke test in Arabic and English.
- Real device QA on iOS Safari and Android Chrome.
- Confirm Cookie Preferences opens the consent preference center in production.

## F. Performance

Status: **Motion is controlled; bundle and production CWV remain launch risks.**

Findings:

- GSAP and ScrollTrigger are dynamically imported through `lib/animation/gsap.ts`.
- Lenis is dynamically imported and disabled by default.
- SmoothScroll is not mounted unless the public flag is enabled.
- Reveal avoids layout properties and caps item targets.
- No Three.js, Spline, page transitions, cursor effects, parallax, or shaders are
  active.
- Previous local lab baseline showed safe LCP/CLS on localhost.

Risks:

- `PERFORMANCE_POLISH_REPORT.md` records local first-load JS gzip around
  252-256 KB, above the 150 KB budget.
- Broad reveal rollout means GSAP/ScrollTrigger can load on most public pages
  after hydration.
- Portfolio and Blog image performance remains a future planning item.
- Production Lighthouse/WebPageTest with real CMS data has not been captured.

Required before launch:

- Run production Lighthouse or WebPageTest with real env/content.
- Investigate initial JS budget overage or explicitly approve the risk.
- Re-measure after CMS content and any images are added.

## G. Security

Status: **Good baseline; form abuse controls are incomplete.**

Findings:

- Security headers include `X-Frame-Options`, `X-Content-Type-Options`, HSTS,
  `Referrer-Policy`, `Permissions-Policy`, and DNS prefetch control.
- CSP remains deferred by prior architecture decision.
- Sanity revalidation webhook uses HMAC-SHA256 and timing-safe comparison.
- Server-only env and clients are isolated with `server-only`.
- Supabase service role is not imported by client components.
- Uploadthing validates allowed file extensions, MIME types, count, and max size.
- No raw secret values were found in source during audit.
- No `<img>`, `dangerouslySetInnerHTML`, `eval`, or `new Function` usage was
  found in app/component/lib source.

Risks:

- Turnstile and rate limiting are not integrated into forms.
- Uploadthing currently accepts SVG and AI/PostScript; those file types need a
  confirmed operational security policy before launch.
- No CSP means third-party script containment relies on current header baseline
  and provider trust.
- Sentry privacy policy/scrubbing settings were not audited beyond local config.

Required before launch:

- Add and test bot protection and rate limiting.
- Review accepted upload types, especially SVG/AI.
- Confirm Sentry PII/data scrubbing settings in the Sentry project.
- Confirm CookieYes/analytics scripts are consent-gated.

## H. CMS / Sanity

Status: **Schema and loader foundation exist; production content is not verified.**

Findings:

- Service, portfolio, blog, testimonial, team, settings, and redirect schemas
  exist.
- Slugs are locked after publish for service, portfolio, and blog.
- Settings singleton includes footer/contact/social and homepage section
  foundations.
- Public client uses published perspective and CDN.
- Preview client uses a server-only token.
- Loaders are server-only and null-safe.
- Mappers validate internal hrefs and content slugs.
- Localized fallback helper exists.

Risks:

- Sanity project/dataset/content readiness is not confirmed.
- Settings singleton absence can produce empty homepage shell or fallback footer.
- Redirect schema exists but middleware does not consume redirect documents yet.
- Portfolio/blog image rendering is not active; visual proof is still limited.
- Some schema fields are optional where production content might need stronger
  validation.

Required before launch:

- Create/verify production dataset.
- Publish settings singleton with home hero, services, testimonials/contact data.
- Publish minimum viable services/portfolio/blog/testimonial content or approve
  fallback launch content.
- Decide whether CMS redirects are required for launch.

## I. Internationalization

Status: **Strong routing foundation; metadata alternates need work.**

Findings:

- `routing.defaultLocale` is `ar`.
- `localePrefix` is `as-needed`, so Arabic stays at root and English uses `/en`.
- Locale detection is enabled.
- Layout sets `lang` and `dir`.
- Translations are split by namespace for Arabic and English.
- Navigation and footer URL helpers keep Arabic at root and English under `/en`.
- RTL typography and logical spacing are used throughout.
- Tests verify Arabic root and English `/en` shells.

Risks:

- `INFORMATION_ARCHITECTURE.md` still contains an older note about `/ar/...`;
  implementation correctly uses Arabic root, but documentation should be cleaned
  later to avoid agent confusion.
- Hreflang alternates are missing.
- Long Arabic content with real CMS data is not manually QA'd.

Required before launch:

- Add hreflang alternates.
- Confirm no `/ar` routes are generated or indexed.
- Manual Arabic and English route crawl before deploy.

## J. Legal / Tracking / Consent

Status: **Consent foundation exists; production integration must be verified.**

Findings:

- CookieYes script is conditionally loaded when
  `NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY` exists.
- Footer Cookie Preferences button has `cky-banner-element`, matching CookieYes
  trigger behavior.
- Analytics env vars are documented.
- No GA/GTM scripts were found directly loaded outside CookieYes in current
  source.

Risks:

- CookieYes key is missing in audit environment.
- Privacy, terms, cookie policy, accessibility, and related legal routes are
  linked in Footer but not implemented as pages in the current app tree.
- Consent mode behavior is not verified in a browser with a real CookieYes key.

Required before launch:

- Configure CookieYes production banner and preference center.
- Implement or provide legal pages for Footer links.
- Confirm analytics load only after consent.

## K. Deployment Readiness

Status: **Build deployable; launch operations incomplete.**

Assumptions:

- Target host: Vercel.
- Install command: `npm ci`.
- Build command: `npm run build`.
- Runtime start command for local production smoke: `npm start`.
- Node version in GitHub Actions: 22.

Ready:

- Build command passes.
- Health route exists and returns status/version/timestamp with `no-store`.
- Sentry package/config exists.
- Playwright CI workflow exists for PR and Vercel deployment status.

Not ready:

- Production env values are not verified.
- UptimeRobot external monitor is not confirmed.
- CI currently runs PR e2e Chromium and preview e2e Chromium; a11y is not a
  separate required CI job.
- Legal routes and SEO files are missing.
- Full e2e status is currently failing in this audit.

Required post-deploy checks:

- `/`, `/en`, `/services`, `/en/services`, `/contact`, `/en/contact`,
  `/quote`, `/en/quote`, `/api/health`
- Sanity content render without fallback errors.
- Contact and Quote submissions persist in Supabase.
- Cookie preferences open.
- Canonicals/hreflang point to production domain.
- Sentry receives a test error in the correct environment.
- UptimeRobot is active against `/api/health`.
