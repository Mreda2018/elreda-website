# Deferred Advanced Ideas Register

**Date:** July 8, 2026  
**Scope:** Sprint 7.2G only: documentation and planning for advanced ideas that
remain out of implementation.

## Status

All ideas in this document are deferred. None are approved for runtime work,
component work, design-token changes, CMS changes, or page implementation.

Deferred means:

- The idea may have brand value later.
- It is not needed for launch readiness.
- It carries accessibility, performance, routing, or maintainability risk.
- It requires a separate Claude-approved milestone before implementation.

## Global Prerequisites

No advanced idea should move into implementation until all of the following are
true:

- Sprints 7.2A through 7.2F are approved or explicitly deferred by review.
- Arabic and English real-device QA is complete on mobile, tablet, and desktop.
- Reduced-motion behavior is manually verified.
- Production-like Core Web Vitals baselines are captured with real CMS content.
- Shared first-load JavaScript budget risk is addressed or explicitly accepted.
- Claude approves a narrow, reversible implementation scope.
- The implementation includes before/after bundle and LCP measurement.

## 1. 3D / Spline Ideas

### 3D Hero Accent

Why deferred:

- Hero H1 and first-viewport LCP safety are stronger launch requirements than
  decorative depth.
- Three.js can add meaningful bundle and main-thread cost if not isolated.
- The current visual system is already premium enough to launch without 3D.

Risk level: High.

Prerequisites before implementation:

- Production LCP baseline on `/` and `/en`.
- A static non-3D fallback designed first.
- Dynamic import proof that Three.js is not in first-load route chunks.
- Low-end Android and iOS Safari QA.
- Clear art direction that supports the brand promise, not novelty.

Accessibility concerns:

- The 3D layer must be decorative and `aria-hidden`.
- It must not trap pointer, keyboard, or screen reader interaction.
- It must disable fully for reduced-motion users.
- It must not communicate required information.

Performance concerns:

- No global Three.js import.
- No Spline embed on initial load.
- No heavy shader compilation in the first viewport.
- No canvas that competes with H1 or likely LCP media.
- Must include a hard frame-rate and memory budget before approval.

Suggested future milestone:

- Milestone 8.3: LCP-safe Decorative 3D Prototype.

Go / no-go criteria:

- Go only if route-level LCP remains under target, first-load JS is controlled,
  and the fallback experience is visually complete.
- No-go if 3D adds visible loading, worsens mobile scroll, or becomes the page's
  main visual dependency.

### Spline Embed Experiment

Why deferred:

- Spline embeds can add unpredictable runtime weight and external dependency
  behavior.
- They are harder to audit than code-owned Three.js scenes.

Risk level: High.

Prerequisites before implementation:

- A measured Spline export size.
- A self-hosting or lazy-loading strategy.
- Static fallback and reduced-motion fallback.
- Security and privacy review for any third-party runtime.

Accessibility concerns:

- Embed must be decorative unless a fully accessible alternative exists.
- Keyboard focus must not enter non-essential decorative controls.

Performance concerns:

- Must not load on first paint.
- Must be opt-in below the first viewport or behind an interaction.
- Must not block navigation or form interaction.

Suggested future milestone:

- Milestone 8.4: Optional Spline Feasibility Review.

Go / no-go criteria:

- Go only if Spline is demonstrably lighter and safer than a code-owned
  alternative for the chosen visual.
- No-go if it requires a global runtime, iframe dependency in the hero, or
  reduced-motion compromises.

## 2. Page Transitions

### Entrance-Only Content Transition

Why deferred:

- `PAGE_TRANSITIONS_DECISION.md` recommends implementation later after visual QA.
- Next.js App Router can make exit animations fragile because routed content can
  unmount before animation cleanup.
- Transitions can delay focus, obscure route changes, and harm LCP if applied to
  hero or H1 content.

Risk level: High.

Prerequisites before implementation:

- Approved visual QA after all polish sprints.
- Route-level LCP baseline before and after.
- Keyboard, Back/Forward, skip-link, hash-link, and screen-reader QA.
- Explicit route allowlist.
- A single transition root and cleanup plan.

Accessibility concerns:

- No transition on first load.
- No transition for reduced-motion users.
- No hiding H1, hero content, Header, Footer, skip navigation, or focus outline.
- No `visibility: hidden`, `autoAlpha`, or `display: none` on readable routed
  content.
- Route change must not block focus or screen reader access.

Performance concerns:

- No transition ScrollTriggers.
- No Lenis dependency.
- No overlay that delays readable content.
- Maximum duration remains 420ms for approved content entrance.

Suggested future milestone:

- Milestone 8.1: Restricted Page Transition Prototype.

Go / no-go criteria:

- Go only if the implementation is content-only, entrance-only, reduced-motion
  safe, and does not affect LCP/H1 visibility.
- No-go for global overlays, route caching, previous-page cloning, or any
  transition that blocks navigation.

## 3. Advanced Motion

### Hero Supporting-Content Motion

Why deferred:

- The project has a strict LCP rule: H1 and likely LCP content must remain
  visible on first paint.
- Existing reveal and micro-interactions already provide enough launch motion.

Risk level: Medium to High.

Prerequisites before implementation:

- Identify which hero elements are non-LCP.
- Confirm the H1 remains outside all reveal/animation setup.
- Measure first paint and LCP before and after.
- Reduced-motion fallback reviewed manually.

Accessibility concerns:

- Hero motion must never hide required content.
- Content order must stay unchanged.
- CTAs must remain immediately usable.

Performance concerns:

- No GSAP on initial H1.
- No opacity from `0` for LCP candidates.
- No layout motion or text reflow.

Suggested future milestone:

- Milestone 8.2: LCP-safe Hero Support Motion.

Go / no-go criteria:

- Go only for secondary decorative/supporting content that remains readable
  without animation.
- No-go if the H1, lead paragraph, or primary CTA depends on motion for
  visibility.

### Scroll Storytelling

Why deferred:

- Scroll storytelling can increase ScrollTrigger count, main-thread work, and
  keyboard navigation complexity.
- The current reveal system is intentionally conservative.

Risk level: High.

Prerequisites before implementation:

- Reveal runtime QA on low-end mobile.
- A single page candidate with clear business value.
- A maximum ScrollTrigger count and cleanup plan.
- Content remains complete without scroll effects.

Accessibility concerns:

- No pinned sections that trap keyboard users.
- No scroll progress required to understand content.
- Reduced-motion users receive the complete static layout.

Performance concerns:

- No layout-affecting animation.
- No heavy blur, filters, or continuous scroll-linked transforms on text-heavy
  pages.
- Avoid simultaneous animation groups.

Suggested future milestone:

- Milestone 8.5: Single-Page Scroll Story Prototype.

Go / no-go criteria:

- Go only if one section can demonstrate measurable brand value without harming
  keyboard flow or Core Web Vitals.
- No-go for global scroll storytelling or multi-page rollout.

## 4. Cursor Effects

### Custom Cursor Or Magnetic Pointer

Why deferred:

- Cursor effects are low business value compared with forms, proof assets, and
  page-specific CTAs.
- They add pointer-specific behavior that does not translate to touch.

Risk level: Medium.

Prerequisites before implementation:

- Desktop-only scope.
- No effect on touch devices.
- No dependency on pointer effects to identify clickable elements.
- Reduced-motion and coarse-pointer fallback.

Accessibility concerns:

- Native cursor must remain understandable.
- Focus states must stay visible and static.
- Do not replace semantic hover/focus affordances.

Performance concerns:

- No global per-frame pointer work unless measured.
- No large DOM overlays following the pointer.
- No cursor effect over forms or text-selection areas.

Suggested future milestone:

- Milestone 9.1: Desktop-Only Pointer Enhancement Review.

Go / no-go criteria:

- Go only if the effect is lightweight, desktop-only, non-essential, and can be
  disabled without changing the design.
- No-go if it obscures text, affects form usability, or adds a global RAF loop.

## 5. Decorative Scroll Effects

### Parallax Accents

Why deferred:

- Parallax is explicitly a placeholder in the current motion foundation.
- It can conflict with reduced motion, Lenis, and mobile scroll performance.

Risk level: High.

Prerequisites before implementation:

- Lenis remains optional and separately validated.
- Reduced-motion disables the effect completely.
- The parallax layer is decorative and not tied to reading order.
- Mobile test plan approved before implementation.

Accessibility concerns:

- No required content in parallax layers.
- No scroll-jacking.
- No focusable elements in moving decorative layers.

Performance concerns:

- No continuous transform on many elements.
- No heavy background-position animations on mobile.
- Avoid fixed backgrounds on iOS Safari unless tested.

Suggested future milestone:

- Milestone 8.6: Decorative Parallax Feasibility Test.

Go / no-go criteria:

- Go only for one below-the-fold decorative accent with measured smoothness.
- No-go for global parallax systems or hero parallax before LCP is locked.

### Scroll Progress Bar

Why deferred:

- It adds UI chrome without solving a current launch problem.
- It can become misleading on long form pages and route changes.

Risk level: Medium.

Prerequisites before implementation:

- Decide whether progress is useful for editorial pages only.
- Exclude Contact and Quote unless form behavior is separately reviewed.
- Confirm route cleanup and reduced-motion behavior.

Accessibility concerns:

- Must be decorative or properly labelled.
- Must not replace headings, breadcrumbs, or navigation landmarks.

Performance concerns:

- Avoid global scroll listeners if CSS or low-cost browser primitives are
  sufficient.
- Must not create layout shift or overlay page content.

Suggested future milestone:

- Milestone 9.2: Editorial Scroll Progress Review.

Go / no-go criteria:

- Go only if restricted to long editorial/blog content and measurable as useful.
- No-go for global progress bars across short marketing pages and forms.

## 6. Future Creative Experiments

### Shader Backgrounds

Why deferred:

- Shader backgrounds are visually tempting but high-risk for mobile performance,
  battery use, reduced-motion, and fallback quality.
- The design system already warns to avoid shader/background patterns until
  budgets are confirmed.

Risk level: High.

Prerequisites before implementation:

- Static token-based fallback designed first.
- GPU and battery behavior tested on mobile.
- Bundle and worker strategy defined.
- Clear rule that shaders are decorative only.

Accessibility concerns:

- Must not reduce contrast or readability.
- Must disable for reduced motion and likely for low-power mobile contexts.

Performance concerns:

- Avoid first-viewport shader work.
- Avoid continuous high-resolution canvas rendering.
- Measure CPU/GPU cost before approval.

Suggested future milestone:

- Milestone 9.3: Static-First Shader Exploration.

Go / no-go criteria:

- Go only if the static fallback is excellent and the shader is a progressive
  enhancement.
- No-go if readability, battery, LCP, or scroll responsiveness regresses.

### Video Or Cinematic Backgrounds

Why deferred:

- Videos are outside the approved current rules and can create LCP, bandwidth,
  and accessibility risk.

Risk level: High.

Prerequisites before implementation:

- Explicit content strategy and asset approval.
- Poster image and no-autoplay fallback.
- Captions or transcript if the video carries information.
- Mobile data and reduced-motion policy.

Accessibility concerns:

- No autoplaying informative video without controls.
- Decorative video must be silent, hidden from assistive tech, and replaceable by
  a static image.

Performance concerns:

- No video as required first-viewport content.
- Use optimized poster images and defer video loading.

Suggested future milestone:

- Milestone 9.4: Media Asset Strategy.

Go / no-go criteria:

- Go only when real brand media exists and does not compete with LCP.
- No-go for stock-like atmospheric loops or any video that blocks text.

### AI / Interactive Configurator

Why deferred:

- It is a product feature, not visual polish.
- It would require data, validation, analytics, backend decisions, and
  accessibility design beyond current scope.

Risk level: High.

Prerequisites before implementation:

- Business requirements and privacy review.
- Form/backend architecture approval.
- Accessible state management and progressive enhancement plan.
- Analytics and consent behavior defined.

Accessibility concerns:

- Must not replace the static Quote and Contact paths.
- Needs full keyboard and screen reader support.
- Error and loading states must be localized.

Performance concerns:

- Avoid loading AI or heavy interaction code on all routes.
- Lazy-load only where users request it.

Suggested future milestone:

- Milestone 10.1: Quote Guidance Product Discovery.

Go / no-go criteria:

- Go only if it directly improves qualified lead conversion and has backend
  ownership.
- No-go as a decorative chatbot or generic lead widget.

## Recommended Future Order

1. Keep all advanced ideas deferred until production readiness and polish sprints
   are approved.
2. Revisit page transitions first only as a restricted, entrance-only prototype
   because the decision document already defines the safest path.
3. Explore LCP-safe hero supporting motion before any 3D, shader, or video work.
4. Consider one decorative 3D or parallax prototype only after bundle/LCP issues
   are under control.
5. Leave cursor effects, scroll progress, shaders, Spline, and video until after
   real device QA proves the core site is stable.

## Explicit Non-Implementation Record

Sprint 7.2G does not implement:

- Page transitions.
- 3D, Spline, Three.js, WebGL, or shaders.
- Advanced motion or new reveal variants.
- Cursor effects.
- Decorative scroll effects.
- Lenis activation.
- Runtime code.
- Page, component, CMS, or design-token changes.
