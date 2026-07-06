import type Lenis from "lenis";

import { prefersReducedMotion } from "./preferences";

export type LenisInstance = Lenis;

export const lenisOptions = {
  duration: 1.1,
  easing: (time: number) => Math.min(1, 1.001 - 2 ** (-10 * time)),
  smoothWheel: true,
  syncTouch: false,
} satisfies ConstructorParameters<typeof Lenis>[0];

export async function createLenis(): Promise<LenisInstance | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (prefersReducedMotion()) {
    return null;
  }

  const { default: Lenis } = await import("lenis");

  return new Lenis(lenisOptions);
}
