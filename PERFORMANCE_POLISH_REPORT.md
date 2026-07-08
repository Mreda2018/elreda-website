# Sprint 7.2F Performance Polish Report

**Date:** July 8, 2026  
**Scope:** Sprint 7.2F only: performance risk review after reveal rollout and before advanced visuals.

## Summary

- GSAP and ScrollTrigger remain dynamically imported through `lib/animation/gsap.ts`.
- Lenis remains disabled by default through `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=false`.
- The root layout now skips the `SmoothScroll` client boundary entirely unless the approved env flag is enabled.
- Motion client components now import direct animation modules instead of the animation barrel to reduce accidental client graph growth.
- No Hero, H1, Header, Footer, route behavior, CMS content, visual design, or animation behavior was changed.

## Bundle Boundary Findings

Command:

```bash
npm run build
```

Follow-up diagnostic:

```bash
node -e "/* read .next/diagnostics/route-bundle-stats.json and gzip first-load chunks */"
```

Local Next diagnostics after the build:

| Route | First-load JS, uncompressed | First-load JS, gzip | First-load chunks |
|---|---:|---:|---:|
| `/[locale]` | 844,678 B | 252,420 B | 13 |
| `/[locale]/about` | 844,678 B | 252,420 B | 13 |
| `/[locale]/blog` | 844,678 B | 252,420 B | 13 |
| `/[locale]/industries` | 844,678 B | 252,420 B | 13 |
| `/[locale]/portfolio` | 844,678 B | 252,420 B | 13 |
| `/[locale]/pricing` | 844,678 B | 252,420 B | 13 |
| `/[locale]/services` | 844,678 B | 252,420 B | 13 |
| `/[locale]/contact` | 859,912 B | 256,201 B | 13 |
| `/[locale]/quote` | 859,912 B | 256,201 B | 13 |

Risk:

- The current local gzip first-load JS baseline is above the original 150 KB budget. This is a launch risk to track before advanced visuals.
- Contact and Quote carry a slightly larger first-load baseline because of form client logic.
- The measurement is from local Next build diagnostics, not a production CDN/RUM value.

Boundary verification:

- `gsap` and `ScrollTrigger` were found only in a separate generated static chunk that is not listed in first-load route chunks.
- `lenis` was not found in the default first-load static chunk scan.
- Direct imports now avoid pulling the full `lib/animation` barrel into motion client components.

## Local Mobile Web Vitals Lab Baseline

Environment:

- Built app served with `npm start`.
- Playwright Chromium, 390 x 844 viewport.
- Localhost, warm machine, no network throttling.
- Sanity env vars were not configured, so CMS-backed areas used existing fallback behavior.
- These are lab smoke readings, not field Core Web Vitals.

| Route | LCP ms | CLS | DOMContentLoaded ms | Load ms | Transfer size |
|---|---:|---:|---:|---:|---:|
| `/` | 580 | 0 | 579 | 669 | 22,909 B |
| `/en` | 76 | 0 | 89 | 89 | 20,528 B |
| `/services` | 72 | 0 | 78 | 78 | 24,097 B |
| `/en/services` | 52 | 0 | 60 | 60 | 24,097 B |
| `/portfolio` | 76 | 0 | 75 | 75 | 26,761 B |
| `/en/portfolio` | 60 | 0 | 63 | 63 | 26,761 B |
| `/about` | 88 | 0 | 76 | 76 | 31,135 B |
| `/en/about` | 76 | 0 | 69 | 69 | 31,135 B |
| `/contact` | 84 | 0 | 77 | 77 | 28,435 B |
| `/en/contact` | 64 | 0 | 66 | 66 | 28,435 B |
| `/industries` | 112 | 0 | 103 | 103 | 33,835 B |
| `/en/industries` | 68 | 0 | 62 | 62 | 33,835 B |
| `/pricing` | 84 | 0 | 50 | 54 | 31,471 B |
| `/en/pricing` | 80 | 0 | 71 | 71 | 31,471 B |
| `/blog` | 80 | 0 | 52 | 55 | 26,944 B |
| `/en/blog` | 68 | 0 | 60 | 60 | 26,944 B |

Interpretation:

- Lab LCP and CLS are currently safe in this local environment.
- The homepage Arabic route is slower than other routes locally because it performs the most fallback CMS loader work.
- Real launch validation still needs throttled Lighthouse/WebPageTest or field data after production env vars and CMS content are configured.

## Reveal Runtime Review

Reveal groups by source page:

| Page file | Reveal groups | `data-reveal-item` references |
|---|---:|---:|
| `app/[locale]/page.tsx` | 5 | 4 |
| `app/[locale]/services/page.tsx` | 2 | 2 |
| `app/[locale]/portfolio/page.tsx` | 3 | 3 |
| `app/[locale]/about/page.tsx` | 5 | 6 |
| `app/[locale]/contact/page.tsx` | 3 | 3 |
| `app/[locale]/quote/page.tsx` | 2 | 0 |
| `app/[locale]/industries/page.tsx` | 3 | 2 |
| `app/[locale]/pricing/page.tsx` | 3 | 4 |
| `app/[locale]/blog/page.tsx` | 3 | 2 |

Current guardrails:

- Each reveal group caps item animation targets with `animationBudget.maxSimultaneousAnimations`.
- Reveal does not wrap Hero H1 or initial Hero content.
- Reveal uses `opacity: 0.01`, not `visibility: hidden`, so content remains available to assistive technology.
- ScrollTrigger defaults remain `start: "top 90%"`.

Risk:

- The homepage and About page have the highest reveal group counts.
- Do not add more reveal groups until production Lighthouse or WebPageTest confirms main-thread cost is acceptable on low-end mobile.

## Portfolio And Blog Image Performance Plan

Before adding real Portfolio or Blog imagery:

- Use the existing `SanityImage` / Next Image foundation; do not use raw `<img>`.
- Require `alt`, intrinsic dimensions, and stable aspect ratio from CMS mapping.
- Use `sizes` tuned to card/grid breakpoints, not `100vw` everywhere.
- Only use `priority` for a true LCP image. Portfolio and Blog listing thumbnails below the hero should stay lazy-loaded.
- Keep placeholder treatment static and lightweight. Avoid animated blur, shader masks, or video thumbnails in listing cards.
- Use conservative image quality defaults and Sanity transforms for width-limited card assets.
- Preserve touch behavior with persistent overlays if hover overlays are introduced later.
- Reserve layout space before images load to avoid CLS.

## Deferred

- No Lenis activation.
- No new reveal rollout.
- No page transitions.
- No advanced visual effects.
- No Three.js, Spline, shaders, cursor effects, parallax, or video.
- No CMS schema or content changes.

## Next Performance Priorities

1. Run production Lighthouse or WebPageTest with real env vars and CMS content.
2. Investigate why shared first-load JS is above the 150 KB gzip budget.
3. Re-check Contact and Quote after server action dependencies are finalized.
4. Validate reveal runtime on a lower-end Android device before adding more motion.
5. Re-measure after Portfolio and Blog images are implemented.
