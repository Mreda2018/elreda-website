import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-body text-small font-semibold leading-none text-text-secondary rtl:text-ar-small",
  {
    variants: {
      variant: {
        red: "border-red-primary/40 bg-red-subtle",
        neutral: "border-border-light bg-surface-elevated",
        glass:
          "border-[color:var(--glass-border)] bg-[color:var(--glass-bg)]",
      },
      size: {
        sm: "px-3 py-1.5",
        md: "px-4 py-2",
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
