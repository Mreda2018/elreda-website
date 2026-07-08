import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("micro-card relative rounded-md border shadow-sm", {
  variants: {
    variant: {
      glass:
        "border-[color:var(--glass-border)] bg-[color:color-mix(in_srgb,var(--glass-bg)_78%,var(--surface)_22%)] backdrop-blur-[20px]",
      surface: "border-border bg-surface shadow-md",
      elevated: "border-border-light bg-surface-elevated shadow-lg",
    },
    padding: {
      none: "p-0",
      sm: "p-5",
      md: "p-7",
      lg: "p-6 sm:p-8 lg:p-10",
    },
  },
  defaultVariants: {
    variant: "glass",
    padding: "lg",
  },
});

export const cardCompositionVariants = cva("", {
  variants: {
    composition: {
      feature:
        "flex h-full min-h-[calc(var(--space-48)+var(--space-8))] flex-col gap-[var(--space-6)] text-start",
      editorial:
        "grid gap-[var(--space-8)] text-start lg:grid-cols-[0.8fr_1.2fr]",
      metric:
        "border-t border-[color:var(--glass-border)] pt-[var(--space-5)]",
      compact: "flex h-full flex-col gap-[var(--space-4)] text-start",
    },
  },
});

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> &
  VariantProps<typeof cardCompositionVariants>;

export function Card({
  className,
  variant,
  padding,
  composition,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        cardVariants({ variant, padding }),
        cardCompositionVariants({ composition }),
        className,
      )}
      {...props}
    />
  );
}
