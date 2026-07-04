import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Primary CTAs intentionally use flat --red-button instead of the brand gradient
// so every rendered state keeps consistent WCAG AA contrast.
export const buttonVariants = cva(
  "micro-button inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border text-body font-semibold leading-none shadow-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-button disabled:pointer-events-none disabled:opacity-50 rtl:text-ar-body",
  {
    variants: {
      variant: {
        primary:
          "border-red-button bg-red-button text-white shadow-red hover:bg-red-dark",
        secondary:
          "border-border-light bg-[color:var(--glass-bg)] text-white hover:border-red-primary/60 hover:bg-surface-elevated",
        ghost:
          "border-transparent bg-transparent text-text-secondary shadow-none underline-offset-4 hover:text-white hover:underline",
        subtle:
          "border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-text-primary hover:border-border-light hover:bg-surface-elevated",
      },
      size: {
        sm: "h-10 px-4 text-small rtl:text-ar-small",
        md: "h-12 px-7 text-body rtl:text-ar-body",
        lg: "h-14 px-9 text-body rtl:text-ar-body",
        icon: "size-11 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";
