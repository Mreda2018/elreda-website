# Frontend Component Rules — elReda Advertising

## Design System Reference

All visual decisions come from `DESIGN_SYSTEM.md`. This file defines implementation patterns.

---

## Component Structure

### File Template

```tsx
// 1. Imports (React → Next.js → External → Internal → Types)
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { Service } from '@/lib/sanity/types'

// 2. TypeScript interface for props
interface ServiceCardProps {
  service: Service
  className?: string
}

// 3. Component — default export, named function
export default function ServiceCard({ service, className }: ServiceCardProps) {
  const t = useTranslations('services')

  return (
    <article className={cn('group relative', className)}>
      {/* JSX */}
    </article>
  )
}
```

### Component Boundaries

```
components/layout/       — Header, Footer, Navigation, MobileMenu (used on every page)
components/sections/     — Full-page sections (Hero, ServicesGrid, CTASection)
components/common/       — Reusable atoms (WhatsAppButton, SanityImage, SkipNavigation)
components/forms/        — Form components (QuoteForm, ContactForm)
components/portfolio/    — Portfolio-specific components
components/blog/         — Blog-specific components
components/ui/           — shadcn/ui base components (never modify these directly)
```

---

## Tailwind CSS Rules

### Use Design Tokens

```tsx
// Correct — uses design system token
<button className="bg-[color:var(--red-button)] text-white">

// Correct — Tailwind custom token
<div className="bg-surface text-primary">

// Wrong — hardcoded value
<button style={{ backgroundColor: '#B03020' }}>

// Wrong — hardcoded Tailwind arbitrary
<div className="bg-[#111111]">  // use var(--surface) instead
```

### Class Organization

Order Tailwind classes in this sequence:
```
Layout      → flex, grid, block, position, z-index
Box model   → width, height, margin, padding
Typography  → font, text, leading, tracking
Visual      → bg, border, shadow, opacity
Interactive → hover:, focus:, active:
Responsive  → md:, lg:, xl:
Motion      → transition, duration, ease, animate
RTL         → rtl:, ltr: (use logical properties instead where possible)
```

```tsx
// Example of correct class ordering:
<div className="
  relative flex items-center justify-between
  w-full max-w-screen-xl mx-auto px-6
  text-sm font-medium text-white
  bg-surface/80 border-b border-border
  hover:border-white/20
  transition-colors duration-300
  rtl:flex-row-reverse
">
```

### Logical Properties for RTL

```tsx
// Correct — works in both LTR and RTL
<div className="ps-6 pe-4 ms-auto">   // ps = padding-start, pe = padding-end

// Wrong — hardcoded direction
<div className="pl-6 pr-4 ml-auto">   // breaks in RTL
```

---

## Typography Rules

```tsx
// English headings: Clash Display via --font-display
<h1 className="font-display text-hero text-white">

// English body: Inter via --font-body
<p className="font-body text-body text-text-primary">

// Arabic text: Tajawal via --font-arabic (applied automatically via [lang=ar])
// The root <html lang="ar"> applies font-arabic globally for Arabic locale
// For mixed-content pages, use lang attribute on specific elements:
<span lang="ar" className="font-arabic">عبارة عربية</span>

// Heading hierarchy — one H1 per page, strictly
// H1: Page title (only one)
// H2: Section headings
// H3: Card headings
// H4: Sub-sections
// Never skip levels (H1 → H3)
```

---

## Animation Rules

### LCP Protection (CRITICAL)

```tsx
// FORBIDDEN on hero H1:
gsap.from(heroH1Ref.current, { opacity: 0, y: 40 })  // ← NEVER

// CORRECT for hero H1 — CSS only:
// globals.css:
// @keyframes heroReveal { from { opacity: 0.01; transform: translateY(12px); } }
// .hero-heading { animation: heroReveal 600ms var(--ease-premium) forwards; }

<h1 className="hero-heading text-hero font-display text-white">
  {headline}
</h1>

// GSAP is fine on everything else:
useEffect(() => {
  if (prefersReducedMotion) return
  gsap.from(subheadlineRef.current, { opacity: 0, y: 20, duration: 0.8 })
  gsap.from(ctaRef.current, { opacity: 0, y: 20, duration: 0.6, delay: 0.3 })
}, [])
```

### Scroll Animations

```tsx
// Always use start: "top 90%" — IntersectionObserver based, keyboard accessible
gsap.from(cardRef.current, {
  opacity: 0,
  y: 40,
  duration: 0.6,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: cardRef.current,
    start: 'top 90%',  // ← required for keyboard accessibility
  }
})

// Never use:
scrollTrigger: { start: '+=300px' }  // pixel-based, breaks keyboard navigation
```

### Reduced Motion

```tsx
// Check before any animation
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!prefersReducedMotion) {
  // GSAP animations
}
```

### Dynamic Import for GSAP

```tsx
// GSAP must always be dynamically imported — never at module level
'use client'
import { useEffect, useRef } from 'react'

export function AnimatedSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      // ...
    }
    init()
  }, [])
}
```

---

## Accessibility Rules

### Interactive Elements

```tsx
// All buttons must have accessible names
<button aria-label="Close menu">
  <XIcon size={24} />  {/* icon-only button needs aria-label */}
</button>

// Links with only icons
<a href="/contact" aria-label="Contact us via WhatsApp">
  <WhatsAppIcon />
</a>

// Never use div or span as buttons
// Wrong:
<div onClick={handleClick}>Click me</div>

// Correct:
<button onClick={handleClick}>Click me</button>
```

### Focus Management

```tsx
// Focus indicator: red 2px outline (from DESIGN_SYSTEM.md)
// globals.css:
// :focus-visible { outline: 2px solid var(--red-button); outline-offset: 2px; }

// Mobile menu: use focus-trap-react
import FocusTrap from 'focus-trap-react'

<FocusTrap
  active={isMenuOpen}
  focusTrapOptions={{ returnFocusOnDeactivate: true }}
>
  <nav aria-label="Mobile navigation" aria-modal="true">
    {/* menu items */}
  </nav>
</FocusTrap>
```

### Forms

```tsx
// Always label above input — never placeholder-only
<div>
  <label htmlFor="email" className="text-sm text-text-secondary mb-1 block">
    {t('forms.email')}
  </label>
  <input
    id="email"
    type="email"
    name="email"
    autoComplete="email"
    placeholder={t('forms.emailPlaceholder')}
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <p id="email-error" role="alert" className="text-sm text-error mt-1">
      {errors.email}
    </p>
  )}
</div>
```

---

## RTL / Arabic Rules

```tsx
// Root layout applies direction
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>

// Direction-sensitive icons must flip
<ChevronRight
  className={cn('w-4 h-4', locale === 'ar' && 'rotate-180')}
/>

// Or use RTL-aware classes:
<ChevronRight className="w-4 h-4 rtl:rotate-180" />

// Mixed language content: use lang attribute
const { value, lang } = getLocalizedValue(content, locale)
<p lang={lang}>{value}</p>
```

---

## Portfolio Card — Touch Device Rule

```tsx
// From DESIGN_SYSTEM.md (FIX-MOB-02)
// The overlay is ALWAYS visible on touch devices
// Pure CSS — no JavaScript needed

// globals.css or component styles:
.portfolio-card__overlay {
  opacity: 0;
  transition: opacity 200ms ease;
  background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
}

.portfolio-card:hover .portfolio-card__overlay {
  opacity: 1;
}

@media (hover: none) {
  .portfolio-card__overlay {
    opacity: 1;  /* always visible on touch */
  }
}
```

---

## WhatsApp Button — iOS Safe Area

```tsx
// From DESIGN_SYSTEM.md (FIX-MOB-01)
// Also requires viewport-fit=cover in HTML head

<button
  aria-label="Chat with us on WhatsApp"
  className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg"
  style={{
    bottom: 'calc(20px + env(safe-area-inset-bottom))',
    right: 'calc(20px + env(safe-area-inset-right))',
  }}
>
  <WhatsAppIcon />
</button>
```

---

## Images

```tsx
// Always use SanityImage for Sanity content
import { SanityImage } from '@/components/common/SanityImage'

// Always provide sizes for responsive behavior
<SanityImage
  image={post.featuredImage}
  alt={post.title.ar}  // use the correct locale alt text
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 800px"
  priority={isHeroImage}  // true for above-fold images only
/>

// Non-Sanity images (logo, icons, static assets):
import Image from 'next/image'
<Image src="/logo.svg" alt="elReda Advertising" width={120} height={40} priority />
```

---

## What Never Goes in a Component

- API calls directly in client components
- Sanity fetch calls in client components (use Server Components or pass as props)
- Hardcoded Arabic or English text (use `next-intl`)
- Hardcoded hex values (use CSS variables)
- `console.log` statements
- `any` TypeScript type
- `<img>` for Sanity images
- Direct `opacity: 0` on hero H1
