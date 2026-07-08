import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type OptionCardFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  label: string;
  description?: ReactNode;
  className?: string;
};

export function OptionCardField({
  id,
  label,
  description,
  className,
  type = "checkbox",
  ...props
}: OptionCardFieldProps) {
  const inputId = id ?? `${props.name}-${props.value}`;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex min-h-12 cursor-pointer flex-col gap-[var(--space-3)] rounded-md border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-[var(--space-4)] text-start transition-colors focus-within:border-red-button focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-red-button sm:h-full sm:p-[var(--space-5)]",
        className,
      )}
    >
      <span className="flex items-start gap-[var(--space-3)]">
        <input
          id={inputId}
          type={type}
          className="mt-1 size-4 accent-red-button"
          {...props}
        />
        <span className="text-body font-semibold text-white rtl:text-ar-body">
          {label}
        </span>
      </span>
      {description ? (
        <span className="text-small text-text-secondary rtl:text-ar-small">
          {description}
        </span>
      ) : null}
    </label>
  );
}
