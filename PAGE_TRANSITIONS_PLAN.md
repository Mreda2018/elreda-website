# Page Transitions Plan

Milestone 6.6 is planning only. No runtime page transition code is active from
this document.

## Suitability

Premium page transitions are suitable for elReda Advertising only with strict
limits. The site is a bilingual creative agency website, so a calm transition can
make navigation feel more deliberate and editorial. It must not behave like a
single-page app takeover, delay route changes, hide primary content from assistive
technology, or compete with page heroes.

Recommendation: use a restrained route-content transition later, not a theatrical
full-screen effect.

## Recommended Transition Language

The transition should feel:

- Calm.
- Editorial.
- Premium.
- Confident.
- Direction-aware.
- Fast enough that navigation still feels native.

Recommended values:

- Duration: 320ms to 420ms for content entrance, 160ms to 220ms for any outgoing
  supporting layer.
- Easing: use approved GSAP easing tokens from `gsapEasings`, preferably the
  project standard smooth ease. CSS references from `cssEasings` must not be
  passed into GSAP.
- Opacity: never start route content below `opacity: 0.01`; never apply
  `visibility: hidden` or `autoAlpha` to content that should remain in the
  accessibility tree.
- Transform: use `translateY` or logical inline-axis movement only, capped at
  24px. Avoid scale, rotate, blur, and perspective.
- Overlay: avoid default overlays. If a future sprint approves an overlay, it
  must be decorative, non-blocking, `aria-hidden="true"`, and must not cover the
  new page H1 while it is loading.
- Direction: Arabic routes may use a subtle right-to-left inline-axis gesture;
  English routes may use the mirrored left-to-right gesture. Vertical movement is
  safer and should be the default unless directionality is explicitly valuable.
- Reduced motion: no transition. Route changes should be immediate and native.

## Styles To Avoid

Avoid these transition styles:

- Full-page wipes that block reading or interaction.
- Long loader screens.
- Opacity-to-zero page shells.
- Blur-heavy transitions.
- 3D flips, rotations, elastic movement, overshoot, bounce, or playful effects.
- Scroll-jacking transitions.
- Page transitions tied to cursor movement.
- Transitions that animate Header, Footer, skip links, or persistent navigation.
- Transitions that wait for all route data before showing the new route.

## Arabic And English Routing

The site uses Arabic at root and English under `/en`.

Transition logic must treat these route groups as equivalent localized routes:

- Arabic: `/`, `/services`, `/portfolio`, `/about`, and other root paths.
- English: `/en`, `/en/services`, `/en/portfolio`, `/en/about`, and other
  `/en/*` paths.

Locale switching should not feel like a different product. The transition should
preserve the same duration and easing across locales, while direction-aware
movement may mirror by document direction. The implementation must not assume an
`/ar` prefix because Arabic remains at root.

## Next.js App Router Behavior

Next.js App Router streams Server Components and preserves layouts across route
changes. A future transition system should work with that model instead of
fighting it.

Recommended behavior:

- Keep `Header`, `Footer`, skip navigation, and locale shell outside transition
  animation.
- Animate only the page content boundary below the persistent layout.
- Detect route changes from `usePathname()` in a client component.
- Let App Router navigation happen normally. Do not block `Link` navigation while
  an exit animation runs.
- Prefer entrance-only transitions for the new page content. Outgoing transitions
  are risky with App Router because old page trees may unmount before animation
  cleanup.
- Avoid manually cloning previous pages or caching route trees.

## Proposed Architecture

Future files, if approved:

- `components/motion/PageTransition.tsx`
  - Client component.
  - Wraps only `children` for page content, not the whole document shell.
  - Uses `usePathname()` to detect route changes.
  - Uses `usePrefersReducedMotion()` for imperative GSAP setup.
  - Uses `withGsap()` for dynamic GSAP loading.
  - Uses approved motion tokens and page-transition-specific presets.

Suggested layout placement:

```tsx
<Header />
<main id="main-content">
  <PageTransition>{children}</PageTransition>
</main>
<Footer />
```

This keeps Header and Footer stable, avoids persistent navigation animation, and
preserves the skip link target.

Cleanup requirements:

- Store route animation state in refs, not global mutable state.
- Kill GSAP contexts/tweens on unmount and on route change before starting a new
  transition.
- Guard against duplicate animations when React Strict Mode mounts effects twice.
- Do not create ScrollTriggers for page transitions.
- Do not use `autoAlpha`, `visibility: hidden`, or `display: none` on readable
  page content.
- Do not trap focus during transitions.

Duplicate prevention:

- Track the last completed pathname.
- Ignore effect runs where the pathname has not changed.
- Kill any active transition before starting the next one.
- Keep a single transition root per page shell.

## LCP And H1 Protection

The transition system must never hide or delay the new route H1. App Router pages
should render their H1 visibly on first paint.

Rules:

- Do not animate H1 opacity from `0`.
- Do not wrap H1 in an element with initial `opacity: 0`, `visibility: hidden`,
  `clip-path` hiding, or `aria-hidden`.
- Do not delay page content until GSAP loads.
- Do not use page transitions on the initial page load.
- Do not animate likely LCP images or media during initial render.

If a future transition needs visual polish, animate a supporting page-content
shell after the H1 is already visible, or animate non-LCP secondary content only.

## Layout Shift Rules

Page transitions must not cause layout shift.

- Reserve normal document flow. Do not switch page content to `position: fixed`
  or `absolute` for default transitions.
- Avoid height locking unless a future sprint explicitly tests it across pages.
- Use transform and opacity only.
- Do not animate spacing, grid columns, widths, heights, or font metrics.
- Do not inject overlay elements that push content.

## Navigation Safety

Transitions must not block navigation.

- Links should remain normal Next.js links.
- Do not prevent default link behavior for animation timing.
- Do not intercept Back/Forward browser navigation.
- Do not intercept hash links, skip links, keyboard events, or focus movement.
- Do not disable pointer events on the whole document during transitions.
- If a decorative overlay is ever introduced, it must not capture focus or clicks.

## Reduced Motion

Reduced-motion users must receive native navigation with no page transition.

Use:

- `usePrefersReducedMotion()` for GSAP or imperative transition logic.
- `prefersReducedMotion()` for lower-level guards outside React effects.

Do not initialize page-transition GSAP work when reduced motion is active. If the
preference changes during a session, active transitions must be killed and future
route changes should be immediate.

## Lenis Interaction

Lenis is gated by `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=true` and must remain
optional.

Page transitions must not:

- Initialize Lenis.
- Destroy or reconfigure Lenis.
- Add a second RAF loop for scrolling.
- Add scroll-jacking behavior.
- Depend on Lenis being enabled.

If Lenis is enabled, a future transition may request a normal scroll restoration
after navigation, but only through native-safe behavior and only after testing
keyboard, anchor, and focus navigation. Reduced-motion users must keep native
scrolling.

## ScrollTrigger And Reveal Interaction

Reveal already owns section-level ScrollTrigger behavior below page heroes.

Page transitions must:

- Avoid creating ScrollTriggers.
- Avoid refreshing ScrollTrigger before new content has mounted.
- Call a safe refresh/update helper only if a future implementation proves it is
  necessary after route content settles.
- Never hide reveal targets with page-level wrappers that remove them from the
  accessibility tree.
- Let reduced-motion behavior disable both reveal setup and transitions.

The safest future order is:

1. App Router renders the new page.
2. H1 is visible immediately.
3. Page transition applies only to eligible non-critical wrapper or secondary
   content.
4. Existing reveal groups initialize below the hero according to their own rules.

## Mobile Behavior

Mobile should receive the simplest version.

- Prefer native-feeling entrance only.
- Keep transform distance at or below 16px on small screens.
- Avoid horizontal transitions if they can conflict with browser back gestures.
- Do not animate form pages in a way that delays input interaction.
- Do not enable transitions if they degrade iOS Safari or Android Chrome scroll
  performance.
- Test Arabic and English routes on real touch devices before enabling broadly.

## Risks And Blockers

Accessibility risks:

- Hiding content from screen readers with `visibility: hidden`, `display: none`,
  `autoAlpha`, or incorrect `aria-hidden`.
- Moving focus unexpectedly after navigation.
- Delaying skip-link or keyboard access to page content.
- Making route changes ambiguous for reduced-motion users.

Performance risks:

- Extra client JavaScript on every route.
- GSAP loading for navigation before it is needed.
- Duplicate animations under React Strict Mode.
- Main-thread contention when page transitions, reveal, and Lenis all run
  together.

Next.js App Router risks:

- Old page content may unmount before exit animation can complete.
- Streaming content can arrive after the transition begins.
- Nested layouts can preserve or remount different boundaries in ways that make
  route animation inconsistent.

SEO and LCP risks:

- Hidden H1 or delayed content can harm LCP and indexing.
- Full-screen overlays can become perceived LCP candidates.
- Initial-load transitions can delay meaningful paint.

Hydration risks:

- Pathname-dependent wrappers can mismatch if they assume browser-only state
  during server render.
- Transition roots must render stable markup before client effects run.

Scroll restoration risks:

- Lenis and browser restoration can disagree if transitions attempt manual scroll
  control.
- Hash links and Back/Forward navigation can break if route changes are
  intercepted.

## Go / No-Go Recommendation

Recommended with restrictions.

Do not implement full page transitions until the site has completed mobile QA,
reduced-motion QA, and LCP checks for the main public routes. The approved future
direction is an entrance-only, page-content-boundary transition that excludes
Header, Footer, Hero H1, initial page load, reduced-motion users, and any
scroll-jacking behavior.
