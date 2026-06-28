import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const sectionVariants = cva("relative w-full", {
  variants: {
    tone: {
      dark: "bg-black text-text-primary",
      surface: "bg-surface text-text-primary",
      elevated: "bg-surface-elevated text-text-primary",
      light: "bg-white text-text-inverse",
      transparent: "bg-transparent text-text-primary",
    },
    spacing: {
      none: "py-0",
      compact: "py-16",
      default: "py-section-y",
    },
  },
  defaultVariants: {
    tone: "transparent",
    spacing: "default",
  },
});

export type SectionProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionVariants>;

export function Section({ className, tone, spacing, ...props }: SectionProps) {
  return (
    <section
      className={cn(sectionVariants({ tone, spacing }), className)}
      {...props}
    />
  );
}
