# SPEC FIX PLAN
## elReda Advertising — Critical & High Issue Resolution

**Based on:** DESIGN_REVIEW.md  
**Date:** 2026-06-27  
**Status:** Approved — Update planning documents before development starts  
**Scope:** 6 Critical + 22 High issues = 28 total resolutions  

---

## How to Use This Document

Each issue from DESIGN_REVIEW.md is converted into a specification fix.

Every fix includes:
- The problem (brief)
- The decision (unambiguous, no "or" choices left open)
- Which planning documents to update
- What the implementation must do (requirement)
- How to verify it is done (acceptance criteria)

All critical and high issues must be resolved in the planning documents before any code is written.

---

## CRITICAL ISSUES (6)

---

### FIX-SEC-01 — File Upload Storage
**Review Issue:** SEC-01 | **Priority:** CRITICAL

**Problem:**
Vercel has no writable filesystem. Quote form file uploads have no declared storage destination. They will crash or silently fail in production.

**Decision:**
Use **Uploadthing** as the file storage service.
- Reason: First-class Next.js integration, free tier (2GB storage, 2GB bandwidth/month), handles type validation, virus scanning, and CDN delivery out of the box.
- Uploaded files go to Uploadthing's S3-backed CDN, not Vercel's filesystem.
- The Server Action for quote submission calls Uploadthing's `utapi` to confirm the uploaded file before processing the form.
- Accepted file types: PDF, DOCX, PNG, JPG, AI, SVG, ZIP — max 10MB per file.
- File URL is stored with the form submission in Supabase (see FIX-MISS-02).

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add Uploadthing to tech stack, update Section 7 security to include upload validation rules
- TASKS.md: Add Uploadthing setup task to Group 1

**Implementation Requirement:**
```
Package: uploadthing @uploadthing/react
Environment variables required:
  UPLOADTHING_TOKEN=...
Upload route: app/api/uploadthing/core.ts
Upload endpoint: app/api/uploadthing/route.ts
Allowed file types: ["pdf", "docx", "image", "application/zip"]
Max file size: 10MB
```

**Acceptance Criteria:**
- [ ] File selected on quote form uploads to Uploadthing CDN (not Vercel)
- [ ] File URL returned and stored alongside form submission
- [ ] Files rejected if wrong type or over 10MB with clear error message
- [ ] Upload fails gracefully — user sees error, form is not cleared

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-SEC-02 — Bot and Spam Protection
**Review Issue:** SEC-02 | **Priority:** CRITICAL

**Problem:**
No bot challenge, CAPTCHA, or honeypot on any form. Rate limiting alone cannot stop distributed spam attacks. Quote inbox will be flooded with junk leads.

**Decision:**
Use **Cloudflare Turnstile** as the primary bot protection mechanism.
- Reason: Free, privacy-preserving, GDPR-compliant, accessible (no image puzzles), works with screen readers, silent verification for most users.
- Every form (quote, contact, consultation) must include a Turnstile widget.
- Turnstile token is verified server-side in every Server Action before processing.
- Secondary defense: each form includes a **honeypot field** (`aria-hidden`, invisible to humans) — if filled, the submission is silently discarded.
- Rate limiting: use `@upstash/ratelimit` with Upstash Redis (free tier: 10,000 requests/day). Limit: 5 submissions per IP per hour per form.

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add Cloudflare Turnstile + @upstash/ratelimit to tech stack and Section 7
- TASKS.md: Add bot protection setup task to Group 1

**Implementation Requirement:**
```
Cloudflare Turnstile: free account, get SITE_KEY + SECRET_KEY
Package: @marsidev/react-turnstile
Rate limiting: @upstash/ratelimit + @upstash/redis
Environment variables:
  NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
  TURNSTILE_SECRET_KEY=...
  UPSTASH_REDIS_REST_URL=...
  UPSTASH_REDIS_REST_TOKEN=...
Verification: Server Action calls Turnstile verify API before any processing
Honeypot field: hidden input named "website" — if value is not empty, discard silently
```

**Acceptance Criteria:**
- [ ] Turnstile widget visible on all 3 forms
- [ ] Server Action rejects submissions with missing or invalid Turnstile token
- [ ] Honeypot field present in DOM but invisible (CSS + aria-hidden)
- [ ] Submissions from same IP blocked after 5 in 1 hour with HTTP 429

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-SEC-03 — CSRF Protection via Server Actions
**Review Issue:** SEC-03 | **Priority:** CRITICAL

**Problem:**
CSRF protection was stated but not designed. Next.js API Routes have no built-in CSRF protection.

**Decision:**
Replace all form-submission API routes with **Next.js 16.2.9 Server Actions**.
- Reason: Server Actions include built-in CSRF protection provided by the Next.js framework (they require the correct `Origin` header matching the deployment domain).
- This decision also resolves DX-01 (Server Actions are the correct Next.js 16.2.9 App Router pattern).
- Affected forms: Quote, Contact, Consultation.
- Only one API route remains: `/api/revalidate/route.ts` for Sanity ISR webhook (this is not a form, it is an external webhook — it uses signature verification instead of CSRF, see FIX-API-01).
- All form Server Actions use the `"use server"` directive.

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Remove form API routes from tech stack, add Server Actions architecture decision to Section 7
- TASKS.md: Remove T57, T58, T59 (form API routes), replace with Server Action tasks in Groups 9

**Implementation Requirement:**
```
Remove:
  app/api/quote/route.ts
  app/api/contact/route.ts
  app/api/consultation/route.ts

Add:
  app/actions/quote.ts     ("use server")
  app/actions/contact.ts   ("use server")
  app/actions/consultation.ts ("use server")

Retain:
  app/api/revalidate/route.ts   (Sanity ISR webhook, see FIX-API-01)
  app/api/uploadthing/route.ts  (Uploadthing file handling)
  app/api/health/route.ts       (Uptime monitoring, see FIX-MISS-03)
```

**Acceptance Criteria:**
- [ ] No API route files exist for quote, contact, or consultation
- [ ] All three forms use `<form action={serverAction}>` or `useFormState` with Server Actions
- [ ] Cross-origin form submission attempts are rejected by Next.js framework
- [ ] Forms work with JavaScript disabled (progressive enhancement)

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-SEC-04 — Brand Red Color Contrast Fix
**Review Issue:** SEC-04 | **Priority:** CRITICAL

**Problem:**
`#C0392B` (Red Primary) on `#0A0A0A` background = 3.9:1 contrast — fails WCAG AA (requires 4.5:1 for normal text). Gradient endpoint `#E74C3C` with white text = 3.8:1 — also fails. The design system simultaneously requires WCAG AA and uses colors that violate it.

**Decision:**
The color system is restructured with strict usage rules:

**Button Red (new token):** `#B03020`
- White `#FFFFFF` on `#B03020` = 5.1:1 — passes WCAG AA ✓
- Use exclusively for button backgrounds and interactive element fills

**Red Primary:** `#C0392B` (unchanged)
- ONLY for: decorative borders, icon fills, tag backgrounds, non-text accents, large heading accents (≥ 24px bold = large text, requires only 3:1)
- NEVER for: body text, button background (use `--red-button` instead), text links

**Gradient (corrected):**
```css
--gradient-brand: linear-gradient(135deg, #B03020, #C0392B);
```
White text on gradient darkest point (`#B03020`) = 5.1:1 ✓

**Red Subtle (unchanged):** `#C0392B1A` — decorative background tint only, no text rendered on top.

**Required Document Updates:**
- DESIGN_SYSTEM.md: Add `--red-button: #B03020` token, update gradient, add "Color Usage Rules" table with contrast ratios, update button spec to use `--red-button`

**Implementation Requirement:**
```css
/* New token */
--red-button: #B03020;

/* Corrected gradient */
--gradient-brand: linear-gradient(135deg, #B03020, #C0392B);

/* Usage rule in code */
/* Button background: var(--red-button) ONLY */
/* Decorative elements: var(--red-primary) */
```

**Acceptance Criteria:**
- [ ] All button backgrounds use `--red-button` (#B03020)
- [ ] Gradient corrected to start at #B03020
- [ ] WCAG contrast checker confirms: white on #B03020 = 5.1:1 (passes AA)
- [ ] Red (#C0392B) never used as background for white/light body text
- [ ] Lighthouse Accessibility score 95+ maintained

**Owner Document:** DESIGN_SYSTEM.md

---

### FIX-PERF-01 — LCP-Safe Hero Animation
**Review Issue:** PERF-01 | **Priority:** CRITICAL

**Problem:**
GSAP text reveal animations start elements at `opacity: 0`. The hero H1 is the LCP element. Google measures LCP before JS animations complete — a hidden H1 destroys the LCP score, making the < 2.5s target impossible to achieve.

**Decision:**
**The hero H1 heading MUST be visible on first paint with no JavaScript dependency.**

Rules:
1. The hero H1 (`<h1>`) must render immediately visible — `opacity: 1`, no `transform` initial offset, no `visibility: hidden`.
2. The H1 MAY use a CSS `@keyframes` animation (not GSAP) for a subtle reveal, since CSS animations start rendering immediately without JS execution.
3. GSAP is permitted on: background elements, decorative shapes, gradient overlays, subheadline, CTAs, scroll indicator — all of which are NOT the LCP element.
4. GSAP SplitText / character-level animation: permitted on subheadline only. Never on H1.
5. Any element that could be the LCP candidate (hero image, hero heading) must be above `opacity: 0.01` threshold at first paint.

**Required Document Updates:**
- DESIGN_SYSTEM.md: Add "LCP Protection Rule" to Animation section
- INFORMATION_ARCHITECTURE.md: Add LCP constraint note to Home Page Hero section

**Implementation Requirement:**
```
Hero H1: visible on first paint, CSS animation optional
Hero background: GSAP permitted
Hero subheadline: GSAP permitted (not LCP element)
Hero CTAs: GSAP/Motion permitted (not LCP element)

Verification: Chrome DevTools Performance tab → LCP element must be the H1 
and must have a time ≤ 1.5s on a simulated Fast 3G connection.
```

**Acceptance Criteria:**
- [ ] Chrome DevTools shows LCP element is the H1 heading
- [ ] LCP is achieved within 2.5s on Fast 3G simulation
- [ ] H1 is not `opacity: 0` or `visibility: hidden` at any point during page load
- [ ] PageSpeed Insights LCP score ≥ 90 on desktop

**Owner Document:** DESIGN_SYSTEM.md

---

### FIX-MISS-01 — Cookie Consent and Analytics Gating
**Review Issue:** MISS-01 | **Priority:** CRITICAL

**Problem:**
Meta Pixel, GA4, and Microsoft Clarity all set tracking cookies. No cookie consent mechanism exists. This violates GDPR (EU visitors), Egypt's Data Protection Law No. 151/2020, and Meta's own terms of service for Pixel use.

**Decision:**
Use **CookieYes** as the Consent Management Platform (CMP).
- Reason: Free plan available, GDPR and Egypt DPL compliant, easy one-script integration, customizable banner, supports consent mode.
- All analytics scripts (GA4, Meta Pixel, Microsoft Clarity) MUST be blocked until the user provides consent.
- CookieYes integrates with Google Consent Mode v2 — GA4 fires in consent mode (limited data) before explicit consent, full data after.
- Meta Pixel: blocked entirely until consent granted.
- Microsoft Clarity: blocked entirely until consent granted.
- Cookie banner appears on first visit, bottom of screen, dark theme to match brand.
- Cookie preference center: accessible via "Cookie Settings" link in footer.

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add CookieYes to tech stack, update Section 6 analytics to show consent-conditional loading
- TASKS.md: Add cookie consent task as T00 in Group 1 (before all other tasks), update analytics tasks T66–T70 to note consent-conditional loading
- PROJECT_BRIEF.md: Add cookie consent / data privacy requirement to Accessibility & Compliance section
- INFORMATION_ARCHITECTURE.md: Add "Cookie Settings" link to footer navigation

**Implementation Requirement:**
```
CookieYes: free plan at cookieyes.com
Integration: single script tag, added to <head> via next/script with strategy="beforeInteractive"
Consent mode: Google Consent Mode v2 enabled
Analytics loading:
  - GA4: fires in analytics_storage=denied mode before consent, full mode after
  - Meta Pixel: blocked until marketing consent granted
  - Clarity: blocked until analytics consent granted
Footer: add "Cookie Preferences" link → opens CookieYes preference center
```

**Acceptance Criteria:**
- [ ] Cookie banner appears on first visit for all new users
- [ ] No tracking cookies set before consent is granted
- [ ] Meta Pixel events confirmed NOT firing before consent (check Network tab)
- [ ] GA4 confirmed firing in consent mode before explicit consent
- [ ] Cookie Settings link in footer opens preference center
- [ ] Consent state persists across pages and sessions

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

## HIGH ISSUES (22)

---

### FIX-SEC-05 — Sanity API Token Scoping
**Review Issue:** SEC-05 | **Priority:** HIGH

**Problem:**
Single Sanity client file with undefined token scope. Write tokens in client-side code = attacker can modify all CMS content.

**Decision:**
Two distinct Sanity clients, separated by scope:

**Public client** (`lib/sanity/publicClient.ts`):
- No token required
- `useCdn: true` (fastest delivery)
- Fetches only published content
- Safe to import in client components and server components

**Preview client** (`lib/sanity/previewClient.ts`):
- `SANITY_API_READ_TOKEN` environment variable (viewer level only)
- `useCdn: false` (bypasses CDN for real-time draft content)
- Marked `server-only` — cannot be imported in client components
- Used only during Sanity Live Preview sessions

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Update Section 2 file structure (`lib/sanity/`), update Sanity client description in Section 3

**Implementation Requirement:**
```
lib/sanity/publicClient.ts:
  createClient({ projectId, dataset, apiVersion, useCdn: true })
  No token — published content only

lib/sanity/previewClient.ts:
  import 'server-only'
  createClient({ projectId, dataset, apiVersion, useCdn: false, token: SANITY_API_READ_TOKEN })

Environment variables to add to .env.example:
  SANITY_API_READ_TOKEN=  # viewer-level token for draft preview only
  # Never add write tokens to .env or .env.example
```

**Acceptance Criteria:**
- [ ] `previewClient.ts` contains `import 'server-only'` — build fails if imported in client component
- [ ] Public pages use `publicClient` (no token in requests)
- [ ] No write token exists in the Next.js codebase at any time

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-SEC-06 — CSP Headers Strategy
**Review Issue:** SEC-06 | **Priority:** HIGH

**Problem:**
Strict CSP is incompatible with GTM (which injects arbitrary scripts). The documents require both without acknowledging the conflict.

**Decision:**
Phase 1: Deploy **hardened security headers** (not a strict CSP) to maximize protection while keeping GTM functional. Document the trade-off explicitly.

**Headers to implement in `next.config.ts`:**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-DNS-Prefetch-Control: on
```

**Content-Security-Policy:** Deferred to Phase 2.
- Phase 2 decision point: evaluate GTM Server-Side Container, which removes the need for GTM client-side script injection and enables a strict CSP.
- If server-side GTM is not feasible, use a permissive CSP with a nonce.

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Replace "Content Security Policy headers" with the explicit header list above and Phase 2 note

**Acceptance Criteria:**
- [ ] All 6 headers present in HTTP response for every page
- [ ] `Security Headers` scan at securityheaders.com returns grade B+ or higher
- [ ] GTM and analytics load without errors
- [ ] Phase 2 CSP decision documented as a task (P2-12)

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-PERF-02 — JavaScript Bundle Budget
**Review Issue:** PERF-02 | **Priority:** HIGH

**Problem:**
GSAP + Motion + Three.js could exceed 250KB gzipped before any app code loads. No budget or constraint exists.

**Decision:**
**Hard initial JS budget: ≤ 150KB gzipped for the first load of any page.**

Library loading strategy:
| Library | Loading Strategy | Bundle Impact |
|---|---|---|
| Lenis | Eager (global) | ~8KB — acceptable |
| Motion (Framer) | Tree-shaken, on demand | ~15-40KB depending on use |
| GSAP core | Dynamic import per page that needs it | ~30KB |
| GSAP ScrollTrigger | Dynamic import alongside GSAP | ~18KB |
| GSAP SplitText | NOT USED — use CSS clip-path + Motion instead | 0KB |
| Three.js | Dynamic import, code-split per page | 0KB initial |
| Spline | NOT USED in Phase 1 | 0KB |

**Note on GSAP SplitText:** SplitText is a Club GSAP plugin requiring a commercial license. Decision: do not use it. Achieve text reveal animations using CSS `clip-path` or Motion's layout animations instead.

**Tooling:**
- Add `@next/bundle-analyzer` as devDependency
- Run `ANALYZE=true npm run build` to verify bundle sizes before each phase launch

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add bundle budget table to Section 4 Performance Architecture, remove Spline from Phase 1 stack

**Acceptance Criteria:**
- [ ] `@next/bundle-analyzer` installed
- [ ] Homepage initial JS ≤ 150KB gzipped (verified with bundle analyzer)
- [ ] Three.js does not appear in initial bundle
- [ ] GSAP does not appear in pages that don't use it
- [ ] SplitText not used anywhere (no commercial license)

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-PERF-03 — Sanity Image Integration
**Review Issue:** PERF-03 | **Priority:** HIGH

**Problem:**
"Sanity CDN for images" and "Next.js Image component for all images" are both required but incompatible without explicit configuration.

**Decision:**
- Add `cdn.sanity.io` to `next.config.ts` `remotePatterns`
- Create `components/common/SanityImage.tsx` — a wrapper component that:
  1. Accepts a Sanity image reference object
  2. Uses `@sanity/image-url` builder to construct the CDN URL
  3. Passes the URL to Next.js `<Image>` component for optimization
  4. Supports `width`, `height`, `fill`, `sizes`, `priority` props

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add SanityImage component to file structure, add next.config.ts remotePatterns requirement to Section 4

**Implementation Requirement:**
```typescript
// next.config.ts addition required:
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.sanity.io' }
  ]
}

// Component signature:
<SanityImage
  image={sanityImageRef}
  alt="Description"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={false}
/>
```

**Acceptance Criteria:**
- [ ] All Sanity images render via Next.js Image component (check Network tab for image optimization headers)
- [ ] No CORS errors when loading Sanity images
- [ ] Images served as WebP format where browser supports it
- [ ] No `<img>` tags for Sanity content — always `<Image>` via SanityImage component

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-CON-01 — Default Locale: Arabic Primary
**Review Issue:** CON-01 | **Priority:** HIGH

**Problem:**
PROJECT_BRIEF says Arabic is the primary language. DEVELOPMENT_ROADMAP sets `defaultLocale: 'en'`. These contradict, and the wrong setting inverts SEO priority.

**Decision:**
**Arabic is the default locale. Arabic content is served at the root domain.**

```
elreda.com/         → Arabic homepage (default)
elreda.com/en/      → English homepage
elreda.com/ar/      → Redirects to elreda.com/
```

**Rationale:** The primary market is Egypt and GCC — Arabic-speaking businesses. Arabic content at the root domain is what Google primarily indexes. English is the secondary international locale.

**i18n config:**
```typescript
locales: ['ar', 'en']
defaultLocale: 'ar'
```

**Hreflang mapping:**
```html
<link rel="alternate" hreflang="ar-EG" href="https://elreda.com/" />
<link rel="alternate" hreflang="en" href="https://elreda.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://elreda.com/" />
```

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Update Section 5 i18n configuration
- SEO_GEO_PLAN.md: Update hreflang mapping in Section 5
- PROJECT_BRIEF.md: Add explicit note confirming Arabic is root locale

**Acceptance Criteria:**
- [ ] `elreda.com/` serves Arabic content
- [ ] `elreda.com/en/` serves English content
- [ ] Google Search Console shows Arabic as primary indexed locale
- [ ] Hreflang tags correct on all pages

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-CON-02 — Service Routes: Dynamic CMS-Driven
**Review Issue:** CON-02 | **Priority:** HIGH

**Problem:**
File structure has 9 hardcoded service folders. Sanity has slugs. Slug change in CMS = 404. Architectural conflict.

**Decision:**
**Option B: Dynamic route `/services/[slug]/page.tsx`.**
- One template file generates all 9 (and future) service pages
- `generateStaticParams()` reads all service slugs from Sanity at build time
- Service slugs are locked after first publish in Sanity (see FIX-CMS-01)
- When a new service is added in Sanity, the next build generates its page automatically

**File structure change:**
```
REMOVE:
  app/[locale]/services/branding/
  app/[locale]/services/graphic-design/
  app/[locale]/services/printing/
  ... (all 9 hardcoded folders)

ADD:
  app/[locale]/services/[slug]/page.tsx
  app/[locale]/services/[slug]/opengraph-image.tsx
```

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Update Section 2 file structure
- TASKS.md: Update T44, T45, T46 to reflect dynamic routing

**Acceptance Criteria:**
- [ ] One `[slug]/page.tsx` file exists (not 9 separate folders)
- [ ] `generateStaticParams()` returns all 9 service slugs from Sanity
- [ ] All 9 service URLs work in production
- [ ] Adding a new service in Sanity auto-generates its page on next build

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-MISS-02 — Form Submission Persistence (Supabase)
**Review Issue:** MISS-02 | **Priority:** HIGH

**Problem:**
Form submissions only go to email via Resend. Resend outage = leads permanently lost. No submission history, no retry.

**Decision:**
Add **Supabase** to Phase 1 tech stack for form submission logging.
- Supabase is already planned for Phase 3 (client portal) — adding it in Phase 1 is the right move as it gives early database experience and no architectural change later.
- Free tier: 500MB database, 2GB file storage.

**Submission flow:**
```
User submits form
  ↓
Server Action runs
  ↓
1. Validate input (Zod) — reject if invalid
2. Verify Turnstile token — reject if invalid
3. INSERT into Supabase submissions table — FIRST
4. Attempt Resend email
5. UPDATE submissions record: email_sent=true OR email_error=message
6. Return success (even if email failed — submission is safe)
```

**Supabase table: `submissions`**
```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
type        TEXT NOT NULL  -- 'quote' | 'contact' | 'consultation'
data        JSONB NOT NULL -- all form fields
locale      TEXT NOT NULL  -- 'ar' | 'en'
email_sent  BOOLEAN DEFAULT FALSE
email_error TEXT
created_at  TIMESTAMPTZ DEFAULT NOW()
```

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add Supabase to Phase 1 tech stack (Backend section), add submissions table schema
- TASKS.md: Add Supabase setup task to Group 1, update Server Action tasks to include Supabase logging

**Acceptance Criteria:**
- [ ] Every form submission creates a record in Supabase before email is sent
- [ ] Resend failure does NOT prevent record creation — submission is never lost
- [ ] `email_sent` field correctly reflects email success/failure
- [ ] Admin can view all submissions in Supabase dashboard

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-MISS-03 — Error Monitoring and Uptime
**Review Issue:** MISS-03 | **Priority:** HIGH

**Problem:**
No error monitoring, no uptime monitoring. Production failures go undetected.

**Decision:**
- **Sentry** for error monitoring: `@sentry/nextjs` (free tier: 5K errors/month, sufficient for MVP)
- **UptimeRobot** for uptime: free plan, monitors `elreda.com` and `/api/health` endpoint every 5 minutes, alerts via email
- **Health endpoint:** `/api/health/route.ts` returns `{ status: 'ok', timestamp, version }` — used by UptimeRobot

**Sentry configuration:**
- Capture: JavaScript errors, Server Action errors, API route errors
- Source maps: uploaded to Sentry on build
- Alerts: email notification for any new error type, and when error rate > 10/hour

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add Sentry + UptimeRobot to tech stack, add health endpoint to file structure
- TASKS.md: Add Sentry and UptimeRobot setup tasks to Group 1

**Acceptance Criteria:**
- [ ] Sentry dashboard shows errors from production
- [ ] UptimeRobot sends email alert if site goes down > 5 minutes
- [ ] `/api/health` returns 200 with valid JSON
- [ ] Deliberate test error in Sentry appears in dashboard within 60 seconds

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-MISS-04 — Open Graph Image Generation
**Review Issue:** MISS-04 | **Priority:** HIGH

**Problem:**
100+ unique OG images are needed. No generation strategy exists. Manual creation per page is not scalable.

**Decision:**
Use **Next.js 16.2.9 built-in `opengraph-image.tsx`** with `@vercel/og` for dynamic OG image generation.

**Template design (server-rendered):**
- Background: `#0A0A0A` (brand dark)
- Top-left: elReda Advertising logo (SVG)
- Center: Page title (white, Clash Display equivalent system font)
- Bottom-left: Service/category label (red, smaller)
- Bottom-right: `elreda.com` watermark
- Size: 1200×630px

**File structure:**
```
app/[locale]/opengraph-image.tsx         # Default for homepage/about
app/[locale]/services/[slug]/opengraph-image.tsx  # Service pages
app/[locale]/portfolio/[slug]/opengraph-image.tsx # Uses project image
app/[locale]/blog/[slug]/opengraph-image.tsx      # Uses article image
```

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add `@vercel/og` to tech stack, add opengraph-image files to file structure
- SEO_GEO_PLAN.md: Update Section 4 to describe dynamic OG generation strategy

**Acceptance Criteria:**
- [ ] Sharing elreda.com link on WhatsApp/LinkedIn shows correct branded OG image
- [ ] Sharing a service page shows that service's title in the OG image
- [ ] OG image dimensions are 1200×630
- [ ] Images load in < 2 seconds (Vercel Edge function)

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-MISS-05 — Environment and Staging Strategy
**Review Issue:** MISS-05 | **Priority:** HIGH

**Problem:**
No staging environment. No Sanity dataset separation. Development events contaminate production analytics.

**Decision:**
Three environments with explicit configuration:

| Environment | Where | Sanity Dataset | Analytics |
|---|---|---|---|
| `development` | Local machine | `development` | Disabled (`DISABLE_ANALYTICS=true`) |
| `preview` | Vercel PR preview deployments | `development` | Disabled |
| `production` | Vercel production | `production` | Full |

**Sanity datasets:**
- Create two datasets in Sanity: `production` and `development`
- `development` dataset: safe to experiment with, mirrors `production` structure
- `production` dataset: only updated through deliberate CMS actions

**Environment variables to add to `.env.example`:**
```
SANITY_DATASET=development        # 'production' in prod Vercel env
DISABLE_ANALYTICS=true            # remove or set to 'false' in production
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # set to domain in production
```

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add environment strategy table, update `.env.example` section
- TASKS.md: Add Sanity dataset creation task to Group 2

**Acceptance Criteria:**
- [ ] `development` and `production` Sanity datasets exist
- [ ] Local development uses `development` dataset exclusively
- [ ] Analytics scripts do not fire in development or preview environments
- [ ] Vercel production environment has `SANITY_DATASET=production`

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-MISS-06 — Automated Testing Strategy
**Review Issue:** MISS-06 | **Priority:** HIGH

**Problem:**
QA is entirely manual. No automated tests exist. Regressions in critical flows will be discovered in production.

**Decision:**
Add **Playwright** for end-to-end testing of critical user flows.

**Test coverage (Phase 1 minimum):**
| Test | Flow | Locales |
|---|---|---|
| E2E-01 | Quote form: complete all 5 steps, submit, verify Thank You page | AR + EN |
| E2E-02 | Contact form: submit, verify confirmation | AR + EN |
| E2E-03 | Language switch: toggle EN↔AR, verify URL and content change | — |
| E2E-04 | Navigation: all main nav links load correct pages | AR + EN |
| E2E-05 | WhatsApp button: appears after scroll, correct link format | Mobile |
| E2E-06 | Portfolio filter: filter changes visible cards | EN |

**Test runs:**
- Locally: `npx playwright test`
- On every PR: GitHub Actions runs Playwright against Vercel preview deployment URL

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add Playwright to tech stack (Developer Tools section), add /tests/ directory to file structure
- TASKS.md: Add Playwright setup task to Group 1, add test writing tasks to a new Group 15

**Acceptance Criteria:**
- [ ] `npx playwright test` runs all 6 test suites without manual setup
- [ ] All tests pass against production before launch
- [ ] GitHub Actions CI runs tests on every PR
- [ ] Failing test blocks PR merge

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-ACC-01 — Animation Keyboard Accessibility
**Review Issue:** ACC-01 | **Priority:** HIGH

**Problem:**
GSAP ScrollTrigger fires on scroll position. Keyboard-only users navigate by Tab (no scrolling). Animated sections may never appear for them.

**Decision:**
**Global animation rule: all scroll-triggered animations MUST also trigger when the element enters the viewport, regardless of how the viewport change occurred.**

Implementation rule:
- Use GSAP ScrollTrigger's `start: "top 90%"` setting which uses IntersectionObserver internally and fires when the element becomes visible by any means (scroll OR keyboard navigation that reveals the element)
- Never use pixel-based scroll position triggers (`start: "+=300px"`) — these depend on scroll, not viewport visibility
- All elements that start in an animated initial state (e.g., opacity 0, translateY 40px) MUST reach their final visible state within 1000ms of being in the viewport, regardless of JS execution order

**Required Document Updates:**
- DESIGN_SYSTEM.md: Add "Keyboard Accessibility Rule" to Animation section

**Acceptance Criteria:**
- [ ] Tab through entire homepage with keyboard only — all sections are visible and readable (no opacity-0 stuck sections)
- [ ] Animations play when elements become visible via keyboard navigation
- [ ] NVDA + Chrome confirms content is accessible without scroll

**Owner Document:** DESIGN_SYSTEM.md

---

### FIX-ACC-02 — Mobile Menu Focus Trap
**Review Issue:** ACC-02 | **Priority:** HIGH

**Problem:**
Mobile full-screen menu overlay has no focus trap specification. Keyboard users can Tab behind the open overlay.

**Decision:**
Use `focus-trap-react` package for mobile menu focus management.

**Behavior specification:**
- **Menu opens:** Focus moves to first menu item automatically
- **Tab key:** Cycles through menu items only (focus trapped inside overlay)
- **Shift+Tab:** Cycles backward through menu items
- **Escape key:** Closes menu, focus returns to hamburger button
- **Close button click:** Closes menu, focus returns to hamburger button
- **Overlay backdrop click:** Closes menu, focus returns to hamburger button
- ARIA: `<nav aria-label="Mobile navigation" aria-modal="true">` on the overlay element

**Required Document Updates:**
- DESIGN_SYSTEM.md: Update mobile navigation component spec with focus trap behavior
- TASKS.md: Update T26 with focus trap requirements

**Implementation Requirement:**
```
Package: focus-trap-react
Usage: <FocusTrap active={isMenuOpen} focusTrapOptions={{ returnFocusOnDeactivate: true }}>
  <nav>...</nav>
</FocusTrap>
```

**Acceptance Criteria:**
- [ ] Tab key cannot move focus outside the open mobile menu
- [ ] Escape key closes menu and returns focus to hamburger button
- [ ] Screen reader (VoiceOver) announces the menu is a modal navigation
- [ ] No elements behind the overlay are reachable by keyboard while menu is open

**Owner Document:** DESIGN_SYSTEM.md

---

### FIX-ACC-03 — Arabic Screen Reader Testing Specification
**Review Issue:** ACC-03 | **Priority:** HIGH

**Problem:**
QA task T79 says "screen reader test (VoiceOver or NVDA)" without Arabic specification. Neither defaults to Arabic.

**Decision:**
Arabic screen reader testing is a mandatory QA step, specified as follows:

**Test 1 — iOS VoiceOver Arabic:**
- Device: iPhone with iOS VoiceOver enabled, language set to Arabic
- Pages: Homepage (AR), Service page (AR), Blog post (AR), Quote form (AR)
- Verify: heading hierarchy, form labels, button names, link text, error messages

**Test 2 — Windows NVDA Arabic:**
- Setup: NVDA with eSpeak NG Arabic voice pack
- Pages: Same as above
- Verify: bidirectional text, mixed Arabic/English content reads correctly

**Test 3 — Mixed content:**
- Pages that contain both Arabic and English text (e.g., service pages with English technical terms)
- Verify: `lang` attribute switches correctly so screen reader uses correct pronunciation engine

**Required Document Updates:**
- TASKS.md: Replace vague T79 with explicit Arabic screen reader test specification

**Acceptance Criteria:**
- [ ] iOS VoiceOver reads Arabic homepage without skipping content
- [ ] NVDA reads Arabic form labels and announces errors in Arabic
- [ ] Mixed-language pages have correct `lang` attributes on inline language switches
- [ ] No unlabeled interactive elements in Arabic version

**Owner Document:** TASKS.md

---

### FIX-ACC-04 — Multi-step Form Accessibility
**Review Issue:** ACC-04 | **Priority:** HIGH

**Problem:**
5-step quote form has no accessibility specification. Screen readers cannot communicate step state. Keyboard users cannot navigate back. Browser back button navigates away.

**Decision:**
The multi-step quote form must be built to the following accessibility specification:

**DOM structure:**
```html
<form>
  <!-- Step progress indicator -->
  <nav aria-label="Form steps">
    <ol>
      <li aria-current="step">Step 1: Services</li>  <!-- active step -->
      <li>Step 2: Project Details</li>
      ...
    </ol>
  </nav>

  <!-- Step announcement for screen readers -->
  <div aria-live="polite" aria-atomic="true" class="sr-only">
    Step 2 of 5: Project Details
  </div>

  <!-- Each step is a fieldset -->
  <fieldset>
    <legend>Step 1: What service are you looking for?</legend>
    <!-- Step content -->
  </fieldset>
</form>
```

**Navigation behavior:**
- Each step push a URL query parameter: `?step=1`, `?step=2`, etc.
- Browser back button moves to previous step (not navigate away from the page)
- Form data persisted to `sessionStorage` keyed by step number
- Refreshing the page at step 3 restores step 3 with saved data

**Keyboard behavior:**
- "Next" button advances step (Tab + Enter)
- "Back" button returns to previous step
- Focus moves to step title on step change

**Required Document Updates:**
- INFORMATION_ARCHITECTURE.md: Replace current quote page spec with this accessibility-compliant spec
- TASKS.md: Update T54 with this specification

**Acceptance Criteria:**
- [ ] Screen reader announces "Step 2 of 5: Project Details" when step changes
- [ ] Browser back button goes to Step 1 from Step 2 (not away from page)
- [ ] Refreshing at Step 3 restores form data
- [ ] Each step's fieldset has a visible `<legend>`
- [ ] NVDA correctly reads step progress

**Owner Document:** INFORMATION_ARCHITECTURE.md

---

### FIX-GEO-01 — Arabic llms.txt
**Review Issue:** GEO-01 | **Priority:** HIGH

**Problem:**
`llms.txt` is English-only. Arabic-language AI queries cannot discover elReda from this file.

**Decision:**
The `llms.txt` file includes a bilingual Arabic + English summary. Arabic section comes first (primary market).

**File structure (bilingual):**
```
# إلريدا للدعاية والإعلان | elReda Advertising

> إلريدا للدعاية والإعلان وكالة إبداعية وتقنية متكاملة مقرها القاهرة، مصر.
> نساعد الشركات على بناء هويات بصرية قوية، مواقع إلكترونية، متاجر رقمية، تطبيقات موبايل، أنظمة ERP، وحلول أتمتة بالذكاء الاصطناعي.
> نخدم العملاء في مصر والإمارات والمملكة العربية السعودية ودول الخليج العربي.

---

> elReda Advertising is a full-service creative and technology agency based in Cairo, Egypt.
> We help businesses build strong brand identities, professional websites, e-commerce stores, mobile applications, ERP systems, and AI-powered automation solutions.
> We serve clients across Egypt, the UAE, Saudi Arabia, and the wider Middle East.

[Arabic services section]
[English services section]
[Contact section]
```

**Required Document Updates:**
- SEO_GEO_PLAN.md: Update llms.txt template in Section 7 to bilingual version

**Acceptance Criteria:**
- [ ] `elreda.com/llms.txt` loads and includes Arabic text
- [ ] File encoding is UTF-8
- [ ] Arabic section describes all 9 services in Arabic
- [ ] File is accessible without authentication

**Owner Document:** SEO_GEO_PLAN.md

---

### FIX-CMS-01 — Slug Change Protection
**Review Issue:** CMS-01 | **Priority:** HIGH

**Problem:**
Sanity editors can change slugs anytime, causing immediate 404s with no redirects.

**Decision:**
Two-part solution:

**Part 1 — Slug lock after publish:**
Sanity schema: the `slug` field on Blog Posts, Portfolio Projects, and Services uses `readOnly` function:
```typescript
slug: {
  type: 'slug',
  readOnly: ({ document }) => document._id && !document._id.startsWith('drafts.')
}
```
This makes slug editable on drafts, locked after publishing.

**Part 2 — Redirect document type:**
New Sanity schema: `redirect.ts`
```typescript
{
  name: 'redirect',
  type: 'document',
  fields: [
    { name: 'from', type: 'string' },  // old URL path: '/portfolio/old-slug'
    { name: 'to', type: 'string' },    // new URL path: '/portfolio/new-slug'
    { name: 'permanent', type: 'boolean', initialValue: true }
  ]
}
```
Next.js middleware reads the redirect documents from Sanity at request time (cached, refreshed on revalidation) and applies redirects.

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add `redirect.ts` to Sanity schemas in Section 3, add middleware note

**Acceptance Criteria:**
- [ ] Changing a blog slug on a published document is blocked in Sanity (field is read-only)
- [ ] Creating a Redirect document in Sanity causes Next.js to serve a 301 redirect
- [ ] Test: old URL redirects to new URL within 30 seconds of Sanity publish

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-CMS-02 — Translation Fallback
**Review Issue:** CMS-02 | **Priority:** HIGH

**Problem:**
Missing Arabic translation causes empty content or broken pages. No fallback behavior defined.

**Decision:**
**Fallback rule:** If the `ar` field for a content block is empty, null, or an empty array, render the `en` content with an inline `lang="en"` attribute on the containing element.

**Schema addition:**
Add `isTranslated` boolean to all schemas with bilingual fields:
```typescript
{ name: 'isTranslated', type: 'boolean', initialValue: false }
```
Sanity Studio shows a warning badge when `isTranslated` is false and locale is 'ar'.

**Utility function:**
```typescript
// lib/i18n/getLocalizedValue.ts
function getLocalizedValue(field: { en: T; ar: T | null }, locale: string): { value: T; lang: string } {
  if (locale === 'ar' && field.ar) return { value: field.ar, lang: 'ar' }
  return { value: field.en, lang: 'en' }
}
```
Usage: `<div lang={lang}>{value}</div>`

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Add `isTranslated` field to all schemas in Section 3, add utility function to file structure

**Acceptance Criteria:**
- [ ] Arabic page with missing Arabic translation shows English content with `lang="en"` attribute
- [ ] No empty sections or broken layouts when Arabic content is missing
- [ ] Sanity Studio shows incomplete translation status

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-MOB-01 — WhatsApp Button iOS Safe Area
**Review Issue:** MOB-01 | **Priority:** HIGH

**Problem:**
Fixed bottom-right button overlaps iOS home indicator on iPhone X and later.

**Decision:**
Apply CSS safe-area-inset values to the floating WhatsApp button:

```css
.whatsapp-button {
  position: fixed;
  bottom: calc(20px + env(safe-area-inset-bottom));
  right: calc(20px + env(safe-area-inset-right));
}
```

The `<meta name="viewport">` tag must include `viewport-fit=cover` to enable `env()` values.

**Required Document Updates:**
- DESIGN_SYSTEM.md: Update WhatsApp Floating Button component spec with safe-area CSS

**Acceptance Criteria:**
- [ ] WhatsApp button does not overlap iOS home indicator on iPhone 12/13/14/15
- [ ] Button is accessible in both portrait and landscape orientation
- [ ] `viewport-fit=cover` present in HTML meta tag
- [ ] Test on real device (or Xcode simulator with home indicator enabled)

**Owner Document:** DESIGN_SYSTEM.md

---

### FIX-MOB-02 — Portfolio Cards: Touch Device Behavior
**Review Issue:** MOB-02 | **Priority:** HIGH

**Problem:**
Portfolio cards reveal project info on hover. Touch devices have no hover. Card content is invisible until tap.

**Decision:**
Use CSS `@media (hover: none)` to detect touch devices. On touch devices, show project title and category as a persistent bottom overlay.

```css
/* Desktop: overlay visible on hover */
.portfolio-card__overlay {
  opacity: 0;
  transition: opacity 200ms ease;
}
.portfolio-card:hover .portfolio-card__overlay {
  opacity: 1;
}

/* Touch devices: overlay always visible */
@media (hover: none) {
  .portfolio-card__overlay {
    opacity: 1;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
  }
}
```

**Required Document Updates:**
- DESIGN_SYSTEM.md: Update Portfolio Card component spec with touch device behavior
- INFORMATION_ARCHITECTURE.md: Note touch behavior on Portfolio page description

**Acceptance Criteria:**
- [ ] iPhone: portfolio card shows title and category without tapping
- [ ] Desktop with mouse: overlay appears only on hover
- [ ] Text on dark gradient overlay meets contrast requirements

**Owner Document:** DESIGN_SYSTEM.md

---

### FIX-DX-01 — Server Actions Replace Form API Routes
*(Resolved with FIX-SEC-03 — combined decision)*

See FIX-SEC-03 for full specification. This issue is closed by that fix.

**Additional developer experience notes:**
- Server Actions provide TypeScript end-to-end type safety without manual type definitions for request/response shapes
- Server Action progressive enhancement: forms work without JavaScript enabled
- Server Action error handling: use `useActionState` (React 19 / Next.js 16.2.9) for client-side error display

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

### FIX-API-01 — Sanity Webhook Signature Verification
**Review Issue:** API-01 | **Priority:** HIGH

**Problem:**
The ISR revalidation webhook endpoint `/api/revalidate` has no signature verification. Anyone who discovers the URL can flood the revalidation cache.

**Decision:**
Verify Sanity's HMAC-SHA256 webhook signature on every incoming request.

**Implementation:**
```typescript
// app/api/revalidate/route.ts
import crypto from 'crypto'

const secret = process.env.SANITY_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('sanity-webhook-signature')

  if (!signature) return new Response('Unauthorized', { status: 401 })

  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(body).digest('hex')
  const expected = `sha256=${digest}`

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )

  if (!isValid) return new Response('Unauthorized', { status: 401 })

  // ... revalidation logic
}
```

**Required Document Updates:**
- DEVELOPMENT_ROADMAP.md: Update webhook description in Section 4, add SANITY_WEBHOOK_SECRET to environment variables

**Acceptance Criteria:**
- [ ] Request to `/api/revalidate` without signature header returns 401
- [ ] Request with incorrect signature returns 401
- [ ] Request with correct signature triggers revalidation
- [ ] `SANITY_WEBHOOK_SECRET` in `.env.example`

**Owner Document:** DEVELOPMENT_ROADMAP.md

---

## Summary Table

| Fix ID | Issue | Priority | Decision |
|---|---|---|---|
| FIX-SEC-01 | File upload storage | CRITICAL | Uploadthing |
| FIX-SEC-02 | Bot/spam protection | CRITICAL | Cloudflare Turnstile + Upstash rate limit |
| FIX-SEC-03 | CSRF protection | CRITICAL | Next.js 16.2.9 Server Actions |
| FIX-SEC-04 | Red contrast failure | CRITICAL | New `--red-button: #B03020` token, corrected gradient |
| FIX-PERF-01 | LCP animation risk | CRITICAL | H1 visible on first paint, GSAP on supporting elements only |
| FIX-MISS-01 | Cookie consent | CRITICAL | CookieYes CMP, consent-gated analytics |
| FIX-SEC-05 | Sanity token scope | HIGH | publicClient + previewClient (server-only) |
| FIX-SEC-06 | CSP + GTM conflict | HIGH | Hardened headers Phase 1, CSP deferred to Phase 2 |
| FIX-PERF-02 | JS bundle budget | HIGH | ≤ 150KB initial, GSAP/Three.js lazy loaded |
| FIX-PERF-03 | Sanity image integration | HIGH | remotePatterns + SanityImage component |
| FIX-CON-01 | Default locale | HIGH | Arabic at root, English at /en/ |
| FIX-CON-02 | Service routes | HIGH | Dynamic /services/[slug] via generateStaticParams |
| FIX-MISS-02 | Form persistence | HIGH | Supabase submissions table, log before email |
| FIX-MISS-03 | Error monitoring | HIGH | Sentry + UptimeRobot + /api/health |
| FIX-MISS-04 | OG image strategy | HIGH | Next.js opengraph-image.tsx + @vercel/og |
| FIX-MISS-05 | Staging environment | HIGH | 3 environments, 2 Sanity datasets |
| FIX-MISS-06 | Automated testing | HIGH | Playwright, 6 E2E tests, CI on every PR |
| FIX-ACC-01 | Animation keyboard a11y | HIGH | IO-based triggers, not scroll-position only |
| FIX-ACC-02 | Mobile menu focus trap | HIGH | focus-trap-react, ESC to close |
| FIX-ACC-03 | Arabic screen reader | HIGH | iOS VoiceOver Arabic + NVDA Arabic |
| FIX-ACC-04 | Multi-step form a11y | HIGH | fieldset/legend, aria-live, URL per step |
| FIX-GEO-01 | Arabic llms.txt | HIGH | Bilingual llms.txt, Arabic section first |
| FIX-CMS-01 | Slug change protection | HIGH | Lock after publish + Redirect document type |
| FIX-CMS-02 | Translation fallback | HIGH | Fallback to EN with lang attribute, isTranslated field |
| FIX-MOB-01 | WhatsApp iOS safe area | HIGH | env(safe-area-inset-bottom) |
| FIX-MOB-02 | Portfolio touch behavior | HIGH | @media (hover: none) persistent overlay |
| FIX-DX-01 | Server Actions | HIGH | Resolved by FIX-SEC-03 |
| FIX-API-01 | Webhook verification | HIGH | HMAC-SHA256 signature check |

---

*No code has been written. All decisions above must be reflected in the planning documents before development begins. The next step is to update all affected planning documents per this specification.*
