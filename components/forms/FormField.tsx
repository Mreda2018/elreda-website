import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type FieldOption = {
  value: string;
  label: string;
};

type BaseFieldProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  className?: string;
};

const fieldControlClassName =
  "min-h-12 w-full rounded-md border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-[var(--space-4)] py-[var(--space-3)] text-body text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-red-button focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-button rtl:text-ar-body";

function FieldShell({ id, label, hint, className, children }: BaseFieldProps & {
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-[var(--space-2)] text-start", className)}>
      <label
        htmlFor={id}
        className="text-small font-medium text-text-primary rtl:text-ar-small"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-small text-text-muted rtl:text-ar-small">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export type TextFieldProps = BaseFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

export function TextField({ id, label, hint, className, ...props }: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <input
        id={id}
        aria-describedby={hintId}
        className={fieldControlClassName}
        {...props}
      />
    </FieldShell>
  );
}

export type TextAreaFieldProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;

export function TextAreaField({
  id,
  label,
  hint,
  className,
  rows = 5,
  ...props
}: TextAreaFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <textarea
        id={id}
        rows={rows}
        aria-describedby={hintId}
        className={cn(fieldControlClassName, "resize-y")}
        {...props}
      />
    </FieldShell>
  );
}

export type SelectFieldProps = BaseFieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className"> & {
    options: FieldOption[];
    placeholder?: string;
  };

export function SelectField({
  id,
  label,
  hint,
  className,
  options,
  placeholder,
  ...props
}: SelectFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <select
        id={id}
        aria-describedby={hintId}
        className={fieldControlClassName}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
