# CMS QA Report

Date: 2026-07-17

## Pages checked

- Home: Settings hero/services and Testimonials loaders, mapping, empty sections, and CMS-authored internal links.
- Services: service document list, localized fallback content, and empty list state.
- Portfolio: project list, empty service references, optional metadata, and empty list state.
- About: layout reviewed; this page currently uses translation content and does not query Team Member documents.
- Blog: post list, optional author/category/date, empty tags, excerpts, and empty list state.
- Contact and Quote: page shells, locale links, form rendering, and shared CMS-backed footer settings.
- Portfolio detail and Blog detail: route files are not present in this checkout, so there is no detail-page frontend to exercise in this pass.

## Empty CMS fields tested

- Portfolio `heroImage`: not queried or rendered by the current listing frontend; no empty image box or invalid image URL is produced.
- Portfolio `gallery`: not queried or rendered by the current listing frontend; an empty array has no layout effect.
- Portfolio `services`: null and empty arrays map to `[]`; the service metadata block is omitted when empty.
- Service `relatedServices` and `portfolio`: not queried or rendered by the current services listing; empty references have no layout effect.
- Testimonial `photo`: not queried or rendered; quote cards remain balanced without a reserved photo area.
- Team Member `photo` and Blog author photo: not queried or rendered; optional author text is omitted when the author reference is empty.
- Blog `featuredImage`: not queried or rendered by the current listing frontend; cards do not reserve an empty media region.
- Blog `tags`: null maps to `[]`; the tag list is omitted when empty and blank tag values are filtered.
- SEO image: current schemas do not expose a CMS SEO image. Metadata consistently uses the localized generated `opengraph-image` route, so no missing image URL is emitted.
- Settings social links: missing or invalid URLs are omitted; the entire social group is hidden when no valid profiles exist.

## Fixes applied

- Added one shared locale helper for CMS-authored internal paths. Arabic links remain at root without `/ar`; English links receive `/en`; accidental `/ar` or `/en` prefixes are normalized before output.
- Applied locale normalization to Home hero CTA and service links.
- Removed disabled footer pills for empty social profiles to avoid dead UI and visual clutter with partially populated Settings data.
- Added the missing `npm run typecheck` script (`tsc --noEmit`) so the required QA command is reproducible.

## Verification

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.

## Remaining non-blocking notes

- Portfolio detail (`/portfolio/[slug]`) and Blog detail (`/blog/[slug]`) are not implemented in the current checkout. Their hero/gallery/featured-image behavior must be verified when those scheduled page templates are added.
- About is not connected to Team Member CMS data yet. Missing team photos are therefore safe today, but the future Team Member component must preserve the same conditional-image behavior.
- Current listing designs intentionally use text-led cards and do not display CMS images. No demo images or artificial placeholders were added during this QA pass.
