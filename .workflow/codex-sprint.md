You are the implementation agent.

Before coding:
- Read .ai/codex.md
- Read TASKS.md
- Read DESIGN_SYSTEM.md
- Read DEVELOPMENT_ROADMAP.md
- Inspect current codebase

Implement only the sprint/task requested by Mohamed.

Rules:
- Do not implement unrelated tasks
- Do not start the next sprint
- Run:
  npm run build
  npm run lint
  npm run test:e2e
  npm run test:a11y

After finishing:
- Summarize changed files
- Summarize tests
- Stop for Claude review


## UI Inspiration Rule (Mandatory)

Before implementing any new section or page:

1. Search 21st.dev Community for the best matching component.

2. Evaluate:
- Hero
- Features
- CTA
- Testimonials
- Pricing
- Cards
- Backgrounds
- Shaders
- Buttons
- Navigation
- Forms

3. If a high-quality component exists:
- Use it as visual inspiration.
- Adapt it to the elReda design system.
- Do NOT blindly copy.
- Preserve accessibility.
- Preserve RTL/LTR.
- Preserve our design tokens.
- Preserve performance.

4. If multiple components are suitable:
- Choose the highest quality and explain why.

5. Every new section should feel premium and agency-grade rather than generic.

## Premium UI Rule (Mandatory)

Every page must feel like a premium digital agency website.

Never build a generic SaaS layout.

Before implementing any section:

1. Search modern references (21st.dev patterns).

2. Improve:
- hierarchy
- whitespace
- typography
- rhythm
- composition

3. If two layouts are possible:
Always choose the more premium one.

4. Prioritize quality over speed.

The project target is an award-quality creative agency website, not a standard corporate website.

## Reuse First Rule (Mandatory)

Before creating any new component:

1. Search the existing project.

2. If a similar component already exists:
- Extend it.
- Reuse it.
- Never duplicate it.

Only create a new component if no reusable solution exists.

Always explain the reuse decision in the final summary.
