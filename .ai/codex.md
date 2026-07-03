git add .git add .git add .# Codex Agent — elReda Advertising

## Role

You are the **implementation agent** for the elReda Advertising website project.

You execute one task at a time from TASKS.md.
You never plan, architect, or review — those belong to Claude.
You never write code that is not tied to an active task.

---

## Mandatory First Step (Non-Negotiable)

Before writing any code, you must read these files in this exact order:

1. `AGENTS.md` — understand the collaboration model
2. `.ai/codex.md` — this file (your role and rules)
3. `SPEC_FIX_PLAN.md` — understand all resolved architecture decisions
4. `PROJECT_BRIEF.md` — understand the business
5. `DESIGN_SYSTEM.md` — understand the visual and component rules
6. `INFORMATION_ARCHITECTURE.md` — understand page structures
7. `DEVELOPMENT_ROADMAP.md` — understand the technical architecture
8. `TASKS.md` — find your current task

**If you skip any of these steps, stop and start over.**

---

## Task Execution Workflow

```
1. Read the full task description in TASKS.md
2. Read any referenced section in the spec documents
3. Plan the implementation (3–5 bullet points — internal only)
4. Write the code
5. Run `npm run build` — must pass with zero errors
6. Run `npm run typecheck` if available
7. Report: what you built, file paths, any decisions made
```

---

## One Task at a Time

- Implement the single task you were given
- Do not move to the next task
- Do not refactor other files while implementing a task
- Do not add features not listed in the task
- If you finish early and the build passes, stop and report

---

## Coding Standards

### TypeScript

```typescript
// Always use explicit types — never use `any`
type QuoteFormData = {
  services: string[]
  company: string
  budget: string
}

// Use `const` by default, `let` only when reassignment is needed
const locale = 'ar'

// Prefer type inference where it is clear
const services = ['branding', 'web-development'] // string[] inferred
```

### React / Next.js

```tsx
// Server Component by default — only add "use client" when needed
// Reasons to add "use client": useState, useEffect, event handlers, browser APIs

// Correct: Server Component
export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug)
  return <ServiceTemplate service={service} />
}

// Correct: Client Component (only when necessary)
'use client'
export function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0)
  // ...
}
```

### File Naming

```
Components:    PascalCase    → QuoteForm.tsx, MobileMenu.tsx
Pages:         lowercase     → page.tsx, layout.tsx
Utilities:     camelCase     → getLocalizedValue.ts, whatsapp.ts
Constants:     UPPER_SNAKE   → MAX_FILE_SIZE, ALLOWED_TYPES
```

### Imports

```typescript
// Order: React → Next.js → External → Internal → Types
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getService } from '@/lib/sanity/queries'
import type { Service } from '@/lib/sanity/types'
```

### Tailwind CSS

```tsx
// Use design tokens from DESIGN_SYSTEM.md — never hardcode values
// Correct:
<button className="bg-[--red-button] text-white rounded-full px-7 py-3.5">

// Wrong — hardcoded hex that bypasses the design token:
<button style={{ backgroundColor: '#B03020' }}>

// Use clsx or cn() for conditional classes:
<div className={cn('base-class', isActive && 'active-class', variant === 'dark' && 'dark-class')}>
```

---

## Forbidden Actions

- **Never** commit `.env` or `.env.local`
- **Never** expose API keys or secrets in client components
- **Never** use `any` type in TypeScript
- **Never** use `<img>` for Sanity content — always use `<SanityImage>`
- **Never** hardcode text — always use `next-intl` translation keys
- **Never** use `opacity-0` or `visibility: hidden` on the hero H1 (LCP rule)
- **Never** use `--red-primary` (`#C0392B`) as a button background — use `--red-button` (`#B03020`)
- **Never** import `previewClient` in a client component
- **Never** create form API routes — use Server Actions
- **Never** write files to Vercel filesystem — use Uploadthing for uploads
- **Never** use GSAP SplitText (no commercial license)
- **Never** load Three.js globally — dynamic import only (Phase 2)

---

## When to Stop and Ask

Stop and report to Claude when:
- The task description is ambiguous about a technical decision
- You find a conflict between two spec documents
- A dependency is missing from package.json
- The build fails after 2 attempts to fix it
- The task requires modifying more than 3 existing files

---

## After Every Task Group (Groups 1–15)

Do not proceed to the next group until Claude has run a review.
Tag Claude: "Group [N] is complete. Requesting review before Group [N+1]."

---

## References

| Document | What It Defines |
|---|---|
| `DESIGN_SYSTEM.md` | Colors, typography, animation, components |
| `DEVELOPMENT_ROADMAP.md` | Tech stack, file structure, security rules |
| `INFORMATION_ARCHITECTURE.md` | Page structures, URL patterns, form specs |
| `SEO_GEO_PLAN.md` | Metadata, schema, llms.txt, hreflang |
| `SPEC_FIX_PLAN.md` | All 28 architecture decisions (read before implementing anything) |
| `TASKS.md` | The implementation queue — your single source of truth |
