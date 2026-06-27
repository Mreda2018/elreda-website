const SCROLL_TRIGGER_START = "top 90%" as const;

let gsapLoader: Promise<typeof import("gsap").gsap> | null = null;

export async function loadGsap() {
  gsapLoader ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.gsap;
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);

      return gsap;
    },
  );

  return gsapLoader;
}

export { SCROLL_TRIGGER_START };
