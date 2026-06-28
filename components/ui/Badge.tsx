import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border text-xs font-medium leading-none",
  {
    variants: {
      variant: {
        red: "border-red-primary/40 bg-surface-elevated text-text-secondary",
        neutral: "border-border-light bg-surface-elevated text-text-secondary",
        glass:
          "border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-text-secondary",
      },
      size: {
        sm: "px-2.5 py-1",
        md: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "sm",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
