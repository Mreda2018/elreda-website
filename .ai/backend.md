# Backend Rules — elReda Advertising

## What "Backend" Means in This Project

This project has no traditional backend server. The "backend" consists of:

| Layer | Technology | Purpose |
|---|---|---|
| Form handling | Next.js Server Actions | Quote, Contact, Consultation submissions |
| Content API | Sanity.io + GROQ | All CMS content reads |
| File uploads | Uploadthing | Quote form attachments |
| Email | Resend | Transactional notifications |
| Database | Supabase | Form submission persistence |
| ISR webhook | `/api/revalidate/route.ts` | Sanity triggers page rebuild |
| Uptime | `/api/health/route.ts` | UptimeRobot monitor endpoint |
| Bot protection | Cloudflare Turnstile + Upstash | Spam prevention |

---

## Server Actions — The Primary Pattern

### Rule: All Form Submissions Use Server Actions

```typescript
// CORRECT
// app/actions/quote.ts
"use server"

export async function submitQuote(prevState: unknown, formData: FormData) {
  // 1. Zod validation
  // 2. Turnstile verification
  // 3. Rate limiting
  // 4. Supabase insert (FIRST)
  // 5. Resend email
  // 6. Update Supabase with email result
  return { success: true }
}

// WRONG — do not create API routes for forms
// app/api/quote/route.ts  ← this file should NOT exist
```

### Zod Validation Schema

```typescript
// Define schemas in the action file or a shared lib/schemas.ts
import { z } from 'zod'

const QuoteSchema = z.object({
  services: z.array(z.string()).min(1, 'Select at least one service'),
  company: z.string().min(2).max(200),
  industry: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  budget: z.enum(['under-5k', '5k-15k', '15k-50k', '50k+', 'unsure']),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']),
  locale: z.enum(['ar', 'en']),
  fileUrl: z.string().url().optional(),
  // Honeypot — must be empty
  website: z.literal('').optional(),
})
```

### Turnstile Verification

```typescript
async function verifyTurnstile(token: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  )
  const data = await response.json()
  return data.success === true
}
```

### Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),  // 5 per IP per hour
  prefix: 'quote',  // use different prefix per form type
})

// In Server Action:
const ip = headers().get('x-forwarded-for') ?? '127.0.0.1'
const { success } = await ratelimit.limit(ip)
if (!success) return { error: 'Too many submissions. Please try again later.' }
```

### Honeypot Check

```typescript
// Check before Turnstile (cheaper)
const honeypot = formData.get('website')
if (honeypot) {
  // Silent discard — do not tell the bot it was caught
  return { success: true }
}
```

### Supabase Insert

```typescript
import { createClient } from '@supabase/supabase-js'

// Use service role key on server — never in client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const { data: submission, error } = await supabase
  .from('submissions')
  .insert({
    type: 'quote',
    data: validated.data,
    locale: validated.data.locale,
  })
  .select('id')
  .single()

if (error) {
  // Log to Sentry — this is a critical failure
  console.error('Supabase insert failed:', error)
  return { error: 'Failed to save submission. Please try again.' }
}
```

### Resend Email

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

let emailSent = false
let emailError: string | null = null

try {
  await resend.emails.send({
    from: 'elReda Advertising <no-reply@elreda.com>',
    to: 'info@elreda.com',
    subject: `New Quote Request — ${validated.data.company}`,
    // html: use a React Email template
  })
  emailSent = true
} catch (err) {
  emailError = String(err)
  // Do NOT return error to user — submission is safe in Supabase
}

// Update submission with email status
await supabase
  .from('submissions')
  .update({ email_sent: emailSent, email_error: emailError })
  .eq('id', submission.id)

return { success: true }
```

---

## Sanity — GROQ Queries

### Two Clients, Different Uses

```typescript
// publicClient — all public pages (no token)
import { publicClient } from '@/lib/sanity/publicClient'
const service = await publicClient.fetch(serviceQuery, { slug })

// previewClient — draft preview only (has import 'server-only')
import { previewClient } from '@/lib/sanity/previewClient'
const draftData = await previewClient.fetch(serviceQuery, { slug })
```

### Query Best Practices

```typescript
import { groq } from 'next-sanity'

// Project only the fields you need — never select *
export const serviceQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    description,
    features,
    process,
    faq,
    isTranslated,
    "relatedServices": relatedServices[]-> {
      "slug": slug.current,
      title
    }
  }
`

// For generateStaticParams — only fetch slugs
export const allServiceSlugsQuery = groq`
  *[_type == "service" && defined(slug.current)] {
    "slug": slug.current
  }
`
```

---

## ISR Webhook

```typescript
// app/api/revalidate/route.ts
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('sanity-webhook-signature')

  if (!signature) {
    return Response.json({ error: 'No signature' }, { status: 401 })
  }

  const secret = process.env.SANITY_WEBHOOK_SECRET!
  const hmac = crypto.createHmac('sha256', secret)
  const digest = `sha256=${hmac.update(body).digest('hex')}`

  // timing-safe comparison — prevent timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )

  if (!isValid) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)
  const type = payload._type  // 'service' | 'portfolio' | 'blog' | etc.

  // Revalidate the affected paths
  switch (type) {
    case 'service':
      revalidatePath('/[locale]/services/[slug]', 'page')
      break
    case 'portfolio':
      revalidatePath('/[locale]/portfolio/[slug]', 'page')
      break
    case 'blogPost':
      revalidatePath('/[locale]/blog/[slug]', 'page')
      break
    default:
      revalidatePath('/', 'layout')
  }

  return Response.json({ revalidated: true })
}
```

---

## Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
  })
}
```

---

## Environment Variable Access

```typescript
// RULE: Check at startup — crash fast if required vars are missing

// In lib/sanity/publicClient.ts:
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is required')
}

// NEVER access SUPABASE_SERVICE_ROLE_KEY in client components
// NEVER access SANITY_API_READ_TOKEN in client components
// NEVER access TURNSTILE_SECRET_KEY in client components
// NEVER access RESEND_API_KEY in client components

// These are server-only. If you need them in a component,
// you are doing something architecturally wrong.
```

---

## Error Handling

```typescript
// Always return typed errors from Server Actions
type ActionResult =
  | { success: true }
  | { error: string }

// In Server Action:
try {
  // ... operations
  return { success: true }
} catch (err) {
  // Log to Sentry automatically (Sentry wraps Server Actions)
  console.error('Server Action failed:', err)
  return { error: 'Something went wrong. Please try again.' }
}
```

---

## What Is Forbidden

- API routes for form submissions (`app/api/quote/`, `app/api/contact/`, `app/api/consultation/`)
- Writing files to the Vercel filesystem (use Uploadthing)
- Using `SUPABASE_SERVICE_ROLE_KEY` in client components
- Fetching from Sanity without `publicClient` or `previewClient`
- Skipping Zod validation on any user input
- Calling Resend before Supabase insert
- Using `any` type in TypeScript
