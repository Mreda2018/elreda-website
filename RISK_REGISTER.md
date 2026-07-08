# Risk Register

**Date:** July 8, 2026  
**Scope:** Milestone 8.1 pre-launch production readiness.

| Risk | Severity | Area | Impact | Recommended Action | Owner | Launch Blocker |
|---|---|---|---|---|---|---|
| Full e2e suite is not passing in current audit. | High | QA | Deployment could ship route/runtime regressions. | Fix the Chromium failure and rerun `npm run test:e2e` cleanly with production-like env. | Codex + QA | Yes |
| Missing Sanity public env causes repeated loader errors. | High | CMS / Runtime | Homepage, footer, portfolio, services, blog, and testimonials may render fallback or empty states. | Configure Sanity env and verify production dataset/content. | Deployment owner | Yes |
| Homepage can render an empty shell if `loadHomeHero` returns null. | High | CMS / UX | Production home could appear blank if settings content/env is missing. | Treat settings singleton and home hero as required launch content; add predeploy content check later. | CMS owner | Yes |
| CookieYes production integration is unverified. | High | Legal / Consent | Cookie Preferences may not work; analytics consent may be non-compliant. | Configure `NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY` and verify banner/preference center. | Deployment owner | Yes |
| Legal pages linked from Footer are not implemented. | High | Legal / SEO | Users and crawlers hit missing policy pages; consent/legal readiness incomplete. | Implement or publish privacy, terms, cookies, and accessibility pages. | Content + Codex | Yes |
| Forms lack Turnstile verification. | High | Security / Forms | Spam and bot submissions can reach Supabase. | Add Turnstile UI and server verification before public launch. | Codex | Yes |
| Forms lack Upstash rate limiting. | High | Security / Forms | Distributed or repeated spam can consume resources and pollute leads. | Add per-IP/per-form rate limiting before public launch. | Codex | Yes |
| Form email notification flow is incomplete. | Medium | Forms / Ops | Leads may persist but not notify the team. | Add Resend after Supabase insert or define manual Supabase monitoring workflow. | Codex + Ops | Yes, if inbox workflow is required |
| Quote upload route exists but Quote action does not persist attachments. | Medium | Forms / Uploads | Users cannot submit project files through the current Quote flow. | Wire file upload references or remove launch expectation for attachments. | Codex | No, if attachments are deferred |
| Supabase production table/RLS is not verified. | High | Data / Security | Submissions may fail or data policy may be unsafe. | Verify table schema, service role isolation, backups, and RLS policy stance. | Deployment owner | Yes |
| `robots.txt` is missing. | High | SEO | Crawlers lack explicit indexing guidance. | Add robots route/file for production domain. | Codex / SEO | Yes |
| Sitemap is missing. | High | SEO / GEO | Search discovery and bilingual indexing are weaker. | Add sitemap generation for Arabic root and English `/en`. | Codex / SEO | Yes |
| `llms.txt` and `llms-full.txt` are missing. | Medium | GEO | AI-readable bilingual content requirement is unmet. | Add Arabic-first bilingual AI-readable files. | SEO owner | Yes, if GEO launch is required |
| Hreflang alternates are missing. | High | SEO / i18n | Arabic/English pages may compete or be indexed incorrectly. | Add locale alternates for all launch routes. | Codex / SEO | Yes |
| Services page canonical metadata is missing. | Medium | SEO | Duplicate URL signals are weaker for a key commercial page. | Add canonical metadata consistent with other inner pages. | Codex | No |
| Homepage localized metadata is incomplete. | Medium | SEO | Root and `/en` home may share generic metadata. | Add localized homepage metadata. | Codex / SEO | No |
| Open Graph image route is missing. | Medium | SEO / Social | Shared links may look generic and reduce trust. | Add branded OG image foundation. | Codex / Design | No |
| Structured data is missing. | Medium | SEO | Organization/site understanding is weaker for search and AI systems. | Add Organization and WebSite schema after content is approved. | SEO owner | No |
| First-load JS exceeds 150 KB gzip budget in local diagnostics. | High | Performance | Mobile performance and roadmap compliance risk. | Investigate shared bundle and set budget acceptance criteria before advanced visuals. | Performance owner | No, unless target is strict |
| Production Lighthouse/WebPageTest has not been run with real content. | Medium | Performance | Lab local metrics may hide production CDN/CMS/image issues. | Run production-like CWV measurement after env/content setup. | QA / Performance | No |
| Broad reveal rollout loads GSAP/ScrollTrigger on many pages. | Medium | Performance / Motion | Low-end mobile main-thread cost may grow. | Keep no new reveals; validate on low-end Android before additional motion. | Motion owner | No |
| Lenis can be enabled by public env flag. | Medium | Accessibility / Performance | Accidental activation could affect scroll/focus QA. | Keep `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=false` until approved device QA. | Deployment owner | No |
| Redirect schema is not consumed by middleware. | Medium | CMS / SEO | CMS redirects will not work at launch. | Implement redirect consumption only if launch requires redirects. | Codex / CMS | No |
| Sanity production content minimum is not defined. | High | CMS / UX | Pages may launch with empty lists or placeholders. | Define and publish minimum content set before deploy. | CMS owner | Yes |
| Upload file types include SVG and AI/PostScript. | Medium | Security / Uploads | Potential unsafe file handling if exposed to staff/users without process controls. | Review file policy, scanning expectations, and staff handling before enabling uploads. | Security owner | No, if uploads deferred |
| Sentry PII/data scrubbing is not verified. | Medium | Privacy / Monitoring | Form/runtime errors could send sensitive context. | Confirm Sentry project scrubbers and sampling before launch. | Security / Ops | No |
| Cookie/analytics consent mode is not browser-verified. | High | Legal / Tracking | Analytics may load incorrectly or not at all. | Verify CookieYes, GTM, and GA4 behavior in production preview. | Marketing / Legal | Yes |
| CI does not show a dedicated accessibility job. | Medium | QA / Accessibility | A11y regressions may not block PRs. | Add `npm run test:a11y` to CI required checks. | DevOps | No |
| Automated axe test currently verifies integration, not zero violations. | Medium | Accessibility | Violations could be missed. | Add violation assertions after baseline route scan is stable. | Accessibility QA | No |
| Manual Arabic screen reader QA is not complete. | Medium | Accessibility / i18n | Arabic assistive-tech issues may ship. | Run VoiceOver/NVDA Arabic smoke tests before launch. | Accessibility QA | No |
| Long Arabic CMS content is not tested. | Medium | i18n / Responsive | Real content can overflow cards, badges, and CTAs. | QA production content at mobile/tablet/desktop widths. | Content + QA | No |
| Footer service links point to future service detail pages not implemented. | Medium | Routing / UX | Users may hit missing service detail routes. | Either implement service detail pages, adjust links, or confirm middleware behavior. | Codex / Product | Yes, if links remain public |
| Mobile menu is not built. | Medium | Mobile UX | Mobile users have limited navigation. | Decide if current compact header is acceptable for launch or schedule mobile menu. | Product / Codex | No |
| Analytics env exists but runtime loading is not audited beyond CookieYes script. | Medium | Tracking | Launch analytics may be absent or incomplete. | Verify GTM/GA4 tags and consent categories in preview. | Marketing / Ops | No |
| UptimeRobot external monitor is not confirmed. | Medium | Ops | Outages may not alert the team. | Configure monitor for home and `/api/health`. | Ops | Yes |
| Production rollback is not documented in repo. | Medium | Deployment | Incident response may be slower. | Document Vercel rollback and env rollback procedure. | Ops | No |
