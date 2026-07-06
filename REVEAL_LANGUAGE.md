# Reveal Language System

Milestone 6.3 defines the reusable reveal system for future section animation.
It introduced one live demonstration only: the homepage Services card list.

Milestone 6.4 applies the same system across completed public pages below page
heroes only.

## Reveal Variants

All variants are defined in `lib/animation/reveal.ts` and share the project
ScrollTrigger default of `start: "top 90%"`.

| Variant | Use For | Do Not Use For |
|---|---|---|
| `editorial` | Long-form section intros, story blocks, and measured editorial layouts. | Hero H1, LCP content, dense card grids. |
| `statement` | One strong non-LCP sentence, quote, or closing line. | Multi-item lists or repeated card layouts. |
| `cards` | Card grids and repeated service/project/industry items. | First viewport content or footer links. |
| `metrics` | Small stat groups below the fold. | Animated counters or hero proof stats until separately approved. |
| `stagger` | General ordered child sequences. | Large lists that exceed the animation budget. |
| `split` | Two-column editorial sections where both columns enter as one idea. | Narrow mobile-only compositions that would feel delayed. |
| `hero-secondary` | Future non-H1 hero supporting content only. | H1 visibility, initial hero opacity, or LCP media. |

## Variant Shape

Each reveal defines:

- `trigger`: ScrollTrigger entry behavior.
- `stagger`: child sequencing, capped by the motion budget.
- `duration`: tween duration.
- `easing`: GSAP easing token only.
- `distance`: transform distance in pixels.
- `reducedMotion`: final visible state with no animation.

## Utilities

- `revealVariants`: typed variant registry.
- `getRevealVariant()`: reads a named variant.
- `getRevealFromVars()`: creates direction-aware initial transform values.
- `getRevealToVars()`: creates final visible tween values.
- `Reveal`: reusable client wrapper for a single scroll-triggered reveal group.

Live reveal wrappers use `data-motion="reveal-group"` so they do not activate
the lower-level `data-motion="reveal"` clip-path primitive.

## Performance Limits

- Use one reveal group per viewport until broader performance testing is done.
- Keep reveal animation to transform and opacity.
- Do not animate layout properties such as margin, padding, width, height, grid
  placement, or top/left offsets.
- Keep stagger at or below `motionStaggers.loose`.
- Keep normal reveal duration at or below `motionDurations.slower`.
- Use GSAP only through the existing dynamic `withGsap()` helper.

## Accessibility

- Reduced-motion users receive final visible content with no reveal setup.
- Reveal must not communicate information that is unavailable without motion.
- Reveal must preserve DOM order, reading order, and focus order.
- ScrollTrigger starts must remain `top 90%` so keyboard navigation can reveal
  content as it enters the viewport.
- Do not animate focus outlines.

## LCP Safety

- Never reveal or hide the H1.
- Never animate initial hero content in a way that affects first paint.
- Never set initial `opacity: 0`, `visibility: hidden`, or hiding `clip-path`
  on likely LCP content.
- Do not use `hero-secondary` until a future sprint explicitly approves hero
  supporting-content animation.

## Rollout

Milestone 6.4 applies reveal to:

- Homepage sections after Hero, excluding Trust Bar for first-viewport safety.
- Services content below the page hero.
- Portfolio filters and listing below the page hero.
- About story, mission/vision, values, team, and CTA below the page hero.
- Contact and Quote content/form sections below the page hero.
- Industries, Pricing, and Blog content sections below the page hero.

Card/list groups use child targets marked with `data-reveal-item`. Form sections
reveal as one section-level block to avoid animating every input.
