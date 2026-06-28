import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Primary CTAs intentionally use flat --red-button instead of the brand gradient
// so every rendered state keeps consistent WCAG AA contrast.
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-body font-medium leading-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-button disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-red-button text-white shadow-red hover:brightness-110",
        secondary:
          "border border-border-light bg-transparent text-white shadow-sm hover:bg-[color:var(--glass-bg)]",
        ghost:
          "bg-transparent text-text-secondary underline-offset-4 hover:text-white hover:underline",
        subtle:
          "border border-border-light bg-[color:var(--glass-bg)] text-text-primary",
      },
      size: {
        sm: "h-10 px-4 text-small font-medium",
        md: "h-12 px-7",
        lg: "h-14 px-8",
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
