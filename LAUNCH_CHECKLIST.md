# Launch Checklist

**Date:** July 8, 2026  
**Scope:** Milestone 8.1 pre-launch production readiness.

## Must Fix Before Launch

- [ ] Configure production `NEXT_PUBLIC_SITE_URL` with the final canonical
  domain.
- [ ] Configure Sanity production env:
  `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`,
  `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`,
  `SANITY_WEBHOOK_SECRET`.
- [ ] Confirm Sanity production dataset exists and contains the required
  published settings singleton and public content.
- [ ] Fix current `npm run test:e2e` failure and rerun until clean.
- [ ] Add or generate `robots.txt`.
- [ ] Add or generate sitemap.
- [ ] Add bilingual `llms.txt` and `llms-full.txt`.
- [ ] Add hreflang alternates for Arabic root and English `/en`.
- [ ] Add canonical metadata for homepage and Services page.
- [ ] Add Open Graph image foundation.
- [ ] Implement or publish legal routes linked from Footer: privacy policy,
  terms, cookies policy, accessibility.
- [ ] Configure CookieYes production key and verify Footer Cookie Preferences
  opens the preference center.
- [ ] Configure Supabase production env and verify `submissions` table schema.
- [ ] Verify Contact form persists successfully in Supabase.
- [ ] Verify Quote form persists successfully in Supabase.
- [ ] Add Turnstile server verification to Contact and Quote submissions, or
  explicitly block public launch until complete.
- [ ] Add Upstash rate limiting to Contact and Quote submissions, or explicitly
  block public launch until complete.
- [ ] Decide and implement launch email behavior: Resend notification after
  Supabase persistence, or documented manual lead-monitoring workflow.
- [ ] Confirm Uploadthing production token and quote attachment scope if file
  uploads are part of launch.
- [ ] Confirm Sentry DSNs and source-map upload env for production.
- [ ] Confirm UptimeRobot monitor for `/api/health`.

## Should Fix Before Launch

- [ ] Add organization/site structured data.
- [ ] Add Services page canonical metadata.
- [ ] Add homepage localized metadata.
- [ ] Add preview or production check to ensure Sanity fallback errors are not
  normal operating behavior.
- [ ] Add a CI a11y job, not only local a11y command.
- [ ] Add CI status gate for `npm run lint`, `npm run build`,
  `npm run test:e2e`, and `npm run test:a11y`.
- [ ] Review upload file type policy, especially SVG and AI/PostScript.
- [ ] Confirm Sentry PII/data scrubbing.
- [ ] Run production Lighthouse or WebPageTest with real CMS content.
- [ ] Investigate first-load JS over the 150 KB gzip budget.
- [ ] Run real-device QA on iOS Safari and Android Chrome.
- [ ] Run Arabic and English manual screen reader smoke tests.
- [ ] Confirm long Arabic CMS content wraps without overlap.

## Nice To Have After Launch

- [ ] CMS-managed redirects consumed by middleware.
- [ ] Portfolio and Blog image systems with Sanity image performance safeguards.
- [ ] Page-specific CTA refinement.
- [ ] Fuller mobile menu with focus trap.
- [ ] Production dashboard for form submissions.
- [ ] Richer OG image variants per route.
- [ ] More complete axe violation assertions after launch baseline.
- [ ] Advanced ideas from `DEFERRED_ADVANCED_IDEAS.md`, only after approval.

## Production Environment Checklist

- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] `NEXT_PUBLIC_SANITY_DATASET=production`
- [ ] `NEXT_PUBLIC_SANITY_API_VERSION`
- [ ] `SANITY_API_READ_TOKEN`
- [ ] `SANITY_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `UPLOADTHING_TOKEN`
- [ ] `RESEND_API_KEY`
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- [ ] `TURNSTILE_SECRET_KEY`
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY`
- [ ] `NEXT_PUBLIC_GTM_ID`
- [ ] `NEXT_PUBLIC_GA4_ID`
- [ ] `NEXT_PUBLIC_SENTRY_DSN`
- [ ] `SENTRY_DSN`
- [ ] `SENTRY_ORG`
- [ ] `SENTRY_PROJECT`
- [ ] `SENTRY_AUTH_TOKEN`
- [ ] `SENTRY_ENVIRONMENT=production`
- [ ] `DISABLE_ANALYTICS=false` only if CookieYes gating is verified.
- [ ] `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=false` unless separately approved.

## QA Checklist

- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test:e2e` passes.
- [ ] `npm run test:a11y` passes.
- [ ] Production preview smoke test passes for Arabic and English routes.
- [ ] No server logs for missing Sanity env.
- [ ] No browser console errors on public routes.
- [ ] No horizontal overflow at 360px, 390px, 768px, 1024px, desktop.
- [ ] Header active nav state is visible and uses `aria-current`.
- [ ] Breadcrumbs are visible and semantic.
- [ ] Footer links resolve or intentionally route to implemented pages.

## SEO Checklist

- [ ] Arabic home is `/`.
- [ ] English home is `/en`.
- [ ] No `/ar` URLs are generated or linked.
- [ ] Canonical URLs use production domain.
- [ ] Hreflang includes Arabic root, English `/en`, and `x-default` if approved.
- [ ] Metadata title/description exists on all launch routes.
- [ ] Open Graph title/description/url/image exist.
- [ ] `robots.txt` allows intended public routes.
- [ ] Sitemap includes Arabic and English public routes.
- [ ] `llms.txt` is bilingual and Arabic-first.
- [ ] Structured data validates.

## Accessibility Checklist

- [ ] Skip link is first focus target.
- [ ] Keyboard navigation works across all public Arabic and English routes.
- [ ] Focus states are visible and static.
- [ ] Forms have labels, autocomplete, fieldsets/legends where needed.
- [ ] Error and success statuses are announced correctly.
- [ ] Disabled placeholder controls are non-focusable and understandable.
- [ ] Reduced-motion disables reveal/Lenis setup.
- [ ] H1 and initial hero content are visible on first paint.
- [ ] Manual screen reader smoke test completed in Arabic and English.
- [ ] Cookie Preferences control is keyboard-accessible.

## Forms Checklist

- [ ] Contact required fields validate client/server.
- [ ] Quote required fields validate client/server.
- [ ] Honeypot is present and server-validated.
- [ ] Turnstile widget renders and token verifies server-side.
- [ ] Upstash rate limit blocks repeated submissions.
- [ ] Supabase insert succeeds before email.
- [ ] Email notification sends after persistence, if launch scope includes email.
- [ ] Email status updates in Supabase if email is implemented.
- [ ] User sees localized success and error states.
- [ ] Failed submission does not clear entered data unexpectedly.
- [ ] Upload attachment is validated and persisted if enabled.

## Deployment Checklist

- [ ] Vercel project connected to GitHub repository.
- [ ] Production branch confirmed.
- [ ] Build command: `npm run build`.
- [ ] Install command: `npm ci`.
- [ ] Node version compatible with CI and Vercel.
- [ ] Production env vars configured.
- [ ] Preview env vars configured separately.
- [ ] Sanity webhook points to production `/api/revalidate`.
- [ ] Sanity webhook uses `SANITY_WEBHOOK_SECRET`.
- [ ] DNS and final domain configured.
- [ ] HSTS confirmed after HTTPS is stable.
- [ ] Rollback plan documented: previous Vercel deployment and env rollback.

## Post-Launch Monitoring Checklist

- [ ] `/api/health` returns `{ status: "ok" }`.
- [ ] UptimeRobot monitors home and `/api/health`.
- [ ] Sentry receives production errors.
- [ ] Contact form test submission appears in Supabase.
- [ ] Quote form test submission appears in Supabase.
- [ ] Sanity publish triggers successful revalidation.
- [ ] CookieYes consent logs/settings verified.
- [ ] Analytics events fire only after consent.
- [ ] Search Console submitted for production domain.
- [ ] Core Web Vitals monitored after first traffic.
