# Motion And Visual QA Report

Milestone 7.1 audits the completed public website after the shared visual system,
micro-interactions, reveal rollout, Lenis foundation, and page-transition
decision work. This report is documentation only.

## Audit Method

Reviewed:

- Public route implementations for Arabic root routes and English `/en` routes.
- Shared layout components: Header, Footer, Hero, InnerPageHero, CTASection.
- Shared UI components: Button, Card, SectionHeader, form fields.
- Motion components and utilities: Reveal, SmoothScroll, GSAP helpers, reveal
  variants, motion tokens, CSS micro-interactions.
- Documentation: Creative Direction Audit, Motion Foundation, Motion Language,
  Reveal Language, Page Transitions Plan, Page Transitions Decision.

Automated validation is recorded at the end of the implementation turn. Real
device visual QA is still recommended before launch, especially on iOS Safari and
Android Chrome.

## Overall Verdict

The site is in a strong MVP+ state for a premium bilingual agency website. The
visual system is coherent, dark-first, token-driven, and largely consistent
across Arabic and English. Motion has been rolled out conservatively: heroes and
H1 content remain outside reveal wrappers, Header/Footer are not animated, Lenis
is disabled by default, and micro-interactions are CSS-only with reduced-motion
guards.

Launch readiness verdict: no critical motion or accessibility blocker was found
from code inspection. The main remaining risk is polish: several routes still
share similar card/list/CTA patterns, and portfolio/blog lack visual proof assets.
Advanced visuals, 3D, Spline, and page transitions should remain deferred until
the polish backlog is addressed and device QA is complete.

## Global Visual QA

### Premium Quality

Strengths:

- The shared dark surfaces, glass borders, red accents, and large editorial type
  create a consistent premium base.
- InnerPageHero variants give About, Blog, Contact, Industries, Pricing, and
  Quote a controlled editorial/proof structure.
- About, Industries, and Pricing have the strongest page-level composition
  because they include asymmetry, proof panels, quote blocks, feature treatment,
  and clear hierarchy.
- Header and Footer are more polished than the first foundation pass and now
  support active navigation, stronger information hierarchy, and restrained link
  motion.

Weaknesses:

- Services, Portfolio, Blog, and parts of Contact still lean on repeated glass
  card grids. They are professional, but not yet distinctive enough for an
  award-level agency site.
- CTA sections are consistent but too generic. They close pages reliably but do
  not yet feel like page-specific conversion moments.
- Portfolio and Blog are structurally sound but visually underpowered without
  images, case visuals, editorial thumbnails, or stronger featured layouts.

### Spacing And Rhythm

Strengths:

- Section spacing is consistent and token-based.
- Compact filter sections prevent Portfolio and Blog from feeling too stretched.
- Forms use generous spacing and readable field group rhythm.

Risks:

- Long pages can feel uniformly paced because many sections use the same
  section-header-plus-card-grid rhythm.
- Equal-height cards help order but can make Services and Portfolio feel more
  catalog-like than strategic.
- CTA bands have consistent spacing but need more contextual hierarchy.

### Typography Balance

Strengths:

- H1/H2 hierarchy is strong across public routes.
- Arabic typography uses dedicated RTL classes and avoids known tracking issues
  in the reviewed pricing label pattern.
- Form labels and legends are readable and semantic.

Risks:

- Some card headings and labels may wrap heavily in Arabic once CMS content grows.
- Portfolio and Blog metadata areas can become dense on mobile if real content is
  long.
- Placeholder team/status copy feels temporary and weakens the About page's
  human tone.

### Card Consistency

Strengths:

- Card variants are centralized and token-driven.
- `micro-card` is prepared safely for interactive cards only.
- Composition helpers exist for feature, editorial, metric, and compact layouts.

Risks:

- Visual consistency is high, but repeated glass card styling reduces page
  distinctiveness.
- Some pages need intentional asymmetry, feature cards, or editorial rails before
  advanced motion or 3D is considered.

### CTA Quality

Strengths:

- CTASection is accessible, tokenized, and consistent.
- Disabled placeholder actions are intentionally non-focusable.

Risks:

- CTAs repeat the same pattern too often.
- Page-specific intent is weak. Services, Portfolio, About, Contact, Pricing, and
  Blog should eventually close with distinct value framing.

## Page-By-Page QA

### `/` And `/en`

Visual:

- Strongest route due to the custom homepage Hero and clear sequence: Hero, Trust
  Bar, Services, Portfolio, Industries, Testimonials, CTA.
- Trust Bar remains unanimated, which protects first-viewport stability.
- Portfolio and Industries previews are useful but still placeholder-led.

Motion:

- Reveals begin after Hero and Trust Bar, protecting LCP and first viewport.
- Cards and closing CTA use appropriate variants.

Accessibility:

- Hero H1 is visible and not wrapped in Reveal.
- Trust Bar uses semantic stat structure.

Polish opportunities:

- Add one stronger strategic bridge section later, such as process or connected
  service system.
- Make the final CTA feel more like a homepage finale.

### `/services` And `/en/services`

Visual:

- Clear, accessible page hero and service grid.
- Service cards are orderly but visually equal; the page reads as a catalog more
  than a strategic service system.

Motion:

- Service list uses the `cards` reveal variant below the page hero.
- CTA uses `statement`, which is semantically appropriate.

Accessibility:

- Breadcrumb list has role support.
- Decorative service index is hidden from assistive tech.

Polish opportunities:

- Add a feature/service hierarchy or grouped-service system later.
- Introduce a decision-aid section before the CTA.

### `/portfolio` And `/en/portfolio`

Visual:

- Filters and listing are clear, but the page lacks visual evidence of work.
- Cards carry useful metadata, yet without imagery or featured case treatment the
  page feels more functional than premium.

Motion:

- Filter foundation uses `editorial`; listing uses `cards`; CTA uses
  `statement`.
- Disabled filter buttons are non-focusable and visually disabled.

Accessibility:

- Current filter UI is correctly marked as disabled placeholder behavior.
- Breadcrumbs and metadata lists are semantic.

Polish opportunities:

- Add visual case study assets and a true featured project layout.
- Keep hover overlays deferred until images and touch behavior are designed.

### `/about` And `/en/about`

Visual:

- One of the strongest routes. Editorial story, quote, mission/vision, values,
  and team foundation create a premium rhythm.
- Team placeholders remain visually honest but temporary.

Motion:

- Story uses `split`; card groups use `cards`; CTA uses `statement`.
- Reveal semantics match the section structures.

Accessibility:

- Pull quote is semantic and uses logical border-start styling.
- H1 is protected by InnerPageHero.

Polish opportunities:

- Replace team placeholders with real CMS-backed content when available.
- Add stronger founder/agency credibility content before considering advanced
  visual effects.

### `/contact` And `/en/contact`

Visual:

- Hero proof card and contact cards are clear.
- Contact information is practical, but the form still feels more utilitarian
  than high-touch agency intake.

Motion:

- Contact cards use `cards`.
- Form section uses `editorial`, revealing the form as one block instead of
  animating every input. This is the correct accessibility/performance choice.

Accessibility:

- Form fields use labels and autocomplete.
- Disabled submit is clear as foundation-only behavior.

Polish opportunities:

- Turn contact methods into a stronger "choose your fastest path" module.
- Add response expectation and project-fit microcopy before backend submission.

### `/quote` And `/en/quote`

Visual:

- Strong structure for a future guided quote experience.
- The page is long and form-heavy by design; it may feel demanding on mobile
  until progressive behavior is implemented.

Motion:

- Form layout uses `editorial` as a single reveal block.
- CTA uses `statement`.

Accessibility:

- Fieldsets, legends, progress nav, `aria-current="step"`, and `aria-live`
  foundation are strong.

Polish opportunities:

- Future progressive step behavior should be designed before backend submission.
- Avoid page transitions on this route until form focus and scroll behavior are
  fully QA'd.

### `/industries` And `/en/industries`

Visual:

- Strongest post-homepage composition. Feature cards, localized indices, proof
  panel, and process section make this feel less generic.
- The two-column feature-card rhythm avoids earlier empty grid gaps.

Motion:

- Industry grid uses `cards`; process uses `split`; CTA uses `statement`.
- Reveal variants are semantically aligned with content.

Accessibility:

- Decorative numbers are hidden where appropriate.
- Breadcrumb and lists remain semantic.

Polish opportunities:

- Add real proof per industry when CMS data exists.
- Consider richer industry-specific evidence before advanced visuals.

### `/pricing` And `/en/pricing`

Visual:

- Pricing is conceptually strong: clarity, fit, and momentum rather than a
  generic table.
- Recommended plan treatment creates hierarchy.

Motion:

- Plan cards and FAQ use `cards`; CTA uses `statement`.
- No playful pricing animation or counters are present.

Accessibility:

- Arabic tracking fix is present on uppercase label pattern.
- Plans and FAQ are semantic lists.

Polish opportunities:

- Add a tighter comparison aid or "which plan fits" note later.
- Ensure recommended-card offset remains visually balanced on tablet.

### `/blog` And `/en/blog`

Visual:

- Editorial hero and featured article structure are a good foundation.
- Without post imagery or richer excerpts, the page still feels like a listing
  more than a publication.

Motion:

- Filters use `editorial`; article listing uses `cards`; CTA uses `statement`.
- Tags and metadata remain static and readable.

Accessibility:

- Empty state exists if no articles are loaded.
- Date formatting is localized.

Polish opportunities:

- Add article imagery or editorial thumbnail treatments.
- Build stronger category hierarchy after CMS content matures.

## Motion QA

Strengths:

- Micro-interactions are CSS-only and scoped to buttons, interactive cards,
  navigation, links, and social pills.
- Reduced motion removes transitions and transforms.
- Reveal uses dynamic GSAP loading through the shared helper.
- Reveal initial state uses `opacity: 0.01`, not `visibility: hidden` or
  `autoAlpha`, preserving screen reader safety.
- Heroes, H1s, Header, Footer, and first-viewport Trust Bar are not reveal
  animated.
- Lenis is disabled by default and gated by `NEXT_PUBLIC_ENABLE_SMOOTH_SCROLL`.
- SmoothScroll owns cleanup, RAF cancellation, and Lenis destruction.

Risks:

- Many public routes now have multiple reveal groups. This is acceptable for the
  MVP but should be watched on lower-end mobile devices.
- Card-grid reveals may feel repetitive across Services, Portfolio, Pricing, and
  Blog.
- No real-device reduced-motion QA is documented yet.

Verdict:

- Motion language is controlled, calm, and aligned with the approved system.
- No bounce, overshoot, page transition, parallax, 3D, Spline, or scroll-jacking
  behavior is active.

## Accessibility QA

Strengths:

- H1 and hero content are visible outside Reveal.
- Breadcrumbs use `nav`, `aria-label`, list semantics, and `aria-current`.
- Header navigation uses active route state and `aria-current="page"`.
- Forms use labels, autocomplete, fieldsets, legends, and disabled placeholders
  where backend behavior is intentionally absent.
- Focus-visible outlines are preserved in shared interactive elements.
- Reduced-motion users receive native scrolling and no reveal setup.

Risks:

- Disabled placeholder buttons are correctly non-focusable, but they can still
  feel visually like real CTAs to sighted users.
- Cookie preferences remains a placeholder and should become a real CMP trigger
  before production launch.
- Screen reader QA in Arabic and English still needs real device/browser
  confirmation.

## Performance QA

Strengths:

- GSAP and ScrollTrigger are dynamically imported.
- Lenis is dynamically imported and disabled by default.
- Page transitions are explicitly deferred.
- Reveal avoids layout properties and uses transform/opacity only.
- Section reveal starts follow the documented `top 90%` accessibility rule.
- No Three.js, Spline, cursor effects, page transitions, or decorative
  scroll-based effects are active.

Risks:

- Broad reveal rollout means GSAP loads on most public pages after hydration.
  This is expected, but bundle/runtime impact should be measured before launch.
- Portfolio and Blog will need image performance planning before visual assets
  are introduced.
- CMS env fallback warnings appear in local tests when Sanity public env vars are
  absent; this is not a visual blocker but should be configured in production.

## RTL/LTR QA

Strengths:

- Arabic root routing and English `/en` routing are consistently respected.
- Typography uses RTL-specific classes across headings, body, labels, and small
  text.
- Logical spacing and `border-s` patterns support direction changes.
- Micro-link transform origin mirrors in RTL.
- Localized number/date formatting appears in Industries, Pricing, and Blog.

Risks:

- Long Arabic card titles, tags, and CTA labels should be tested with real CMS
  content.
- Mixed-script metadata in Portfolio and Blog can create uneven line breaks.
- Future page transitions must not assume an `/ar` prefix.

## Mobile And Tablet QA

Strengths:

- Most grids use mobile-first one-column layouts with tablet two-column upgrades.
- Forms stack safely on mobile.
- Header avoids an unfinished mobile nav by showing a compact language pill.
- Smooth scrolling keeps native touch behavior unless explicitly enabled later.

Risks:

- Quote is long on mobile and needs future progressive interaction.
- Header mobile experience is still minimal; a full mobile menu is not yet built.
- Pricing recommended-card offset should be reviewed on tablet.
- Portfolio and Blog cards may become text-heavy on mobile once real CMS content
  expands.

## Risks Before Launch

1. Cookie Preferences is still a placeholder and should be wired to the approved
   consent system before production launch.
2. Contact and Quote forms are layout-only; production launch needs backend
   submission, validation, persistence, bot protection, and clear states.
3. Portfolio and Blog lack visual assets, reducing agency credibility.
4. Real device QA is still needed for Arabic, reduced motion, mobile/touch, and
   long CMS content.
5. Broad reveal rollout should be checked against Core Web Vitals and lower-end
   mobile performance before enabling any additional motion layer.

## Deferred Explicitly

- Page transitions remain deferred per `PAGE_TRANSITIONS_DECISION.md`.
- 3D, Spline, Three.js, shaders, and advanced scroll effects remain deferred.
- Lenis remains disabled by default until device QA approves activation.
- No advanced Hero animation should be considered until LCP is measured.
