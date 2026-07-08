"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { withGsap } from "@/lib/animation/gsap";
import {
  animationBudget,
} from "@/lib/animation/presets";
import {
  getRevealFromVars,
  getRevealToVars,
  getRevealVariant,
  type RevealDirection,
  type RevealVariantName,
} from "@/lib/animation/reveal";
import { motionAttributes } from "@/lib/animation/tokens";
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
    let isActive = true;

    withGsap((gsap) => {
      const root = rootRef.current;

      if (!root) {
        return cleanup;
      }

      const revealVariant = getRevealVariant(variant);
      const direction = getElementDirection(root);
      const allTargets = itemSelector
        ? Array.from(root.querySelectorAll<HTMLElement>(itemSelector))
        : [root];
      const targets = itemSelector
        ? allTargets.slice(0, animationBudget.maxSimultaneousAnimations)
        : allTargets;

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
      if (isActive) {
        cleanup = fn;
        return;
      }

      fn();
    });

    return () => {
      isActive = false;
      cleanup();
    };
  }, [itemSelector, variant]);

  return (
    <div
      ref={rootRef}
      className={cn(className)}
      data-motion={motionAttributes.revealGroup}
      data-reveal={variant}
      data-reveal-id={revealId}
    >
      {children}
    </div>
  );
}
