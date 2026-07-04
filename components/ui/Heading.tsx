import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("max-w-[var(--container-narrow)] text-balance text-white", {
  variants: {
    level: {
      1: "text-h1 font-bold rtl:text-ar-h1 rtl:font-bold",
      2: "text-h2 font-semibold rtl:text-ar-h2 rtl:font-bold",
      3: "text-h3 font-semibold rtl:text-ar-h3 rtl:font-semibold",
      4: "text-h4 font-semibold",
      5: "text-h5 font-medium",
      6: "text-body font-semibold",
    },
    align: {
      start: "text-start",
      center: "text-center",
      end: "text-end",
    },
    tone: {
      primary: "text-white",
      body: "text-text-primary",
      secondary: "text-text-secondary",
      inverse: "text-text-inverse",
    },
  },
  defaultVariants: {
    level: 2,
    align: "start",
    tone: "primary",
  },
});

export type HeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, "children"> &
  VariantProps<typeof headingVariants> & {
    children: ReactNode;
  };

export function Heading({
  children,
  className,
  level = 2,
  align,
  tone,
  ...props
}: HeadingProps) {
  const classes = cn(headingVariants({ level, align, tone }), className);

  if (level === 1) {
    return (
      <h1 className={classes} {...props}>
        {children}
      </h1>
    );
  }

  if (level === 3) {
    return (
      <h3 className={classes} {...props}>
        {children}
      </h3>
    );
  }

  if (level === 4) {
    return (
      <h4 className={classes} {...props}>
        {children}
      </h4>
    );
  }

  if (level === 5) {
    return (
      <h5 className={classes} {...props}>
        {children}
      </h5>
    );
  }

  if (level === 6) {
    return (
      <h6 className={classes} {...props}>
        {children}
      </h6>
    );
  }

  return (
    <h2 className={classes} {...props}>
      {children}
    </h2>
  );
}
