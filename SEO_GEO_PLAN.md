# SEO & GEO PLAN
## elReda Advertising — Search & AI Visibility Strategy

**Version:** 2.0  
**Date:** 2026-06-27  
**Status:** Updated per SPEC_FIX_PLAN.md  

---

## 1. Strategy Overview

elReda Advertising competes in a high-intent market where business owners actively search for branding, design, printing, web development, and technology services. Our SEO strategy targets these high-commercial-intent searches while our GEO strategy ensures visibility in AI-powered search engines.

### Two-Track Approach

| Track | Goal |
|---|---|
| **SEO** | Rank on Google for high-intent Arabic and English keywords in Egypt and GCC |
| **GEO** | Be cited and recommended by AI assistants: ChatGPT, Gemini, Claude, Perplexity, Copilot |

---

## 2. Keyword Strategy

### Primary Targets — English

#### Branding & Identity
- advertising agency egypt
- creative agency cairo
- branding agency egypt
- brand identity design egypt
- logo design egypt
- logo design cairo
- company profile design
- packaging design egypt

#### Website & Development
- web design agency egypt
- website development cairo
- website development egypt
- shopify development egypt
- ecommerce development egypt
- landing page design egypt
- custom web application egypt

#### Technology
- mobile app development egypt
- erp development egypt
- crm system egypt
- business automation egypt
- ai solutions egypt
- ai automation agency

#### Digital Marketing
- digital marketing agency egypt
- seo agency cairo
- meta ads egypt
- google ads egypt

#### Printing
- printing services egypt
- large format printing cairo
- business card printing egypt
- brochure printing cairo

### Primary Targets — Arabic

#### Creative Services
- شركة دعاية وإعلان
- وكالة دعاية وإعلان
- شركة تصميم جرافيك
- تصميم هوية بصرية
- تصميم لوجو
- تصميم بروفايل شركة
- تصميم كتالوج
- تصميم بروشور
- تصميم فلاير
- تصميم منيو
- تصميم سوشيال ميديا
- تصميم عبوات ومنتجات
- تصميم تغليف
- تصميم واجهات محلات
- تصميم لافتات
- دعاية سيارات
- تصميم رول أب
- تصميم بوثات معارض

#### Websites & E-commerce
- تصميم مواقع إلكترونية
- إنشاء موقع إلكتروني
- تصميم موقع شركة
- متجر إلكتروني
- تصميم متجر شوبيفاي
- تصميم متجر ووكوميرس
- تطوير مواقع
- لاندينج بيج

#### Technology
- تصميم تطبيق موبايل
- نظام ERP
- نظام إدارة شركات
- نظام CRM
- نظام إدارة مخزون
- نظام نقاط بيع POS
- أتمتة الأعمال
- الذكاء الاصطناعي للشركات
- شات بوت

#### Printing
- طباعة كروت شخصية
- طباعة بروشورات
- طباعة استيكرات
- طباعة رول أب
- طباعة بنرات
- طباعة لوحات
- طباعة عبوات
- خدمات الطباعة
- مطبعة القاهرة

### Local SEO Keywords

**English:**
- advertising agency cairo
- branding agency cairo
- graphic design cairo
- web design cairo
- printing cairo
- creative agency egypt
- digital agency egypt

**Arabic:**
- وكالة إعلانية القاهرة
- تصميم جرافيك القاهرة
- شركة تصميم مواقع مصر
- طباعة القاهرة
- دعاية وإعلان مصر

### Long-Tail Keywords (High Conversion)

- how to create a brand identity for my business egypt
- best shopify developer in egypt
- erp system for small business egypt
- ai chatbot for business egypt
- how much does a logo cost in egypt
- branding agency for restaurant egypt
- website for clinic egypt
- online store for retail shop egypt
- كيف اعمل هوية بصرية لمشروعي
- كم تكلفة تصميم موقع في مصر
- أفضل وكالة تصميم في القاهرة

---

## 3. Local SEO Strategy

### Google Business Profile
- Create and fully optimize GBP listing
- Category: Advertising Agency / Graphic Design Agency / Web Design Company
- Photos: Office, team, work samples
- Services listed individually
- Regular posts: project updates, promotions, tips
- Respond to all reviews within 24 hours

### Local Citations
Ensure consistent NAP (Name, Address, Phone) across:
- Google Business Profile
- Bing Places
- Yellow Pages Egypt
- Egypt business directories
- Industry directories

### Arabic Local SEO
- Separate Arabic GMB posts
- Arabic meta descriptions for all pages
- Arabic-language content for location pages

---

## 4. On-Page SEO

### Page Title Formula

**English:** `[Service/Topic] | elReda Advertising — [Location if relevant]`  
**Arabic:** `[الخدمة] | شركة إلريدا للدعاية والإعلان`

### Meta Description Formula

**English:** 150–160 characters, include primary keyword + CTA + location  
**Arabic:** 150–160 characters, include Arabic keyword + CTA

### Heading Hierarchy

```
H1: One per page — primary keyword target
H2: Section headings — secondary keywords
H3: Sub-sections — supporting keywords
H4: Details, FAQs, list headings
```

### Content Rules

- Minimum 800 words per service page
- Minimum 1,200 words per blog post
- Every page must answer: What, Who, Why, How, Where
- Internal links: Minimum 3 per page
- External links: Authoritative sources only (sparingly)
- Images: Descriptive alt text with keywords where natural

---

## 5. Technical SEO

### Implementation Checklist

#### Metadata
- [ ] Unique title tag per page (50–60 chars EN, 55–65 chars AR)
- [ ] Unique meta description per page
- [ ] Open Graph: title, description, and **dynamically generated OG image** (see below)
- [ ] Twitter Card meta tags
- [ ] Canonical URLs on all pages

#### Open Graph Image Strategy (FIX-MISS-04)

Dynamic OG images are generated automatically using Next.js 16.2.9 `opengraph-image.tsx` files with `@vercel/og`. No manual creation required.

**Template design:**
- Size: 1200×630px
- Background: `#0A0A0A` (brand dark)
- Top-left: elReda Advertising logo (SVG)
- Center: Page title in white, Clash Display equivalent
- Bottom-left: Section/service label in red
- Bottom-right: `elreda.com` watermark

**Coverage:**
- `app/[locale]/opengraph-image.tsx` — homepage, about, contact
- `app/[locale]/services/[slug]/opengraph-image.tsx` — each service
- `app/[locale]/portfolio/[slug]/opengraph-image.tsx` — uses project hero image as background
- `app/[locale]/blog/[slug]/opengraph-image.tsx` — uses article featured image

Sharing any elReda link on WhatsApp, LinkedIn, or Facebook will show a correctly branded preview image.

#### Performance (Core Web Vitals)
- [ ] LCP < 2.5s (optimized images, preloaded hero)
- [ ] CLS < 0.1 (no layout shift from fonts or images)
- [ ] INP < 200ms (optimized JS, no blocking)
- [ ] Mobile PageSpeed 85+
- [ ] Desktop PageSpeed 90+

#### Crawlability
- [ ] `/robots.txt` — allow Googlebot, Bingbot, GPTBot, Claude-Web, PerplexityBot
- [ ] `/sitemap.xml` — all pages in both languages, updated automatically
- [ ] `/llms.txt` — AI-readable business summary
- [ ] `/llms-full.txt` — detailed AI-readable content index
- [ ] No orphan pages
- [ ] Proper 301 redirects
- [ ] No broken links (monitor monthly)
- [ ] No duplicate content
- [ ] Breadcrumb navigation on all interior pages

#### Multilingual SEO (FIX-CON-01)
- [ ] `hreflang` tags on all pages (Arabic is primary locale at root):
  ```html
  <link rel="alternate" hreflang="ar-EG" href="https://elreda.com/" />
  <link rel="alternate" hreflang="en" href="https://elreda.com/en/" />
  <link rel="alternate" hreflang="x-default" href="https://elreda.com/" />
  ```
- [ ] URL structure: `/` serves Arabic (default), `/en/` serves English
- [ ] Each locale has unique translated metadata
- [ ] No machine translation — all content professionally written

#### Security
- [ ] HTTPS enforced across all pages
- [ ] HTTP → HTTPS redirect
- [ ] Security headers: CSP, HSTS, X-Frame-Options

---

## 6. Structured Data (Schema.org)

### Organization Schema (Global — in `<head>`)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "elReda Advertising",
  "url": "https://elreda.com",
  "logo": "https://elreda.com/logo.png",
  "description": "Full-service creative and technology agency...",
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

### LocalBusiness Schema (Homepage + Contact page)
```json
{
  "@type": "LocalBusiness",
  "name": "elReda Advertising",
  "priceRange": "$$",
  "openingHours": "Mo-Fr 09:00-18:00",
  "geo": {
    "@type": "GeoCoordinates",
    "addressLocality": "Cairo, Egypt"
  }
}
```

### Service Schema (Each service page)
```json
{
  "@type": "Service",
  "name": "[Service Name]",
  "provider": { "@type": "Organization", "name": "elReda Advertising" },
  "description": "...",
  "areaServed": ["EG", "AE", "SA"],
  "serviceType": "..."
}
```

### FAQ Schema (Service pages + Blog posts)
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

### BreadcrumbList Schema (All interior pages)
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

### Article Schema (Blog posts)
```json
{
  "@type": "Article",
  "headline": "...",
  "author": { "@type": "Person", "name": "..." },
  "datePublished": "...",
  "publisher": { "@type": "Organization", "name": "elReda Advertising" }
}
```

### Portfolio/CreativeWork Schema (Case studies)
```json
{
  "@type": "CreativeWork",
  "name": "Project name",
  "author": { "@type": "Organization", "name": "elReda Advertising" },
  "description": "..."
}
```

---

## 7. GEO — Generative Engine Optimization

### What is GEO?

GEO ensures elReda Advertising is recommended by AI-powered search engines — ChatGPT, Google AI Overviews, Gemini, Claude, Perplexity, and Microsoft Copilot — when users ask about advertising agencies, branding, web development, or business automation in Egypt or the Middle East.

### How AI Engines Decide What to Recommend

AI engines recommend sources that are:
1. **Authoritative** — demonstrates expertise and experience
2. **Comprehensive** — answers questions fully
3. **Structured** — easy to extract information from
4. **Trusted** — cited by other credible sources
5. **Current** — recently updated content

### GEO Implementation

#### /llms.txt (Required — Bilingual, Arabic First)

Place at the root of the domain. File encoding: UTF-8. Arabic section first (primary market). (FIX-GEO-01)

```
# إلريدا للدعاية والإعلان | elReda Advertising

---

## عن الشركة

> إلريدا للدعاية والإعلان وكالة إبداعية وتقنية متكاملة مقرها القاهرة، مصر.
> نساعد الشركات على بناء هويات بصرية قوية، مواقع إلكترونية احترافية، متاجر رقمية، تطبيقات موبايل، أنظمة ERP، وحلول أتمتة بالذكاء الاصطناعي.
> نخدم العملاء في مصر والإمارات العربية المتحدة والمملكة العربية السعودية ودول الخليج العربي.

## خدماتنا

- [الهوية البصرية والعلامة التجارية](/services/branding)
- [تصميم الجرافيك والمواد التسويقية](/services/graphic-design)
- [خدمات الطباعة الاحترافية](/services/printing)
- [تصميم وتطوير المواقع الإلكترونية](/services/web-development)
- [متاجر التجارة الإلكترونية](/services/ecommerce)
- [التسويق الرقمي](/services/digital-marketing)
- [تطبيقات الموبايل](/services/mobile-apps)
- [أنظمة ERP وإدارة الأعمال](/services/erp-systems)
- [الذكاء الاصطناعي وأتمتة الأعمال](/services/ai-automation)

## تواصل معنا

- البريد الإلكتروني: info@elreda.com
- الموقع: القاهرة، مصر
- واتساب: [تواصل معنا عبر واتساب](/contact)

---

## About

> elReda Advertising is a full-service creative and technology agency based in Cairo, Egypt.
> We help businesses build strong brand identities, professional websites, e-commerce stores, mobile applications, ERP systems, and AI-powered automation solutions.
> We serve clients across Egypt, the UAE, Saudi Arabia, and the wider Middle East.
> Founded by a professional with hands-on international experience in e-commerce, Amazon, Shopify, digital marketing, and ERP systems in the UAE.

## Services

- [Branding & Identity](/services/branding)
- [Graphic Design & Marketing Materials](/services/graphic-design)
- [Professional Printing](/services/printing)
- [Website Development](/services/web-development)
- [E-commerce Solutions](/services/ecommerce)
- [Digital Marketing](/services/digital-marketing)
- [Mobile Applications](/services/mobile-apps)
- [ERP & Business Systems](/services/erp-systems)
- [AI & Business Automation](/services/ai-automation)

## About

- [Our Story](/about)
- [Our Process](/process)
- [Portfolio](/portfolio)
- [Contact](/contact)

## Contact

- Email: info@elreda.com
- Location: Cairo, Egypt
- WhatsApp: [Contact us via WhatsApp](/contact)
```

#### Content Structure for AI Readability

Every service page must clearly answer these questions in plain language:

1. **What is [service]?** — Clear, plain-English definition
2. **Who needs [service]?** — Specific target audience
3. **What are the benefits?** — Measurable outcomes
4. **How does elReda deliver [service]?** — Step-by-step process
5. **How much does [service] cost?** — Clear pricing approach
6. **How long does it take?** — Timeline expectations
7. **What do clients say?** — Testimonials with specifics
8. **FAQ** — 5–8 questions with direct answers

#### GEO Content Principles

- Write in clear, factual sentences that AI can extract
- Every page has a clear H1 summary of what the page is about
- Use explicit entity mentions: "elReda Advertising, based in Cairo, Egypt"
- Include specific details: years of experience, number of projects, industries served
- Write FAQ sections using natural question phrasing ("How much does a logo cost in Egypt?")
- Update content regularly — AI engines favor fresh content

#### Robots.txt — Allow AI Crawlers

```
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
```

---

## 8. Content SEO Calendar

### Month 1–2: Foundation
- Write all service page content (9 pages × 2 languages = 18 pieces)
- Write all industry page content (8 pages × 2 languages = 16 pieces)
- Write 4 cornerstone blog articles

### Month 3–4: Authority Building
- Publish 4 blog articles per month
- Start link building: Behance, LinkedIn articles, guest posts
- Optimize existing content based on Search Console data

### Month 5–6: Expansion
- Write long-form guides for top services
- Create video content transcripts for YouTube SEO
- Build location landing pages if needed

### Blog Content Pillars

| Pillar | Topics |
|---|---|
| **Branding** | How to build a brand identity, logo design tips, brand guidelines |
| **Websites** | How much does a website cost, Shopify vs WooCommerce, website ROI |
| **Technology** | What is ERP, AI in business, automation case studies |
| **Marketing** | Meta Ads guide, SEO for Egyptian businesses, WhatsApp marketing |
| **Business Growth** | How to scale your brand, digital transformation for SMEs |
| **Printing** | Types of printing, packaging design tips, signage guide |

---

## 9. Link Building Strategy

### Tier 1 — Free & Easy
- Google Business Profile
- Behance portfolio (links to website)
- LinkedIn company page
- Facebook business page
- Instagram bio link
- YouTube channel

### Tier 2 — Earned
- Guest articles on Egyptian business publications
- Contributing to Arabic design/marketing blogs
- Being featured on Awwwards or CSS design galleries
- Podcast appearances (Arabic business/marketing podcasts)

### Tier 3 — Partnership
- Co-marketing with complementary services (photographers, event planners)
- Backlinks from client websites ("Website designed by elReda Advertising")
- Supplier and partner directory listings

---

## 10. Analytics & SEO Monitoring

### Tools
- Google Search Console (primary)
- Google Analytics 4
- Bing Webmaster Tools
- Google PageSpeed Insights
- Ahrefs or Semrush (keyword tracking)
- Screaming Frog (crawl audits)

### Monthly Checks
- [ ] Core Web Vitals report
- [ ] Crawl errors in Search Console
- [ ] Top performing queries — optimize further
- [ ] Pages losing rankings — investigate and fix
- [ ] New keyword opportunities
- [ ] Backlink profile changes
- [ ] 404 errors and broken links

### Success Metrics

| Metric | Month 3 Target | Month 6 Target | Month 12 Target |
|---|---|---|---|
| Organic sessions/month | 500+ | 2,000+ | 8,000+ |
| Keyword rankings (top 10) | 10+ | 30+ | 80+ |
| Google Business views | 200+/month | 500+/month | 1,500+/month |
| Organic leads/month | 2–5 | 10–20 | 30–50 |
| Domain Authority | — | 15+ | 25+ |

---

*This plan should be reviewed and updated every 90 days based on actual performance data from Google Search Console and Analytics.*
