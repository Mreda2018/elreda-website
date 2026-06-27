# GitHub Copilot Instructions — elReda Advertising

This is a Next.js 15 App Router project with TypeScript, Tailwind CSS v4, Sanity.io CMS, and next-intl for Arabic/English bilingual routing.

## Stack

- **Framework:** Next.js 15 App Router — use Server Components by default
- **Language:** TypeScript — no `any` types
- **Styling:** Tailwind CSS v4 + CSS variables for design tokens
- **CMS:** Sanity.io — GROQ queries, two clients (public + preview)
- **i18n:** next-intl — Arabic default at root, English at `/en/`
- **Forms:** Server Actions only — no API routes for user-submitted forms
- **Uploads:** Uploadthing — never write to Vercel filesystem
- **Email:** Resend
- **Database:** Supabase — form submission persistence
- **Auth (forms):** Cloudflare Turnstile + honeypot + Upstash rate limiting

## Critical Rules

### Always

- Default locale is `ar` (Arabic at root `/`), English at `/en/`
- Use `"use server"` for all form submissions — never `app/api/*/route.ts` for forms
- Save to Supabase BEFORE sending Resend email in every Server Action
- Use `publicClient` for all data fetching in pages (no token)
- Use `previewClient` only for Sanity draft preview (has `import 'server-only'`)
- All Sanity images use `<SanityImage>` (wraps Next.js `<Image>` via `@sanity/image-url`)
- Bundle budget: initial JS ≤ 150KB gzipped — GSAP/Three.js are dynamic imports only

### Never

- `opacity: 0` or `visibility: hidden` on hero H1 — it is the LCP element
- `--red-primary` (`#C0392B`) as button background — use `--red-button` (`#B03020`) (WCAG AA)
- `<img>` tags for Sanity content — always `<SanityImage>`
- Hardcoded text — always use `next-intl` translation keys
- `any` type in TypeScript
- `console.log` in production code
- Secrets in `NEXT_PUBLIC_*` variables or client components
- Form API routes — use Server Actions
- Import `previewClient` in client components (it has `import 'server-only'`)
- GSAP SplitText (no commercial license) — use CSS clip-path instead
- Three.js in Phase 1 — Phase 2 only, dynamic import

## Component Patterns

```tsx
// Server Component (default)
export default async function ServicePage({ params }: Props) {
  const data = await publicClient.fetch(query, params)
  return <div>{data.title.ar}</div>
}

// Client Component (only when needed)
'use client'
export function AnimatedCard() {
  const [active, setActive] = useState(false)
  return <div onClick={() => setActive(!active)} />
}

// Server Action
'use server'
export async function submitForm(formData: FormData) {
  // 1. Zod validate
  // 2. Turnstile verify
  // 3. Rate limit
  // 4. Supabase insert FIRST
  // 5. Resend email
  return { success: true }
}
```

## Tailwind — Design Tokens

```tsx
// Use CSS variable tokens from DESIGN_SYSTEM.md
// Backgrounds:   bg-black, bg-surface, bg-surface-elevated
// Text:          text-white, text-text-primary, text-text-secondary
// Borders:       border-border, border-border-light
// Buttons:       bg-[--red-button] (never bg-[--red-primary])
// Gradients:     bg-gradient-brand

// RTL — use logical properties
// padding-inline-start instead of padding-left
// Tailwind: ps-6 pe-4 ms-auto (not pl-6 pr-4 ml-auto)
```

## i18n

```typescript
// Translation in Server Components:
const t = await getTranslations({ locale, namespace: 'common' })

// Translation in Client Components:
const t = useTranslations('forms')

// Fallback for missing Arabic Sanity content:
const { value, lang } = getLocalizedValue(field, locale)
return <span lang={lang}>{value}</span>
```

## Animation — LCP Rule

```tsx
// FORBIDDEN: GSAP on hero H1
gsap.from(h1, { opacity: 0 })  // ← NEVER

// CORRECT: CSS @keyframes for H1 (visible immediately)
// In CSS: @keyframes heroReveal { from { opacity: 0.01 } to { opacity: 1 } }
<h1 className="hero-heading">...</h1>

// GSAP allowed on: background, subheadline, CTAs (not LCP element)
// Always: scrollTrigger.start: "top 90%" for keyboard accessibility
// Always: check prefers-reduced-motion before animating
// Always: dynamic import GSAP — never at module level
```

## File Naming

```
Pages/layouts:    lowercase     page.tsx, layout.tsx
Components:       PascalCase    ServiceCard.tsx, MobileMenu.tsx
Utilities:        camelCase     getLocalizedValue.ts
Server Actions:   camelCase     app/actions/quote.ts
GROQ queries:     camelCase     serviceQuery, allServiceSlugsQuery
Types:            PascalCase    Service, BlogPost, PortfolioProject
```

## Key Files to Know

| File | Purpose |
|---|---|
| `DESIGN_SYSTEM.md` | Color tokens, typography, animation rules |
| `DEVELOPMENT_ROADMAP.md` | Tech stack, file structure, security rules |
| `SPEC_FIX_PLAN.md` | 28 resolved architecture decisions |
| `TASKS.md` | Implementation task queue |
| `.ai/architecture.md` | Architecture decisions and patterns |
| `.ai/frontend.md` | Component and CSS rules |
| `.ai/backend.md` | Server Action and API patterns |
| `lib/sanity/publicClient.ts` | Sanity client for pages |
| `lib/sanity/previewClient.ts` | Sanity client for preview (server-only) |
| `components/common/SanityImage.tsx` | Image component for all Sanity images |
| `lib/i18n/getLocalizedValue.ts` | Arabic/English fallback utility |
