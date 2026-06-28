import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const dividerVariants = cva("shrink-0 border-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full min-h-6 w-px",
    },
    tone: {
      default: "bg-border",
      light: "bg-border-light",
      glass: "bg-[color:var(--glass-border)]",
      red: "bg-red-primary/40",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    tone: "default",
  },
});

export type DividerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dividerVariants>;

export function Divider({
  className,
  orientation,
  tone,
  ...props
}: DividerProps) {
  const separatorOrientation = orientation ?? "horizontal";

  return (
    <div
      role="separator"
      aria-orientation={separatorOrientation}
      className={cn(
        dividerVariants({ orientation: separatorOrientation, tone }),
        className,
      )}
      {...props}
    />
  );
}
