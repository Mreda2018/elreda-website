# INFORMATION ARCHITECTURE
## elReda Advertising — Website Structure & Navigation

**Version:** 2.0  
**Date:** 2026-06-27  
**Status:** Updated per SPEC_FIX_PLAN.md  

---

## 1. Sitemap Overview

```
elreda.com
│
├── / (Home)
│
├── /about
│
├── /services
│   ├── /services/branding
│   ├── /services/graphic-design
│   ├── /services/printing
│   ├── /services/web-development
│   ├── /services/ecommerce
│   ├── /services/digital-marketing
│   ├── /services/mobile-apps
│   ├── /services/erp-systems
│   └── /services/ai-automation
│
├── /portfolio
│   ├── /portfolio/[category]
│   └── /portfolio/[project-slug]
│
├── /industries
│   ├── /industries/restaurants
│   ├── /industries/retail
│   ├── /industries/clinics
│   ├── /industries/real-estate
│   ├── /industries/ecommerce
│   ├── /industries/startups
│   ├── /industries/factories
│   └── /industries/corporate
│
├── /pricing
│
├── /blog
│   ├── /blog/[category]
│   └── /blog/[post-slug]
│
├── /contact
├── /quote
├── /consultation
│
├── /process
├── /faq
├── /testimonials
├── /careers
├── /partners
│
├── /privacy-policy
├── /terms
├── /cookies-policy
├── /refund-policy
├── /accessibility
│
└── /404
```

*Each route has an Arabic equivalent: `/ar/...` or via i18n locale prefix.*

---

## 2. Navigation Structure

### Primary Navigation (Desktop)

```
[Logo]         Services  Portfolio  About  Industries  Blog  Pricing       [AR/EN]  [WhatsApp]  [Get a Quote]
```

### Services Mega Menu

When hovering or clicking **Services**, a full mega menu expands:

```
┌─────────────────────────────────────────────────────────────────┐
│  CREATIVE SERVICES        DIGITAL SERVICES      TECHNOLOGY       │
│                                                                   │
│  ● Branding & Identity    ● Website Development  ● Mobile Apps   │
│  ● Graphic Design         ● E-commerce           ● ERP Systems   │
│  ● Professional Printing  ● Digital Marketing    ● AI Automation │
│                                                                   │
│  ─────────────────────────────────────────────────────────────   │
│  ★ View All Services →                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Navigation

- Hamburger → Full-screen overlay
- Services expandable accordion
- Language toggle at top
- WhatsApp CTA pinned at bottom of menu
- "Get a Quote" button prominent

---

## 3. Page-by-Page Structure

---

### HOME PAGE

**Goal:** Communicate who we are, build trust, drive to quote or WhatsApp

```
[1] HERO
    - Full-screen, cinematic
    - Headline: What we do + who for
    - Subheadline: The promise
    - CTA: "Request a Quote" + "See Our Work"
    - Background: Dark, animated (GSAP)

[2] TRUST BAR
    - Client logos (scrolling)
    - Or: Quick stats (Projects completed, Years experience, Industries served)

[3] SERVICES OVERVIEW
    - 9 service cards in grid
    - Each card: Icon, Title, Short description, "Learn more →"
    - Section headline: "Everything your business needs, under one roof"

[4] PORTFOLIO PREVIEW
    - 6–8 featured projects
    - Filterable by category
    - "View Full Portfolio →"

[5] WHY CHOOSE US
    - 4–5 differentiators
    - Icon + headline + short description each
    - Focus on: End-to-end, AI-first, Business outcomes, Long-term

[6] PROCESS OVERVIEW
    - 4–5 step process (horizontal scroll or stepped layout)
    - Discover → Strategy → Design → Build → Launch → Support

[7] INDUSTRIES
    - Industries we serve (grid of icons or cards)
    - "View industry solutions →"

[8] TESTIMONIALS
    - Rotating testimonials
    - Client name, company, photo, quote

[9] BLOG PREVIEW
    - 3 latest articles
    - "Read all articles →"

[10] CTA SECTION
    - Strong closing headline
    - "Ready to build your brand?" or "Start your project today"
    - Primary: "Request a Quote"
    - Secondary: "Chat on WhatsApp"

[11] FOOTER
    - Logo + tagline
    - Navigation columns: Services, Company, Legal
    - Contact details
    - Social media links
    - Language toggle
    - Cookie Preferences link (opens CookieYes consent center)
    - Copyright
```

---

### ABOUT PAGE

**Goal:** Build trust through story, founder credibility, values

```
[1] HERO
    - Headline: Our story / Who we are
    - Short powerful statement

[2] OUR STORY
    - How elReda was founded
    - The problem we saw in the market
    - Why we built a one-stop agency

[3] FOUNDER
    - Photo + name + title
    - Background: UAE experience, e-commerce, tech
    - Short bio + key expertise

[4] VISION & MISSION
    - Two-column: Vision / Mission
    - Clean typographic layout

[5] BRAND VALUES
    - 5 values with icons: Professional, Innovative, Creative, Trustworthy, Results-Driven

[6] TEAM (Future)
    - Team member cards
    - Placeholder if team is growing

[7] BY THE NUMBERS
    - Stats: Projects, Industries, Countries, Years experience

[8] CTA
    - "Work with us" → Contact / Quote
```

---

### SERVICES OVERVIEW PAGE

**Goal:** Show full scope, drive to individual service pages

```
[1] HERO
    - Headline: Our Services
    - Short statement about the full-service approach

[2] SERVICE CATEGORIES (3 tiers)
    - Creative Services
    - Digital Services
    - Technology Services

[3] SERVICE GRID
    - All 9 services as cards
    - Icon, title, description, "Explore →"

[4] HOW IT WORKS TOGETHER
    - Visual diagram: Brand → Web → System → Marketing → Growth
    - Show how services connect

[5] CTA
    - "Not sure where to start?" → Book a free consultation
```

---

### INDIVIDUAL SERVICE PAGES (×9)

**Template for each service:**

```
[1] HERO
    - Service name
    - Value proposition
    - Primary CTA: "Get a Quote"
    - Secondary: WhatsApp CTA (context-aware)

[2] WHAT IS [SERVICE]
    - Clear explanation
    - Who it's for
    - What problem it solves

[3] WHAT WE OFFER
    - Bullet points or feature cards
    - Every deliverable listed

[4] OUR PROCESS
    - Step-by-step for this specific service
    - 4–6 steps

[5] PORTFOLIO PREVIEW
    - 3–4 related portfolio pieces
    - Link to full portfolio filtered by this service

[6] PRICING
    - "Starting from" price if applicable
    - Package overview or "Request custom quote"

[7] WHY ELREDA FOR [SERVICE]
    - 3–4 differentiators specific to this service

[8] FAQ
    - 5–8 questions specific to this service
    - Schema-optimized for rich results

[9] TESTIMONIALS
    - Relevant client testimonials

[10] CTA
    - "Start your [service] project" → Quote form
    - Pre-filled WhatsApp message for this service
```

---

### PORTFOLIO PAGE

**Goal:** Showcase work, build confidence, lead to case studies

```
[1] HERO
    - "Our Work" headline
    - Short statement

[2] FILTER BAR
    - All | Branding | Graphic Design | Packaging | Websites | E-commerce | Mobile Apps | ERP | AI | Printing | Social Media | Vehicle Branding | Signage

[3] PORTFOLIO GRID
    - Masonry or uniform grid
    - Hover: Project name + category overlay
    - Click: Opens case study

[4] LOAD MORE / PAGINATION
    - Smooth load more animation

[5] CTA
    - "Ready to create something great?"
```

---

### PORTFOLIO CASE STUDY PAGE

**Template for each project:**

```
[1] HERO
    - Full-bleed hero image or video
    - Project title + client + year
    - Service category tag

[2] PROJECT OVERVIEW
    - Client industry
    - Services delivered
    - Timeline
    - Technologies used

[3] THE CHALLENGE
    - What problem the client had
    - Why it mattered

[4] OUR APPROACH
    - Strategy and thinking
    - Research or discovery phase

[5] CREATIVE PROCESS
    - Sketches, wireframes, concepts
    - Iteration and refinement

[6] THE SOLUTION
    - Final deliverables
    - Full image gallery
    - Before/After slider (if applicable)

[7] RESULTS
    - Business outcomes when available
    - Metrics, client feedback

[8] CLIENT TESTIMONIAL
    - Quote + name + photo

[9] RELATED PROJECTS
    - 3 similar projects

[10] CTA
    - "Want a similar result?" → WhatsApp or Quote
```

---

### INDUSTRY PAGES (×8)

**Template:**

```
[1] HERO
    - "We work with [Industry]"
    - Challenge this industry faces

[2] UNDERSTANDING YOUR INDUSTRY
    - What makes this industry unique
    - Common problems we solve

[3] OUR SOLUTIONS
    - Relevant services mapped to this industry's needs

[4] PORTFOLIO
    - Projects from this industry

[5] PROCESS
    - How we work with this type of client

[6] TESTIMONIALS
    - From clients in this industry

[7] FAQ
    - Industry-specific questions

[8] CTA
    - "Let's work together"
```

---

### PRICING PAGE

**Goal:** Build confidence, not commoditize — push toward consultation

```
[1] HERO
    - "Transparent Pricing" headline
    - Philosophy statement

[2] SERVICE TIERS
    - Creative Services (starting from)
    - Digital Services (starting from)
    - Technology (custom quote)

[3] POPULAR PACKAGES
    - 3–4 highlighted packages with features listed

[4] CUSTOM PROJECTS
    - Clear explanation of custom quote process
    - Button: "Request a Custom Quote"

[5] RETAINER PLANS
    - Monthly support packages

[6] FAQ
    - Common pricing questions

[7] CTA
    - "Not sure what you need?" → Free consultation
```

---

### BLOG PAGE

**Goal:** SEO, authority, GEO, lead generation

```
[1] HERO
    - "Insights, guides, and resources"

[2] FEATURED POST
    - Large featured article card

[3] CATEGORY FILTER
    - Branding | Design | Web | Tech | AI | Marketing | Printing | Business

[4] ARTICLE GRID
    - Cards with: Image, Category, Title, Summary, Read time, Date

[5] NEWSLETTER SIGNUP (Phase 2)
    - Email capture

[6] SIDEBAR (Desktop)
    - Popular articles
    - Categories
    - Newsletter
```

---

### BLOG POST TEMPLATE

```
[1] HERO
    - Category tag
    - Title (H1)
    - Author + date + read time
    - Featured image

[2] CONTENT
    - Well-structured with H2/H3
    - Internal links to services and related articles
    - Images with captions
    - FAQ section at end (Schema-optimized)

[3] AUTHOR BOX

[4] RELATED ARTICLES

[5] CTA
    - Relevant service offer at end of post
    - "Need help with [topic]?" → WhatsApp or Quote
```

---

### CONTACT PAGE

```
[1] HERO
    - "Let's talk"

[2] CONTACT OPTIONS
    - WhatsApp (primary)
    - Email
    - Phone
    - Map / Location

[3] CONTACT FORM
    - Name, email, phone, service interested in, message
    - File upload (optional)

[4] WORKING HOURS

[5] SOCIAL MEDIA

[6] FAQ STRIP
    - "How quickly do you respond?" etc.
```

---

### QUOTE PAGE (Multi-step Form)

**Goal:** Qualify leads professionally before the first conversation

#### Accessibility Specification (FIX-ACC-04)

```html
<form>
  <!-- Step progress indicator — keyboard and screen reader accessible -->
  <nav aria-label="Form steps">
    <ol>
      <li aria-current="step">Step 1: Service Selection</li>  <!-- active step -->
      <li>Step 2: Project Details</li>
      <li>Step 3: Budget</li>
      <li>Step 4: Contact Details</li>
      <li>Step 5: Confirmation</li>
    </ol>
  </nav>

  <!-- Screen reader announcement — updates on every step change -->
  <div aria-live="polite" aria-atomic="true" class="sr-only">
    Step 2 of 5: Project Details
  </div>

  <!-- Each step wrapped in fieldset with legend -->
  <fieldset>
    <legend>Step 1: What service are you looking for?</legend>
    <!-- Step content -->
  </fieldset>
</form>
```

#### Navigation Behavior

- Each step pushes a URL query parameter: `?step=1`, `?step=2`, `?step=3`, `?step=4`, `?step=5`
- Browser **Back** button returns to previous step (not navigate away from `/quote`)
- Form data persisted to `sessionStorage` keyed per step
- Refreshing page at Step 3 restores Step 3 with saved data
- Focus moves to the step `<legend>` on every step transition

#### Step Content

```
Step 1 — Service Selection    URL: /quote?step=1
    "What service are you looking for?"
    Grid of service options (checkboxes)
    <fieldset><legend>Step 1: Service Selection</legend>

Step 2 — Project Details      URL: /quote?step=2
    Company name
    Industry / Business type
    Project description
    Deadline / Timeline
    <fieldset><legend>Step 2: Project Details</legend>

Step 3 — Budget               URL: /quote?step=3
    Budget range selector
    "I'm not sure" option available
    <fieldset><legend>Step 3: Budget</legend>

Step 4 — Contact Details      URL: /quote?step=4
    Name
    Email
    Phone / WhatsApp
    Preferred contact method
    File upload (optional: brief, logo, etc.) — via Uploadthing
    Cloudflare Turnstile widget
    Hidden honeypot field (aria-hidden, invisible to humans)
    <fieldset><legend>Step 4: Your Contact Details</legend>

Step 5 — Confirmation         URL: /quote?step=5
    Summary of submission
    What happens next (3 steps)
    Expected response time: within 24 hours
    Optional: Add to WhatsApp
```

---

### THANK YOU PAGE

```
[1] Confirmation message
[2] What to expect next (process steps)
[3] Response time: within 24 hours
[4] Option to also message on WhatsApp
[5] While you wait: Link to portfolio, blog, or services
```

---

### CONSULTATION BOOKING PAGE

```
[1] HERO
    - "Book a free 30-minute consultation"

[2] WHAT TO EXPECT
    - What happens in the call
    - No pressure, no obligation

[3] BOOKING FORM / CALENDAR
    - Name, email, phone
    - Preferred date + time
    - What is your main goal?
    - Service of interest
    Integrate with: Calendly, Cal.com, or custom

[4] CONFIRMATION
    - Redirect to Thank You page
```

---

## 4. URL Structure

### English
```
/                              → Home
/about                         → About Us
/services                      → Services Overview
/services/branding             → Branding & Identity
/services/web-development      → Website Development
/portfolio                     → Portfolio
/portfolio/branding            → Portfolio filtered: Branding
/portfolio/[project-slug]      → Case Study
/industries/restaurants        → Restaurants & Cafes
/pricing                       → Pricing
/blog                          → Blog
/blog/branding                 → Blog category
/blog/[post-slug]              → Blog post
/contact                       → Contact
/quote                         → Get a Quote
/consultation                  → Book a Consultation
/process                       → Our Process
/faq                           → FAQ
```

### Arabic
```
/ar/                           → الرئيسية
/ar/about                      → من نحن
/ar/services                   → خدماتنا
/ar/services/branding          → الهوية البصرية
...etc
```

*Next.js i18n routing handles locale detection and switching automatically.*

---

## 5. Internal Linking Strategy

Every page must link to related content:

- Service pages → Related portfolio projects
- Portfolio case studies → Related services + industries
- Blog posts → Relevant service pages + related articles
- Industry pages → Service pages + portfolio projects
- Homepage → All major sections (7+ links)

**Goal:** Every visitor should be able to reach any key page in 2 clicks or fewer.

---

## 6. User Flows

### Flow 1: Lead from Google Search (Service)
```
Google Search → Service Page → Portfolio → Quote Form → Thank You
```

### Flow 2: Lead from Social Media (Portfolio)
```
Instagram → Portfolio → Case Study → Service Page → WhatsApp
```

### Flow 3: Referral / Direct
```
Homepage → Services → Pricing → Consultation Booking
```

### Flow 4: Blog Reader
```
Google Search → Blog Post → Related Service → Quote Form
```

### Flow 5: Industry-Specific
```
Google Search (industry keyword) → Industry Page → Service → WhatsApp
```

---

## 7. CMS Content Types

| Content Type | Fields |
|---|---|
| **Service** | Title, slug, description, features, process, FAQ, related services, SEO meta |
| **Portfolio Project** | Title, slug, client, industry, services, gallery, process, results, testimonial |
| **Blog Post** | Title, slug, author, category, tags, body, SEO meta, featured image |
| **Testimonial** | Client name, company, photo, quote, rating, service, project |
| **Team Member** | Name, position, bio, photo, social links |
| **Industry Page** | Industry name, description, services, portfolio, FAQ, SEO meta |
| **FAQ** | Question, answer, category |
| **Setting** | Contact info, social links, WhatsApp number, working hours |

---

## 8. 404 Page

```
[1] Large "404" typographic treatment
[2] "This page doesn't exist" message
[3] Quick navigation: Home / Services / Portfolio / Contact
[4] WhatsApp link: "Need help? Chat with us"
```

---

*This architecture is the blueprint for all development decisions regarding routing, navigation, and content structure.*
