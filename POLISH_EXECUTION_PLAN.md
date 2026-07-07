# Polish Execution Plan

Milestone 7.2 converts the approved polish backlog into small, reviewable
implementation sprints. This document is planning only. No fixes are implemented
by this milestone.

## Sprint 7.2A: Critical / Launch Blockers Only

Goal:

- Resolve production readiness blockers that affect launch trust, consent,
  forms, and environment configuration.
- Keep the work functional and accessibility-first, not visual redesign.

Likely affected files:

- `components/layout/Footer.tsx`
- `app/[locale]/layout.tsx`
- `app/[locale]/contact/page.tsx`
- `app/[locale]/quote/page.tsx`
- `components/forms/*`
- `app/actions/_shared/*`
- `app/actions/contact.ts`
- `app/actions/quote.ts`
- `lib/supabase/*`
- `lib/env.ts`
- `lib/env.server.ts`
- `.env.example`
- `messages/ar/common.json`
- `messages/en/common.json`
- `messages/ar/contact.json`
- `messages/en/contact.json`
- `messages/ar/quote.json`
- `messages/en/quote.json`

Risk level:

- High. This sprint touches consent, forms, server actions, persistence, and
  production environment behavior.

Acceptance criteria:

- Cookie Preferences control opens or triggers the approved consent preference
  behavior.
- Contact and Quote forms have accessible submit, pending, success, and error
  states.
- Form submissions persist before email or external side effects, per the closed
  architecture decisions.
- Bot protection and rate limiting are integrated only if the required external
  credentials are available and documented.
- Required public/server environment variables are documented in `.env.example`.
- Arabic root routes and English `/en` routes continue to work.
- No secrets are exposed to client components.

What must not be changed:

- Do not redesign Contact or Quote page layout.
- Do not add animations, page transitions, 3D, Spline, parallax, or Lenis
  activation.
- Do not create form API routes for submissions.
- Do not call email before persistence.
- Do not modify unrelated public pages.
- Do not change CMS schemas unless the approved blocker specifically requires it.

Required tests:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual keyboard form pass for Arabic and English.
- Manual reduced-motion smoke test if any client state is added.

## Sprint 7.2B: High-Priority Visual Polish

Goal:

- Raise perceived creative quality without large redesigns.
- Prioritize Portfolio proof, Blog editorial presence, page-specific CTAs, and
  reduced repeated card-grid patterns.

Likely affected files:

- `app/[locale]/portfolio/page.tsx`
- `app/[locale]/blog/page.tsx`
- `app/[locale]/services/page.tsx`
- `app/[locale]/contact/page.tsx`
- `app/[locale]/pricing/page.tsx`
- `app/[locale]/about/page.tsx`
- `components/sections/CTASection.tsx`
- `components/ui/Card.tsx`
- `components/ui/SectionHeader.tsx`
- `components/ui/editorial.ts`
- `messages/ar/portfolio.json`
- `messages/en/portfolio.json`
- `messages/ar/blog.json`
- `messages/en/blog.json`
- `messages/ar/services.json`
- `messages/en/services.json`
- `messages/ar/contact.json`
- `messages/en/contact.json`
- `messages/ar/pricing.json`
- `messages/en/pricing.json`
- `messages/ar/about.json`
- `messages/en/about.json`

Risk level:

- Medium. Visual composition changes can affect responsive layout, RTL wrapping,
  and section rhythm.

Acceptance criteria:

- Portfolio has stronger proof hierarchy without requiring detail pages.
- Blog has a clearer editorial hierarchy without adding search or filtering
  behavior.
- CTAs feel page-specific while preserving the existing CTASection API where
  practical.
- Services gains a stronger strategic hierarchy or decision-aid section without
  building service detail pages.
- Contact information feels more like a premium "fastest path" module.
- Pricing has clearer plan-fit guidance if needed.
- All changes use existing UI components and design tokens.
- Arabic and English layouts remain first-class.

What must not be changed:

- Do not add CMS schema work unless explicitly scheduled.
- Do not invent fake portfolio images, fake client results, or fake people.
- Do not add advanced visuals, 3D, Spline, shaders, or page transitions.
- Do not activate Lenis.
- Do not add client-side filtering logic.
- Do not build internal/detail pages.

Required tests:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual visual QA at mobile, tablet, and desktop widths.
- Manual RTL/LTR scan for long headings, badges, and CTA labels.

## Sprint 7.2C: Motion Polish

Goal:

- Refine the existing motion layer only where QA proves it is necessary.
- Keep motion calm, editorial, accessible, and performance-conscious.

Likely affected files:

- `components/motion/Reveal.tsx`
- `lib/animation/reveal.ts`
- `lib/animation/tokens.ts`
- `lib/animation/presets.ts`
- `lib/animation/gsap.ts`
- `app/globals.css`
- Public page files using `<Reveal>`:
  - `app/[locale]/page.tsx`
  - `app/[locale]/services/page.tsx`
  - `app/[locale]/portfolio/page.tsx`
  - `app/[locale]/about/page.tsx`
  - `app/[locale]/contact/page.tsx`
  - `app/[locale]/quote/page.tsx`
  - `app/[locale]/industries/page.tsx`
  - `app/[locale]/pricing/page.tsx`
  - `app/[locale]/blog/page.tsx`
- `MOTION_FOUNDATION.md`
- `MOTION_LANGUAGE.md`
- `REVEAL_LANGUAGE.md`

Risk level:

- Medium. Motion changes can affect accessibility, LCP safety, and mobile
  performance.

Acceptance criteria:

- Reveal variants remain semantically aligned with content.
- No H1, initial Hero, Header, Footer, first-viewport Trust Bar, or form input is
  animated.
- Reduced-motion users receive final visible content with no reveal setup.
- No `autoAlpha`, `visibility: hidden`, `opacity: 0`, or hiding clip-path is used
  on important content.
- GSAP and ScrollTrigger remain dynamically loaded.
- Animation remains transform/opacity only and avoids layout properties.
- Any reveal timing adjustment is documented.

What must not be changed:

- Do not add page transitions.
- Do not activate Lenis.
- Do not add new reveal coverage unless a specific QA issue requires it.
- Do not add parallax, scroll progress, custom cursor, 3D, Spline, or decorative
  scroll effects.
- Do not animate focus outlines.
- Do not animate form controls individually.

Required tests:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual reduced-motion test.
- Manual keyboard scroll test to confirm `top 90%` reveal behavior remains safe.

## Sprint 7.2D: Accessibility Polish

Goal:

- Tighten keyboard, screen reader, form, breadcrumb, disabled-control, contrast,
  and RTL accessibility behavior before launch.

Likely affected files:

- `components/common/SkipNavigation.tsx`
- `components/layout/Header.tsx`
- `components/layout/HeaderNavigation.tsx`
- `components/layout/Footer.tsx`
- `components/forms/*`
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/SectionHeader.tsx`
- `components/sections/CTASection.tsx`
- Public page files under `app/[locale]`
- `tests/accessibility.spec.ts`
- `messages/ar/*.json`
- `messages/en/*.json`

Risk level:

- Medium. Accessibility polish can touch shared components and test behavior.

Acceptance criteria:

- Skip link remains first focus target and moves focus to `main`.
- Header active route state remains visible and uses `aria-current="page"`.
- Breadcrumbs remain semantic on all public routes.
- Disabled placeholder controls are understandable and not focusable.
- Focus outlines are visible and not animated.
- Forms keep labels, autocomplete, fieldsets, legends, and logical focus order.
- Arabic and English screen reader labels are localized.
- Contrast remains WCAG AA.

What must not be changed:

- Do not redesign pages while making accessibility fixes.
- Do not remove visible focus states.
- Do not hide important content with `aria-hidden`, `display: none`,
  `visibility: hidden`, or `autoAlpha`.
- Do not add motion as an accessibility enhancement.
- Do not create new navigation behavior without a separate task.

Required tests:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual keyboard traversal on all public routes in Arabic and English.
- Manual screen reader smoke test for Arabic and English where available.

## Sprint 7.2E: Mobile / Responsive Polish

Goal:

- Improve mobile and tablet layout quality without changing desktop information
  architecture.
- Focus on long Arabic content, Quote length, Pricing tablet balance, Portfolio
  and Blog card density, and Header mobile limitations.

Likely affected files:

- `components/layout/Header.tsx`
- `components/layout/HeaderNavigation.tsx`
- `components/layout/Footer.tsx`
- `components/sections/Hero.tsx`
- `components/sections/InnerPageHero.tsx`
- `components/sections/CTASection.tsx`
- `components/ui/Card.tsx`
- `components/ui/Section.tsx`
- `components/ui/Container.tsx`
- `components/ui/editorial.ts`
- `app/[locale]/quote/page.tsx`
- `app/[locale]/pricing/page.tsx`
- `app/[locale]/portfolio/page.tsx`
- `app/[locale]/blog/page.tsx`
- `app/[locale]/services/page.tsx`
- `app/[locale]/contact/page.tsx`

Risk level:

- Medium. Responsive changes can introduce regressions across Arabic and English.

Acceptance criteria:

- No text overlaps or overflows at common mobile and tablet widths.
- Quote form is easier to scan on mobile without adding backend behavior.
- Pricing recommended-card treatment remains balanced on tablet.
- Portfolio and Blog metadata stays readable on mobile.
- CTAs stack cleanly and maintain usable tap targets.
- Header mobile state remains honest until a full mobile menu sprint is approved.
- Footer columns collapse cleanly and remain scannable.

What must not be changed:

- Do not build the full mobile menu unless separately scheduled.
- Do not add page transitions, Lenis activation, 3D, Spline, or advanced motion.
- Do not change content meaning.
- Do not remove sections to shorten mobile pages.
- Do not use viewport-scaled font sizing.

Required tests:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual visual QA at 360px, 390px, 768px, 1024px, and desktop widths.
- Manual Arabic long-string wrapping check.

## Sprint 7.2F: Performance Polish

Goal:

- Measure and reduce performance risk after the reveal rollout and before adding
  any advanced visuals.
- Keep LCP, client bundle, and mobile runtime cost protected.

Likely affected files:

- `next.config.ts`
- `package.json`
- `playwright.config.ts`
- `lib/animation/*`
- `components/motion/Reveal.tsx`
- `components/motion/SmoothScroll.tsx`
- `components/sections/Hero.tsx`
- `components/sections/InnerPageHero.tsx`
- `app/[locale]/layout.tsx`
- Public page files using heavy lists or reveal groups
- `.env.example`
- Performance documentation files as needed

Risk level:

- Medium to High if runtime code is changed. Low if limited to measurement and
  documentation.

Acceptance criteria:

- Build output remains clean.
- GSAP and ScrollTrigger stay dynamically imported.
- Lenis remains disabled by default.
- No Server Component imports client-only animation libraries.
- Reveal group count and runtime cost are reviewed.
- Core Web Vitals baselines are captured for main public routes where tooling is
  available.
- Portfolio/Blog image performance plan exists before real images are added.

What must not be changed:

- Do not add advanced visual effects.
- Do not add 3D, Spline, shaders, page transitions, cursor effects, or parallax.
- Do not activate Lenis by default.
- Do not hide or delay H1/LCP content.
- Do not remove accessibility tests to improve metrics.

Required tests:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Bundle or Lighthouse-style measurement where available.
- Manual reduced-motion and low-end mobile smoke test if runtime changes occur.

## Sprint 7.2G: Deferred Advanced Ideas

Goal:

- Keep advanced ideas documented but explicitly out of implementation until the
  core polish, accessibility, and performance sprints are complete.

Likely affected files if revisited later:

- `PAGE_TRANSITIONS_PLAN.md`
- `PAGE_TRANSITIONS_DECISION.md`
- `MOTION_FOUNDATION.md`
- `MOTION_LANGUAGE.md`
- `REVEAL_LANGUAGE.md`
- Future files only after approval, such as:
  - `components/motion/PageTransition.tsx`
  - Future 3D/Spline/Three.js integration files
  - Future advanced visual documentation

Risk level:

- High. These ideas can affect LCP, accessibility, bundle size, route behavior,
  mobile performance, and maintainability.

Acceptance criteria before any implementation:

- Sprints 7.2A through 7.2F are complete or explicitly deferred by review.
- Real device QA is complete for Arabic and English.
- Reduced-motion behavior is manually verified.
- Core Web Vitals baselines are documented.
- Claude approves a specific implementation scope.
- The implementation remains small, reversible, and gated.

What must not be changed:

- Do not add 3D.
- Do not add Spline.
- Do not add Three.js scenes.
- Do not implement page transitions.
- Do not activate Lenis by default.
- Do not add custom cursor, parallax, scroll progress, shader backgrounds, or
  decorative scroll storytelling.

Required tests for any future approved advanced sprint:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run test:a11y`
- Manual keyboard, screen reader, reduced-motion, and mobile/touch QA.
- LCP and bundle measurement before and after.

## Recommended First Implementation Sprint

Recommended first sprint: Sprint 7.2A, limited to launch blockers.

Reason:

- Consent, forms, and production environment configuration are higher launch risk
  than visual polish.
- Sprint 7.2A creates the production foundation needed before improving
  Portfolio, Blog, CTAs, motion timing, mobile refinements, or performance
  measurement.
- It also keeps the next implementation sprint narrow and reviewable by avoiding
  creative redesign work and advanced motion.

If external service credentials are not available, split Sprint 7.2A into:

1. Documentation and `.env.example` completeness.
2. Form UI state wiring that does not call external services.
3. External integration once credentials are available.
