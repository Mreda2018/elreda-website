# Code Review Workflow — elReda Advertising

## When to Review

Claude runs a review after every completed task group before Codex starts the next group.

| Trigger | Reviewer | Output |
|---|---|---|
| Group N complete | Claude | Entries added to `REVIEW.md` |
| Critical issue found | Claude | Codex sent back to fix before next group |
| All issues resolved | Claude | "Group N approved — Codex may begin Group N+1" |

---

## Review Checklist

### Correctness
- [ ] Build passes: `npm run build` exits with no errors
- [ ] TypeScript: no type errors (`npm run typecheck` or build output)
- [ ] No `any` types introduced
- [ ] No hardcoded text — all strings use `next-intl` translation keys
- [ ] No console.log or debug statements left in code

### Security
- [ ] No secrets in client components or committed files
- [ ] Server Actions used for all form submissions (not API routes)
- [ ] Turnstile token verification present in every form Server Action
- [ ] `previewClient.ts` not imported in any client component
- [ ] Supabase insert runs before Resend email in form actions

### Performance
- [ ] Hero H1 is not `opacity: 0` or `visibility: hidden` at any point
- [ ] GSAP `start: "top 90%"` used for scroll-triggered animations
- [ ] All Sanity images use `<SanityImage>` component (not `<img>`)
- [ ] GSAP is dynamically imported — not in the global bundle
- [ ] Three.js is not imported anywhere in Phase 1

### Accessibility
- [ ] All interactive elements have accessible names (`aria-label` or visible text)
- [ ] Focus indicators are visible (red 2px outline)
- [ ] Mobile menu uses `focus-trap-react`
- [ ] Quote form uses `<fieldset>` + `<legend>` per step
- [ ] Arabic content has correct `dir="rtl"` and `lang="ar"` attributes
- [ ] Skip navigation component present in root layout

### Design System Compliance
- [ ] No button uses `--red-primary` (`#C0392B`) as background — must use `--red-button` (`#B03020`)
- [ ] Gradient uses `--gradient-brand` token (not hardcoded hex)
- [ ] All spacing uses design system tokens (`--space-*`)
- [ ] WhatsApp button has `env(safe-area-inset-bottom)` CSS
- [ ] Portfolio cards have `@media (hover: none)` persistent overlay

### Internationalization
- [ ] All pages render correctly in Arabic (RTL, `dir="rtl"`)
- [ ] All pages render correctly in English (LTR, `dir="ltr"`)
- [ ] Arabic content uses `font-family: var(--font-arabic)` (Tajawal)
- [ ] Direction-sensitive icons (arrows) flip in RTL
- [ ] `hreflang` tags are present and correct (`ar-EG` at root, `en` at `/en/`)

### SEO
- [ ] Every page has a unique `<title>` and `<meta name="description">`
- [ ] Every page has correct Open Graph tags
- [ ] Dynamic pages use `generateMetadata()` with Sanity content
- [ ] Canonical URL is set on every page

---

## Review Output Format

After reviewing a task group, Claude adds to `REVIEW.md`:

```markdown
## Review: Group [N] — [Group Name]
**Date:** YYYY-MM-DD
**Reviewed by:** Claude
**Status:** [APPROVED / NEEDS FIXES]

### Critical Issues (must fix before Group N+1)

**[CRIT-01] Issue title**
- File: `path/to/file.tsx`, line ~42
- Problem: What is wrong and why it matters
- Fix: Exactly what needs to change
- Acceptance: How to verify it is fixed

### Minor Issues (can fix in Group 13 QA)

**[MIN-01] Issue title**
- File: `path/to/file.tsx`
- Problem: Brief description
- Fix: Brief guidance

### Approved Decisions

- [Decision that Codex made correctly — record so future agents don't question it]

---
```

---

## Severity Definitions

| Level | Definition | Action |
|---|---|---|
| **Critical** | Security vulnerability, broken functionality, LCP regression, WCAG failure | Must fix before next group |
| **High** | Design system violation, missing accessibility attribute, performance issue | Fix in current group if possible, otherwise track in REVIEW.md |
| **Minor** | Code style, naming, missing comment on complex logic | Fix in Group 13 (QA) |

---

## After All Groups Complete (Pre-Launch Review)

Before Group 14 (Launch) begins, Claude runs a full pre-launch review covering:

1. Lighthouse audit results (targets: 90+/85+/95+/95+)
2. Bundle analyzer output (initial JS ≤ 150KB)
3. Arabic screen reader test results (VoiceOver + NVDA)
4. Security headers grade (securityheaders.com — minimum B+)
5. Playwright E2E test results (all 6 suites passing)
6. CookieYes consent banner (analytics confirmed blocked before consent)
7. Supabase form submissions table (all test submissions present)

Only after all pre-launch criteria are met does Claude approve Group 14.
