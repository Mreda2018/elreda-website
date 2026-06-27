<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses Next.js 16.2.9 with App Router. Next.js 16 has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AI Collaboration Model — elReda Advertising

This file defines how AI agents collaborate in this repository.
Every AI agent that works on this project must read this file first.

---

## The Team

| Agent | Role | Scope |
|---|---|---|
| **Claude** | Senior AI Partner — Plan, Review, Architect | Spec docs, task planning, code review, unblocking |
| **Codex** | Implementation Agent — Build | One task at a time from TASKS.md |
| **GitHub Copilot** | Inline Assistant — Autocomplete | Individual file edits, boilerplate completion |
| **Future Agents** | Defined per task | Read this file first, then their role file |

---

## Collaboration Rules

### 1. Claude Plans, Codex Builds

Claude does not implement. Codex does not plan. These roles are separated intentionally:
- Claude defines WHAT needs to be built and HOW it should be architected
- Codex executes the specific task from TASKS.md
- Neither agent changes the other's primary artifact without the other's involvement

### 2. Read Before You Build

Every agent must read the specification documents before writing code:

```
Required reading order:
1. AGENTS.md                    ← this file
2. .ai/<your-role>.md           ← your specific role file
3. SPEC_FIX_PLAN.md             ← 28 resolved architecture decisions
4. PROJECT_BRIEF.md             ← business context
5. DESIGN_SYSTEM.md             ← visual and component rules
6. INFORMATION_ARCHITECTURE.md  ← page structures
7. DEVELOPMENT_ROADMAP.md       ← tech stack and patterns
8. TASKS.md                     ← the implementation queue
```

If an agent implements without reading these documents, it will make these documented mistakes:
- Use English instead of Arabic as the default locale at root
- Create API routes instead of Server Actions for forms
- Animate hero H1 with `opacity: 0` (destroys LCP score)
- Use `#C0392B` red on buttons (fails WCAG AA contrast)
- Call Resend before Supabase insert (loses leads on email failure)

### 3. One Task at a Time

Codex works on exactly one task from TASKS.md at a time:
- Mark task `[-]` (In Progress) while building
- Mark task `[x]` (Done) after completion
- After each task GROUP: wait for Claude review before the next group

### 4. No Agent Skips Review

Between task groups, Claude runs a review per `.ai/review.md`:
- Codex may not begin Group N+1 until Claude approves Group N
- Review findings go to `REVIEW.md`
- Critical findings must be fixed before proceeding

### 5. Decisions Are Documented

Every significant technical decision must be:
- Written in a spec document
- Referenced in the implementing task in TASKS.md
- Committed with a message explaining the "why"

Future agents should never have to guess "why did they do it this way."

---

## Role Files

Each agent has a dedicated instruction file in `.ai/`:

| Agent | File | Purpose |
|---|---|---|
| Codex | `.ai/codex.md` | Implementation rules, coding standards, forbidden actions |
| Claude | `.ai/claude.md` | Review responsibilities, planning authority, communication style |
| All | `.ai/review.md` | Review checklist and output format |
| All | `.ai/commit.md` | Commit message conventions |
| All | `.ai/deploy.md` | Deployment checklist and steps |
| All | `.ai/bugfix.md` | Bug identification and fixing workflow |
| All | `.ai/architecture.md` | Architecture patterns and closed decisions |
| All | `.ai/frontend.md` | Component, CSS, and animation rules |
| All | `.ai/backend.md` | Server Action, Sanity, and API patterns |
| All | `.ai/seo.md` | Metadata, schema, OG image, and llms.txt rules |

GitHub Copilot reads: `.github/copilot-instructions.md`

---

## Architecture Decisions — Who Owns What

| Decision Type | Owner | Where Documented |
|---|---|---|
| Technical architecture | Claude | DEVELOPMENT_ROADMAP.md, SPEC_FIX_PLAN.md |
| Visual design | Claude | DESIGN_SYSTEM.md |
| Page structure and UX | Claude | INFORMATION_ARCHITECTURE.md |
| SEO and content strategy | Claude | SEO_GEO_PLAN.md, CONTENT_STRATEGY.md |
| Task breakdown | Claude | TASKS.md |
| Implementation | Codex | Code files |
| Inline code completion | Copilot | Code files |
| Review and approval | Claude | REVIEW.md |

---

## Closed Decisions (Do Not Reopen)

These 28 decisions were resolved in `SPEC_FIX_PLAN.md`. They are final:

| ID | Decision |
|---|---|
| FIX-SEC-01 | File uploads → Uploadthing |
| FIX-SEC-02 | Bot protection → Cloudflare Turnstile + honeypot + Upstash |
| FIX-SEC-03 | Forms → Server Actions (not API routes) |
| FIX-SEC-04 | Red button color → `#B03020` (not `#C0392B`) |
| FIX-PERF-01 | Hero H1 → visible on first paint, CSS @keyframes only |
| FIX-MISS-01 | Cookie consent → CookieYes CMP |
| FIX-SEC-05 | Sanity → publicClient + previewClient (not one client) |
| FIX-SEC-06 | Security headers → hardened (CSP deferred to Phase 2) |
| FIX-PERF-02 | JS bundle → ≤ 150KB initial, GSAP/Three.js dynamic imports |
| FIX-PERF-03 | Images → SanityImage component (wraps Next.js Image) |
| FIX-CON-01 | Default locale → Arabic at root (`defaultLocale: 'ar'`) |
| FIX-CON-02 | Service routes → dynamic `/services/[slug]` (not 9 folders) |
| FIX-MISS-02 | Form persistence → Supabase before Resend |
| FIX-MISS-03 | Monitoring → Sentry + UptimeRobot + `/api/health` |
| FIX-MISS-04 | OG images → `opengraph-image.tsx` + `@vercel/og` |
| FIX-MISS-05 | Environments → dev/preview/production, 2 Sanity datasets |
| FIX-MISS-06 | Testing → Playwright, 6 E2E test suites |
| FIX-ACC-01 | GSAP scroll → `start: "top 90%"` (keyboard accessible) |
| FIX-ACC-02 | Mobile menu → focus-trap-react |
| FIX-ACC-03 | Screen reader → iOS VoiceOver Arabic + NVDA Arabic in QA |
| FIX-ACC-04 | Quote form → fieldset/legend, aria-live, URL per step |
| FIX-GEO-01 | llms.txt → bilingual, Arabic first |
| FIX-CMS-01 | Slug protection → readOnly after publish + Redirect schema |
| FIX-CMS-02 | Translation fallback → English content with `lang="en"` attribute |
| FIX-MOB-01 | WhatsApp button → `env(safe-area-inset-bottom)` |
| FIX-MOB-02 | Portfolio cards → `@media (hover: none)` persistent overlay |
| FIX-DX-01 | Server Actions (resolved with FIX-SEC-03) |
| FIX-API-01 | Sanity webhook → HMAC-SHA256 signature verification |

---

## Handoff Protocol

### Claude → Codex

Claude provides:
1. Task ID: "Implement T47"
2. Spec reference: "See DESIGN_SYSTEM.md Section 8 (LCP Rule) and FIX-PERF-01"
3. Acceptance criterion: "H1 visible on first paint, build passes, LCP ≤ 1.5s on Fast 3G"

### Codex → Claude

Codex reports:
1. What was built: component name and file path
2. Decisions made: any choices not explicitly specified
3. Files changed: complete list
4. Build status: pass or fail
5. Request: "Group N complete. Requesting review before Group N+1."

---

## For Future AI Agents

If you are a new AI agent working on this repository:

**Do:**
1. Read this file fully
2. Read `.ai/<your-assigned-role>.md`
3. Read `SPEC_FIX_PLAN.md` — the 28 decisions are resolved
4. Read `TASKS.md` — find your assigned task
5. Build only what is in the task
6. Run `npm run build` before reporting
7. Report: files changed, decisions, build status

**Do not:**
- Restructure files outside your task
- Propose alternatives to the 28 closed decisions
- Create API routes for form handling
- Set English as the default locale
- Add `opacity: 0` to the hero H1
- Use `any` TypeScript type
- Write `console.log` in production code
- Import `previewClient` in client components

---

## Project Values (Priority Order)

1. **Security** — user data protected, bots blocked, secrets server-side only
2. **Accessibility** — WCAG 2.2 AA for Arabic and English, all devices and abilities
3. **Performance** — LCP < 2.5s, initial JS ≤ 150KB, no animation regressions
4. **SEO/GEO** — Arabic-first indexing, structured data, AI-readable bilingual content
5. **User Experience** — every interaction is intentional, fast, and professional
6. **Maintainability** — clean code, documented decisions, no magic

These are production requirements for a professional agency website — not preferences.
