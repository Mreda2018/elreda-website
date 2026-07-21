# Final Staging QA Report

- Date: 2026-07-21
- Branch: `staging`
- Current deployed staging commit: `c961efb880f9a5c24f5447105a6968959c6147e6`
- App-fix commit verified: `cfdf9db0c259d3fc3586adbd277791eaa3c2f959`
- Staging deployment: `https://elreda-website-git-staging-mohamedreda2005-3712s-projects.vercel.app`

## Final Recommendation

**READY FOR MERGE**

The repository-side blockers identified in the previous QA pass are fixed and
deployed in commit `cfdf9db`. The live language-switcher click-through matrix now
passes. The Vercel automation bypass is configured, and `Playwright #11` completed
the protected Preview E2E suite with 10 passing tests. App code is QA-approved and
no merge blocker remains.

## Blocker Status

### 1. Mobile navigation

Status: **Fixed and deployed.**

- A menu button is now rendered below the desktop `lg` breakpoint.
- The menu opens a modal navigation panel containing the localized primary links,
  quote link, and language switch.
- `focus-trap-react` contains keyboard focus inside the open menu and returns focus
  to the trigger when the menu closes.
- The first navigation link receives initial focus. Escape, the close button, and
  the overlay close the menu.
- Activating any navigation, quote, or language link closes the menu.
- The trigger exposes `aria-expanded` and `aria-controls`; the panel exposes
  `role="dialog"` and `aria-modal="true"`.
- Menu controls and links retain the existing visible `focus-visible` treatment.

### 2. Language switching

Status: **Pass — fixed, deployed, and manually verified live.**

The earlier live user test showed the visible “العربية / English” text but no
navigation. This was a real observed staging failure caused by an outdated
deployment: the tested preview was still serving commit `676dc78`, whose desktop
and mobile language labels were static, noninteractive markup. Redeploying commit
`cfdf9db` replaced that stale output with the current interactive implementation
and resolved the issue.

The deployed implementation:

- The switcher is now an explicit `<button type="button">`; it no longer relies on
  `next/link` for interaction or navigation.
- The button is not disabled and explicitly uses `pointer-events-auto` and
  `cursor-pointer` while retaining the exact existing visual classes.
- Its click handler prevents default behavior, sets `NEXT_LOCALE` for one year with
  `path=/` and `samesite=lax`, calls `router.push` with the computed target, and
  then runs the optional mobile-menu close callback.
- The button has both the localized accessible label and matching `title`, remains
  keyboard operable with native Enter/Space behavior, and keeps the existing focus
  style.
- The target continues to come from the current pathname and shared
  `getLocalizedHref` helper.
- The same switcher is used on desktop and inside the mobile menu.
- Header and mobile-menu parent wrappers were inspected. No disabled state,
  `pointer-events-none`, overlay, motion layer, or z-index conflict blocks the
  current button, so those components were not changed.
- Arabic remains the default root locale and never generates `/ar`.
- English remains under `/en`.
- No `/ar` href was found in the rendered HTML of the 14 requested local routes.

Manual live-browser click-through matrix completed after redeploying `cfdf9db`:

| Start | Click | Expected stable destination | Live result |
|---|---|---|---|
| `/en` | Arabic | `/` | Pass; landed on `/` and remained there |
| `/en/services` | Arabic | `/services` | Pass; landed on `/services` and remained there |
| `/` | English | `/en` | Pass; landed on `/en` and remained there |
| `/services` | English | `/en/services` | Pass; landed on `/en/services` and remained there |

The user also confirmed that the old combined static label is gone, the switcher is
clickable on the redeployed staging site, and no `/ar` route was generated.

### 3. Shared closing CTAs

Status: **Fixed and deployed.**

The shared closing actions are now links using the existing button styles. They no
longer render with `aria-disabled="true"`, `tabIndex={-1}`, reduced opacity, or
missing destinations.

| Context | Primary destination | Secondary destination |
|---|---|---|
| Home | Quote | CMS Settings WhatsApp number; Contact fallback |
| Services, Portfolio, About, Blog, Industries, Pricing | Quote | Contact |
| Contact | Quote | Services |
| Quote | Contact | Services |

Arabic destinations use root routes. English destinations use the equivalent `/en`
routes. External WhatsApp URLs are not locale-prefixed.

### 4. GitHub Actions clean-install failure

Status: **Fixed, deployed, and confirmed by the latest CI install step.**

The lockfile was regenerated with npm 10.9.2, matching the npm major used by the
Node 22 GitHub Actions job. The regenerated lock includes the missing nested
`@swc/helpers@0.5.23` record and the new mobile-menu focus-trap dependencies.

The updated tree passes the same npm 10 clean-install validation that failed for
the previous deployed commit. In the latest preview E2E job for `cfdf9db`, both
`Install dependencies` and `Install Playwright browser` passed before the runner
reached the browser tests.

## Pages Checked

The route shells and shared header/CTA output were probed from a local Next.js
production server after the fixes. The manual live retest covered the four
language-switch paths below. The final Preview E2E run also accessed the protected
deployment successfully and passed all 10 configured browser tests.

| Page | Local production result | Deployed staging result |
|---|---|---|
| `/` | Arabic shell and fixed header rendered; CMS sections unavailable locally | Manual language-switch pass; automated foundation pass |
| `/services` | Arabic route, fixed header, Quote/Contact CTA links | Manual language-switch pass; automation access confirmed |
| `/portfolio` | Arabic route, fixed header, Quote/Contact CTA links | Automation access confirmed; no dedicated final assertion |
| `/about` | Arabic route, fixed header, Quote/Contact CTA links | Automation access confirmed; no dedicated final assertion |
| `/blog` | Arabic route, fixed header, Quote/Contact CTA links | Automation access confirmed; no dedicated final assertion |
| `/contact` | Arabic route, fixed header, Quote/Services CTA links and form shell | Automation access confirmed; no dedicated final assertion |
| `/quote` | Arabic route, fixed header, Contact/Services CTA links and form shell | Automation access confirmed; no dedicated final assertion |
| `/en` | English shell and fixed header rendered; CMS sections unavailable locally | Manual language-switch and automated foundation pass |
| `/en/services` | English route, fixed header, `/en/quote` and `/en/contact` CTA links | Manual language-switch pass; automation access confirmed |
| `/en/portfolio` | English route, fixed header, `/en/quote` and `/en/contact` CTA links | Automated disabled-control assertion passes |
| `/en/about` | English route, fixed header, `/en/quote` and `/en/contact` CTA links | Automated navigation and breadcrumb assertions pass |
| `/en/blog` | English route, fixed header, `/en/quote` and `/en/contact` CTA links | Automation access confirmed; no dedicated final assertion |
| `/en/contact` | English route, fixed header, `/en/quote` and `/en/services` CTA links and form shell | Automated form accessibility assertions pass |
| `/en/quote` | English route, fixed header, `/en/contact` and `/en/services` CTA links and form shell | Automated form accessibility assertions pass |

Local CMS rendering was not used as CMS sign-off because this workspace does not
have `NEXT_PUBLIC_SANITY_PROJECT_ID`. The loaders fail safely, but the Home CMS
sections consequently do not render locally. This is a local QA-environment
limitation, not evidence that the configured Vercel preview is missing its Sanity
environment variables.

## Arabic and English Routing Status

Status: **Pass for implementation and deployed language switching.**

- `next-intl` remains configured with Arabic as `defaultLocale: "ar"` and
  `localePrefix: "as-needed"`.
- Header navigation and quote links are generated centrally for the active locale.
- The language switch removes an existing locale prefix before adding the target
  locale, so it preserves the equivalent path without producing `/ar`.
- The same localized navigation data is used by desktop and mobile navigation.
- Local rendered output for all requested routes contains the expected document
  language and no `/ar` links.
- Live click-through verification confirms that Arabic remains on root routes and
  English remains under `/en` for the root and Services paths.

## CMS Rendering Status

Status: **No CMS regressions identified; not part of the final E2E assertions.**

No CMS schemas, queries, mappers, portfolio/blog cards, testimonial rendering, or
About Team wiring were changed. The following remain manual CMS QA coverage notes:

- Home hero and Settings content in Arabic and English.
- Services from Sanity.
- Portfolio cards without images or missing-detail links.
- Testimonials without photos.
- Blog cards without featured images or missing-detail links.
- Contact and Quote form visibility with the preview environment variables.

## Accessibility Notes

Status: **Automated Preview accessibility suite passes.**

- Mobile navigation uses the project-mandated focus-trap behavior.
- Menu trigger, close control, navigation links, CTA links, and language switch are
  native buttons or anchors with visible focus styles.
- Menu state and dialog relationships use valid ARIA attributes.
- Link activation closes the mobile menu; Escape and overlay dismissal are wired.
- No heading structures or form ARIA relationships were changed.
- Reduced-motion CSS and motion components were not changed.
- The final protected Preview run passed all configured accessibility and foundation
  tests; prior manual QA notes remain unchanged.

## INP Investigations — Sanity Studio

Status: **Admin-only; non-blocking for the public website.**

### Hidden upload input — 244.4 ms

- The reported `input#-_r_14_` matches Sanity Studio's bundled
  `FileInputButton`. That component renders a hidden `input[type="file"]` with
  `data-testid="file-button-input"` and constructs its ID as
  `` `${idProp || ""}-${useId()}` ``. With React's generated `_r_14_` value,
  the resulting ID is exactly `-_r_14_`.
- This control belongs to Sanity Studio image/file authoring under `/studio`,
  including image upload fields such as the Settings logo and Home hero image.
- Public Contact and Quote controls use explicit IDs such as `contact-name` and
  `quote-email`. They are uncontrolled inputs with no `onInput` or `onChange`
  validation path; submission validation runs through Server Actions.
- Public search, mobile navigation, and language switching do not render this
  generated-ID input.
- The reported 244.4 ms handler therefore measures an admin authoring interaction
  in third-party Studio UI and does not affect public-site INP. No application code
  was changed.

### Text-overflow span — 241.2 ms

- The reported
  `span.SpanWithTextOverflow-sc-ol2i3b-0.bwSltN` is owned by
  `@sanity/ui@3.2.0`. Its internal `SpanWithTextOverflow` component is a
  styled `<span>` used by the Sanity UI `Text`, `Label`, and `Heading` primitives
  when `textOverflow="ellipsis"` is enabled.
- `sc-ol2i3b-0` is the fixed styled-components ID emitted for that Sanity UI
  component, while `bwSltN` is its generated runtime style hash. Neither class is
  declared or rendered by a public application component.
- Sanity UI enters this application through `NextStudio` on the `/studio` route.
  The public component tree does not import `@sanity/ui` or styled-components.
- The span can be the event target for a handler attached to a surrounding Studio
  control, but it is an admin authoring element rather than a public-site control.
  The reported 241.2 ms interaction is therefore non-blocking for public-site INP,
  and no application code was changed.

## Visual QA Notes

Status: **No blocking visual regressions identified.**

- The mobile panel reuses the existing black surfaces, glass borders, spacing,
  typography, red focus outline, and button variants; no redesign was introduced.
- The language link and menu trigger reuse the existing header control styling.
- The user confirmed that the deployed switcher is clickable and the obsolete
  combined static language text is no longer present.
- Shared CTAs retain their existing layout and visual variants; only their disabled
  semantics and destinations changed.
- No images, gray placeholders, portfolio/blog detail interactions, Team content,
  or section layouts were added.
- Preview protection no longer blocks browser automation. The final E2E rerun did
  not introduce a new visual-regression suite.

## Vercel Preview E2E Root Cause

The failed `Vercel Preview E2E` job for commit `676dc78` did **not** reach the
preview site:

- GitHub Actions run: `29727287972`
- Job: `88303188530`
- `Checkout`: passed
- `Setup Node`: passed
- `Install dependencies`: failed
- `Install Playwright browser`: skipped
- `Run Playwright against preview`: skipped

The available annotation only reports exit code 1. Full job-log download returned
HTTP 403 because the local GitHub CLI authentication is invalid. The failure was
therefore reproduced from an isolated archive of the exact commit with npm 10.9.2:

```text
npm error `npm ci` can only install packages when your package.json and
package-lock.json are in sync.
npm error Missing: @swc/helpers@0.5.23 from lock file
```

After regenerating the lockfile, the same npm 10.9.2 `npm ci --dry-run` check exits
0. This confirms that the specific red job was a lockfile/clean-install failure,
not a wrong preview URL, locale route bug, missing Vercel app environment variable,
or Playwright assertion failure.

### Resolution: Vercel Automation Bypass Verified

Commit `c961efb` conditionally adds the Vercel protection headers in Playwright and
passes the GitHub Actions secret only to the Preview E2E step. No secret value is
present in source, workflow YAML, logs, or this report.

The resulting `deployment_status` run completed successfully:

- Workflow: `Playwright #11`
- GitHub Actions run: `29811544344`
- Job: `88573388434`
- `Checkout`: passed
- `Setup Node`: passed
- `Install dependencies`: passed
- `Install Playwright browser`: passed
- `Run Playwright against preview`: passed
- Playwright summary: **10 passed in 11.4 seconds**

This confirms that external browser automation can reach and test the protected
Preview deployment. Deployment Protection remains enabled; unauthenticated requests
without the bypass are still expected to redirect to Vercel SSO.

GitHub Actions also emitted a Node.js 20 deprecation warning for
`actions/checkout@v4` and `actions/setup-node@v4`, which GitHub currently forces to
run on Node.js 24. The warning did not affect the successful job and is
non-blocking.

## Commands and Checks Run

| Check | Result |
|---|---|
| `npm run lint` | Pass; exit code 0 |
| `npm run typecheck` | Pass; exit code 0 |
| `npm run build` | Pass; Next.js 16.2.9 generated 32 static pages |
| Playwright configuration load without the bypass variable | Pass; existing local behavior preserved |
| Playwright configuration load with a non-secret test placeholder | Pass; conditional bypass configuration enabled |
| `npx --yes npm@10.9.2 ci --ignore-scripts --dry-run --prefer-offline` against `676dc78` | Fail reproduced: missing `@swc/helpers@0.5.23` |
| Same npm 10.9.2 clean-install validation against the fixed tree | Pass; exit code 0 |
| Local production HTTP probes for all 14 requested routes | Route/header/CTA shell checks pass; CMS unavailable locally |
| Live manual language-switch matrix on the branch preview | Pass for all four required transitions; no `/ar` route generated |
| `git ls-remote origin refs/heads/staging` | Pass; remote `staging` points to `c961efb` |
| `Playwright #11` — Vercel Preview E2E | Pass; 10 tests passed in 11.4 seconds |
| `curl -I` without the bypass header | HTTP 302 to Vercel SSO as expected for protected Preview access |
| `git diff --check` | Pass; no whitespace errors |

## Known Approved Minor Notes

1. Portfolio and Blog cards remain intentionally non-clickable placeholders because
   detail routes are not implemented yet.
2. About Team remains interim “coming soon” copy and does not consume Team Member
   CMS data yet.
3. Remaining `getLocalizedHref` duplication may be consolidated later.
4. GitHub Actions reports a Node.js 20 deprecation warning for
   `actions/checkout@v4` and `actions/setup-node@v4`. The successful runner uses
   Node.js 24 for those actions, so this is non-blocking cleanup.

These notes remain approved and are not blockers.

## Remaining Blockers Before Merge

None. The app-code fixes are committed, deployed, manually verified, and
QA-approved. Protected Preview E2E automation passes all 10 configured tests.

The staging branch is **READY FOR MERGE**.
