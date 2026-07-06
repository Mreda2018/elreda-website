# Motion Foundation

Milestone 5 creates architecture only. No page or section animation should run from this work.

Milestone 6.1 adds the reusable motion vocabulary in `MOTION_LANGUAGE.md` and `lib/animation/presets.ts`. It is still architecture only.

Milestone 6.3 adds the reveal vocabulary in `REVEAL_LANGUAGE.md` and `lib/animation/reveal.ts`, with one non-LCP Services section demonstration.

Milestone 6.4 rolls the approved reveal system across completed public pages below page heroes only.

Milestone 6.5 adds a controlled Lenis smooth scrolling foundation in `components/motion/SmoothScroll.tsx`.

## What Exists

- `lib/animation/tokens.ts` defines shared durations, GSAP easings, CSS easing references, stagger values, motion attributes, and ScrollTrigger defaults.
- `lib/animation/preferences.ts` provides SSR-safe reduced-motion helpers.
- `lib/animation/usePrefersReducedMotion.ts` exposes a client hook for future interactive animation components.
- `lib/animation/gsap.ts` lazy-loads GSAP and ScrollTrigger only in the browser, applies the required `start: "top 90%"` default, and skips setup when reduced motion is requested.
- `lib/animation/reveal.ts` defines typed reveal variants and direction-aware GSAP var helpers.
- `lib/animation/lenis.ts` dynamically loads Lenis only in the browser and only when reduced motion is not requested.
- `components/motion/SmoothScroll.tsx` centralizes Lenis setup, ScrollTrigger updates, RAF ownership, and cleanup.
- `app/globals.css` defines inert `data-motion` primitives for future opt-in animation setup.
- `lib/animation/presets.ts` defines reusable motion names and budgets without applying them to UI.

## Reduced Motion Rules

- Always check `prefersReducedMotion()` or `usePrefersReducedMotion()` before starting JavaScript animation.
- Use `usePrefersReducedMotion` for GSAP or any imperative animation setup.
- Use Motion's `useReducedMotion` only inside Motion/React animation components.
- When reduced motion is enabled, return content in its final visible state.
- Do not initialize Lenis, ScrollTrigger, parallax, staggered text, or scroll reveals for reduced-motion users.
- CSS fallbacks must keep content visible and remove transform, opacity, and clip-path hiding states.

## Easing Tokens

- Use `gsapEasings` only for GSAP timelines and tweens.
- Use `cssEasings` only for CSS variables, inline styles, or class-driven CSS transitions.
- Do not pass `cssEasings` values into GSAP. They contain `var(...)` references and are not GSAP easing names.

## LCP Safety Rules

- Never animate the hero H1 with GSAP.
- Never use `opacity: 0`, `visibility: hidden`, or initial `clip-path` hiding on H1 or likely LCP media.
- Hero H1 may use CSS-only reveal with an initial opacity no lower than `0.01`.
- Decorative hero background, subheadline, CTAs, and scroll indicators may animate later if they do not become LCP candidates.

## Future Usage Pattern

Future animation components should:

1. Add an explicit data attribute such as `data-motion="fade-up"`.
2. Set `data-motion-state="ready"` only after JavaScript has loaded, reduced motion has been checked, and the element is not LCP-critical.
3. Use `withGsap()` or `loadGsapWhenMotionAllowed()` from `lib/animation/gsap.ts`.
4. Use `scrollTriggerDefaults.start` or `SCROLL_TRIGGER_START`; do not use pixel-based scroll starts.
5. Clean up timelines and ScrollTriggers on unmount.

Recommended async `useEffect` cleanup pattern:

```tsx
useEffect(() => {
  let cleanup = () => {};

  withGsap((gsap) => {
    // Create timelines, ScrollTriggers, or contexts here.
    return () => {
      // Kill timelines, contexts, and ScrollTriggers here.
    };
  }).then((fn) => {
    cleanup = fn;
  });

  return () => cleanup();
}, []);
```

## Data Attribute Primitives

- `data-motion="fade-up"`: future translate-y and opacity reveal.
- `data-motion="reveal"`: future clip-path reveal for non-LCP media or decorative blocks.
- `data-motion="stagger-group"` with child `data-motion-item`: future stagger orchestration.
- `data-motion="parallax"`: placeholder only; no transform is applied yet.
- `data-motion="section-entrance"`: future section entrance pattern.

These primitives are inert until a future component sets `data-motion-state="ready"` and runs animation setup.

## Performance Budget

- GSAP must stay dynamically imported and page-scoped.
- Do not import GSAP, ScrollTrigger, Motion, or Lenis in Server Components.
- Prefer transform and opacity only.
- Avoid animating layout properties such as width, height, padding, margin, top, left, or grid placement.
- Keep scroll animations one-time by default.
- Do not add page-wide animation orchestration until bundle impact is measured.

## Smooth Scrolling Foundation

Lenis is available behind `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=true`.

Default behavior:

- Smooth scrolling is disabled unless the public flag is explicitly set to `"true"`.
- Native browser scrolling remains the default fallback.
- `SmoothScroll` is the only component allowed to initialize Lenis.
- Do not create page-level or section-level Lenis instances.

Reduced-motion behavior:

- If `prefers-reduced-motion: reduce` is active, Lenis does not initialize.
- If the preference changes while mounted, the provider cleans up the active Lenis instance.
- Reduced-motion users keep native scrolling and visible content.

ScrollTrigger compatibility:

- Lenis scroll events call `updateLoadedScrollTrigger()`.
- `updateLoadedScrollTrigger()` is a no-op until GSAP/ScrollTrigger has already been loaded by a reveal group.
- The smooth scroll provider must not import GSAP or ScrollTrigger directly.
- Do not add a GSAP ticker loop for Lenis; `SmoothScroll` owns one `requestAnimationFrame` loop and cancels it on unmount.

Accessibility rules:

- Keyboard scrolling, anchor navigation, skip links, tab navigation, and focus movement must remain native-safe.
- Do not intercept clicks, focus, keyboard events, or hash changes for scroll effects.
- Do not use smooth scrolling to hide or delay content.
- Do not activate Lenis on pages where it interferes with forms, keyboard navigation, or assistive technology QA.

Performance and mobile rules:

- Keep `syncTouch: false` so touch scrolling remains native.
- Do not add parallax, progress bars, cursor effects, page transitions, or scroll-jacking on top of Lenis.
- Use Lenis only as a scroll feel enhancement after QA on iOS Safari, Android Chrome, keyboard navigation, and reduced motion.
- Destroy Lenis and remove listeners on unmount to avoid memory leaks.

## Deferred Intentionally

- No page animation activation.
- No ScrollTrigger assignment to sections.
- No hero animation changes.
- No card hover animation changes.
- No parallax implementation.
- No Three.js or Spline.
