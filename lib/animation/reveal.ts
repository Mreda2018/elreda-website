import {
  gsapEasings,
  motionDurations,
  motionStaggers,
  scrollTriggerDefaults,
} from "./tokens";

export type RevealVariantName =
  | "editorial"
  | "statement"
  | "cards"
  | "metrics"
  | "stagger"
  | "split"
  | "hero-secondary";

export type RevealAxis = "x" | "y";
export type RevealDirection = "ltr" | "rtl";

export type RevealReducedMotionBehavior = {
  animate: false;
  finalState: "visible";
};

export type RevealVariant = {
  trigger: {
    start: typeof scrollTriggerDefaults.start;
    once: typeof scrollTriggerDefaults.once;
  };
  stagger: number;
  duration: number;
  easing: (typeof gsapEasings)[keyof typeof gsapEasings];
  distance: number;
  axis: RevealAxis;
  reducedMotion: RevealReducedMotionBehavior;
};

export const revealVariants = {
  editorial: {
    trigger: {
      start: scrollTriggerDefaults.start,
      once: true,
    },
    stagger: motionStaggers.tight,
    duration: motionDurations.slower,
    easing: gsapEasings.premium,
    distance: 32,
    axis: "y",
    reducedMotion: {
      animate: false,
      finalState: "visible",
    },
  },
  statement: {
    trigger: {
      start: scrollTriggerDefaults.start,
      once: true,
    },
    stagger: 0,
    duration: motionDurations.slower,
    easing: gsapEasings.premium,
    distance: 24,
    axis: "y",
    reducedMotion: {
      animate: false,
      finalState: "visible",
    },
  },
  cards: {
    trigger: {
      start: scrollTriggerDefaults.start,
      once: true,
    },
    stagger: motionStaggers.normal,
    duration: motionDurations.slow,
    easing: gsapEasings.premium,
    distance: 28,
    axis: "y",
    reducedMotion: {
      animate: false,
      finalState: "visible",
    },
  },
  metrics: {
    trigger: {
      start: scrollTriggerDefaults.start,
      once: true,
    },
    stagger: motionStaggers.tight,
    duration: motionDurations.slow,
    easing: gsapEasings.out,
    distance: 18,
    axis: "y",
    reducedMotion: {
      animate: false,
      finalState: "visible",
    },
  },
  stagger: {
    trigger: {
      start: scrollTriggerDefaults.start,
      once: true,
    },
    stagger: motionStaggers.normal,
    duration: motionDurations.slow,
    easing: gsapEasings.premium,
    distance: 24,
    axis: "y",
    reducedMotion: {
      animate: false,
      finalState: "visible",
    },
  },
  split: {
    trigger: {
      start: scrollTriggerDefaults.start,
      once: true,
    },
    stagger: motionStaggers.tight,
    duration: motionDurations.slower,
    easing: gsapEasings.premium,
    distance: 32,
    axis: "x",
    reducedMotion: {
      animate: false,
      finalState: "visible",
    },
  },
  "hero-secondary": {
    trigger: {
      start: scrollTriggerDefaults.start,
      once: true,
    },
    stagger: motionStaggers.tight,
    duration: motionDurations.slower,
    easing: gsapEasings.premium,
    distance: 16,
    axis: "y",
    reducedMotion: {
      animate: false,
      finalState: "visible",
    },
  },
} as const satisfies Record<RevealVariantName, RevealVariant>;

export function getRevealVariant(variant: RevealVariantName): RevealVariant {
  return revealVariants[variant];
}

export function getRevealFromVars(
  variant: RevealVariant,
  direction: RevealDirection = "ltr",
) {
  const axis = variant.axis === "x" ? "x" : "y";
  const distance =
    axis === "x" && direction === "rtl" ? -variant.distance : variant.distance;

  return {
    autoAlpha: 0,
    [axis]: distance,
  };
}

export function getRevealToVars(variant: RevealVariant) {
  const axis = variant.axis === "x" ? "x" : "y";

  return {
    autoAlpha: 1,
    [axis]: 0,
    duration: variant.duration,
    ease: variant.easing,
    stagger: variant.stagger,
  };
}
