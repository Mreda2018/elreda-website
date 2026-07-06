# Motion Language System

Milestone 6.1 defines vocabulary only. It does not animate pages, sections, components, or real UI.

## Motion Personality

The elReda motion language is:

- Calm.
- Editorial.
- Premium.
- Confident.
- Precise.
- Useful.

It is never playful, bouncy, elastic, chaotic, or decorative for its own sake. Motion should feel like a high-end editorial system revealing intent, not a product demo trying to entertain.

## Naming System

Use dot-path names that describe the component and state:

- `motion.card.hover`
- `motion.card.enter`
- `motion.button.hover`
- `motion.button.press`
- `motion.button.focus`
- `motion.section.reveal`
- `motion.nav.active`
- `motion.nav.enter`
- `motion.hero.content`

Code exports these as `motionPresets` from `lib/animation/presets.ts`. Use the exported object as the single source of truth:

```ts
import { motionPresets } from "@/lib/animation";

const preset = motionPresets.card.hover;
```

`motionPresets.navigation` is available as a descriptive alias for `motionPresets.nav`, but documentation and future specs should prefer the shorter `motion.nav.*` naming.

## Preset Shape

Every preset defines:

- `duration`
- `easing`
- `delay`
- `stagger`
- `transformOrigin` when relevant

Easing values in presets are GSAP easing names only. CSS easing references remain separate in `cssEasings`.

## Preset Inventory

### Base Interaction

- `motion.hover`: default non-component-specific hover response.
- `motion.press`: default press/tap response.
- `motion.focus`: reserved for focus-adjacent supporting elements, never the focus outline itself.
- `motion.reveal`: default non-LCP reveal language.
- `motion.stagger`: default group sequencing language.

### Sections

- `motion.section.reveal`: large section reveal vocabulary for future non-LCP content.
- `motion.section.enter`: quieter section entrance for supporting blocks.

### Cards

- `motion.card.hover`: subtle lift/glow language.
- `motion.card.press`: quick tactile response.
- `motion.card.enter`: card grid/list entry language.

### Buttons

- `motion.button.hover`: primary button hover language.
- `motion.button.press`: fast press feedback.
- `motion.button.focus`: supporting focus-adjacent motion only.

### Navigation

- `motion.nav.hover`: nav link hover response.
- `motion.nav.active`: active route indicator language.
- `motion.nav.enter`: menu or navigation item entry language.

### Hero

- `motion.hero.content`: non-H1 supporting hero content only. Never use this for H1 visibility.

## Animation Budget

Hard limits for future implementation:

- Maximum simultaneous animations: 6 active tweens/timelines in a viewport.
- Maximum stagger: 120ms.
- Maximum duration: 800ms for normal UI and section motion.
- Maximum blur: 16px, decorative only, never on readable text.
- Maximum transform distance: 48px.
- Minimum opacity for any initially rendered candidate content: 0.01.
- Avoid layout animation. Use transform and opacity only unless a later task explicitly approves an exception.

For interaction feedback:

- Hover and press should stay at or below 200ms.
- Press should feel immediate.
- Navigation active states should be calm and legible, not attention-seeking.

## Accessibility Rules

Never animate:

- H1 visibility.
- Initial hero opacity.
- Focus outline.
- Reduced-motion users.

Additional rules:

- Reduced-motion users must receive final visible states with no parallax, scroll reveal, staggered text, or Lenis.
- Use `usePrefersReducedMotion` for GSAP or imperative animation setup.
- Use Motion's `useReducedMotion` only inside Motion/React animation components.
- Do not use motion to communicate information that is unavailable without motion.
- Preserve focus order and reading order.

## Performance Rules

- GSAP stays dynamically imported.
- No ScrollTrigger usage until a future animation implementation sprint.
- No timelines in this sprint.
- No CSS keyframes in this sprint.
- No Three.js, Spline, or video.
- Do not animate page layout, grid placement, spacing, or text reflow.
- Future animation implementation must measure bundle impact before broad rollout.

## Deferred

- Page animation wiring.
- Component hover animation wiring.
- ScrollTrigger timelines.
- Hero animation changes.
- Lenis activation.
- 3D or shader work.

## Milestone 6.2 Micro-Interactions

Shared CSS classes implement the first approved micro-interactions:

- `.micro-button` maps to `motion.button.hover` and `motion.button.press`.
- `.micro-card` maps to `motion.card.hover` only for interactive card surfaces: links, buttons, link/button roles, or cards marked with `data-interactive="true"`.
- `.micro-nav-link` maps to `motion.nav.hover` and `motion.nav.active`.
- `.micro-link` maps to the base `motion.hover` link language.
- `.micro-pill` maps to footer/social pill hover language.

These interactions use CSS transitions only, avoid layout-changing properties, and are disabled under `prefers-reduced-motion: reduce`.

## Milestone 6.3 Reveal Language

Reusable reveal variants are documented in `REVEAL_LANGUAGE.md` and exported from `lib/animation/reveal.ts`.

The approved variants are:

- `editorial`
- `statement`
- `cards`
- `metrics`
- `stagger`
- `split`
- `hero-secondary`

Milestone 6.4 rolls these variants across completed public pages below page heroes only. No Hero, H1, first-viewport Trust Bar, Footer, or navigation reveal is active.
