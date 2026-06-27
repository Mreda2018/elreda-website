# Commit Message Conventions — elReda Advertising

## Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

All three sections follow these rules:
- Subject line: max 72 characters
- Subject: imperative mood — "add" not "added", "fix" not "fixed"
- Body: explain WHY, not WHAT (the diff shows what)
- Footer: reference task IDs from TASKS.md

---

## Types

| Type | When to Use |
|---|---|
| `feat` | A new feature or page (e.g., adding the Quote form) |
| `fix` | A bug fix |
| `style` | CSS/design changes that don't affect functionality |
| `a11y` | Accessibility improvement |
| `perf` | Performance improvement |
| `seo` | SEO, metadata, schema, or llms.txt changes |
| `i18n` | Translation or RTL/LTR changes |
| `sec` | Security fix (Turnstile, headers, token handling) |
| `refactor` | Code reorganization with no behavior change |
| `chore` | Tooling, config, dependencies, CI |
| `docs` | Documentation only (spec docs, READMEs) |
| `test` | Adding or updating Playwright tests |

---

## Scopes

Use the component, page, or feature being modified:

```
feat(hero): ...
feat(quote-form): ...
feat(sanity): ...
fix(whatsapp-button): ...
a11y(mobile-menu): ...
seo(llms-txt): ...
i18n(ar): ...
sec(server-actions): ...
chore(deps): ...
```

---

## Examples

### Feature commits

```
feat(quote-form): add 5-step multi-step form with accessibility spec

Implements fieldset/legend per step, aria-live announcements, URL per step
(?step=N), and sessionStorage persistence. Submission uses Server Action
with Turnstile verification and Supabase persistence before Resend email.

Closes T69
```

```
feat(hero): implement LCP-safe hero animation

H1 uses CSS @keyframes (visible on first paint). GSAP animates background,
subheadline, and CTAs only. Resolves FIX-PERF-01.

Closes T47
```

```
feat(sanity): add dual client setup (public + preview)

publicClient.ts: no token, useCdn true, safe for all components.
previewClient.ts: server-only, viewer-level token, useCdn false.
No write tokens exist anywhere in the Next.js app.

Closes T18, T19
```

### Fix commits

```
fix(whatsapp-button): add iOS safe-area-inset to prevent home indicator overlap

Applies env(safe-area-inset-bottom) and viewport-fit=cover.
Resolves FIX-MOB-01.

Closes T43
```

```
fix(red-button): replace --red-primary with --red-button on all CTAs

#C0392B fails WCAG AA at 3.9:1. Replaced with #B03020 (5.1:1).
All button backgrounds now use var(--red-button).

Closes T05
```

### Accessibility commits

```
a11y(mobile-menu): add focus-trap-react for keyboard navigation

FocusTrap wraps overlay. ESC closes menu and returns focus to hamburger.
Tab cycles through menu items only. Resolves FIX-ACC-02.

Closes T41
```

### Security commits

```
sec(revalidate): add HMAC-SHA256 signature verification to Sanity webhook

crypto.timingSafeEqual prevents timing attacks. 401 returned for missing
or invalid signatures. Resolves FIX-API-01.

Closes T75
```

### Chore commits

```
chore(deps): add Playwright, focus-trap-react, @marsidev/react-turnstile

Required for E2E testing, mobile menu accessibility, and bot protection.
See SPEC_FIX_PLAN.md FIX-ACC-02, FIX-SEC-02, FIX-MISS-06.
```

---

## Commit Frequency

- Commit after each completed task (or tightly related group of 2–3 small tasks)
- Never batch unrelated changes into one commit
- Every commit must leave the build passing

---

## What Never Goes in a Commit

- `.env` or `.env.local`
- Sanity API tokens or webhook secrets
- Any file containing credentials
- `node_modules/`
- `.next/` build output

The `.gitignore` enforces this — never override it.

---

## Branch Strategy

```
main              — production, always deployable
feature/<task-id> — one branch per task group (e.g., feature/group-1-foundation)
fix/<description> — hotfix branches
```

Merge to `main` only after Claude review approval and passing CI.
