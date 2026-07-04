import { gsapEasings, motionDurations, motionStaggers } from "./tokens";

export type MotionTransformOrigin =
  | "center center"
  | "center top"
  | "center bottom"
  | "left center"
  | "right center";

export type MotionPreset = {
  duration: number;
  easing: (typeof gsapEasings)[keyof typeof gsapEasings];
  delay: number;
  stagger: number;
  transformOrigin?: MotionTransformOrigin;
};

const navigationPresets = {
  hover: {
    duration: motionDurations.fast,
    easing: gsapEasings.out,
    delay: 0,
    stagger: 0,
    transformOrigin: "center center",
  },
  active: {
    duration: motionDurations.normal,
    easing: gsapEasings.premium,
    delay: 0,
    stagger: 0,
    transformOrigin: "center bottom",
  },
  enter: {
    duration: motionDurations.slow,
    easing: gsapEasings.premium,
    delay: 0,
    stagger: motionStaggers.tight,
    transformOrigin: "center top",
  },
} satisfies Record<string, MotionPreset>;

export const motionPresets = {
  hover: {
    duration: motionDurations.fast,
    easing: gsapEasings.out,
    delay: 0,
    stagger: 0,
    transformOrigin: "center center",
  },
  press: {
    duration: motionDurations.instant,
    easing: gsapEasings.out,
    delay: 0,
    stagger: 0,
    transformOrigin: "center center",
  },
  focus: {
    duration: motionDurations.fast,
    easing: gsapEasings.out,
    delay: 0,
    stagger: 0,
    transformOrigin: "center center",
  },
  reveal: {
    duration: motionDurations.slower,
    easing: gsapEasings.premium,
    delay: 0,
    stagger: motionStaggers.tight,
    transformOrigin: "center bottom",
  },
  stagger: {
    duration: motionDurations.slow,
    easing: gsapEasings.premium,
    delay: 0,
    stagger: motionStaggers.normal,
  },
  section: {
    reveal: {
      duration: motionDurations.slower,
      easing: gsapEasings.premium,
      delay: 0,
      stagger: motionStaggers.normal,
      transformOrigin: "center bottom",
    },
    enter: {
      duration: motionDurations.slow,
      easing: gsapEasings.out,
      delay: 0,
      stagger: motionStaggers.tight,
      transformOrigin: "center bottom",
    },
  },
  card: {
    hover: {
      duration: motionDurations.fast,
      easing: gsapEasings.out,
      delay: 0,
      stagger: 0,
      transformOrigin: "center center",
    },
    press: {
      duration: motionDurations.instant,
      easing: gsapEasings.out,
      delay: 0,
      stagger: 0,
      transformOrigin: "center center",
    },
    enter: {
      duration: motionDurations.slow,
      easing: gsapEasings.premium,
      delay: 0,
      stagger: motionStaggers.normal,
      transformOrigin: "center bottom",
    },
  },
  button: {
    hover: {
      duration: motionDurations.fast,
      easing: gsapEasings.out,
      delay: 0,
      stagger: 0,
      transformOrigin: "center center",
    },
    press: {
      duration: motionDurations.instant,
      easing: gsapEasings.out,
      delay: 0,
      stagger: 0,
      transformOrigin: "center center",
    },
    focus: {
      duration: motionDurations.fast,
      easing: gsapEasings.out,
      delay: 0,
      stagger: 0,
      transformOrigin: "center center",
    },
  },
  nav: navigationPresets,
  navigation: navigationPresets,
  hero: {
    content: {
      duration: motionDurations.slower,
      easing: gsapEasings.premium,
      delay: motionStaggers.tight,
      stagger: motionStaggers.tight,
      transformOrigin: "center bottom",
    },
  },
} as const;

export const animationBudget = {
  maxSimultaneousAnimations: 6,
  maxStagger: motionStaggers.loose,
  maxDuration: motionDurations.slower,
  maxBlurPx: 16,
  maxTransformPx: 48,
  minInitialOpacity: 0.01,
} as const;

