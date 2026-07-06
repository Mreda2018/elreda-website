# Polish Backlog

Milestone 7.1 creates a polish backlog before advanced visuals, 3D, Spline, or
page transitions are considered. This document is not an implementation task.

## Critical Fixes

No critical motion, visual, or accessibility fix was identified from code-level
audit.

Production-critical items still outside this motion/visual polish scope:

- Wire Cookie Preferences to the approved consent management behavior.
- Implement real Contact and Quote submission flows with validation, persistence,
  bot protection, and accessible success/error states.
- Configure required production environment variables for Sanity and site URL.

## High Priority Polish

1. Strengthen Portfolio visual proof.
   - Add CMS-backed project imagery or strong visual placeholders.
   - Create a true featured case-study treatment.
   - Keep touch behavior accessible before hover overlays are introduced.

2. Strengthen Blog editorial presence.
   - Add article imagery or an editorial thumbnail system.
   - Give featured content stronger hierarchy.
   - Avoid a generic listing feel once real posts exist.

3. Make CTAs page-specific.
   - Services CTA should guide uncertain clients toward discovery.
   - Portfolio CTA should lean on proof and outcomes.
   - About CTA should feel founder/partnership-led.
   - Contact CTA should offer a distinct next step rather than duplicating the
     form.
   - Pricing CTA should help users choose a fit.

4. Add more composition variety before adding advanced motion.
   - Use feature cards, editorial rails, proof strips, and split layouts.
   - Reduce repeated section-header-plus-equal-card-grid patterns.
   - Keep all changes token-based and RTL-safe.

5. Complete real device QA.
   - Arabic and English on mobile, tablet, and desktop.
   - iOS Safari and Android Chrome.
   - Keyboard navigation.
   - Reduced-motion behavior.
   - Long CMS content wrapping.

## Medium Priority Polish

1. Services page hierarchy.
   - Introduce a connected-services or grouped-services concept.
   - Feature one or two priority service cards instead of making every card equal.
   - Add a "not sure where to start" decision aid before the CTA.

2. Contact experience.
   - Rework contact cards into a stronger "fastest path" module.
   - Add expectation-setting copy around response time and project fit.
   - Keep the form revealed as one block, not per input.

3. Quote experience.
   - Plan progressive step behavior before backend work.
   - Review mobile form length and option-card density.
   - Avoid page transitions on this route until focus and validation are proven.

4. About team section.
   - Replace placeholders with real CMS-backed team or leadership content.
   - If real people are unavailable, convert the area into capability pods or
     operating principles instead of temporary placeholders.

5. Pricing tablet balance.
   - Review the recommended-card offset at tablet and small laptop widths.
   - Add a simple fit guide if the three tiers feel too similar.

## Minor Polish

- Review all CTA action placeholders so sighted users do not mistake disabled
  buttons for production-ready actions.
- Check Arabic line breaks in badges, tags, filters, and metadata after real CMS
  content is entered.
- Review Footer service links once service detail pages exist.
- Normalize page-specific proof card copy length so hero asides feel balanced.
- Confirm all active nav states remain clear across Arabic root and English `/en`
  paths.

## Motion Polish

- Keep current micro-interactions; they are calm and CSS-only.
- Keep reveal variants as currently assigned unless visual QA shows a specific
  section feels too delayed.
- Avoid adding reveal to Header, Footer, Hero H1, first-viewport Trust Bar, or
  form inputs.
- Measure GSAP/ScrollTrigger runtime cost before adding more reveal groups.
- Validate reduced-motion behavior on real devices before approving any new
  motion layer.

## Accessibility Polish

- Perform manual screen reader QA in Arabic and English.
- Confirm skip link behavior after any future transition or scroll work.
- Confirm disabled placeholder controls remain understandable.
- Confirm form focus states, labels, and autocomplete behavior before backend
  submission work.
- Keep focus outlines static and never animate them.

## Performance Polish

- Capture Core Web Vitals on all public routes before advanced visuals.
- Measure bundle impact from broad reveal rollout.
- Keep Lenis disabled by default until device QA approves activation.
- Plan Sanity image performance before adding Portfolio and Blog visuals.
- Avoid adding global animation code to Server Components.

## Deferred Ideas

These ideas are intentionally deferred and must not start until high-priority
polish, accessibility QA, and performance QA are complete:

- Page transitions.
- 3D Hero accents.
- Three.js scenes.
- Spline embeds.
- Shader backgrounds.
- Parallax systems.
- Scroll progress bars.
- Custom cursor effects.
- Advanced scroll storytelling.
- Lenis activation by default.

## Proposed Order

1. Production readiness fixes: consent, forms, environment configuration.
2. Real device QA: Arabic/English, mobile/tablet/desktop, reduced motion.
3. Portfolio and Blog visual proof.
4. Page-specific CTA refinement.
5. Services, Contact, and Quote composition improvements.
6. Performance measurement after visual proof assets are added.
7. Revisit page transitions only after the above is complete.
