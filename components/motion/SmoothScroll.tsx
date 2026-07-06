"use client";

import { useEffect, type ReactNode } from "react";

import {
  createLenis,
  updateLoadedScrollTrigger,
  usePrefersReducedMotion,
  type LenisInstance,
} from "@/lib/animation";

export type SmoothScrollProps = {
  children: ReactNode;
  enabled?: boolean;
};

export function SmoothScroll({
  children,
  enabled = false,
}: SmoothScrollProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      return;
    }

    let frameId = 0;
    let isDisposed = false;
    let lenis: LenisInstance | null = null;
    let unsubscribeScroll: (() => void) | undefined;

    createLenis().then((instance) => {
      if (isDisposed) {
        instance?.destroy();
        return;
      }

      if (!instance) {
        return;
      }

      lenis = instance;
      unsubscribeScroll = lenis.on("scroll", updateLoadedScrollTrigger);

      const raf = (time: number) => {
        lenis?.raf(time);
        frameId = window.requestAnimationFrame(raf);
      };

      frameId = window.requestAnimationFrame(raf);
      updateLoadedScrollTrigger();
    });

    return () => {
      isDisposed = true;

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      unsubscribeScroll?.();
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled, prefersReducedMotion]);

  return children;
}
