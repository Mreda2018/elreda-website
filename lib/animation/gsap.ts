import { prefersReducedMotion } from "./preferences";
import { scrollTriggerDefaults } from "./tokens";

const SCROLL_TRIGGER_START = scrollTriggerDefaults.start;

let gsapLoader: Promise<typeof import("gsap").gsap> | null = null;
let updateScrollTrigger: (() => void) | null = null;

export async function loadGsap() {
  if (typeof window === "undefined") {
    return null;
  }

  gsapLoader ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.defaults(scrollTriggerDefaults);
      updateScrollTrigger = () => ScrollTrigger.update();

      return gsap;
    },
  );

  return gsapLoader;
}

export async function loadGsapWhenMotionAllowed() {
  if (prefersReducedMotion()) {
    return null;
  }

  return loadGsap();
}

export async function withGsap(
  setup: (gsap: typeof import("gsap").gsap) => void | (() => void),
) {
  const gsap = await loadGsapWhenMotionAllowed();

  if (!gsap) {
    return () => {};
  }

  return setup(gsap) ?? (() => {});
}

export function updateLoadedScrollTrigger() {
  updateScrollTrigger?.();
}

export { SCROLL_TRIGGER_START };
