# Sanity Production Readiness

Status: Sprint 8.2E CMS/Sanity launch gate. This document tracks required
production CMS setup and verification. Do not commit real Sanity tokens,
webhook secrets, draft content, or production-only dashboard values here.

## Launch Blockers Covered

- Sanity production dataset must exist and be selected by Vercel Production.
- Required published content must be present before launch.
- Missing Sanity public env loader errors must be resolved in production logs.
- The homepage settings singleton and home hero are required launch content.
- Fallback or empty CMS states must be explicitly approved before launch.
- Sanity publish webhooks must revalidate the production deployment.

## Required Environment

Production must configure these variables in Vercel Production. Preview and
Development should be configured separately.

| Variable | Scope | Production requirement |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | Production Sanity project ID. |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | `production` for Vercel Production. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public | Pinned API date used by all clients. |
| `SANITY_API_READ_TOKEN` | Server only | Viewer/read token only; no write/admin scope. |
| `SANITY_WEBHOOK_SECRET` | Server only | Strong HMAC secret for `/api/revalidate`. |

`SANITY_API_READ_TOKEN` and `SANITY_WEBHOOK_SECRET` must never be prefixed with
`NEXT_PUBLIC_`, sent to client components, or exposed in logs.

## Dataset And Studio Readiness

Production launch requires:

- A Sanity dataset named `production`.
- Vercel Production `NEXT_PUBLIC_SANITY_DATASET=production`.
- Sanity Studio pointed at the same project and production dataset for final
  content entry.
- Published documents, not drafts, for every launch-critical content item.
- Arabic root routes preserved as root paths and English routes preserved under
  `/en`. Do not create or publish links that depend on an alternate Arabic URL
  prefix.

## Required Singleton

The `settings` singleton must be published with `_id` exactly `settings`.
The Studio structure exposes this as the single Settings document.

Required launch fields:

- `homeHero.eyebrow`
- `homeHero.headline`
- `homeHero.description`
- `homeHero.primaryCta.label`
- `homeHero.primaryCta.href`
- `homeHero.secondaryCta.label`
- `homeHero.secondaryCta.href`
- `homeHero.statistics` if the launch design expects hero metrics
- `homeServices.eyebrow`
- `homeServices.heading`
- `homeServices.description`
- `homeServices.serviceItems` with valid internal `href` values
- `homeServices.cta` if the launch design expects the section CTA
- `contactPhone`
- `contactEmail`
- `whatsappNumber`
- `address`
- `workingHours`
- `socialMedia` values that are ready for public launch

For bilingual launch, Arabic and English values should be populated. If a field
uses English as a temporary fallback for Arabic, that decision must be approved
before launch and recorded in the launch checklist.

## Minimum Published Content Set

The public client reads only published content. Draft-only documents do not
satisfy launch readiness.

Minimum launch set:

| Type | Minimum | Required fields for rendering |
|---|---:|---|
| `settings` | 1 | `_id=settings`, home hero, home services, footer/contact/social settings. |
| `service` | At least 1 public service, or explicit fallback approval. | `title.en`, `slug`, localized title, localized description. |
| `testimonial` | At least 1 public testimonial, or explicit fallback approval. | `quote.en`, `clientName`, optional rating/company. |
| `portfolio` | At least 1 public project if Portfolio is public at launch. | `title.en`, `slug`, client/industry where applicable. |
| `blogPost` | At least 1 public post if Blog is public at launch. | `title.en`, `slug`, body or SEO description. |
| `teamMember` | Required when referenced by launch blog posts. | `name`, public-safe role/profile data. |
| `redirect` | Optional only. | Do not rely on redirect documents until redirect consumption is separately scoped. |

Service, portfolio, and blog slugs must be lowercase URL slugs that match the
runtime slug validation. Public internal links should start with `/` and must
not use protocol-relative URLs.

## Fallback Behavior

Current loaders catch Sanity client and query failures, log messages such as
`loadHomeHero failed`, and return `null`. Current mappers also return `null`
when required content is missing.

This behavior is acceptable for local resilience, but not as a launch state.
Production readiness requires:

- No `Missing required public environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID`
  logs.
- No persistent `loadHomeHero failed`, `loadHomeServices failed`,
  `loadHomeTestimonials failed`, `loadServicesPage failed`,
  `loadPortfolioPage failed`, `loadBlogPage failed`, or
  `loadFooterSettings failed` logs.
- No empty homepage shell caused by missing `settings.homeHero`.
- No empty CMS-backed public route unless the team has explicitly approved
  fallback-safe launch content for that route.
- Arabic and English route smoke tests with real production CMS data.

## Preview And Draft Readiness

The project has a server-only Sanity preview client using `previewDrafts` and
`SANITY_API_READ_TOKEN`. Before enabling any preview entry point publicly:

- Keep the read token server-only.
- Use a read/viewer token, not an editor/write/admin token.
- Confirm draft preview routes, if added later, are protected.
- Confirm preview mode does not alter public published rendering.

No new preview route is required or implemented by Sprint 8.2E.

## Webhook And Revalidation

Sanity must send publish/update/delete webhooks to the production deployment:

- Endpoint: `https://<production-domain>/api/revalidate`
- Method: `POST`
- Header: `sanity-webhook-signature`
- Secret: same value as production `SANITY_WEBHOOK_SECRET`
- Payload: JSON containing at least `_type`; include `slug.current` for
  `service`, `portfolio`, and `blogPost` when available.

The route verifies HMAC-SHA256 signatures and revalidates localized Arabic root
paths plus English `/en` paths for CMS-backed content. It does not introduce or
depend on an alternate Arabic URL prefix.

Manual webhook verification:

1. Publish or update the production `settings` singleton.
2. Confirm Sanity webhook delivery returns `200`.
3. Confirm the JSON response includes `"revalidated": true`.
4. Confirm `/` and `/en` reflect the published change after revalidation.
5. Confirm production logs show no missing Sanity env or signature errors.

## Redirect Readiness

The `redirect` schema exists and revalidation handles redirect document changes,
but redirect documents are not currently consumed by middleware.

Do not publish launch-critical redirects in Sanity unless redirect consumption is
separately scoped and implemented. If launch needs redirects, track them outside
Sanity or approve a dedicated redirect implementation sprint.

## Production Smoke Test

Run these after production Sanity env and content are configured:

1. `npm run build` with production-like Sanity env.
2. Open `/` and `/en`; verify home hero, services, testimonials, and footer data.
3. Open `/services` and `/en/services`; verify service cards render from Sanity.
4. Open `/portfolio` and `/en/portfolio`; verify either real projects render or
   fallback-safe launch approval is documented.
5. Open `/blog` and `/en/blog`; verify either real posts render or fallback-safe
   launch approval is documented.
6. Open `/contact`, `/en/contact`, `/quote`, and `/en/quote`; verify footer CMS
   contact/social data is present and localized.
7. Inspect production logs for Sanity loader errors.
8. Publish a harmless content change and confirm `/api/revalidate` succeeds.

## Remaining Manual CMS Actions

These cannot be completed in the repository and remain launch blockers until the
Sanity and deployment owners verify them:

- Create or confirm the production dataset.
- Configure Vercel Production Sanity env variables.
- Publish the `settings` singleton with home hero, home services, footer,
  contact, and social content.
- Publish the minimum service, testimonial, portfolio, blog, and team content
  required for the approved launch scope.
- Approve any fallback-safe empty sections or route states.
- Configure and test the production Sanity webhook.
- Confirm production preview logs contain no Sanity env or fallback errors.
