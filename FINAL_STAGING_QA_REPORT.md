# Final Staging QA Report

- Date: 2026-07-21
- Branch: `staging`
- Current deployed staging commit: `bfcb188650a485d15b0a7b4e173043b05c44ad1a`
- App-fix commit verified: `cfdf9db0c259d3fc3586adbd277791eaa3c2f959`
- Staging deployment: `https://elreda-website-git-staging-mohamedreda2005-3712s-projects.vercel.app`

## Final Recommendation

**App code: QA-APPROVED**

**Merge status: NOT READY FOR MERGE — external automation blocker only**

The repository-side blockers identified in the previous QA pass are fixed and
deployed in commit `cfdf9db`. The live language-switcher click-through matrix now
passes. The sole remaining merge blocker is external browser automation access:
the protected preview still redirects the unauthenticated GitHub Actions runner to
Vercel SSO, and the latest `Vercel Preview E2E` check consequently remains red.
Merge readiness requires an approved automation bypass or public staging URL and a
green E2E rerun. No remaining app-side blocker was identified in this rerun.

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
language-switch paths below. Unauthenticated automation remains blocked by Vercel
SSO, so this retest does not claim a new automated pass for the other routes.

| Page | Local production result | Deployed staging result |
|---|---|---|
| `/` | Arabic shell and fixed header rendered; CMS sections unavailable locally | Manual language-switch pass; automation blocked by Vercel SSO |
| `/services` | Arabic route, fixed header, Quote/Contact CTA links | Manual language-switch pass; automation blocked by Vercel SSO |
| `/portfolio` | Arabic route, fixed header, Quote/Contact CTA links | Blocked by Vercel SSO |
| `/about` | Arabic route, fixed header, Quote/Contact CTA links | Blocked by Vercel SSO |
| `/blog` | Arabic route, fixed header, Quote/Contact CTA links | Blocked by Vercel SSO |
| `/contact` | Arabic route, fixed header, Quote/Services CTA links and form shell | Blocked by Vercel SSO |
| `/quote` | Arabic route, fixed header, Contact/Services CTA links and form shell | Blocked by Vercel SSO |
| `/en` | English shell and fixed header rendered; CMS sections unavailable locally | Manual language-switch pass; automation blocked by Vercel SSO |
| `/en/services` | English route, fixed header, `/en/quote` and `/en/contact` CTA links | Manual language-switch pass; automation blocked by Vercel SSO |
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
- The user confirmed that the deployed switcher is clickable and the obsolete
  combined static language text is no longer present.
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

### Latest rerun for deployed staging commit `bfcb188`

The current deployment triggered GitHub Actions run `29742573677`, job
`88352573276`:

- `Checkout`: passed
- `Setup Node`: passed
- `Install dependencies`: passed
- `Install Playwright browser`: passed
- `Run Playwright against preview`: failed
- Playwright summary: 9 failed, 1 passed

The failing assertions consistently report that normal application elements are
absent across Arabic and English routes, including skip links, primary navigation,
breadcrumbs, forms, and the document shells. At the same time, an unauthenticated
request to the exact branch preview returns HTTP 302 to `https://vercel.com/sso-api`.
Together, this confirms that the new failure is the external Vercel protection/SSO
barrier, not the prior lockfile problem or a language-switcher regression. The
manual browser click-through can pass for an authorized user while the GitHub
Actions browser remains unable to reach the application.

## Commands and Checks Run

| Check | Result |
|---|---|
| `npm run lint` | Pass; exit code 0 |
| `npm run typecheck` | Pass; exit code 0 |
| `npm run build` | Pass; Next.js 16.2.9 generated 32 static pages |
| `npx --yes npm@10.9.2 ci --ignore-scripts --dry-run --prefer-offline` against `676dc78` | Fail reproduced: missing `@swc/helpers@0.5.23` |
| Same npm 10.9.2 clean-install validation against the fixed tree | Pass; exit code 0 |
| Local production HTTP probes for all 14 requested routes | Route/header/CTA shell checks pass; CMS unavailable locally |
| Live manual language-switch matrix on the branch preview | Pass for all four required transitions; no `/ar` route generated |
| `git ls-remote origin refs/heads/staging` | Pass; remote `staging` points to `bfcb188` |
| Latest `Vercel Preview E2E` check | Fail; browser step reached the protected preview and reported 9 failures, 1 pass |
| `curl -I` against the branch preview | HTTP 302 to Vercel SSO still confirmed for unauthenticated automation |
| `git diff --check` | Pass; no whitespace errors |

## Known Approved Minor Notes

1. Portfolio and Blog cards remain intentionally non-clickable placeholders because
   detail routes are not implemented yet.
2. About Team remains interim “coming soon” copy and does not consume Team Member
   CMS data yet.
3. Remaining `getLocalizedHref` duplication may be consolidated later.

These notes remain approved and are not blockers.

## Remaining Blockers Before Merge

The app-code fixes are committed, deployed, manually verified, and QA-approved. No
app-code blocker remains.

The only remaining blocker is external: Vercel Deployment Protection redirects the
unauthenticated GitHub Actions browser to SSO. Configure an approved automation
bypass or public staging exception, then rerun `Vercel Preview E2E` and require a
green result.

Until external Preview E2E access is resolved and the check passes, the staging
branch remains **NOT READY FOR MERGE**.
