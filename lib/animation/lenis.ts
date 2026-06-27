import Lenis from "lenis";

export const lenisOptions = {
  duration: 1.1,
  easing: (time: number) => Math.min(1, 1.001 - 2 ** (-10 * time)),
  smoothWheel: true,
  syncTouch: false,
} satisfies ConstructorParameters<typeof Lenis>[0];

export function createLenis() {
  return new Lenis(lenisOptions);
}
