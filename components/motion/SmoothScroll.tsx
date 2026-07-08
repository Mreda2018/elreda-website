"use client";

import { useEffect, type ReactNode } from "react";

import {
  createLenis,
  type LenisInstance,
} from "@/lib/animation/lenis";
import { updateLoadedScrollTrigger } from "@/lib/animation/gsap";
import { usePrefersReducedMotion } from "@/lib/animation/usePrefersReducedMotion";

export type SmoothScrollProps = {
  children: ReactNode;
  enabled?: boolean;
};

export function SmoothScroll({
  children,
  enabled = false,
}: SmoothScrollProps) {
  if (!enabled) {
    return children;
  }

  return <SmoothScrollRuntime>{children}</SmoothScrollRuntime>;
}

function SmoothScrollRuntime({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
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
  }, [prefersReducedMotion]);

  return children;
}
