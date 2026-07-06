export const motionDurations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
} as const;

export const gsapEasings = {
  out: "power2.out",
  in: "power2.in",
  inOut: "power2.inOut",
  premium: "power3.out",
} as const satisfies Record<string, string>;

export const cssEasings = {
  out: "var(--ease-out)",
  in: "var(--ease-in)",
  inOut: "var(--ease-in-out)",
  spring: "var(--ease-spring)",
  premium: "var(--ease-premium)",
} as const;

export const motionStaggers = {
  tight: 0.04,
  normal: 0.08,
  loose: 0.12,
} as const;

export const scrollTriggerDefaults = {
  start: "top 90%",
  once: true,
  toggleActions: "play none none none",
} as const;

export const motionAttributes = {
  fadeUp: "fade-up",
  reveal: "reveal",
  revealGroup: "reveal-group",
  staggerGroup: "stagger-group",
  parallax: "parallax",
  sectionEntrance: "section-entrance",
} as const;
