# Staging QA Checklist

Status: Milestone 9.1 staging QA gate. Fill the result columns after a Vercel
Preview deployment exists. Do not record secrets in this file.

Staging URL:

Reviewer:

Date:

Commit SHA:

## Build Verification

| Check | Result | Notes |
|---|---|---|
| Vercel Preview deployment completed. | Pending | |
| Install command is `npm ci`. | Pending | |
| Build command is `npm run build`. | Pending | |
| Node version confirmed in Vercel settings. | Pending | |
| Local `npm run build` passed on same commit. | Pending | |
| Local `npm run lint` passed on same commit. | Pending | |
| Local `npm run test:e2e -- --workers=1` passed on same commit. | Pending | |
| Local `npm run test:a11y` passed on same commit. | Pending | |

## Environment Verification

| Check | Result | Notes |
|---|---|---|
| Preview env values are separate from Production. | Pending | |
| `NEXT_PUBLIC_SITE_URL` points to staging/preview URL. | Pending | |
| Sanity public env values are present. | Pending | |
| Supabase staging env values are present. | Pending | |
| Turnstile staging site/secret keys are present. | Pending | |
| Upstash staging REST URL/token are present. | Pending | |
| CookieYes staging key is present if consent QA is in scope. | Pending | |
| Sentry staging DSNs/env are present if monitoring QA is in scope. | Pending | |
| Uploadthing staging token is present if upload QA is in scope. | Pending | |
| `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL=false`. | Pending | |
| `DISABLE_ANALYTICS=true` unless staging analytics is intentionally tested. | Pending | |

## Security Verification

| Check | Result | Notes |
|---|---|---|
| No private secret uses a `NEXT_PUBLIC_` prefix. | Pending | |
| Contact rejects missing or invalid Turnstile token. | Pending | |
| Quote rejects missing or invalid Turnstile token. | Pending | |
| Rate limiting blocks repeated Contact submissions. | Pending | |
| Rate limiting blocks repeated Quote submissions. | Pending | |
| Honeypot remains present and server-validated. | Pending | |
| Error states do not expose keys, tokens, stack traces, or provider internals. | Pending | |
| `/api/health` returns only safe health data. | Pending | |

## SEO/GEO Verification

| Check | Result | Notes |
|---|---|---|
| Staging is protected from indexing. | Pending | Prefer Vercel Deployment Protection. |
| `/robots.txt` returns 200. | Pending | |
| `/sitemap.xml` returns 200. | Pending | |
| `/llms.txt` returns 200. | Pending | |
| `/llms-full.txt` returns 200. | Pending | |
| `/opengraph-image` returns 200 image/png. | Pending | |
| `/en/opengraph-image` returns 200 image/png. | Pending | |
| Canonicals use staging URL during staging QA. | Pending | |
| Hreflang preserves Arabic root and English `/en`. | Pending | |
| No alternate Arabic URL prefix appears in generated output. | Pending | |
| Staging sitemap is not submitted to Search Console. | Pending | |

## Accessibility Verification

| Check | Result | Notes |
|---|---|---|
| `npm run test:a11y` passes. | Pending | |
| Keyboard navigation works on Arabic routes. | Pending | |
| Keyboard navigation works on English routes. | Pending | |
| Skip link focuses main content. | Pending | |
| Focus states are visible. | Pending | |
| Contact form labels, live regions, and errors are accessible. | Pending | |
| Quote form fieldsets, legends, live regions, and errors are accessible. | Pending | |
| Cookie Preferences control is keyboard accessible. | Pending | |
| Arabic screen reader smoke test completed. | Pending | |
| English screen reader smoke test completed. | Pending | |

## Mobile Verification

| Check | Result | Notes |
|---|---|---|
| 360px viewport has no horizontal overflow. | Pending | |
| 390px viewport has no horizontal overflow. | Pending | |
| 768px viewport has no horizontal overflow. | Pending | |
| 1024px viewport has no horizontal overflow. | Pending | |
| Header and navigation remain usable on mobile. | Pending | |
| Contact form remains usable on mobile. | Pending | |
| Quote form remains usable on mobile. | Pending | |
| Long Arabic CMS content wraps without overlap. | Pending | |

## Forms Verification

| Check | Result | Notes |
|---|---|---|
| `/contact` renders. | Pending | |
| `/en/contact` renders. | Pending | |
| `/quote` renders. | Pending | |
| `/en/quote` renders. | Pending | |
| Valid Contact submission creates staging Supabase record. | Pending | |
| Valid Quote submission creates staging Supabase record. | Pending | |
| Supabase record stores expected form type and locale. | Pending | |
| Manual lead-monitoring or Resend behavior is approved. | Pending | |
| Uploadthing behavior verified if uploads are in scope. | Pending | |

## CMS Verification

| Check | Result | Notes |
|---|---|---|
| Sanity staging/development dataset is selected. | Pending | |
| Required `settings` singleton is published. | Pending | |
| Home hero renders from Sanity or approved staging fallback. | Pending | |
| Home services render from Sanity or approved staging fallback. | Pending | |
| Testimonials render from Sanity or approved staging fallback. | Pending | |
| Services route renders CMS-backed content or approved fallback. | Pending | |
| Portfolio route renders CMS-backed content or approved fallback. | Pending | |
| Blog route renders CMS-backed content or approved fallback. | Pending | |
| No missing Sanity env logs appear in Vercel. | Pending | |
| Revalidation webhook succeeds if configured. | Pending | |

## Legal Route Verification

| Route | Expected | Result | Notes |
|---|---|---|---|
| `/privacy` | 404 unless alias approved | Pending | Current route is `/privacy-policy`. |
| `/en/privacy` | 404 unless alias approved | Pending | Current route is `/en/privacy-policy`. |
| `/privacy-policy` | 200 | Pending | Draft legal copy. |
| `/en/privacy-policy` | 200 | Pending | Draft legal copy. |
| `/terms` | 200 | Pending | Draft legal copy. |
| `/en/terms` | 200 | Pending | Draft legal copy. |
| `/cookies-policy` | 200 | Pending | Draft legal copy. |
| `/en/cookies-policy` | 200 | Pending | Draft legal copy. |
| `/accessibility` | 200 | Pending | Draft legal copy. |
| `/en/accessibility` | 200 | Pending | Draft legal copy. |
| Footer legal links resolve. | 200 | Pending | Crawl Arabic and English footer. |

## Post-Deploy Smoke Test Results

| Route or integration | Result | Notes |
|---|---|---|
| `/` | Pending | |
| `/en` | Pending | |
| `/studio` | Pending | Confirm authenticated Sanity Studio loads. |
| `/robots.txt` | Pending | |
| `/sitemap.xml` | Pending | |
| `/llms.txt` | Pending | |
| `/llms-full.txt` | Pending | |
| `/opengraph-image` | Pending | |
| `/en/opengraph-image` | Pending | |
| `/contact` | Pending | |
| `/en/contact` | Pending | |
| `/quote` | Pending | |
| `/en/quote` | Pending | |
| `/api/health` | Pending | |
| Contact submission | Pending | |
| Quote submission | Pending | |
| Turnstile rejection | Pending | |
| Upstash rate limit | Pending | |
| Cookie Preferences trigger | Pending | |
| Sanity content fetch | Pending | |
| Sanity webhook/revalidation | Pending | |
| Sentry staging test event | Pending | |

## Staging Sign-Off

QA owner:

Deployment owner:

Security reviewer:

SEO reviewer:

CMS owner:

Decision: Pending
