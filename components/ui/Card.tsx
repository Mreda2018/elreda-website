import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-md border", {
  variants: {
    variant: {
      glass:
        "border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] backdrop-blur-[20px]",
      surface: "border-border bg-surface",
      elevated: "border-border-light bg-surface-elevated shadow-md",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
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
