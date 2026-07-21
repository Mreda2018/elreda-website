# Deployment Guide — elReda Advertising

## Environments

| Environment | URL | Sanity Dataset | Analytics |
|---|---|---|---|
| Development | `localhost:3000` | `development` | Disabled |
| Preview | Vercel PR preview URL | `development` | Disabled |
| Production | `elreda.com` | `production` | Full (consent-gated) |

---

## Protected Preview E2E Access

Use Vercel's **Protection Bypass for Automation** for Playwright tests against
protected Preview deployments:

1. In Vercel, open Project → Settings → Deployment Protection → Protection Bypass
   for Automation and create a dedicated secret for Playwright/CI.
2. In Project → Settings → Environment Variables, confirm
   `VERCEL_AUTOMATION_BYPASS_SECRET` uses that generated value, is marked sensitive,
   and is scoped to **Preview**. Vercel may create this system environment variable
   automatically when the bypass is designated.
3. In GitHub, open Repository → Settings → Secrets and variables → Actions and add
   the same value as a repository secret named
   `VERCEL_AUTOMATION_BYPASS_SECRET`. A Vercel Preview environment variable is not
   automatically available to the external GitHub Actions runner.
4. Redeploy the Preview after creating, changing, or rotating the Vercel variable;
   environment-variable changes do not apply to existing deployments.

The Preview E2E workflow exposes the GitHub secret only to the Playwright test step.
When the variable is present, `playwright.config.ts` adds these global browser
headers:

```text
x-vercel-protection-bypass: <secret from the CI environment>
x-vercel-set-bypass-cookie: true
```

When the variable is absent, Playwright adds neither header, so local E2E behavior
is unchanged. Never put the secret value in source code, workflow YAML, logs, URLs,
or committed environment files.

---

## Pre-Deployment Checklist

Complete every item before pushing to production. Claude must approve before launch.

### Code Quality
- [ ] `npm run build` passes with zero errors
- [ ] `npm run typecheck` passes (no TypeScript errors)
- [ ] No `console.log` or debug code in production files
- [ ] No `any` types in TypeScript
- [ ] Bundle size verified: initial JS ≤ 150KB gzipped (`ANALYZE=true npm run build`)

### Security
- [ ] No secrets or API keys committed to git (run `git log --all --full-diff -p | grep -E 'SECRET|TOKEN|KEY|PASSWORD'`)
- [ ] `.env` and `.env.local` not in git history
- [ ] All form submissions use Server Actions (no API routes for quote/contact/consultation)
- [ ] Turnstile verification present in all Server Actions
- [ ] HMAC signature verification present in `/api/revalidate/route.ts`
- [ ] `previewClient.ts` has `import 'server-only'` at top

### Environment Variables (Vercel Production)
Set all of the following in Vercel dashboard → Project → Settings → Environment Variables:

```bash
# Next.js
NEXT_PUBLIC_SITE_URL=https://elreda.com

# Sanity (CRITICAL: must be 'production' not 'development')
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=<viewer-level-token>
SANITY_WEBHOOK_SECRET=<random-32-char-string>

# Email
RESEND_API_KEY=<resend-api-key>

# Uploadthing
UPLOADTHING_SECRET=<uploadthing-secret>
UPLOADTHING_APP_ID=<uploadthing-app-id>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Bot protection
TURNSTILE_SITE_KEY=<cloudflare-site-key>
TURNSTILE_SECRET_KEY=<cloudflare-secret-key>
UPSTASH_REDIS_REST_URL=<upstash-url>
UPSTASH_REDIS_REST_TOKEN=<upstash-token>

# Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# Monitoring
SENTRY_DSN=<sentry-dsn>
SENTRY_AUTH_TOKEN=<sentry-auth-token>

# Analytics flag (CRITICAL: must NOT be 'true' in production)
# DISABLE_ANALYTICS=   ← remove this variable entirely in production
```

**Double-check:** `NEXT_PUBLIC_SANITY_DATASET` must be `production` and `DISABLE_ANALYTICS` must be absent or `false`.

### SEO & Metadata
- [ ] Every page has a unique `<title>` and `<meta name="description">`
- [ ] OG images render correctly (test by sharing URL on WhatsApp)
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] `sitemap.xml` accessible and valid (check Google Search Console)
- [ ] `llms.txt` accessible and bilingual (Arabic section first)
- [ ] Hreflang tags correct: `ar-EG` at root, `en` at `/en/`
- [ ] Schema markup validated in Google Rich Results Test

### Accessibility
- [ ] Lighthouse Accessibility ≥ 95
- [ ] iOS VoiceOver (Arabic): homepage and quote form tested
- [ ] NVDA (Arabic): form labels and errors confirmed
- [ ] Keyboard navigation: all pages reachable, no stuck animations
- [ ] Focus indicators visible on all interactive elements

### Performance
- [ ] Lighthouse Performance: ≥ 90 desktop, ≥ 85 mobile
- [ ] LCP < 2.5s (verified in Chrome DevTools → Performance)
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] Hero H1 is the LCP element (not hidden by GSAP)
- [ ] All images serve as WebP format

### Analytics & Consent
- [ ] CookieYes banner appears on first visit for new users
- [ ] **No tracking cookies set before consent** (verify in DevTools → Application → Cookies)
- [ ] Meta Pixel NOT firing before marketing consent (verify in Network tab)
- [ ] GA4 confirmed firing in consent mode before explicit consent
- [ ] GA4 full tracking confirmed after consent granted (GA4 DebugView)
- [ ] Sentry receiving events (trigger a test error and verify in Sentry dashboard)

### Infrastructure
- [ ] Domain DNS configured and propagated
- [ ] HTTPS active on all routes (no HTTP remaining)
- [ ] HTTP → HTTPS redirect working
- [ ] Security headers verified at securityheaders.com (grade B+ minimum)
- [ ] UptimeRobot monitoring active and `/api/health` returning 200
- [ ] Sanity ISR webhook configured pointing to production URL

### Content & Testing
- [ ] All forms tested end-to-end in production (quote, contact, consultation)
- [ ] Supabase receiving form submissions
- [ ] Resend sending notification emails
- [ ] All 9 service pages loading from Sanity
- [ ] Portfolio and blog loading from Sanity production dataset
- [ ] Arabic layout correct on all pages
- [ ] WhatsApp button iOS safe area confirmed on iPhone
- [ ] Portfolio touch overlay confirmed on iPhone (no hover required)
- [ ] Playwright E2E tests passing against production URL

---

## Deployment Steps

### Step 1 — Final Build Verification

```bash
npm run build
# Must exit with: ✓ Compiled successfully

ANALYZE=true npm run build
# Check bundle sizes in browser window that opens
```

### Step 2 — Push to Main

```bash
git status
git add <specific files>
git commit -m "chore(deploy): prepare for production launch"
git push origin main
```

### Step 3 — Vercel Auto-Deploy

Vercel detects the push to `main` and deploys automatically.
Monitor at: Vercel dashboard → Deployments → Latest

Wait for: "Ready" status with green checkmark.

### Step 4 — Domain Configuration

In Vercel → Project → Settings → Domains:
- Add `elreda.com`
- Add `www.elreda.com` (redirect to `elreda.com`)
- Follow Vercel's DNS configuration instructions for Cloudflare

### Step 5 — Post-Deploy Verification

```bash
# Test production URLs
curl -I https://elreda.com         # → 200 OK
curl -I https://elreda.com/en/     # → 200 OK
curl -I https://elreda.com/api/health  # → 200 OK

# Test security headers
curl -I https://elreda.com | grep -E 'X-Frame|X-Content|Strict-Transport|Referrer'
```

### Step 6 — Google Search Console

1. Go to Google Search Console → Add Property → Domain
2. Add `elreda.com`
3. Verify via DNS TXT record (Cloudflare)
4. Submit sitemap: `https://elreda.com/sitemap.xml`
5. Submit sitemap: `https://elreda.com/en/sitemap.xml`

### Step 7 — UptimeRobot

Confirm monitors are active:
- `https://elreda.com` — monitor type: HTTPS
- `https://elreda.com/api/health` — monitor type: HTTPS, keyword: `"status":"ok"`

---

## Rollback

If production has a critical issue:

1. Go to Vercel dashboard → Deployments
2. Find the last working deployment
3. Click → "..." → "Promote to Production"

This instantly rolls back without a code deploy.

---

## Post-Launch (First 48 Hours)

- [ ] Check Sentry dashboard for unexpected errors
- [ ] Check Google Search Console for crawl errors
- [ ] Verify Lighthouse scores in production (not localhost)
- [ ] Confirm Google Analytics receiving data
- [ ] Monitor UptimeRobot for any downtime alerts
- [ ] Test all forms again from a real mobile device
