# Page Transitions Decision

Milestone 6.7 records the final implementation decision for premium page
transitions. It does not add runtime transition code.

## Final Recommendation

Defer implementation.

Page transitions are not rejected. They can support the brand if they remain
quiet, fast, and editorial. They should not be implemented now because the current
site still needs visual QA across mobile devices, reduced-motion settings, Lenis,
Reveal, and Core Web Vitals before another global motion layer is added.

## Reasoning

### Accessibility

The site already has strong accessibility requirements around visible content,
skip navigation, focus order, and reduced motion. Page transitions add risk by
potentially delaying focus, hiding routed content, or creating ambiguous route
changes for screen reader and keyboard users.

Implementation should wait until the transition can be tested with:

- Keyboard navigation.
- Skip link behavior.
- Browser Back and Forward navigation.
- Arabic and English screen reader flows.
- `prefers-reduced-motion: reduce`.

### LCP And SEO

The project has a hard rule: never hide or delay the H1 or likely LCP content.
Page transitions can easily harm LCP if they fade in the whole routed page,
display an overlay, or wait for client animation code before content feels ready.

Implementation should be deferred until route-level LCP can be measured after the
transition is added. The H1 must remain visible on first paint.

### Next.js App Router Risk

Next.js App Router streams Server Components and preserves nested layouts. Exit
animations are fragile because the previous page can unmount before cleanup runs.
Trying to cache old routes or block navigation would increase complexity and
could fight the framework.

The safe future direction is entrance-only content enhancement after App Router
has rendered the new route.

### Arabic Root Routes And English `/en` Routes

Arabic remains at root. English uses `/en`. Transition logic must not assume an
`/ar` route prefix. Direction-aware motion can mirror by `dir`, but navigation
between Arabic root routes and English `/en` routes must feel consistent and must
not introduce special-case routing behavior.

### Mobile Behavior

Mobile is the highest-risk environment for page transitions because of touch
scrolling, browser back gestures, lower CPU budgets, and longer form pages.
Horizontal gestures can conflict with native navigation. Contact and Quote pages
also need immediate input access.

Mobile transition behavior should be reduced to the simplest entrance-only
version, or disabled if QA shows degraded responsiveness.

### Lenis Compatibility

Lenis is currently gated by `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=true` and disabled
for reduced-motion users. Page transitions must not depend on Lenis, initialize
Lenis, destroy Lenis, or add a second scroll RAF loop.

Deferring keeps the smooth scrolling foundation isolated until it has completed
device QA.

### Reveal And ScrollTrigger Compatibility

Reveal already applies ScrollTrigger below page heroes. Page transitions should
not create ScrollTriggers or hide reveal targets from the accessibility tree.
Running route transitions and section reveals together can increase main-thread
work and create duplicate animation states.

Future implementation must let App Router render first, keep the H1 visible, and
allow existing reveal groups to initialize according to their own rules.

### Maintenance Complexity

A global page transition wrapper affects every public route. It would require
strict cleanup, duplicate-animation guards, reduced-motion branching, App Router
route detection, Lenis coordination, and QA across two locale route systems.

The brand value does not justify taking that complexity before visual QA and LCP
baselines are captured.

### Brand Value

The creative value is real. A restrained page-content transition could make the
site feel more premium and intentional. But the brand would be harmed more by a
slow, inaccessible, or inconsistent transition than helped by a decorative route
effect.

## Allowed Future Scope

If implementation is approved later, the allowed scope is:

- Public marketing routes only after QA: home, services, portfolio, about,
  industries, pricing, and blog.
- Contact and Quote only if form focus and input readiness remain immediate.
- No transition on initial page load.
- No transition for reduced-motion users.
- No transition for hash-only navigation.
- No transition for skip links.

Routes that must not use transitions:

- API routes.
- Upload or submission flows.
- Any future authenticated portal.
- Any future route with complex focus management, modal state, or multi-step form
  behavior until separately approved.

Excluded elements:

- Header.
- Footer.
- Skip navigation.
- Hero H1.
- Initial hero content that may affect LCP.
- Focus outlines.

Transition type:

- Content-only.
- Entrance-only by default.
- No default overlay.
- No hybrid overlay/content transition unless a later sprint approves and tests a
  decorative `aria-hidden` overlay.

Maximum duration:

- 420ms for content entrance.
- 220ms maximum for any approved outgoing supporting layer.
- Mobile should target the low end of the range or disable the transition.

Reduced-motion fallback:

- Immediate native navigation.
- No GSAP transition setup.
- No delayed content.
- No Lenis dependency.

Scroll restoration:

- Preserve native browser behavior by default.
- Do not intercept Back, Forward, hash links, skip links, or focus movement.
- Do not use transitions to force scroll position.
- If scroll adjustment is ever needed, it must be explicitly tested with Lenis
  enabled and disabled.

Cleanup requirements:

- Kill active GSAP tweens on unmount and route change.
- Guard React Strict Mode duplicate effect runs.
- Track the last pathname to avoid repeated animation for the same route.
- Keep a single transition root.
- Remove any decorative overlay immediately after completion.
- Do not leave persistent `pointer-events: none`, transforms, or opacity styles
  on routed content.

## Implementation Constraints

Any future implementation must follow these constraints:

- No H1 hiding.
- No initial Hero hiding.
- No `visibility: hidden` on routed content.
- No `autoAlpha` on routed content.
- No `display: none` on readable content.
- No blocking navigation.
- No scroll-jacking.
- No transition on first load.
- No transition for reduced-motion users.
- No transition on form submission routes if focus, validation, or input
  readiness becomes risky.
- No duplicate GSAP timelines.
- No persistent overlays after navigation.
- No Header, Footer, skip navigation, or focus outline animation.
- No page transition ScrollTriggers.
- No extra Lenis RAF loop.
- No route caching or previous-page cloning without a separate architecture
  review.

## Decision Outcome

Decision:
Recommended to implement later after visual QA.
