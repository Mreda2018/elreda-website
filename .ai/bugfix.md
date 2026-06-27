# Bug Fixing Workflow — elReda Advertising

## Overview

Every bug fix follows this five-step process:
Identify → Reproduce → Root Cause → Fix → Verify

Never skip to the fix without completing the first three steps.

---

## Step 1: Identify

Collect the following before writing any code:

```markdown
Bug Report:
- Description: What is broken?
- Where: Page URL, component name, file path (if known)
- When: On load? On interaction? On form submit? On specific locale?
- Who: Affects all users? Mobile only? Arabic locale only?
- Severity: Critical (broken functionality) / High (visual) / Low (cosmetic)
- Source: Sentry error ID / UptimeRobot alert / Manual discovery / User report
```

---

## Step 2: Reproduce

Reproduce the bug locally before touching any code:

```bash
# Start dev server
npm run dev

# Reproduce on the affected path
# For Arabic locale: http://localhost:3000/ (root = Arabic)
# For English locale: http://localhost:3000/en/
```

**If you cannot reproduce locally:** The bug may be environment-specific. Check:
- Is `SANITY_DATASET` set to the correct dataset?
- Is the issue in production but not preview? Check Sentry for the production error ID.
- Is the issue mobile-only? Use Chrome DevTools device simulation.

**Do not fix what you cannot reproduce.**

---

## Step 3: Root Cause

Identify the specific line of code causing the bug. Ask:

1. What was the intended behavior?
2. What is the actual behavior?
3. Why is there a gap?

Common root causes in this project:

| Symptom | Common Root Cause | Where to Look |
|---|---|---|
| Form submission fails silently | Turnstile token missing or rejected | Server Action, Turnstile verify call |
| Analytics fire before consent | CookieYes script not `beforeInteractive` | `app/layout.tsx` |
| Arabic page layout broken | Missing `dir="rtl"` or logical CSS properties | `app/[locale]/layout.tsx`, component CSS |
| LCP score degraded | Hero H1 has `opacity: 0` or GSAP override | `components/sections/Hero.tsx` |
| Sanity content not loading | Wrong dataset or missing `remotePatterns` | `lib/sanity/publicClient.ts`, `next.config.ts` |
| Button contrast failing | Using `--red-primary` instead of `--red-button` | Component CSS / Tailwind class |
| iOS WhatsApp button obscured | Missing `env(safe-area-inset-bottom)` | `components/common/WhatsAppButton.tsx` |
| Form submission lost | Resend called before Supabase insert | Server Action function order |
| Preview not working | `previewClient` imported in client component | Check for `import 'server-only'` |
| OG image not generating | Missing `opengraph-image.tsx` or wrong export | Route `opengraph-image.tsx` files |

---

## Step 4: Fix

### Small Fix (1–3 lines changed)

Fix directly on the current branch. No new branch needed.

```bash
# Make the fix
# Run build
npm run build

# If build passes, commit immediately
git add <specific-file>
git commit -m "fix(<scope>): <imperative description>"
```

### Medium Fix (affects 1 component or 1 page)

```bash
# Create a fix branch
git checkout -b fix/<short-description>

# Make the fix
# Run build
npm run build

# Commit
git add <specific-files>
git commit -m "fix(<scope>): <description>

Root cause: <one sentence>
Fix: <one sentence>"

# Push and create PR (or merge to main if pre-launch)
git push origin fix/<short-description>
```

### Critical Production Fix (hotfix)

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<short-description>

# Fix the issue
npm run build  # must pass

git add <files>
git commit -m "fix(<scope>): <description> [HOTFIX]"
git push origin hotfix/<short-description>

# Merge to main immediately after review
# Vercel auto-deploys
```

---

## Step 5: Verify

After the fix:

```bash
# Build must pass
npm run build

# Verify the specific bug is resolved
npm run dev
# Test the exact scenario that triggered the bug

# If the fix touches a form or critical flow:
npx playwright test  # run relevant test suite

# If the fix touches accessibility:
# Re-run keyboard navigation test on affected page
# Re-check contrast ratios if CSS changed
```

Write a brief verification note:

```markdown
Bug [ID]: <description>
Fixed in: <file>, line ~<N>
Root cause: <one sentence>
Verified by: <how you confirmed it is fixed>
Build: ✓ passing
```

---

## Bug Priority Definitions

| Priority | Definition | Target Resolution |
|---|---|---|
| **P0 — Critical** | Site is down, forms not submitting, data loss risk | Fix within 2 hours |
| **P1 — High** | Security issue, broken page, LCP regression, a11y failure | Fix within 24 hours |
| **P2 — Medium** | Visual bug on production, minor functionality issue | Fix within 72 hours |
| **P3 — Low** | Cosmetic issue, minor text error | Fix in next scheduled session |

---

## What Not to Do

- **Do not** fix a bug by guessing — always reproduce first
- **Do not** change more than the minimum needed to fix the specific bug
- **Do not** refactor surrounding code while fixing a bug
- **Do not** skip the build check after a fix
- **Do not** close a Sentry issue without writing a fix commit
- **Do not** use `// @ts-ignore` to silence TypeScript errors — fix the type

---

## Sentry Workflow

When an error appears in Sentry:

1. Click the error → read the full stack trace
2. Find the exact file and line number
3. Go to that file and understand the context
4. Reproduce locally (if possible)
5. Fix → build → commit → push
6. In Sentry: resolve the issue and link the commit

If the Sentry error includes a user ID or form submission data: check Supabase to verify whether the submission was saved before the error occurred.
