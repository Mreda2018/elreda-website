import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full px-section-x", {
  variants: {
    size: {
      default: "max-w-container",
      narrow: "max-w-narrow",
      wide: "max-w-wide",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type ContainerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof containerVariants>;

export function Container({ className, size, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}
