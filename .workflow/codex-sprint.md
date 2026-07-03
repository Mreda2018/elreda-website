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