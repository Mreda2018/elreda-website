# Final Staging QA Report

- Date: 2026-07-20
- Branch: `staging`
- Deployed commit investigated: `676dc78b596374c6702cdff573cc7f8b0b693d75`
- Staging deployment: `https://elreda-website-git-staging-mohamedreda2005-3712s-projects.vercel.app`

## Final Recommendation

**NOT READY FOR MERGE**

The four repository-side blockers identified in the previous QA pass are fixed in
the current working tree. However, these fixes have not been committed or deployed,
the protected preview still redirects automation to Vercel SSO, and the failed
preview E2E job has not yet been rerun successfully. Merge readiness requires a new
preview deployment, an automation access path, a green E2E rerun, and a final
browser interaction pass on that deployment.

## Blockers Fixed in the Working Tree

### 1. Mobile navigation

Status: **Fixed locally; deployment verification pending.**

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

Status: **Explicit button fix applied locally; deployment and user retest pending.**

The user retested the protected Vercel branch preview in an Incognito browser after
the prior local fix. The visible “العربية / English” text could be selected, but
clicking it did not navigate.

Root cause found: the live preview is still built from remote `staging` commit
`676dc78b596374c6702cdff573cc7f8b0b693d75`. That commit renders the combined
language text as a static, noninteractive `<div>` on desktop and `<span>` on mobile;
it does not contain `LanguageSwitcher.tsx`, the mobile menu, or any of the current
working-tree fixes. The exact combined label in the user screenshot matches that
old placeholder. The previous Link-prefetch diagnosis therefore did not describe
this specific live failure: the tested deployment never ran the Link implementation.

The current implementation was additionally hardened as requested:

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

Required real-browser click-through matrix:

| Start | Click | Expected stable destination | Result in this session |
|---|---|---|---|
| `/en` | Arabic | `/` | Pending after commit, push, and redeployment |
| `/en/services` | Arabic | `/services` | Pending after commit, push, and redeployment |
| `/` | English | `/en` | Pending after commit, push, and redeployment |
| `/services` | English | `/en/services` | Pending after commit, push, and redeployment |

The browser-control connection available to this QA session still reports no
attached browser. More importantly, the existing live URL cannot exercise this
button until the current working tree is committed, pushed to `staging`, and a new
preview deployment completes. No click-through pass is claimed until the user
confirms that deployed version in the live browser.

### 3. Shared closing CTAs

Status: **Fixed locally; deployment verification pending.**

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

Status: **Fixed locally; CI rerun pending.**

The lockfile was regenerated with npm 10.9.2, matching the npm major used by the
Node 22 GitHub Actions job. The regenerated lock includes the missing nested
`@swc/helpers@0.5.23` record and the new mobile-menu focus-trap dependencies.

The updated tree passes the same npm 10 clean-install validation that failed for
the deployed commit.

## Pages Checked

The route shells and shared header/CTA output were probed from a local Next.js
production server after the fixes. The exact Vercel preview remains protected, so
the deployed results are still pending.

| Page | Local production result | Deployed staging result |
|---|---|---|
| `/` | Arabic shell and fixed header rendered; CMS sections unavailable locally | Blocked by Vercel SSO |
| `/services` | Arabic route, fixed header, Quote/Contact CTA links | Blocked by Vercel SSO |
| `/portfolio` | Arabic route, fixed header, Quote/Contact CTA links | Blocked by Vercel SSO |
| `/about` | Arabic route, fixed header, Quote/Contact CTA links | Blocked by Vercel SSO |
| `/blog` | Arabic route, fixed header, Quote/Contact CTA links | Blocked by Vercel SSO |
| `/contact` | Arabic route, fixed header, Quote/Services CTA links and form shell | Blocked by Vercel SSO |
| `/quote` | Arabic route, fixed header, Contact/Services CTA links and form shell | Blocked by Vercel SSO |
| `/en` | English shell and fixed header rendered; CMS sections unavailable locally | Blocked by Vercel SSO |
| `/en/services` | English route, fixed header, `/en/quote` and `/en/contact` CTA links | Blocked by Vercel SSO |
| `/en/portfolio` | English route, fixed header, `/en/quote` and `/en/contact` CTA links | Blocked by Vercel SSO |
| `/en/about` | English route, fixed header, `/en/quote` and `/en/contact` CTA links | Blocked by Vercel SSO |
| `/en/blog` | English route, fixed header, `/en/quote` and `/en/contact` CTA links | Blocked by Vercel SSO |
| `/en/contact` | English route, fixed header, `/en/quote` and `/en/services` CTA links and form shell | Blocked by Vercel SSO |
| `/en/quote` | English route, fixed header, `/en/contact` and `/en/services` CTA links and form shell | Blocked by Vercel SSO |

Local CMS rendering was not used as CMS sign-off because this workspace does not
have `NEXT_PUBLIC_SANITY_PROJECT_ID`. The loaders fail safely, but the Home CMS
sections consequently do not render locally. This is a local QA-environment
limitation, not evidence that the configured Vercel preview is missing its Sanity
environment variables.

## Arabic and English Routing Status

Status: **Local implementation passes; deployed verification pending.**

- `next-intl` remains configured with Arabic as `defaultLocale: "ar"` and
  `localePrefix: "as-needed"`.
- Header navigation and quote links are generated centrally for the active locale.
- The language switch removes an existing locale prefix before adding the target
  locale, so it preserves the equivalent path without producing `/ar`.
- The same localized navigation data is used by desktop and mobile navigation.
- Local rendered output for all requested routes contains the expected document
  language and no `/ar` links.

## CMS Rendering Status

Status: **Not reverified on the protected deployment.**

No CMS schemas, queries, mappers, portfolio/blog cards, testimonial rendering, or
About Team wiring were changed. The following must still be reconfirmed after
preview access is available:

- Home hero and Settings content in Arabic and English.
- Services from Sanity.
- Portfolio cards without images or missing-detail links.
- Testimonials without photos.
- Blog cards without featured images or missing-detail links.
- Contact and Quote form visibility with the preview environment variables.

## Accessibility Notes

Status: **Source and production-HTML checks pass; live keyboard verification pending.**

- Mobile navigation uses the project-mandated focus-trap behavior.
- Menu trigger, close control, navigation links, CTA links, and language switch are
  native buttons or anchors with visible focus styles.
- Menu state and dialog relationships use valid ARIA attributes.
- Link activation closes the mobile menu; Escape and overlay dismissal are wired.
- No heading structures or form ARIA relationships were changed.
- Reduced-motion CSS and motion components were not changed.
- A controllable browser was unavailable in this QA environment, so actual Tab/
  Shift+Tab containment, focus return, touch activation, and reduced-motion runtime
  behavior still need confirmation on the deployed preview.

## Visual QA Notes

Status: **No regressions found in source; deployed viewport QA pending.**

- The mobile panel reuses the existing black surfaces, glass borders, spacing,
  typography, red focus outline, and button variants; no redesign was introduced.
- The language link and menu trigger reuse the existing header control styling.
- Shared CTAs retain their existing layout and visual variants; only their disabled
  semantics and destinations changed.
- No images, gray placeholders, portfolio/blog detail interactions, Team content,
  or section layouts were added.
- Final 390px mobile and 1440px desktop visual inspection remains blocked by preview
  protection and the unavailable browser session.

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

### Next expected E2E blocker: Vercel Deployment Protection

The correct branch preview URL currently returns HTTP 302 to
`https://vercel.com/sso-api` before application HTML. The workflow currently passes
only `PLAYWRIGHT_BASE_URL` and does not provide a protection bypass. Once dependency
installation succeeds, the runner will still need an approved automation access
path.

Required external configuration:

1. In the Vercel project, enable **Protection Bypass for Automation** and generate
   a dedicated Playwright/CI secret.
2. Store that value as a GitHub Actions secret, for example
   `VERCEL_AUTOMATION_BYPASS_SECRET`.
3. Configure Playwright to send `x-vercel-protection-bypass` with that secret and,
   for browser navigation, `x-vercel-set-bypass-cookie: true`.
4. Keep using the exact branch preview URL above, or provide a dedicated public
   staging domain/Deployment Protection exception. Do not substitute
   `https://elreda-website.vercel.app`, because that alias points to the main
   deployment rather than the staging branch under review.

Reference: [Vercel Protection Bypass for Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).

No Vercel protection setting or GitHub secret was changed during this task.

## Commands and Checks Run

| Check | Result |
|---|---|
| `npm run lint` | Pass; exit code 0 |
| `npm run typecheck` | Pass; exit code 0 |
| `npm run build` | Pass; Next.js 16.2.9 generated 32 static pages |
| `npx --yes npm@10.9.2 ci --ignore-scripts --dry-run --prefer-offline` against `676dc78` | Fail reproduced: missing `@swc/helpers@0.5.23` |
| Same npm 10.9.2 clean-install validation against the fixed tree | Pass; exit code 0 |
| Local production HTTP probes for all 14 requested routes | Route/header/CTA shell checks pass; CMS unavailable locally |
| `git ls-remote origin refs/heads/staging` | Remote branch still points to `676dc78`; current fixes are not deployed |
| `curl -I` against the branch preview | HTTP 302 to Vercel SSO confirmed |
| `git diff --check` | Pass; no whitespace errors |

## Known Approved Minor Notes

1. Portfolio and Blog cards remain intentionally non-clickable placeholders because
   detail routes are not implemented yet.
2. About Team remains interim “coming soon” copy and does not consume Team Member
   CMS data yet.
3. Remaining `getLocalizedHref` duplication may be consolidated later.

These notes remain approved and are not blockers.

## Remaining Blockers Before Merge

1. Commit and deploy the current fixes to a new staging preview.
2. Configure an approved Vercel automation bypass or a public staging exception for
   the GitHub Actions runner.
3. Rerun `Vercel Preview E2E` and require a green result on the new commit.
4. Complete the browser-based mobile menu, language switching, keyboard, CMS,
   forms, reduced-motion, and mobile/desktop visual pass against that exact preview.

Until those checks are complete, the staging branch remains **NOT READY FOR MERGE**.
