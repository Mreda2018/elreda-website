"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import {
  getRevealFromVars,
  getRevealToVars,
  getRevealVariant,
  withGsap,
  type RevealDirection,
  type RevealVariantName,
} from "@/lib/animation";
import { cn } from "@/lib/utils";

export type RevealProps = {
  children: ReactNode;
  variant: RevealVariantName;
  itemSelector?: string;
  className?: string;
};

function getElementDirection(element: HTMLElement): RevealDirection {
  return window.getComputedStyle(element).direction === "rtl" ? "rtl" : "ltr";
}

export function Reveal({
  children,
  variant,
  itemSelector,
  className,
}: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealId = useId();

  useEffect(() => {
    let cleanup = () => {};

    withGsap((gsap) => {
      const root = rootRef.current;

      if (!root) {
        return cleanup;
      }

      const revealVariant = getRevealVariant(variant);
      const direction = getElementDirection(root);
      const targets = itemSelector
        ? Array.from(root.querySelectorAll<HTMLElement>(itemSelector))
        : [root];

      if (targets.length === 0) {
        return cleanup;
      }

      root.setAttribute("data-motion-state", "ready");

      const context = gsap.context(() => {
        gsap.fromTo(targets, getRevealFromVars(revealVariant, direction), {
          ...getRevealToVars(revealVariant),
          scrollTrigger: {
            trigger: root,
            start: revealVariant.trigger.start,
            once: revealVariant.trigger.once,
          },
        });
      }, root);

      return () => {
        root.removeAttribute("data-motion-state");
        context.revert();
      };
    }).then((fn) => {
      cleanup = fn;
    });

    return () => cleanup();
  }, [itemSelector, variant]);

  return (
    <div
      ref={rootRef}
      className={cn(className)}
      data-motion="reveal-demo"
      data-reveal={variant}
      data-reveal-id={revealId}
    >
      {children}
    </div>
  );
}
