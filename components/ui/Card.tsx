import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("relative rounded-md border shadow-sm", {
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
      lg: "p-8 lg:p-10",
    },
  },
  defaultVariants: {
    variant: "glass",
    padding: "lg",
  },
});

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props} />
  );
}
