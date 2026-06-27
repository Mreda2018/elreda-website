# DEVELOPMENT ROADMAP
## elReda Advertising — Technical Architecture & Build Plan

**Version:** 2.0  
**Date:** 2026-06-27  
**Status:** Updated per SPEC_FIX_PLAN.md — Ready for Development  
**Changes from v1.0:** FIX-SEC-01 through FIX-API-01 applied (see SPEC_FIX_PLAN.md)

---

## 1. Technology Stack

### Frontend
| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 16.2.9 (App Router) | SSG + SSR + ISR, SEO-optimal, performance, scale |
| Language | TypeScript | Type safety, maintainability |
| Styling | Tailwind CSS v4 | Utility-first, performance, design system tokens |
| Components | shadcn/ui | Accessible, composable, unstyled by default |
| Animation | GSAP + ScrollTrigger | Hero, scroll-driven, complex timelines (lazy-loaded per page) |
| Animation (light) | Motion (Framer Motion) | Component-level micro-interactions (tree-shaken) |
| Smooth Scroll | Lenis | Buttery scroll performance (~8KB, eager-loaded) |
| 3D (Phase 2 only) | Three.js | Hero accent — dynamic import only, not in Phase 1 |
| Icons | Lucide React | Clean, consistent, accessible |
| Fonts | Clash Display + Inter + Tajawal | See Design System |
| Focus Management | focus-trap-react | Mobile menu focus trap (see FIX-ACC-02) |

> **Bundle budget: ≤ 150KB gzipped initial JS per page. See Section 4.**
>
> **Next.js 16 warning:** Next.js 16.2.9 has breaking changes from earlier versions. Before implementing any task that touches routing, rendering, config, metadata, Server Actions, fonts, images, scripts, or build behavior, read the relevant local guide in `node_modules/next/dist/docs/`.

### Content Management
| Layer | Technology | Reason |
|---|---|---|
| Headless CMS | Sanity.io | Flexible schema, GROQ, real-time, multilingual, roles |
| Media | Sanity Asset Pipeline + Next.js Image | Optimized delivery via SanityImage component |
| Preview | Sanity Live Preview | Real-time draft content preview in Next.js |

### Backend / Integrations
| Layer | Technology | Reason |
|---|---|---|
| Form handling | Next.js 16.2.9 Server Actions | CSRF protection built-in, type-safe, progressive enhancement |
| File uploads | Uploadthing | Vercel-compatible CDN storage, type/size validation |
| Email | Resend | Transactional email (form confirmations, notifications) |
| Database (forms) | Supabase | Form submission persistence — never lose a lead |
| Bot protection | Cloudflare Turnstile + @upstash/ratelimit | Spam prevention, accessible CAPTCHA alternative |
| Consent | CookieYes (free plan) | GDPR + Egypt DPL compliance, analytics gating |
| Analytics | Google Analytics 4 | Primary analytics (consent-gated) |
| Tag Manager | Google Tag Manager | Central tracking hub (consent-gated) |
| Behavior | Microsoft Clarity | Heatmaps, session recordings (consent-gated) |
| Pixels | Meta Pixel + Conversions API | Ad tracking (consent-gated, marketing category) |
| i18n | next-intl | Bilingual routing, translations, RTL |
| Error monitoring | Sentry (@sentry/nextjs, free tier) | Catch production errors, source maps |
| OG Images | @vercel/og + opengraph-image.tsx | Automated branded OG images per route |

### Infrastructure & Developer Tools
| Layer | Technology | Reason |
|---|---|---|
| Hosting | Vercel | Edge network, CI/CD, preview deployments |
| Repository | GitHub | Version control, CI/CD integration |
| Domain | elreda.com (TBD) | Primary domain |
| DNS | Cloudflare | Performance, DDoS protection, DNS |
| Uptime Monitoring | UptimeRobot (free) | Alert if site goes down >5 min |
| Testing | Playwright | E2E tests for 6 critical user flows |
| Bundle Analysis | @next/bundle-analyzer | Verify bundle budget before each phase launch |
| Environment | .env.local + Vercel Env Vars | Secrets never in code |

---

## 2. Project Structure

```
elreda-website/
├── app/
│   ├── [locale]/              # i18n: ar (default) + en
│   │   ├── page.tsx           # Home
│   │   ├── opengraph-image.tsx  # Default OG image
│   │   ├── about/
│   │   ├── services/
│   │   │   ├── page.tsx           # Services overview
│   │   │   └── [slug]/            # Dynamic: all 9 services via generateStaticParams
│   │   │       ├── page.tsx
│   │   │       └── opengraph-image.tsx
│   │   ├── portfolio/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── opengraph-image.tsx
│   │   ├── industries/
│   │   │   └── [slug]/
│   │   ├── pricing/
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── opengraph-image.tsx
│   │   ├── contact/
│   │   ├── quote/
│   │   ├── consultation/
│   │   ├── thank-you/
│   │   ├── process/
│   │   ├── faq/
│   │   ├── privacy-policy/
│   │   ├── terms/
│   │   ├── cookies-policy/
│   │   └── not-found.tsx
│   ├── actions/               # Server Actions (CSRF-protected, replaces API routes for forms)
│   │   ├── quote.ts           # "use server"
│   │   ├── contact.ts         # "use server"
│   │   └── consultation.ts    # "use server"
│   ├── api/
│   │   ├── revalidate/route.ts  # Sanity ISR webhook (HMAC signature verified)
│   │   ├── uploadthing/         # Uploadthing file upload handler
│   │   │   ├── core.ts
│   │   │   └── route.ts
│   │   └── health/route.ts      # Uptime check endpoint
│   └── layout.tsx
│
├── components/
│   ├── ui/                    # shadcn/ui base components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx     # Includes focus-trap-react
│   ├── sections/
│   │   ├── Hero.tsx           # H1 visible on first paint (see FIX-PERF-01)
│   │   ├── ServicesGrid.tsx
│   │   ├── PortfolioPreview.tsx
│   │   ├── WhyUs.tsx
│   │   ├── Process.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTASection.tsx
│   ├── portfolio/
│   ├── blog/
│   ├── forms/
│   │   ├── QuoteForm.tsx      # Uses Server Action, step URL params, fieldset/legend
│   │   ├── ContactForm.tsx    # Uses Server Action
│   │   └── ConsultationForm.tsx  # Uses Server Action
│   └── common/
│       ├── WhatsAppButton.tsx  # env(safe-area-inset-bottom) — see FIX-MOB-01
│       ├── LanguageToggle.tsx
│       ├── SchemaMarkup.tsx
│       ├── SanityImage.tsx     # Wraps Next.js Image for Sanity content
│       ├── SkipNavigation.tsx  # "Skip to main content" link
│       └── AnimatedText.tsx
│
├── lib/
│   ├── sanity/
│   │   ├── publicClient.ts    # No token, useCdn: true — public content
│   │   ├── previewClient.ts   # server-only, viewer-level token — draft preview
│   │   ├── queries.ts
│   │   └── types.ts
│   ├── i18n/
│   │   └── getLocalizedValue.ts  # Fallback EN→AR with lang attribute
│   ├── uploadthing.ts
│   ├── analytics.ts           # Analytics helpers (disabled when DISABLE_ANALYTICS=true)
│   ├── whatsapp.ts
│   └── utils.ts
│
├── messages/                  # Namespaced translation files
│   ├── en/
│   │   ├── common.json
│   │   ├── home.json
│   │   ├── services.json
│   │   └── forms.json
│   └── ar/
│       ├── common.json
│       ├── home.json
│       ├── services.json
│       └── forms.json
│
├── public/
│   ├── robots.txt
│   ├── sitemap.xml (auto-generated)
│   ├── llms.txt               # Bilingual — Arabic first (see FIX-GEO-01)
│   ├── llms-full.txt
│   └── images/
│
├── sanity/                    # Sanity Studio
│   ├── schemas/
│   │   ├── service.ts         # Slug locked after publish
│   │   ├── portfolio.ts       # Slug locked after publish
│   │   ├── blog.ts            # Slug locked after publish
│   │   ├── testimonial.ts
│   │   ├── team.ts
│   │   ├── redirect.ts        # NEW: from/to/permanent redirect rules
│   │   └── settings.ts
│   └── sanity.config.ts
│
├── tests/                     # Playwright E2E tests
│   ├── quote-form.spec.ts
│   ├── contact-form.spec.ts
│   ├── language-switch.spec.ts
│   ├── navigation.spec.ts
│   ├── whatsapp-button.spec.ts
│   └── portfolio-filter.spec.ts
│
├── styles/
│   └── globals.css
│
├── .env.example
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Sanity CMS Schema Overview

### Environment: Two Datasets
- **`production`** — live content, published by CMS editors
- **`development`** — staging content, local dev and Vercel preview deployments

Set via environment variable: `SANITY_DATASET=production` (production) or `SANITY_DATASET=development` (dev/preview).

### Slug Protection Rule (FIX-CMS-01)
All slugs on Service, Portfolio, and Blog schemas use:
```typescript
readOnly: ({ document }) => document._id && !document._id.startsWith('drafts.')
```
Slugs are editable on drafts, **locked after first publish**.

### Translation Fields (FIX-CMS-02)
All schemas with bilingual content include:
```typescript
{ name: 'isTranslated', type: 'boolean', initialValue: false, title: 'Arabic translation complete' }
```

### Content Types

#### Service
```typescript
{
  name: string  // unique slug — readOnly after publish
  isTranslated: boolean  // is Arabic version complete?
  title: { en: string, ar: string }
  description: { en: block[], ar: block[] }
  icon: image
  features: { en: string[], ar: string[] }
  process: { step: number, title, description }[]
  faq: { question, answer }[]
  seo: { title, description }  // OG image generated by Next.js
  relatedServices: reference[]
  portfolio: reference[]
}
```

#### Portfolio Project
```typescript
{
  title: { en: string, ar: string }
  slug: string  // readOnly after publish
  isTranslated: boolean
  client: string
  industry: string
  services: reference[]
  heroImage: image
  gallery: image[]
  challenge: { en: block[], ar: block[] }
  approach: { en: block[], ar: block[] }
  process: { en: block[], ar: block[] }
  results: { en: block[], ar: block[] }
  testimonial: reference
  technologies: string[]
  featured: boolean
  publishedAt: date
}
```

#### Blog Post
```typescript
{
  title: { en: string, ar: string }
  slug: string  // readOnly after publish
  isTranslated: boolean
  author: reference
  category: string
  tags: string[]
  body: { en: block[], ar: block[] }
  featuredImage: image
  seo: { title, description }
  publishedAt: date
  featured: boolean
}
```

#### Redirect (NEW — FIX-CMS-01)
```typescript
{
  from: string  // old URL path: '/portfolio/old-slug'
  to: string    // new URL path: '/portfolio/new-slug'
  permanent: boolean  // true = 301, false = 302
}
```
Next.js middleware reads these and applies redirects at request time.

#### Settings (Singleton)
```typescript
{
  contactPhone: string
  contactEmail: string
  whatsappNumber: string
  address: { en: string, ar: string }
  workingHours: { en: string, ar: string }
  socialMedia: { instagram, facebook, linkedin, behance, tiktok, youtube }
}
```

---

## 4. Performance Architecture

### Bundle Budget (FIX-PERF-02)

**Hard limit: ≤ 150KB gzipped initial JS for the first load of any page.**

| Library | Loading Strategy | Approximate Size |
|---|---|---|
| Lenis | Eager (global, tiny) | ~8KB |
| Motion (Framer) | Tree-shaken, on demand | ~15–40KB |
| GSAP core | Dynamic import per page | ~30KB |
| GSAP ScrollTrigger | Dynamic import alongside GSAP | ~18KB |
| Three.js | NOT in Phase 1. Dynamic import in Phase 2 | 0KB Phase 1 |
| Spline | NOT used | 0KB |

> Run `ANALYZE=true npm run build` before each phase launch to verify bundle budget.

### LCP Protection Rule (FIX-PERF-01)

**The hero H1 heading MUST be visible on first paint. No exceptions.**

- Hero H1: `opacity: 1` from the start — use CSS `@keyframes` for any reveal effect
- Hero background, subheadline, CTAs: GSAP is fine (these are not the LCP element)
- GSAP scroll-trigger: `start: "top 90%"` — IntersectionObserver based (keyboard accessible)
- Never set `opacity: 0` or `visibility: hidden` on the LCP candidate element
- Target: LCP < 1.5s on Fast 3G in Chrome DevTools Performance tab

### Rendering Strategy

| Page Type | Strategy | Revalidation |
|---|---|---|
| Home | SSG | On-demand via Sanity webhook |
| Service pages | SSG + ISR | On-demand via Sanity webhook |
| Portfolio | SSG + ISR | On-demand via Sanity webhook |
| Blog posts | SSG + ISR | On-demand via Sanity webhook |
| Contact / Quote | Client components | No prerender (form state) |
| Industry pages | SSG | On-demand via Sanity webhook |

### Sanity Image Integration (FIX-PERF-03)

`next.config.ts` must include:
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.sanity.io' }
  ]
}
```

Use `components/common/SanityImage.tsx` for all Sanity images:
```typescript
// Accepts Sanity image ref + standard Next.js Image props
// Uses @sanity/image-url builder internally
// Renders via Next.js <Image> for automatic WebP optimization
<SanityImage image={sanityRef} alt="..." width={1200} height={800} sizes="100vw" />
```

### Open Graph Images (FIX-MISS-04)

Each route group uses `opengraph-image.tsx` with `@vercel/og`:
- Template: `#0A0A0A` background + elReda logo + page title + `elreda.com` watermark
- Size: 1200×630px, rendered at Vercel Edge
- Dynamic routes (services, portfolio, blog) read the page title from Sanity at generation time

### Font Loading

```typescript
// Self-hosted (Clash Display) + next/font (Inter + Tajawal)
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
import { Tajawal } from 'next/font/google'
```

All fonts: `display: 'swap'`, preloaded for critical weights (400, 600, 700).

---

## 5. Internationalization (i18n)

### Configuration (FIX-CON-01)

```typescript
// next.config.ts
locales: ['ar', 'en']
defaultLocale: 'ar'      // Arabic is PRIMARY — served at elreda.com/
```

**URL routing:**
```
elreda.com/           → Arabic (default locale, no prefix)
elreda.com/en/        → English
elreda.com/ar/        → Redirects to elreda.com/
```

### RTL Handling

```html
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

```css
/* Use CSS logical properties for all directional spacing */
.card {
  padding-inline-start: 24px;
  margin-inline-end: 16px;
}
```

### Language Switch

- Language toggle in header (always visible)
- Auto-detect from browser `Accept-Language` header on first visit
- Arabic users land on `elreda.com/` automatically (default locale)
- English users land on `elreda.com/en/`
- User can override via language toggle, preference stored in cookie

### Hreflang (FIX-CON-01)

```html
<link rel="alternate" hreflang="ar-EG" href="https://elreda.com/" />
<link rel="alternate" hreflang="en" href="https://elreda.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://elreda.com/" />
```

### Translation Fallback (FIX-CMS-02)

Utility: `lib/i18n/getLocalizedValue.ts`
- If Arabic content is empty/null: render English content with `lang="en"` override
- No broken pages — always show something meaningful

### Messages Structure

Namespaced for tree-shaking:
```
messages/ar/common.json   — nav, footer, buttons
messages/ar/home.json     — homepage-specific strings
messages/ar/services.json — service page strings
messages/ar/forms.json    — all form labels and errors
```

---

## 6. Analytics Implementation

### Consent Gating (FIX-MISS-01)

**All analytics are blocked until the user grants consent via CookieYes.**

| Service | Category | Behavior before consent | After consent |
|---|---|---|---|
| GA4 | analytics | Fires in consent mode (no cookies, limited data) | Full tracking |
| Meta Pixel | marketing | Blocked entirely | Full tracking |
| Microsoft Clarity | analytics | Blocked entirely | Full tracking |
| GTM | — | Loads but fires no tags | All tags active |

CookieYes script: `<Script src="cookieyes" strategy="beforeInteractive" />` in root layout.

In development/preview: `DISABLE_ANALYTICS=true` prevents all analytics scripts from loading.

### GA4 Custom Events

```javascript
// Quote form submitted
gtag('event', 'quote_submitted', { service: selectedService, budget_range: selectedBudget })

// WhatsApp clicked
gtag('event', 'whatsapp_click', { page: window.location.pathname, language: currentLocale })

// Consultation booked
gtag('event', 'consultation_booked', { service: selectedService })

// Language switched
gtag('event', 'language_switch', { from: prevLocale, to: newLocale })
```

---

## 7. Security Standards

### Server Actions (FIX-SEC-03 + FIX-DX-01)

All form submissions use Next.js 16.2.9 Server Actions:
- CSRF protection built into the framework (Origin header verification)
- Progressive enhancement — forms work without JavaScript
- Type-safe end-to-end — no manual request/response type definitions

The only remaining API routes are:
- `/api/revalidate` — Sanity ISR webhook (HMAC signature verified)
- `/api/uploadthing` — File upload handler (Uploadthing manages its own auth)
- `/api/health` — Uptime monitoring endpoint

### Bot Protection (FIX-SEC-02)

Every form submission is protected by:
1. **Cloudflare Turnstile** — silent CAPTCHA verified server-side in every Server Action
2. **Honeypot field** — hidden `name="website"` input; if filled, discard silently
3. **Rate limiting** — `@upstash/ratelimit`: 5 submissions per IP per hour per form type

### File Uploads (FIX-SEC-01)

Files go to Uploadthing (CDN-backed, Vercel-compatible):
- Allowed types: PDF, DOCX, PNG, JPG, AI, SVG, ZIP
- Max size: 10MB per file
- URL stored with submission in Supabase
- Never written to Vercel filesystem

### Sanity Token Security (FIX-SEC-05)

```typescript
// lib/sanity/publicClient.ts — no token
createClient({ useCdn: true })  // public, published content only

// lib/sanity/previewClient.ts — restricted
import 'server-only'            // cannot be imported in client components
createClient({ useCdn: false, token: process.env.SANITY_API_READ_TOKEN })  // viewer level only
```

No write tokens exist in the Next.js application at any time.

### Security Headers (FIX-SEC-06)

Phase 1 implements hardened security headers (not a strict CSP — GTM compatibility maintained):

```typescript
// next.config.ts headers
'X-Frame-Options': 'DENY'
'X-Content-Type-Options': 'nosniff'
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
'Referrer-Policy': 'strict-origin-when-cross-origin'
'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
'X-DNS-Prefetch-Control': 'on'
```

Phase 2 decision point: evaluate GTM Server-Side Container to enable a strict CSP without breaking analytics.

### Webhook Verification (FIX-API-01)

Sanity ISR webhook at `/api/revalidate`:
- Verifies HMAC-SHA256 signature using `SANITY_WEBHOOK_SECRET`
- Uses `crypto.timingSafeEqual()` — prevents timing attacks
- Returns 401 if signature is missing or incorrect

### Form Submission Flow (FIX-MISS-02)

```
Server Action called
  → 1. Zod validation (reject if invalid)
  → 2. Turnstile verification (reject if bot)
  → 3. Rate limit check (reject if exceeded)
  → 4. INSERT into Supabase submissions table (never lose lead)
  → 5. Send Resend email
  → 6. UPDATE submission: email_sent=true or email_error=message
  → Return success (even if email failed — lead is safe in DB)
```

### Environment Variables (.env.example)

```bash
# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=development   # 'production' in prod
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=                   # viewer-level only, server-side only
SANITY_WEBHOOK_SECRET=                   # HMAC secret for ISR webhook

# Email
RESEND_API_KEY=

# Uploadthing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=               # server-side only

# Bot protection
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Analytics (CookieYes handles consent, these are GTM/Pixel IDs)
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA4_ID=

# Monitoring
SENTRY_DSN=
SENTRY_AUTH_TOKEN=                       # for source map upload on build

# Development flags
DISABLE_ANALYTICS=true                   # set to false in production only
```

---

## 8. Environment Strategy (FIX-MISS-05)

| Environment | Where | Sanity Dataset | Analytics | Purpose |
|---|---|---|---|---|
| `development` | Local machine | `development` | Disabled | Daily development work |
| `preview` | Vercel PR deployments | `development` | Disabled | PR review, staging checks |
| `production` | Vercel production | `production` | Full | Live site |

**Sanity datasets:**
1. `production` — live content only
2. `development` — experimental content, safe to modify

**Preview deployments:** Created automatically by Vercel for every PR. Uses `SANITY_DATASET=development` and `DISABLE_ANALYTICS=true`.

---

## 9. Testing Strategy (FIX-MISS-06)

### Playwright E2E Tests

| Test File | Flow | Locales |
|---|---|---|
| `quote-form.spec.ts` | Complete 5-step quote form, verify Thank You page | AR + EN |
| `contact-form.spec.ts` | Submit contact form, verify confirmation | AR + EN |
| `language-switch.spec.ts` | Toggle language, verify URL and content change | — |
| `navigation.spec.ts` | All main nav links load correct pages | AR + EN |
| `whatsapp-button.spec.ts` | Button appears after scroll, correct link format | Mobile viewport |
| `portfolio-filter.spec.ts` | Filter changes visible portfolio cards | EN |

**Running tests:**
```bash
npx playwright test         # run all tests
npx playwright test --ui    # visual mode
```

**CI:** GitHub Actions runs Playwright against Vercel preview deployment URL on every PR.

---

## 10. Development Phases

### PHASE 1 — MVP (Target: 6–8 weeks)

**Goal:** Launch a production-ready premium website with all core pages.

#### Week 1: Foundation (Security, Consent, Monitoring First)
- Next.js 16.2.9 project setup (TypeScript, Tailwind v4, App Router)
- CookieYes consent integration (before any analytics)
- Sentry error monitoring setup
- Supabase project + submissions table
- Uploadthing account + file upload handler
- Cloudflare Turnstile account + integration
- UptimeRobot setup + `/api/health` endpoint
- next-intl i18n (AR default, EN at /en/)
- Sanity.io project (two datasets: production + development)
- Sanity dual client (publicClient + previewClient)
- Design system tokens (Tailwind, colors, typography)
- Font setup (Clash Display, Inter, Tajawal)
- SkipNavigation component
- `.env.example` with all variables documented

#### Week 2: CMS & Layout
- All Sanity schemas (service, portfolio, blog, testimonial, team, redirect, settings)
- Base layout: Header + Footer with SkipNavigation
- Mobile navigation (with focus-trap-react)
- Language toggle
- WhatsApp floating button (with safe-area CSS)
- Lenis smooth scroll

#### Week 3–4: Core Pages
- Home page (all sections, LCP-safe H1 animation)
- About page
- Services overview page
- Service page template `/services/[slug]` (dynamic, generateStaticParams)
- Contact page
- Quote multi-step form (fieldset/legend, aria-live, URL per step, Server Action)
- Consultation booking page
- Thank You page
- 404 page

#### Week 5–6: Portfolio & Blog
- Portfolio page with category filter (touch-device-aware)
- Portfolio case study template
- Sanity content integration (portfolio + blog)
- Blog listing page
- Blog post template
- ISR + Sanity webhooks (HMAC verified)

#### Week 7: SEO & Analytics
- Metadata + Open Graph (dynamic opengraph-image.tsx per route)
- All Schema.org markup
- robots.txt
- Sitemap (auto-generated, bilingual)
- llms.txt (bilingual — Arabic first)
- llms-full.txt
- GTM integration (consent-gated via CookieYes)
- GA4 + custom events
- Meta Pixel (consent-gated)
- Microsoft Clarity (consent-gated)
- Sentry source maps uploaded on build

#### Week 8: QA, Polish & Launch
- Playwright E2E tests for all 6 critical flows
- Lighthouse audit (target: 90/85/95/95)
- Accessibility audit (WCAG 2.2 AA, NVDA Arabic, iOS VoiceOver Arabic)
- Cross-browser testing (Chrome, Safari, Firefox, Edge)
- RTL testing (Arabic — all pages)
- Security headers verified (securityheaders.com)
- Bundle analyzer run — confirm ≤ 150KB initial JS
- Deploy to Vercel (production)
- Domain + HTTPS
- Google Search Console + sitemap submitted

**Phase 1 Deliverables:**
- Live website at elreda.com
- Sanity CMS fully configured (two datasets)
- Arabic content at root, English at /en/
- Analytics tracking with consent gating
- PageSpeed 90+/85+
- All E2E tests passing

---

### PHASE 2 — Growth (Months 3–6)

- Industry landing pages (8 × 2 languages)
- Interactive pricing calculator
- Advanced case studies (10+ projects)
- Advanced GSAP animation layer (Three.js selective use)
- Blog content build-up (12+ articles)
- FAQ global page
- Careers page
- Newsletter integration
- Download center (company profile PDF)
- Phase 2 decision: GTM Server-Side Container + strict CSP

---

### PHASE 3 — Client Platform (Months 7–12)

- Client portal (protected routes, Supabase auth — already set up from Phase 1)
- Project dashboard (status, milestones)
- File sharing system
- Invoice history
- Support ticket system
- Role-based access control

---

### PHASE 4 — Business Platform (Months 12–24)

- CRM integration
- AI-powered lead qualification
- WhatsApp Business API integration
- Online payment gateway
- Proposal generator
- Marketing automation
- Internal business dashboard
- AI assistant (on-site)
- ERP integration for project management

---

## 11. Required Files Checklist

### Every Phase Must Include

- [ ] `.env.example` — all required variables with descriptions
- [ ] `robots.txt` — allow Google, Bing, GPTBot, ClaudeBot, PerplexityBot; disallow /api/, /studio/
- [ ] `sitemap.xml` — auto-generated, covers all routes, both locales
- [ ] `llms.txt` — bilingual AI engine summary (Arabic first)
- [ ] `REVIEW.md` — post-build review notes

### Legal Pages (Before Launch)

- [ ] Privacy Policy (EN + AR)
- [ ] Terms & Conditions (EN + AR)
- [ ] Cookie Policy (EN + AR) — with link from CookieYes banner
- [ ] Refund Policy (EN + AR)
- [ ] Accessibility Statement (EN + AR)

---

## 12. Deployment Checklist (Pre-Launch)

```
□ All environment variables set in Vercel dashboard
□ SANITY_DATASET=production in Vercel production env
□ DISABLE_ANALYTICS=false (or removed) in Vercel production env
□ Domain DNS configured
□ HTTPS active
□ robots.txt accessible
□ sitemap.xml accessible and valid
□ llms.txt accessible (bilingual)
□ Google Search Console verified
□ Analytics events verified in GA4 DebugView (after cookie consent granted)
□ Meta Pixel verified in Pixel Helper (after marketing consent granted)
□ All forms tested end-to-end (EN + AR, with Turnstile)
□ Supabase receiving form submissions
□ Sentry receiving test events
□ UptimeRobot monitoring active
□ WhatsApp button working on mobile (no iOS safe area overlap)
□ Lighthouse scores: 90+ / 85+ / 95+ / 95+
□ No console errors in production
□ Bundle size ≤ 150KB initial JS (verified with bundle analyzer)
□ All images via SanityImage component (Next.js Image)
□ All pages have unique meta title + description
□ Schema markup validated (Google Rich Results Test)
□ RTL layout correct on all Arabic pages
□ Security headers verified (securityheaders.com grade B+ minimum)
□ Playwright tests passing against production URL
□ Arabic screen reader test passed (VoiceOver + NVDA)
□ CookieYes consent banner appearing on first visit
□ Analytics NOT firing before consent given
```

---

*This roadmap is the authoritative guide for all development decisions. Any scope change must be discussed and documented before implementation begins.*
