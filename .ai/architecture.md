# Architecture Rules — elReda Advertising

## Source of Truth

All architecture decisions are documented in:
- `DEVELOPMENT_ROADMAP.md` — tech stack, file structure, rendering strategy
- `SPEC_FIX_PLAN.md` — 28 resolved architecture decisions (do not re-open these)

If a decision is not in these documents, raise it to Claude before implementing.

---

## Next.js App Router Rules

### Server vs Client Components

**Default: Server Component.** Add `"use client"` only when required.

```
"use client" is required when:
  - useState / useEffect / useReducer
  - Event handlers (onClick, onChange, onSubmit)
  - Browser-only APIs (window, document, navigator)
  - Client-side libraries (GSAP, Lenis, Framer Motion with hooks)

"use client" is NOT needed for:
  - Data fetching (use async Server Components)
  - Conditional rendering based on props
  - Static content
  - Sanity content display
```

**Decision tree:**

```
Does this component fetch data from Sanity?
  → Yes: Server Component (async function, no "use client")

Does this component have useState or event handlers?
  → Yes: Client Component ("use client")

Does this component use GSAP or Lenis?
  → Use a client wrapper component, keep the outer shell as a Server Component
```

### Data Fetching

```typescript
// Correct: Fetch in Server Component
// app/[locale]/services/[slug]/page.tsx
export default async function ServicePage({ params }: Props) {
  const service = await publicClient.fetch(serviceQuery, { slug: params.slug })
  // ...
}

// Wrong: Never fetch Sanity data in useEffect
'use client'
export function ServicePage() {
  const [service, setService] = useState(null)
  useEffect(() => {
    fetch('/api/service').then(...)  // ← This pattern is wrong
  }, [])
}
```

### Static Generation

```typescript
// All dynamic routes must export generateStaticParams()
// app/[locale]/services/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = await publicClient.fetch(allServiceSlugsQuery)
  return slugs.flatMap((slug: string) => [
    { locale: 'ar', slug },
    { locale: 'en', slug },
  ])
}
```

---

## File Structure Rules

### Boundaries

```
app/                    — Routes only. No business logic here.
app/actions/            — Server Actions only. No UI code here.
app/api/                — Only: revalidate, uploadthing, health. Never add form routes.
components/             — UI components. No direct Sanity fetches.
lib/                    — Business logic, utilities, external service clients.
sanity/                 — Sanity Studio schemas only.
tests/                  — Playwright test files only.
```

### Naming

```
Pages (App Router):     lowercase — page.tsx, layout.tsx, opengraph-image.tsx
Route groups:           (parentheses) — (auth), (marketing)
Components:             PascalCase — QuoteForm.tsx, ServiceCard.tsx
Hooks:                  camelCase with "use" prefix — useScrollDepth.ts
Utilities:              camelCase — getLocalizedValue.ts
Sanity queries:         camelCase — serviceQuery, allPortfolioSlugsQuery
Types:                  PascalCase — Service, PortfolioProject, BlogPost
```

---

## Sanity Architecture

### Two Clients — Never Mix

```typescript
// publicClient.ts — for all public pages
// No token, useCdn: true, safe everywhere
import { publicClient } from '@/lib/sanity/publicClient'
const data = await publicClient.fetch(query)

// previewClient.ts — for draft preview only
// Has import 'server-only' — cannot be imported in client components
// Only used in preview route handlers
import { previewClient } from '@/lib/sanity/previewClient'
```

### GROQ Queries

```typescript
// All queries live in lib/sanity/queries.ts
// Projection fields explicitly listed — never use * (fetch everything)

// Correct:
export const serviceQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    title,
    description,
    features,
    "slug": slug.current
  }
`

// Wrong — over-fetches:
const data = await client.fetch(`*[_type == "service"]`)
```

---

## Server Actions Architecture

### Form Submission Flow (Strict Order)

```typescript
// app/actions/quote.ts
"use server"

export async function submitQuote(formData: FormData) {
  // 1. Validate with Zod — reject invalid data
  const validated = QuoteSchema.safeParse(Object.fromEntries(formData))
  if (!validated.success) return { error: 'Invalid data' }

  // 2. Verify Turnstile — reject bots
  const turnstileToken = formData.get('cf-turnstile-response')
  const isHuman = await verifyTurnstile(turnstileToken as string)
  if (!isHuman) return { error: 'Bot detected' }

  // 3. Rate limit — reject spam
  const { success } = await ratelimit.limit(ip)
  if (!success) return { error: 'Too many requests' }

  // 4. Save to Supabase FIRST — never lose a lead
  const { data: submission } = await supabase
    .from('submissions')
    .insert({ type: 'quote', data: validated.data, locale })
    .select('id')
    .single()

  // 5. Send email via Resend
  let emailSent = false
  let emailError = null
  try {
    await resend.emails.send({ to: 'info@elreda.com', ... })
    emailSent = true
  } catch (err) {
    emailError = String(err)
  }

  // 6. Update Supabase with email result
  await supabase
    .from('submissions')
    .update({ email_sent: emailSent, email_error: emailError })
    .eq('id', submission.id)

  return { success: true }
}
```

### What Is NOT a Server Action

- Sanity ISR webhook receiver — this is `app/api/revalidate/route.ts` (external POST from Sanity)
- Uploadthing handler — this is `app/api/uploadthing/route.ts` (Uploadthing manages its own auth)
- Health check — this is `app/api/health/route.ts`

---

## i18n Architecture

### Locale Routing

```
elreda.com/          → Arabic (default — no prefix)
elreda.com/en/       → English
elreda.com/ar/       → 301 redirect to elreda.com/
```

```typescript
// next.config.ts
locales: ['ar', 'en']
defaultLocale: 'ar'   // Arabic is PRIMARY — do not change this
```

### Translation Keys

```typescript
// Always use namespaced keys — never flat keys
const t = useTranslations('common')    // reads messages/ar/common.json
const t = useTranslations('forms')     // reads messages/ar/forms.json

// Correct:
t('navigation.services')

// Wrong — flat key, breaks tree-shaking:
t('navigationServices')
```

### Translation Fallback

```typescript
// When Arabic content is missing in Sanity:
import { getLocalizedValue } from '@/lib/i18n/getLocalizedValue'

const { value, lang } = getLocalizedValue(service.title, locale)
// lang = 'ar' if Arabic exists, 'en' if falling back
return <h1 lang={lang}>{value}</h1>
```

---

## Security Architecture

### Environment Variables

```
NEXT_PUBLIC_*    — safe to use in client components (never put secrets here)
Non-public vars  — server-only, accessed in Server Actions and API routes only
```

### The Hierarchy of Trust

```
User Input → Zod validation (always)
Bot Request → Turnstile verification (always, on all forms)
Sanity Webhook → HMAC-SHA256 signature (always)
Uploadthing → Manages its own auth
Supabase client-side → Anon key only (no service role key in client)
```

---

## Performance Architecture

### Bundle Budget

Initial JS ≤ 150KB gzipped. Enforced by `@next/bundle-analyzer` before each launch.

### Dynamic Imports

```typescript
// GSAP must always be dynamic imported — never in the module graph
const { gsap } = await import('gsap')
const { ScrollTrigger } = await import('gsap/ScrollTrigger')

// Three.js — Phase 2 only, always dynamic
const THREE = await import('three')
```

### Images

```typescript
// ALL images from Sanity use SanityImage — never <img>
import { SanityImage } from '@/components/common/SanityImage'

<SanityImage
  image={project.heroImage}
  alt={project.title}
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={isAboveFold}
/>
```

---

## Decisions That Are Closed

These decisions were made in `SPEC_FIX_PLAN.md` and must not be reopened:

| Decision | Closed Answer |
|---|---|
| File upload storage | Uploadthing (not Vercel filesystem) |
| Form handling pattern | Server Actions (not API routes) |
| Default locale | Arabic at root (not English) |
| Service page routing | Dynamic `/services/[slug]` (not 9 hardcoded folders) |
| Sanity clients | publicClient + previewClient (not one client) |
| Bot protection | Cloudflare Turnstile (not reCAPTCHA) |
| Form persistence | Supabase before Resend (not email-only) |
| Error monitoring | Sentry + UptimeRobot |
| OG images | Next.js opengraph-image.tsx (not manual) |
| Button contrast | `--red-button: #B03020` (not `--red-primary: #C0392B`) |
