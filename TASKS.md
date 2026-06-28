# TASKS
## elReda Advertising — Development Task List

**Version:** 2.0  
**Date:** 2026-06-27  
**Phase:** Phase 1 — MVP  
**Changes from v1.0:** Group 1 restructured per SPEC_FIX_PLAN.md to include security, consent, storage, monitoring, accessibility, and staging foundation before any UI work.

---

## How to Use This File

- Complete tasks in order within each group
- Mark task status: `[ ]` = To Do, `[x]` = Done, `[-]` = In Progress, `[!]` = Blocked
- Never start the next task group until the current one is reviewed
- After every 4–6 tasks completed, run `npm run build` to verify no breakage
- Update this file as tasks are completed

---

## PHASE 1 — MVP

### GROUP 1: Project Foundation
*Security, consent, monitoring, and storage setup MUST complete before any UI code.*

#### 1A — Framework Setup

- [x] **T01** — Verify Next.js 16.2.9 App Router is correctly installed and running
  - Verified: App Router build passes on Next.js `16.2.9`.
- [x] **T02** — Install and configure `next-intl` for bilingual routing
  - Default locale: `ar` (Arabic at root `/`)
  - Secondary locale: `en` (English at `/en/`)
  - See FIX-CON-01 in SPEC_FIX_PLAN.md
- [x] **T03** — Create namespaced translation files:
  - `/messages/ar/common.json`, `/messages/ar/home.json`, `/messages/ar/services.json`, `/messages/ar/forms.json`
  - `/messages/en/common.json`, `/messages/en/home.json`, `/messages/en/services.json`, `/messages/en/forms.json`
- [x] **T04** — Configure locale detection: auto-detect from browser `Accept-Language`, fallback to Arabic, Arabic users land on root `/`
- [x] **T05** — Set up Tailwind CSS v4 with custom design tokens from DESIGN_SYSTEM.md
  - Include `--red-button: #B03020` (not `--red-primary: #C0392B`) for all button backgrounds
  - See FIX-SEC-04 in SPEC_FIX_PLAN.md
- [x] **T06** — Install Clash Display (self-hosted from Fontshare), Inter, and Tajawal via `next/font`
  - Inter and Tajawal configured with `next/font/google`; Clash Display token reserved for licensed self-hosted Fontshare files (not committed).
- [x] **T07** — Install and configure shadcn/ui with custom theme matching DESIGN_SYSTEM.md
- [x] **T08** — Install GSAP, Motion (Framer Motion), and Lenis
  - GSAP: dynamic import only (not global bundle)
  - Motion: tree-shaken imports
  - Lenis: eager global load (~8KB)
- [x] **T09** — Install Lucide React for icons

#### 1B — Cookie Consent (Required Before Analytics)

- [ ] **T10** — Set up CookieYes (free plan at cookieyes.com)
  - Add CookieYes script to root layout with `strategy="beforeInteractive"`
  - Configure: dark theme banner, bottom of screen
  - Enable Google Consent Mode v2
  - Add "Cookie Preferences" link to footer (implemented in T27)
  - See FIX-MISS-01 in SPEC_FIX_PLAN.md

#### 1C — Error and Uptime Monitoring

- [ ] **T11** — Install and configure Sentry (`@sentry/nextjs`)
  - Free tier (5K errors/month)
  - Capture: JS errors, Server Action errors
  - Configure source map upload on build
  - Set up email alert for new error types
  - See FIX-MISS-03
- [ ] **T12** — Create `/app/api/health/route.ts`
  - Returns: `{ status: 'ok', timestamp, version }`
  - Used by UptimeRobot
- [ ] **T13** — Set up UptimeRobot (free account)
  - Monitor: `elreda.com` and `/api/health`
  - Frequency: every 5 minutes
  - Alert: email if downtime > 5 minutes
  - See FIX-MISS-03

#### 1D — Form Submission Storage

- [ ] **T14** — Create Supabase project (free tier)
  - Create database table `submissions`:
    ```sql
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
    type        TEXT NOT NULL  -- 'quote' | 'contact' | 'consultation'
    data        JSONB NOT NULL
    locale      TEXT NOT NULL  -- 'ar' | 'en'
    email_sent  BOOLEAN DEFAULT FALSE
    email_error TEXT
    created_at  TIMESTAMPTZ DEFAULT NOW()
    ```
  - Phase 1 use: form persistence only (client portal uses auth in Phase 3)
  - See FIX-MISS-02

#### 1E — File Upload Storage

- [ ] **T15** — Set up Uploadthing account (free tier: 2GB storage, 2GB bandwidth)
  - Create upload route: `app/api/uploadthing/core.ts`
  - Create endpoint: `app/api/uploadthing/route.ts`
  - Allowed types: PDF, DOCX, PNG, JPG, AI, SVG, ZIP — max 10MB
  - See FIX-SEC-01

#### 1F — Bot Protection

- [ ] **T16** — Set up Cloudflare Turnstile (free account at dash.cloudflare.com)
  - Get SITE_KEY and SECRET_KEY
  - Install `@marsidev/react-turnstile`
  - See FIX-SEC-02
- [ ] **T17** — Set up Upstash Redis (free tier: 10,000 requests/day)
  - Install `@upstash/ratelimit` + `@upstash/redis`
  - Limit: 5 form submissions per IP per hour per form type

#### 1G — Sanity Dual Client Setup

- [x] **T18** — Create `lib/sanity/publicClient.ts`
  - No token, `useCdn: true` — public published content
- [x] **T19** — Create `lib/sanity/previewClient.ts`
  - `import 'server-only'` at top
  - Uses `SANITY_API_READ_TOKEN` (viewer level)
  - `useCdn: false` for real-time draft content
  - See FIX-SEC-05

#### 1H — Staging Environment

- [!] **T20** — Create two Sanity datasets: `production` and `development`
  - Local dev and Vercel preview: `SANITY_DATASET=development`
  - Vercel production: `SANITY_DATASET=production`
  - See FIX-MISS-05
  - Code wired for dataset separation; Sanity dashboard dataset creation remains external TODO.

#### 1I — Testing Setup

- [x] **T21** — Install Playwright (`@playwright/test`)
  - Create `playwright.config.ts`
  - Configure test directory: `/tests/`
  - Set up GitHub Actions CI to run tests against Vercel preview URL on every PR
  - See FIX-MISS-06

#### 1J — Accessibility Foundation

- [x] **T22** — Build `components/common/SkipNavigation.tsx`
  - "Skip to main content" link
  - Visible on keyboard focus only
  - First focusable element on every page

#### 1K — Environment and Build

- [ ] **T23** — Create `.env.example` with all required variables documented
  - Include all variables from DEVELOPMENT_ROADMAP.md Section 7
  - Comment every variable with its purpose
- [ ] **T24** — Add `next.config.ts` setup:
  - `images.remotePatterns` for `cdn.sanity.io`
  - Security headers (see DEVELOPMENT_ROADMAP.md Section 7)
  - `@next/bundle-analyzer` as devDependency
- [ ] **T25** — Create base `app/[locale]/layout.tsx`
  - `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>`
  - CookieYes script (beforeInteractive)
  - SkipNavigation component
  - Analytics scripts (consent-gated, disabled in dev via DISABLE_ANALYTICS)
- [ ] **T26** — Run `npm run build` — verify clean build with no errors

---

### GROUP 2: Sanity CMS Setup
*Complete before building content-driven pages*

- [!] **T27** — Create Sanity.io project (name: elreda-website), install dependencies (`next-sanity`, `@sanity/image-url`)
  - Dependencies and local config added; Sanity dashboard project creation remains external TODO.
- [x] **T28** — Create Sanity schema: `service.ts`
  - `slug` field: `readOnly` after publish (see FIX-CMS-01)
  - `isTranslated` boolean field (see FIX-CMS-02)
  - Fields: title EN/AR, description, features, process, FAQ, relatedServices, portfolio
- [x] **T29** — Create Sanity schema: `portfolio.ts`
  - Same slug protection and `isTranslated` field
  - Fields: title, client, industry, services, heroImage, gallery, case study fields, testimonial, featured
- [x] **T30** — Create Sanity schema: `blogPost.ts`
  - Same slug protection and `isTranslated` field
  - Fields: title, body EN/AR, author, category, SEO
- [x] **T31** — Create Sanity schema: `testimonial.ts` (quote, client name, company, photo, rating)
- [x] **T32** — Create Sanity schema: `teamMember.ts` (name, position, bio, photo, social links)
- [x] **T33** — Create Sanity schema: `settings.ts` (singleton — contact info, social links, WhatsApp number)
- [x] **T34** — Create Sanity schema: `redirect.ts`
  - Fields: `from` (string), `to` (string), `permanent` (boolean)
  - Used by Next.js middleware to apply CMS-managed redirects
  - See FIX-CMS-01
- [ ] **T34A** — Future: consume Sanity Redirect documents in Next middleware
  - Query published `redirect` documents from Sanity
  - Apply `permanent` as 301 and non-permanent as 307/308 per middleware requirements
  - Not part of Sprint 1B.3; do not implement until scheduled
- [ ] **T35** — Create `lib/sanity/queries.ts` with GROQ queries for all content types
- [ ] **T36** — Create `lib/sanity/types.ts` with TypeScript types matching schemas
- [ ] **T37** — Create `lib/i18n/getLocalizedValue.ts` utility for translation fallback with `lang` attribute
- [ ] **T38** — Create `components/common/SanityImage.tsx` component
  - Wraps Next.js `<Image>` using `@sanity/image-url` builder
  - Accepts: Sanity image ref, `alt`, `width`, `height`, `fill`, `sizes`, `priority`
  - See FIX-PERF-03
- [ ] **T39** — Test Sanity connection: fetch one document from `development` dataset in dev mode

---

### GROUP 3: Layout Components
*Site-wide components used on every page*

- [ ] **T40** — Build `components/layout/Header.tsx`
  - Fixed position, blur backdrop
  - Logo (left in LTR, right in RTL)
  - Desktop navigation with services mega menu
  - Language toggle (EN/AR)
  - WhatsApp icon button
  - "Get a Quote" primary button
  - Scroll behavior: transparent → filled on scroll

- [ ] **T41** — Build `components/layout/MobileMenu.tsx`
  - Hamburger toggle (hamburger button is the return focus target)
  - Full-screen overlay
  - `focus-trap-react` wrapping entire overlay
    - Opens: focus moves to first menu item
    - Tab: cycles through menu items only (trapped)
    - Escape: closes menu, returns focus to hamburger button
    - Close button: same as Escape
  - `<nav aria-label="Mobile navigation" aria-modal="true">` on overlay
  - Services accordion
  - Language toggle
  - WhatsApp CTA at bottom
  - See FIX-ACC-02

- [ ] **T42** — Build `components/layout/Footer.tsx`
  - Logo + tagline
  - Navigation columns: Services / Company / Legal
  - Contact info (from Sanity settings)
  - Social media icons (from Sanity settings)
  - Language toggle
  - **"Cookie Preferences" link** → opens CookieYes preference center
  - Copyright
  - CMS-managed: all links and contact details from Sanity settings

- [ ] **T43** — Build `components/common/WhatsAppButton.tsx`
  - Floating button, fixed bottom-right
  - **CSS: `bottom: calc(20px + env(safe-area-inset-bottom))` — iOS safe area**
  - **CSS: `right: calc(20px + env(safe-area-inset-right))` — landscape safety**
  - Green background, WhatsApp SVG icon
  - Pulse animation (subtle, 3s interval)
  - Context-aware: reads current page, selects correct pre-filled message (9 variants)
  - Appears after 30% scroll depth
  - `aria-label="Chat with us on WhatsApp"`
  - See FIX-MOB-01

- [ ] **T44** — Build `components/common/LanguageToggle.tsx`
  - AR / EN switch
  - Preserves current page path on switch
  - Persists preference in cookie

- [ ] **T45** — Initialize Lenis smooth scroll in root layout
  - Disable on mobile if performance degrades
  - Respect `prefers-reduced-motion`

- [ ] **T46** — Run `npm run build` — verify clean build

---

### GROUP 4: Home Page
*Most important page — requires all sections. LCP protection is mandatory.*

- [ ] **T47** — Build Hero section
  - Full-screen, dark background
  - **H1 MUST be visible on first paint — no `opacity: 0` on H1**
  - **H1 may use CSS `@keyframes` for reveal — not GSAP opacity**
  - GSAP on: background elements, subheadline, CTAs, scroll indicator
  - Arabic: Translated content, RTL layout
  - Animated background (decorative only — particles, gradient, or geometric)
  - Scroll indicator
  - See FIX-PERF-01

- [ ] **T48** — Build Trust Bar section (client logos marquee or key stats)

- [ ] **T49** — Build Services Overview section
  - 9 service cards in responsive grid
  - Scroll-triggered reveal: `start: "top 90%"` (IntersectionObserver-based)
  - Each card: icon, title EN/AR, short description, "Learn more →"
  - Hover: border glow + lift

- [ ] **T50** — Build Portfolio Preview section
  - Fetches featured portfolio items from Sanity via `publicClient`
  - 6–8 project cards
  - **Hover overlay: desktop only (CSS `:hover`) — `@media (hover: none)`: persistent bottom overlay**
  - "View Full Portfolio →" link
  - See FIX-MOB-02

- [ ] **T51** — Build Why Choose Us section (4–5 differentiator cards, animated counters)

- [ ] **T52** — Build Process Overview section (4–5 steps, horizontal scroll or stepped layout)

- [ ] **T53** — Build Industries section (8 industry icons, click → industry page)

- [ ] **T54** — Build Testimonials section (carousel or grid, data from Sanity)

- [ ] **T55** — Build Blog Preview section (3 latest from Sanity, "Read all →")

- [ ] **T56** — Build CTA section (strong headline, primary + secondary CTAs)

- [ ] **T57** — Compose full Home page in `app/[locale]/page.tsx`
  - All sections in correct order
  - One H1, proper heading hierarchy
  - EN and AR content paths via `getLocalizedValue`

---

### GROUP 5: About Page

- [ ] **T58** — Build About page (`app/[locale]/about/page.tsx`)
  - Hero with headline
  - Our story (rich text from Sanity)
  - Founder section (photo, bio, credentials)
  - Vision & Mission
  - Brand values (5 cards)
  - Stats (animated counters)
  - CTA section

---

### GROUP 6: Services Pages

- [ ] **T59** — Build Services Overview page (`/services`)
  - Hero, 3-tier service categories, all 9 service cards, "How services work together" visual, CTA

- [ ] **T60** — Build Service Page template (`/services/[slug]`)
  - Dynamic route with `generateStaticParams()` reading all service slugs from Sanity
  - Fetches content from Sanity `publicClient` by slug
  - Hero with service-specific WhatsApp CTA
  - What we offer (deliverables)
  - Our process (numbered steps)
  - Related portfolio
  - Pricing intro
  - Why elReda for this service
  - FAQ section (with FAQ schema)
  - Testimonials
  - CTA
  - See FIX-CON-02

- [ ] **T61** — Create Sanity content for all 9 services (EN + AR) in `development` dataset first:
  - `branding`, `graphic-design`, `printing`, `web-development`, `ecommerce`
  - `digital-marketing`, `mobile-apps`, `erp-systems`, `ai-automation`
  - Set `isTranslated: true` when both EN and AR are complete

---

### GROUP 7: Portfolio

- [ ] **T62** — Build Portfolio listing page (`/portfolio`)
  - Category filter: URL-based (`/portfolio?category=branding`)
  - Masonry or uniform grid
  - Items from Sanity via `publicClient`
  - **`@media (hover: none)` — persistent bottom overlay showing title + category**
  - **`@media (hover: hover)` — overlay appears on hover only**
  - Load more or pagination
  - See FIX-MOB-02

- [ ] **T63** — Build Portfolio case study template (`/portfolio/[slug]`)
  - Hero image, project meta, challenge, approach, process, result gallery, before/after slider, results, testimonial, related projects (3), CTA

- [ ] **T64** — Add initial portfolio projects to Sanity (minimum 6 projects across 3+ categories)

---

### GROUP 8: Blog

- [ ] **T65** — Build Blog listing page (`/blog`) — featured post, category filter, article grid, pagination

- [ ] **T66** — Build Blog post template (`/blog/[slug]`)
  - Hero (category, title, author, date, read time, image)
  - Rich text body (EN and AR via `getLocalizedValue`)
  - Internal links to services
  - FAQ section at end
  - Author box, related articles (3), CTA

- [ ] **T67** — Add initial blog posts to Sanity (minimum 3 articles in EN + AR)

---

### GROUP 9: Conversion Pages

- [ ] **T68** — Build Contact page (`/contact`)
  - Hero, WhatsApp primary, email + phone, contact form, working hours, social media links

- [ ] **T69** — Build Quote multi-step form (`/quote`)
  - **Step 1–5 — each step uses `<fieldset>` + `<legend>` as step title**
  - **Step progress indicator: `<nav aria-label="Form steps">` with `aria-current="step"` on active step**
  - **`<div aria-live="polite" aria-atomic="true" className="sr-only">Step N of 5: [Title]</div>`**
  - **Each step pushes to URL: `?step=1`, `?step=2` — browser back = previous step**
  - **Form data persisted to `sessionStorage` keyed by step — refresh restores**
  - Focus moves to step title on step change
  - Step 1: Service selection (checkboxes)
  - Step 2: Project details (company, industry, description, timeline)
  - Step 3: Budget range selector
  - Step 4: Contact details + Uploadthing file upload + Turnstile widget + honeypot
  - Step 5: Confirmation summary
  - Submission: Server Action → Zod validation → Turnstile verify → Upstash rate limit → Supabase insert → Resend email → Redirect to Thank You
  - See FIX-ACC-04, FIX-SEC-01, FIX-SEC-02, FIX-SEC-03, FIX-MISS-02

- [ ] **T70** — Build Consultation booking page (`/consultation`)
  - What to expect in the call
  - Booking form (name, email, phone, date, time, service, goal)
  - Turnstile widget + honeypot
  - Submission via Server Action → Supabase + Resend

- [ ] **T71** — Build Thank You page (`/thank-you`)
  - Confirmation message
  - What happens next (3 steps)
  - Response time: within 24 hours
  - WhatsApp option
  - Navigation: Portfolio / Blog / Services

---

### GROUP 10: Server Actions

- [ ] **T72** — Build `app/actions/quote.ts` (`"use server"`)
  - Zod schema validation
  - Turnstile verification
  - Upstash rate limiting
  - Supabase insert (FIRST — before email)
  - Resend email (notification to info@elreda.com + confirmation to client)
  - Update Supabase: `email_sent`, `email_error`
  - Return typed result: `{ success: boolean, error?: string }`

- [ ] **T73** — Build `app/actions/contact.ts` (`"use server"`)
  - Same pattern as quote — simpler Zod schema
  - Supabase insert + Resend

- [ ] **T74** — Build `app/actions/consultation.ts` (`"use server"`)
  - Validate booking request
  - Supabase insert + Resend email notifications

- [x] **T75** — Build `/app/api/revalidate/route.ts`
  - HMAC-SHA256 signature verification using `SANITY_WEBHOOK_SECRET`
  - `crypto.timingSafeEqual()` comparison
  - Call `revalidatePath()` for the affected content type on verified request
  - Return 401 if signature missing or invalid
  - See FIX-API-01

---

### GROUP 11: SEO & Analytics

- [ ] **T76** — Create `generateMetadata()` for every page
  - Unique title + description per page (EN + AR)
  - Open Graph title, description
  - Twitter Card tags
  - Canonical URL
  - Hreflang: `ar-EG` at root, `en` at /en/, `x-default` at root

- [ ] **T77** — Create `opengraph-image.tsx` using `@vercel/og`
  - Default: `app/[locale]/opengraph-image.tsx`
  - Service pages: `app/[locale]/services/[slug]/opengraph-image.tsx`
  - Portfolio: `app/[locale]/portfolio/[slug]/opengraph-image.tsx`
  - Blog: `app/[locale]/blog/[slug]/opengraph-image.tsx`
  - Template: `#0A0A0A` background + elReda logo + page title + `elreda.com` watermark, 1200×630
  - See FIX-MISS-04

- [ ] **T78** — Create `components/common/SchemaMarkup.tsx`
  - Organization schema (global)
  - LocalBusiness schema (home + contact)
  - Service schema (service pages)
  - FAQ schema (service + blog pages)
  - Article schema (blog posts)
  - BreadcrumbList schema (all interior pages)
  - CreativeWork schema (portfolio case studies)

- [ ] **T79** — Create `public/robots.txt`
  - Allow: Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended
  - Disallow: /api/, /studio/
  - Sitemap reference

- [ ] **T80** — Configure sitemap generation (all static + dynamic routes, both locales, auto-updated on build)

- [ ] **T81** — Create `public/llms.txt` — bilingual AI engine summary (Arabic section first, see FIX-GEO-01 and SEO_GEO_PLAN.md Section 7)

- [ ] **T82** — Create `public/llms-full.txt` — extended AI-readable content index

- [ ] **T83** — Add GTM script via `next/script` (`strategy="afterInteractive"`, consent-gated by CookieYes)

- [ ] **T84** — Configure GA4 via GTM
  - Page view tracking
  - All custom events from DEVELOPMENT_ROADMAP.md Section 6

- [ ] **T85** — Configure Meta Pixel via GTM (marketing consent category — gated by CookieYes)

- [ ] **T86** — Add Microsoft Clarity script (analytics consent category — gated by CookieYes)

- [ ] **T87** — Test all analytics events in GA4 DebugView and Meta Pixel Helper
  - Verify: NO events fire before consent is granted
  - Verify: Events fire correctly after consent

---

### GROUP 12: Legal Pages

- [ ] **T88** — Create Privacy Policy page (`/privacy-policy`) — EN + AR (include data processing, cookie consent, Supabase data storage)
- [ ] **T89** — Create Terms & Conditions page (`/terms`) — EN + AR
- [ ] **T90** — Create Cookie Policy page (`/cookies-policy`) — EN + AR (link from CookieYes banner)
- [ ] **T91** — Create Refund Policy page (`/refund-policy`) — EN + AR
- [ ] **T92** — Create Accessibility Statement page (`/accessibility`) — EN + AR

---

### GROUP 13: Quality Assurance

- [ ] **T93** — Mobile QA on real devices (iPhone, Android, multiple screen sizes)
  - Navigation, forms, images, RTL layout
  - **WhatsApp button: confirm no overlap with iOS home indicator on iPhone 12/13/14/15**
  - **Portfolio cards: confirm persistent overlay on touch (no hover required)**

- [ ] **T94** — Desktop cross-browser testing (Chrome, Safari, Firefox, Edge — all major pages)

- [ ] **T95** — RTL/Arabic layout audit
  - All pages correct in Arabic, no broken layouts, proper typography, correct reading direction
  - Direction-sensitive icons (arrows) flip correctly

- [ ] **T96** — Accessibility audit — WCAG 2.2 AA
  - Keyboard navigation: tab through all pages, all content visible (no stuck animations)
  - **Arabic screen reader — iOS VoiceOver:**
    - Device: iPhone with VoiceOver enabled, language set to Arabic
    - Pages: Homepage (AR), Service page (AR), Blog post (AR), Quote form (AR)
    - Verify: heading hierarchy, form labels, button names, link text, error messages
  - **Arabic screen reader — NVDA:**
    - Setup: NVDA with eSpeak NG Arabic voice pack
    - Same pages as above
    - Verify: bidirectional text reads correctly
  - **Mixed-content pages:** verify `lang` attribute on inline language switches
  - Contrast ratios checked (white on `--red-button: #B03020` = 5.1:1 ✓)
  - Focus indicators visible on all interactive elements
  - All form inputs labeled above (never placeholder-only)
  - See FIX-ACC-03

- [ ] **T97** — Quote form accessibility test
  - Screen reader announces step number and title on each step change
  - Browser back button returns to previous step (not navigate away)
  - Refreshing at step 3 restores saved data
  - Focus moves to step legend on step change
  - Turnstile widget is accessible (no image puzzle required)
  - See FIX-ACC-04

- [ ] **T98** — Lighthouse audit — achieve target scores
  - Performance: 90+ desktop / 85+ mobile
  - Accessibility: 95+
  - SEO: 95+
  - Best Practices: 95+

- [ ] **T99** — Schema validation (Google Rich Results Test for all structured data)

- [ ] **T100** — Form end-to-end testing (manual)
  - Quote form: submit all 5 steps, verify Supabase record created, verify email received, verify Thank You page
  - Contact form: submit, verify Supabase record, verify email
  - Consultation: submit, verify Supabase record, verify confirmation email
  - Test: Turnstile blocks bots (submit without completing Turnstile)
  - Test: Resend failure still creates Supabase record

- [ ] **T101** — WhatsApp flow testing
  - All 9 context-aware messages correct
  - Button appears at 30% scroll depth
  - Mobile: no home indicator overlap
  - Desktop and mobile

- [ ] **T102** — Security review
  - No secrets in client code (check with build analyzer)
  - Server Actions — not API routes — handling form submissions
  - Security headers verified at securityheaders.com (grade B+ minimum)
  - Rate limiting active (test with repeated submissions)
  - CookieYes consent banner working (no analytics before consent)

- [ ] **T103** — Bundle size verification
  - Run `ANALYZE=true npm run build`
  - Confirm: initial JS ≤ 150KB gzipped for homepage
  - Confirm: Three.js NOT in initial bundle
  - Confirm: GSAP NOT in pages that don't use it
  - See FIX-PERF-02

- [ ] **T104** — Playwright E2E tests — run all 6 test suites and confirm all pass

---

### GROUP 14: Launch

- [ ] **T105** — Deploy to Vercel (production)
- [ ] **T106** — Connect domain (elreda.com or confirmed alternative)
- [ ] **T107** — Set all environment variables in Vercel dashboard
  - `SANITY_DATASET=production`
  - `DISABLE_ANALYTICS=` (remove or set to false)
  - All other vars from `.env.example`
- [ ] **T108** — Verify HTTPS active on all routes
- [ ] **T109** — Submit sitemap to Google Search Console
- [ ] **T110** — Submit sitemap to Bing Webmaster Tools
- [ ] **T111** — Verify GA4 receiving live data (after granting consent in banner)
- [ ] **T112** — Verify Meta Pixel receiving events (after granting marketing consent)
- [ ] **T113** — Verify Sentry receiving events (trigger a test error, confirm it appears)
- [ ] **T114** — Verify UptimeRobot monitoring active and `/api/health` returns 200
- [ ] **T115** — Create Google Business Profile
- [ ] **T116** — Final production Lighthouse audit — confirm all targets met
- [ ] **T117** — Write REVIEW.md with any post-launch issues found

---

### GROUP 15: Playwright Test Implementation

*Write these tests during or after Group 10 (Server Actions), when form flows are complete*

- [ ] **T118** — Write `tests/quote-form.spec.ts` — complete 5-step quote form, AR + EN
- [ ] **T119** — Write `tests/contact-form.spec.ts` — contact form submit, AR + EN
- [ ] **T120** — Write `tests/language-switch.spec.ts` — toggle EN↔AR, verify URL and content
- [ ] **T121** — Write `tests/navigation.spec.ts` — all main nav links load correct pages, AR + EN
- [ ] **T122** — Write `tests/whatsapp-button.spec.ts` — appears after scroll, correct link (mobile viewport)
- [ ] **T123** — Write `tests/portfolio-filter.spec.ts` — filter changes visible cards

---

## PHASE 2 Tasks (Planned — Not Started)

- [ ] **P2-01** — Industry pages (8 × 2 languages)
- [ ] **P2-02** — Interactive pricing calculator
- [ ] **P2-03** — Advanced case studies (10+ projects)
- [ ] **P2-04** — Careers page
- [ ] **P2-05** — Partners page
- [ ] **P2-06** — Process page (standalone)
- [ ] **P2-07** — FAQ global page
- [ ] **P2-08** — Newsletter integration (MailChimp or Brevo)
- [ ] **P2-09** — Download center (company profile PDF)
- [ ] **P2-10** — Animation layer 2 (Three.js hero, scroll-driven storytelling, parallax)
- [ ] **P2-11** — 12+ blog articles published
- [ ] **P2-12** — GTM Server-Side Container evaluation → strict CSP implementation (see FIX-SEC-06)

---

## Phase 3 Tasks (Planned — Not Started)

- [ ] **P3-01** — Client portal (Supabase auth — already configured from Phase 1)
- [ ] **P3-02** — Project dashboard
- [ ] **P3-03** — File sharing
- [ ] **P3-04** — Invoice history
- [ ] **P3-05** — Support tickets

---

*This file is the single source of truth for all implementation work. No code should be written without a corresponding task. Tasks must be completed in order within each group.*
