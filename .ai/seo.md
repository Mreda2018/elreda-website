# SEO Implementation Rules — elReda Advertising

## Source of Truth

Full SEO strategy: `SEO_GEO_PLAN.md`
Technical requirements: `DEVELOPMENT_ROADMAP.md` Sections 4, 7
Architecture decisions: `SPEC_FIX_PLAN.md` FIX-CON-01, FIX-MISS-04, FIX-GEO-01

---

## Metadata — generateMetadata()

Every page must export `generateMetadata()`. No exceptions.

### Static Pages

```typescript
// app/[locale]/about/page.tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' })
  const isArabic = locale === 'ar'

  return {
    title: isArabic
      ? 'عن إلريدا للدعاية والإعلان | وكالة إبداعية في القاهرة'
      : 'About elReda Advertising | Creative Agency Cairo',
    description: isArabic
      ? 'تعرف على إلريدا للدعاية والإعلان، الوكالة الإبداعية والتقنية المتكاملة في القاهرة...'
      : 'elReda Advertising is a full-service creative and technology agency in Cairo, Egypt...',
    alternates: {
      canonical: isArabic ? 'https://elreda.com/about' : 'https://elreda.com/en/about',
      languages: {
        'ar-EG': 'https://elreda.com/about',
        'en': 'https://elreda.com/en/about',
      },
    },
    openGraph: {
      title: isArabic ? 'عن إلريدا للدعاية والإعلان' : 'About elReda Advertising',
      description: '...',
      url: isArabic ? 'https://elreda.com/about' : 'https://elreda.com/en/about',
      locale: isArabic ? 'ar_EG' : 'en_US',
      alternateLocale: isArabic ? 'en_US' : 'ar_EG',
      type: 'website',
    },
  }
}
```

### Dynamic Pages (from Sanity)

```typescript
// app/[locale]/services/[slug]/page.tsx
export async function generateMetadata({
  params: { locale, slug }
}: Props): Promise<Metadata> {
  const service = await publicClient.fetch(serviceMetaQuery, { slug })
  const { value: title, lang } = getLocalizedValue(service.title, locale)
  const isArabic = locale === 'ar'

  return {
    title: isArabic
      ? `${title} | إلريدا للدعاية والإعلان`
      : `${title} | elReda Advertising`,
    description: isArabic ? service.metaDescription?.ar : service.metaDescription?.en,
    alternates: {
      canonical: isArabic
        ? `https://elreda.com/services/${slug}`
        : `https://elreda.com/en/services/${slug}`,
      languages: {
        'ar-EG': `https://elreda.com/services/${slug}`,
        'en': `https://elreda.com/en/services/${slug}`,
      },
    },
  }
}
```

---

## Hreflang Configuration (FIX-CON-01)

Arabic is the default locale at root. English is at `/en/`. This is the correct configuration:

```html
<!-- On every page — via alternates in generateMetadata() -->
<link rel="alternate" hreflang="ar-EG" href="https://elreda.com/[path]" />
<link rel="alternate" hreflang="en" href="https://elreda.com/en/[path]" />
<link rel="alternate" hreflang="x-default" href="https://elreda.com/[path]" />
```

Next.js generates these automatically from the `alternates.languages` object in `generateMetadata()`.

---

## Open Graph Images (FIX-MISS-04)

Use `opengraph-image.tsx` files — never manual images.

### Root Default Template

```typescript
// app/[locale]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        {/* Logo placeholder — replace with actual SVG */}
        <div style={{ color: '#B03020', fontSize: 24, marginBottom: 32 }}>
          elReda Advertising
        </div>
        <div style={{ color: '#FFFFFF', fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
          {locale === 'ar'
            ? 'وكالة إبداعية وتقنية متكاملة'
            : 'Full-Service Creative Agency'}
        </div>
        <div style={{ color: '#A0A0A0', fontSize: 28, marginTop: 24 }}>
          Cairo, Egypt
        </div>
        {/* Bottom watermark */}
        <div style={{
          position: 'absolute',
          bottom: 48,
          right: 80,
          color: '#666666',
          fontSize: 20,
        }}>
          elreda.com
        </div>
      </div>
    ),
    { ...size }
  )
}
```

### Dynamic OG for Service/Blog/Portfolio Pages

```typescript
// app/[locale]/services/[slug]/opengraph-image.tsx
export default async function OgImage({ params }: Props) {
  const service = await publicClient.fetch(serviceOgQuery, { slug: params.slug })
  const title = params.locale === 'ar' ? service.title.ar : service.title.en

  return new ImageResponse(
    <div style={{ /* same dark template */ }}>
      <div style={{ color: '#B03020' }}>Service</div>
      <div style={{ color: '#FFFFFF' }}>{title}</div>
      <div style={{ color: '#A0A0A0' }}>elreda.com</div>
    </div>
  )
}
```

---

## Structured Data (Schema.org)

All schema goes in `components/common/SchemaMarkup.tsx` and is rendered in `<head>` via `<script type="application/ld+json">`.

### Organization Schema (global — root layout)

```typescript
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "elReda Advertising",
  "url": "https://elreda.com",
  "logo": "https://elreda.com/logo.png",
  "description": "Full-service creative and technology agency in Cairo, Egypt.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cairo",
    "addressCountry": "EG"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Arabic", "English"]
  },
  "sameAs": [
    "https://instagram.com/elreda",
    "https://facebook.com/elreda",
    "https://linkedin.com/company/elreda",
    "https://behance.net/elreda"
  ]
}
```

### FAQ Schema (service pages + blog posts)

```typescript
// Only on pages that actually have FAQ sections
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": service.faq.map((item) => ({
    "@type": "Question",
    "name": item.question[locale],
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer[locale]
    }
  }))
}
```

### BreadcrumbList Schema (all interior pages)

```typescript
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": locale === 'ar' ? "الرئيسية" : "Home",
      "item": locale === 'ar' ? "https://elreda.com" : "https://elreda.com/en"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": locale === 'ar' ? "خدماتنا" : "Services",
      "item": locale === 'ar' ? "https://elreda.com/services" : "https://elreda.com/en/services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": service.title[locale],
      "item": `https://elreda.com${locale === 'en' ? '/en' : ''}/services/${slug}`
    }
  ]
}
```

---

## Sitemap

Use Next.js App Router built-in sitemap:

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { publicClient } from '@/lib/sanity/publicClient'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, portfolio, blog] = await Promise.all([
    publicClient.fetch(allServiceSlugsQuery),
    publicClient.fetch(allPortfolioSlugsQuery),
    publicClient.fetch(allBlogSlugsQuery),
  ])

  const staticRoutes = ['', '/about', '/services', '/portfolio', '/blog', '/contact', '/quote']

  const staticEntries = staticRoutes.flatMap((route) => [
    { url: `https://elreda.com${route}`, changeFrequency: 'monthly', priority: route === '' ? 1.0 : 0.8 },
    { url: `https://elreda.com/en${route}`, changeFrequency: 'monthly', priority: route === '' ? 0.9 : 0.7 },
  ])

  // Dynamic route entries for both locales...

  return [...staticEntries, ...dynamicEntries]
}
```

---

## robots.txt

```
// public/robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /studio/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://elreda.com/sitemap.xml
```

---

## llms.txt (GEO)

The `public/llms.txt` file must be bilingual with Arabic first. See `SEO_GEO_PLAN.md` Section 7 for the full template.

Requirements:
- File encoding: UTF-8
- Arabic section: first (primary market)
- All 9 services listed in both languages
- Contact info in both languages
- Accessible without authentication at `elreda.com/llms.txt`

---

## Title Tag Formula

```
Arabic service page:  [اسم الخدمة] | إلريدا للدعاية والإعلان
English service page: [Service Name] | elReda Advertising
Arabic homepage:      إلريدا للدعاية والإعلان | وكالة إبداعية ورقمية في القاهرة
English homepage:     elReda Advertising | Creative & Digital Agency Cairo
Blog post:            [Post Title] | مدونة إلريدا (AR) / elReda Blog (EN)
```

Character limits:
- Title: 50–65 characters (Google truncates at ~60)
- Meta description: 150–160 characters (include keyword + CTA)

---

## Performance Requirements (Core Web Vitals)

These are SEO requirements, not just performance goals:

| Metric | Target | Why It Matters for SEO |
|---|---|---|
| LCP | < 2.5s | Google ranking factor |
| CLS | < 0.1 | Poor CLS → lower rankings |
| INP | < 200ms | New Core Web Vital (2024) |
| Mobile PageSpeed | 85+ | Mobile-first indexing |
| Desktop PageSpeed | 90+ | Baseline quality signal |

**LCP protection is directly tied to SEO.** The hero H1 being hidden by GSAP does not just hurt UX — it tanks the LCP score and thus organic rankings.

---

## Content SEO Rules

Every service page must answer (per `SEO_GEO_PLAN.md` Section 7):

1. What is this service? (clear definition)
2. Who needs it? (specific target audience)
3. What are the benefits? (measurable outcomes)
4. How does elReda deliver it? (step-by-step process)
5. How much does it cost? (starting from, or consultation)
6. How long does it take? (timeline)
7. What do clients say? (testimonials)
8. FAQ (5–8 questions, Schema.org optimized)

Minimum word count: 800 words per service page, 1200 words per blog post.

---

## Checklist Before Each Page Ships

- [ ] `generateMetadata()` present with unique title and description
- [ ] Canonical URL set correctly for the locale
- [ ] `alternates.languages` present for hreflang
- [ ] OG image rendering (test with: open URL in new incognito tab, check `<meta property="og:image">`)
- [ ] Schema.org markup present and valid (Google Rich Results Test)
- [ ] Breadcrumb navigation visible and matches breadcrumb schema
- [ ] At least 3 internal links to related pages
- [ ] H1 is unique, includes primary keyword, visible on first paint
- [ ] Images have descriptive `alt` text with natural keyword use
- [ ] Page indexed in robots.txt (not accidentally blocked)
