# Motion Foundation

Milestone 5 creates architecture only. No page or section animation should run from this work.

Milestone 6.1 adds the reusable motion vocabulary in `MOTION_LANGUAGE.md` and `lib/animation/presets.ts`. It is still architecture only.

Milestone 6.3 adds the reveal vocabulary in `REVEAL_LANGUAGE.md` and `lib/animation/reveal.ts`, with one non-LCP Services section demonstration.

## What Exists

- `lib/animation/tokens.ts` defines shared durations, GSAP easings, CSS easing references, stagger values, motion attributes, and ScrollTrigger defaults.
- `lib/animation/preferences.ts` provides SSR-safe reduced-motion helpers.
- `lib/animation/usePrefersReducedMotion.ts` exposes a client hook for future interactive animation components.
- `lib/animation/gsap.ts` lazy-loads GSAP and ScrollTrigger only in the browser, applies the required `start: "top 90%"` default, and skips setup when reduced motion is requested.
- `lib/animation/reveal.ts` defines typed reveal variants and direction-aware GSAP var helpers.
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

## Deferred Intentionally

- No page animation activation.
- No ScrollTrigger assignment to sections.
- No hero animation changes.
- No card hover animation changes.
- No parallax implementation.
- No Three.js or Spline.
