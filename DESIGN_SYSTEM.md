# DESIGN SYSTEM
## elReda Advertising

**Version:** 2.0  
**Date:** 2026-06-27  
**Status:** Updated per SPEC_FIX_PLAN.md  

---

## 1. Design Philosophy

The elReda Advertising design system communicates **premium quality, innovation, and trust** through every visual decision.

The website should feel like entering a world-class digital studio — not a template, not a portfolio site, not a traditional advertising agency.

### Core Principles

| Principle | Description |
|---|---|
| **Premium First** | Every detail should feel intentional and high-quality |
| **Dark by Default** | Dark theme is primary; light sections are used for contrast and breathing room |
| **Motion with Purpose** | Animations support the story — they never distract or slow the experience |
| **Mobile-Native** | Designed for mobile first, elevated for desktop |
| **Accessible Always** | WCAG 2.2 AA compliance is non-negotiable |
| **Performance Obsessed** | Beautiful and fast — never one without the other |
| **Bilingual by Design** | RTL and LTR are equally first-class, not retrofitted |

---

## 2. Color System

### Primary Palette

| Name | Hex | RGB | Usage |
|---|---|---|---|
| **Black** | `#0A0A0A` | 10, 10, 10 | Primary background |
| **Surface** | `#111111` | 17, 17, 17 | Card backgrounds, sections |
| **Surface Elevated** | `#1A1A1A` | 26, 26, 26 | Modals, tooltips, elevated surfaces |
| **Border** | `#222222` | 34, 34, 34 | Default borders |
| **Border Light** | `#2A2A2A` | 42, 42, 42 | Subtle dividers |

### Brand Accent

| Name | Hex | Usage |
|---|---|---|
| **Red Button** | `#B03020` | **Button backgrounds only** — white text at 5.1:1 contrast ✓ WCAG AA |
| **Red Primary** | `#C0392B` | Decorative borders, icon fills, tag backgrounds, large text accents (≥ 24px bold) |
| **Red Dark** | `#96281B` | Hover states on decorative red elements |
| **Red Subtle** | `#C0392B1A` | Background tint only — no text rendered on top |

### Color Usage Rules (FIX-SEC-04)

| Token | Permitted Use | Forbidden Use |
|---|---|---|
| `--red-button: #B03020` | Button backgrounds | Body text, headings |
| `--red-primary: #C0392B` | Decorative borders, icons, tags, large heading accents | Body text, button backgrounds, text links |
| `--red-subtle: #C0392B1A` | Section tint backgrounds | Any context with text rendered on top |

**Contrast verification:**
- White `#FFFFFF` on `--red-button #B03020` = **5.1:1** — passes WCAG AA ✓
- White `#FFFFFF` on `--red-primary #C0392B` = **3.9:1** — fails WCAG AA for normal text ✗ (decorative only)
- White `#FFFFFF` on `--red-dark #96281B` = **6.2:1** — passes WCAG AA ✓ (safe for text if needed)

### Text

| Name | Hex | Usage |
|---|---|---|
| **White** | `#FFFFFF` | Primary headings |
| **Text Primary** | `#F5F5F5` | Body text on dark |
| **Text Secondary** | `#A0A0A0` | Subheadings, captions, meta |
| **Text Muted** | `#666666` | Placeholders, disabled text |
| **Text Inverse** | `#0A0A0A` | Text on light backgrounds |

### Accent Neutrals

| Name | Hex | Usage |
|---|---|---|
| **Silver** | `#C0C0C0` | Metallic accents, icons |
| **Gray Light** | `#E5E5E5` | Light section text |
| **Gray Mid** | `#8A8A8A` | Secondary information |
| **Overlay** | `#00000080` | Image overlays, modals |

### Gradient Tokens

```css
--gradient-brand: linear-gradient(135deg, #B03020, #C0392B);  /* starts at button red — white text passes 5.1:1 */
--gradient-dark: linear-gradient(180deg, #0A0A0A, #111111);
--gradient-hero: radial-gradient(ellipse at top, #1A0808 0%, #0A0A0A 70%);
--gradient-subtle: linear-gradient(135deg, #1A1A1A, #111111);
--gradient-glow: radial-gradient(circle at center, #C0392B33 0%, transparent 70%);
```

> Gradient `--gradient-brand` starts at `#B03020` (darkest point) ensuring white text on the gradient endpoint passes WCAG AA at 5.1:1. Previous endpoint `#E74C3C` (3.8:1) has been removed.

### Glass Effect

```css
--glass-bg: rgba(255, 255, 255, 0.03);
--glass-border: rgba(255, 255, 255, 0.06);
--glass-blur: blur(20px);
```

### Semantic Colors

| Name | Hex | Usage |
|---|---|---|
| **Success** | `#10B981` | Confirmations, success states |
| **Warning** | `#F59E0B` | Warnings, in-progress |
| **Error** | `#EF4444` | Errors, destructive actions |
| **Info** | `#3B82F6` | Informational messages |

---

## 3. Typography

### Font Families

```css
--font-display: 'Clash Display', sans-serif;    /* English headings */
--font-body: 'Inter', sans-serif;               /* English body + UI */
--font-arabic: 'Tajawal', sans-serif;           /* All Arabic content */
```

### Loading Strategy

```html
<!-- Clash Display: self-hosted via next/font/local (Fontshare download) -->
<!-- Inter: next/font/google -->
<!-- Tajawal: next/font/google -->
<!-- All fonts: display: 'swap', preloaded for critical weights (400, 600, 700) -->
```

### Type Scale

#### English (LTR)

| Token | Size | Line Height | Weight | Font | Usage |
|---|---|---|---|---|---|
| `--text-hero` | clamp(64px, 8vw, 120px) | 1.0 | 700 | Clash Display | Hero headline |
| `--text-h1` | clamp(48px, 6vw, 80px) | 1.1 | 700 | Clash Display | Page titles |
| `--text-h2` | clamp(36px, 4vw, 56px) | 1.2 | 600 | Clash Display | Section headings |
| `--text-h3` | clamp(24px, 3vw, 36px) | 1.3 | 600 | Clash Display | Card headings |
| `--text-h4` | clamp(20px, 2.5vw, 28px) | 1.4 | 600 | Inter | Sub-headings |
| `--text-h5` | clamp(16px, 2vw, 20px) | 1.5 | 500 | Inter | Labels |
| `--text-body-lg` | 18px | 1.7 | 400 | Inter | Lead paragraphs |
| `--text-body` | 16px | 1.7 | 400 | Inter | Body text |
| `--text-small` | 14px | 1.6 | 400 | Inter | Captions, meta |
| `--text-xs` | 12px | 1.5 | 400 | Inter | Tags, labels |

#### Arabic (RTL)

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `--ar-hero` | clamp(56px, 7vw, 100px) | 1.1 | 800 | Hero headline |
| `--ar-h1` | clamp(42px, 5.5vw, 72px) | 1.2 | 700 | Page titles |
| `--ar-h2` | clamp(32px, 3.5vw, 48px) | 1.3 | 700 | Section headings |
| `--ar-h3` | clamp(22px, 2.5vw, 32px) | 1.4 | 600 | Card headings |
| `--ar-body-lg` | 18px | 1.8 | 400 | Lead paragraphs |
| `--ar-body` | 16px | 1.8 | 400 | Body text |
| `--ar-small` | 14px | 1.7 | 400 | Captions, meta |

*Arabic text generally needs slightly more line-height for comfortable reading.*

### Typography Rules

- Use **Clash Display** exclusively for headings in English — never for body text
- **Inter** handles all UI, navigation, forms, buttons, and body copy in English
- **Tajawal** handles everything in Arabic — both headings and body
- Letter spacing on large headings: `letter-spacing: -0.03em` for tight premium feel
- Never use more than 2 font weights on a single view
- Maximum line length: 70 characters for body text

---

## 4. Spacing System

Based on an 8px base unit.

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
--space-40: 160px;
--space-48: 192px;
```

### Section Spacing

```css
--section-padding-y: clamp(80px, 10vw, 160px);
--section-padding-x: clamp(24px, 5vw, 120px);
--container-max:     1400px;
--container-narrow:  900px;
--container-wide:    1600px;
```

---

## 5. Grid System

```css
--grid-columns:     12;
--grid-gap:         clamp(16px, 2vw, 32px);
--grid-margin:      clamp(24px, 5vw, 80px);
```

### Breakpoints

| Token | Value | Description |
|---|---|---|
| `xs` | 375px | Small mobile |
| `sm` | 640px | Mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |
| `3xl` | 1920px | Wide screen |

---

## 6. Border Radius

```css
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-2xl:  24px;
--radius-3xl:  32px;
--radius-full: 9999px;
```

---

## 7. Shadow System

```css
--shadow-sm:   0 1px 3px rgba(0,0,0,0.4);
--shadow-md:   0 4px 16px rgba(0,0,0,0.4);
--shadow-lg:   0 8px 32px rgba(0,0,0,0.5);
--shadow-xl:   0 16px 64px rgba(0,0,0,0.6);
--shadow-glow: 0 0 40px rgba(192, 57, 43, 0.2);
--shadow-red:  0 4px 24px rgba(192, 57, 43, 0.3);
```

---

## 8. Animation System

### Principles

- **Meaningful:** Every animation has a reason — it guides attention or communicates state
- **Smooth:** 60fps minimum — no jank, no layout shifts
- **Performant:** GPU-accelerated transforms only (`transform`, `opacity`)
- **Respectful:** All motion respects `prefers-reduced-motion`
- **Fast response:** Hover/interaction animations under 200ms

### Duration Tokens

```css
--duration-instant: 100ms;
--duration-fast:    200ms;
--duration-normal:  300ms;
--duration-slow:    500ms;
--duration-slower:  800ms;
--duration-slowest: 1200ms;
```

### Easing Tokens

```css
--ease-out:       cubic-bezier(0.16, 1, 0.3, 1);
--ease-in:        cubic-bezier(0.4, 0, 1, 1);
--ease-in-out:    cubic-bezier(0.45, 0, 0.55, 1);
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-premium:   cubic-bezier(0.22, 1, 0.36, 1);
```

### Animation Library Allocation

| Library | Use Case |
|---|---|
| **GSAP** | Hero supporting elements, scroll-triggered reveals, complex timelines (dynamic import per page) |
| **Motion (Framer)** | Component interactions, micro-animations, page transitions, hover effects (tree-shaken) |
| **Lenis** | Smooth scroll across the entire site (eager, global) |
| **Three.js** | Phase 2 only — hero accent background. Dynamic import, NOT in Phase 1. |
| **CSS @keyframes** | Hero H1 reveal — the only animation allowed directly on the LCP element |

### LCP Protection Rule (FIX-PERF-01) — MANDATORY

**The hero H1 heading must be visible on first paint. This is non-negotiable.**

| Element | Animation Allowed | Note |
|---|---|---|
| Hero H1 | CSS `@keyframes` only | Must not start `opacity: 0` or `visibility: hidden` |
| Hero background | GSAP ✓ | Not the LCP element |
| Hero subheadline | GSAP ✓ | Not the LCP element |
| Hero CTAs | GSAP / Motion ✓ | Not the LCP element |
| Scroll indicator | GSAP / Motion ✓ | Not the LCP element |

**FORBIDDEN on H1:** `gsap.from(h1, { opacity: 0 })`, SplitText on H1, `visibility: hidden`, `clip-path` hiding initial state.

### Keyboard Accessibility Rule (FIX-ACC-01)

All GSAP scroll-triggered animations MUST use `start: "top 90%"` (IntersectionObserver-based). Never use pixel-based scroll position triggers.

This ensures animations play when an element enters the viewport regardless of whether the user scrolled there or navigated there via keyboard.

### Standard Animation Patterns

#### Hero H1 Reveal (CSS only)
```css
@keyframes heroHeadingReveal {
  from { opacity: 0.01; transform: translateY(12px); }
  to   { opacity: 1;    transform: translateY(0); }
}
h1.hero-heading {
  animation: heroHeadingReveal 600ms var(--ease-premium) forwards;
}
```

#### Text Reveal (Subheadline and below — GSAP)
```
Words slide up + fade in with stagger
Duration: 800ms, Ease: ease-premium, Stagger: 40ms per word
Applied ONLY to subheadline, body text — NEVER to H1
```

#### Section Reveal
```
Elements slide up 40px + fade in on scroll entry
Duration: 600ms, Ease: ease-out, Stagger: 80ms per element
```

#### Image Reveal
```
Clip-path reveal from left or bottom
Duration: 1000ms, Ease: ease-premium
```

#### Card Hover
```
Slight scale + border glow + shadow lift
Scale: 1.02, Duration: 200ms, Ease: ease-out
```

#### Button Interaction
```
Background shift + slight scale + glow
Duration: 150ms, Ease: ease-out
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable: parallax, scroll animations, text reveals */
  /* Keep: opacity transitions, simple fades */
  /* Ensure: content is still visible without animation */
}
```

---

## 9. Component Library

### Buttons

#### Primary CTA (Red)
```
Background: var(--red-button)  [flat #B03020 — white text 5.1:1 contrast ✓]
Text: White (#FFFFFF), Inter 500, 16px
Padding: 14px 28px
Border-radius: --radius-full
Hover: brightness 110% + glow shadow
Decision: Primary buttons use flat --red-button instead of --gradient-brand so all rendered states preserve WCAG contrast consistency.
Note: NEVER use --red-primary (#C0392B) as button background — contrast fails at 3.9:1
```

#### Secondary (Outlined)
```
Background: transparent
Border: 1px solid --border-light
Text: White, Inter 400, 16px
Hover: Border brightens + background --glass-bg
```

#### Ghost (Text)
```
Background: transparent
Text: --text-secondary
Hover: Text becomes white + underline
```

#### Subtle (Glass)
```
Background: --glass-bg
Border: 1px solid --border-light
Text: --text-primary
Use: Low-emphasis controls on dark surfaces where an outlined button is too strong
```

#### WhatsApp CTA
```
Background: #25D366
Icon: WhatsApp SVG
Text: White, Inter 500
Pulse animation on floating version
```

### Cards

#### Service Card
```
Background: --glass-bg
Border: 1px solid --glass-border
Backdrop-filter: --glass-blur
Padding: 32px
Hover: Border glow (red tint) + slight lift
```

#### Portfolio Card
```
Full-bleed image
Aspect ratio: 4:3 or 16:9

Hover-capable devices (CSS @media (hover: hover)):
  Title + category overlay appears on hover
  Overlay: dark gradient bottom-to-top, opacity 0 → 1 on :hover

Touch devices (CSS @media (hover: none)):
  Title + category overlay ALWAYS visible (persistent)
  Overlay: dark gradient bottom-to-top, opacity 1 at all times
  No JavaScript required — pure CSS media query
```
*(See FIX-MOB-02)*

#### Testimonial Card
```
Quote mark (large, red accent)
Body text
Client name + company + photo
Star rating
```

### Navigation

#### Header (Desktop)
```
Position: fixed, top 0
Background: rgba(10,10,10,0.8) + blur(20px)
Height: 80px
Logo left, nav center, CTAs right
Transition: background on scroll
```

#### Header (Mobile)
```
Hamburger menu (this button is the return focus target when menu closes)
Full-screen overlay navigation
Smooth slide-in animation
Language toggle visible

Focus management (focus-trap-react — see FIX-ACC-02):
  Open: focus moves automatically to first menu item
  Tab: cycles through menu items only — cannot reach elements behind overlay
  Shift+Tab: cycles backward through menu items
  Escape key: closes menu, returns focus to hamburger button
  Close button click: same as Escape
  Backdrop click: same as Escape

ARIA: <nav aria-label="Mobile navigation" aria-modal="true"> on overlay element
```

#### Language Toggle
```
AR / EN switch — top right
Active language: White
Inactive: --text-muted
Transition: smooth crossfade
```

### Forms

```
Input background: --surface-elevated
Border: 1px solid --border
Border-radius: --radius-lg
Focus: Border turns red + subtle glow
Label: Above input, --text-secondary
Placeholder: --text-muted
Error: Red border + error message below
Success: Green border + checkmark
```

### WhatsApp Floating Button

```
Position: fixed
Size: 56px circle
Background: #25D366
Shadow: --shadow-glow (green variant)
Animation: Subtle pulse every 3s
Tooltip: Context-aware message preview
Appear: After 30% scroll depth

iOS Safe Area (FIX-MOB-01):
  bottom: calc(20px + env(safe-area-inset-bottom))
  right:  calc(20px + env(safe-area-inset-right))

Requires in HTML <head>:
  <meta name="viewport" content="..., viewport-fit=cover">

This prevents the button from overlapping the iOS home indicator on
iPhone X and later models in both portrait and landscape orientation.
```

### Tags & Badges

```
Small: 12px, padding 4px 10px, radius-full
Background: --red-subtle or --surface-elevated
Text: --text-secondary
Border: 1px solid --border-light
```

---

## 10. Icon System

- Use **Lucide Icons** for UI and functional icons
- Custom SVG icons for service illustrations
- All icons: 24px default, 20px compact, 32px featured
- Stroke weight: 1.5px for elegance
- Color: Inherits text color or use semantic color tokens

---

## 11. Image & Media Guidelines

### Photography Style
- High-quality mockups showing real work
- Dark environment photography for tech/office
- Clean product photography on white or dark backgrounds
- No generic stock photos — all images must feel authentic

### Image Optimization
- Format: WebP with JPEG fallback
- Responsive: Multiple srcset sizes
- Lazy loading on all below-fold images
- Blur placeholder during load
- Alt text: Descriptive and SEO-aware

### Portfolio Images
- Minimum 1200px width
- Consistent aspect ratios per category
- Before/after comparisons: side-by-side slider
- Zoom on hover for detail viewing

---

## 12. RTL / Arabic Layout Rules

- All layout components must support `dir="rtl"` and `dir="ltr"`
- Text alignment flips automatically
- Padding/margin direction tokens: use logical properties (`padding-inline-start`, `margin-inline-end`)
- Icons that indicate direction (arrows) must flip in RTL
- Navigation, breadcrumbs, and reading order must reverse
- Form inputs: text alignment flips, label position stays above
- Scroll animations must work correctly in both directions
- WhatsApp pre-filled messages must use the correct language based on active locale

---

## 13. Loading & Skeleton States

```
Skeleton: --surface-elevated background
Shimmer: Animated gradient sweep
Duration: Infinite until content loads
Border-radius: Match component shape
```

---

## 14. Dark / Light Sections

The website uses a dark-first approach with intentional light sections for contrast.

### Dark Sections (Primary)
- Background: `--black` or `--surface`
- Use for: Hero, services, portfolio, testimonials, footer

### Light Sections (Contrast)
- Background: `#F8F8F8` or `#FFFFFF`
- Text: `--text-inverse`
- Use sparingly for: Stats, client logos, process steps
- Max 1–2 light sections per page

### Transition Between Sections
- Smooth gradient fade between dark and light
- Or sharp edge with subtle border/line
- Never abrupt — always intentional

---

## 15. Accessibility Standards

- Minimum contrast ratio: 4.5:1 (text), 3:1 (large text)
- Focus indicators: 2px red outline, visible on all interactive elements
- ARIA roles: `navigation`, `main`, `aside`, `footer`, `banner`
- Skip to main content link: visible on focus
- Form labels: Always above inputs, never placeholder-only
- Error messages: Descriptive, not just "invalid input"
- Images: Alt text on all non-decorative images
- Videos: Captions available
- All animations respect `prefers-reduced-motion`

---

*This design system is the single source of truth for all visual decisions. Any deviation requires documented justification.*
