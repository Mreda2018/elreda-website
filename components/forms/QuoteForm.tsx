"use client";

import { useActionState } from "react";

import {
  initialSubmissionActionState,
  type SubmissionActionState,
} from "@/app/actions/_shared/submissionState";
import { submitQuoteForm } from "@/app/actions/quote";
import { Button } from "@/components/ui";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { OptionCardField } from "./OptionCardField";
import { SelectField, TextAreaField, TextField } from "./FormField";

type FieldOption = {
  value: string;
  label: string;
  description?: string;
};

export type QuoteFormProps = {
  locale: Locale;
  ariaLabelledBy?: string;
  steps: {
    label: string;
    current: string;
    items: string[];
  };
  labels: {
    services: string;
    details: string;
    budget: string;
    timeline: string;
    contact: string;
    company: string;
    name: string;
    message: string;
    email: string;
    phone: string;
    preferredContact: string;
    honeypot: string;
  };
  placeholders: {
    company: string;
    name: string;
    message: string;
    email: string;
    phone: string;
  };
  serviceOptions: FieldOption[];
  budgetOptions: FieldOption[];
  timelineOptions: FieldOption[];
  preferredContactOptions: FieldOption[];
  submitLabel: string;
};

function FormStatus({ state }: { state: SubmissionActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <p
      className={cn(
        "rounded-md border px-[var(--space-4)] py-[var(--space-3)] text-small rtl:text-ar-small",
        state.status === "success"
          ? "border-success/40 bg-success/10 text-text-primary"
          : "border-error/40 bg-error/10 text-text-primary",
      )}
      role={state.status === "error" ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}

export function QuoteForm({
  locale,
  ariaLabelledBy,
  steps,
  labels,
  placeholders,
  serviceOptions,
  budgetOptions,
  timelineOptions,
  preferredContactOptions,
  submitLabel,
}: QuoteFormProps) {
  const [state, formAction, pending] = useActionState(
    submitQuoteForm,
    initialSubmissionActionState,
  );

  return (
    <form
      className="grid gap-[var(--space-10)]"
      action={formAction}
      aria-labelledby={ariaLabelledBy}
    >
      <input type="hidden" name="locale" value={locale} />
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="quote-website">{labels.honeypot}</label>
        <input
          id="quote-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <nav aria-label={steps.label}>
        <ol className="grid list-none gap-[var(--space-3)] p-0 md:grid-cols-4" role="list">
          {steps.items.map((item, index) => (
            <li
              key={item}
              aria-current={index === 0 ? "step" : undefined}
              className="rounded-md border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-[var(--space-4)] text-small text-text-secondary rtl:text-ar-small"
            >
              <span
                aria-hidden="true"
                className="mb-[var(--space-2)] block font-body font-semibold text-red-primary"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={index === 0 ? "text-text-primary" : undefined}>
                {item}
              </span>
            </li>
          ))}
        </ol>
      </nav>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {steps.current}
      </div>

      <fieldset className="grid gap-[var(--space-5)] border-0 p-0">
        <legend className="mb-[var(--space-5)] text-h4 font-semibold text-white rtl:text-ar-h3">
          {labels.services}
        </legend>
        <div className="grid gap-[var(--grid-gap)] md:grid-cols-2 xl:grid-cols-3">
          {serviceOptions.map((option) => (
            <OptionCardField
              key={option.value}
              name="services"
              value={option.value}
              label={option.label}
              description={option.description}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-[var(--space-5)] border-0 p-0">
        <legend className="mb-[var(--space-5)] text-h4 font-semibold text-white rtl:text-ar-h3">
          {labels.details}
        </legend>
        <div className="grid gap-[var(--space-5)] sm:grid-cols-2">
          <TextField
            id="quote-company"
            name="company"
            label={labels.company}
            placeholder={placeholders.company}
            autoComplete="organization"
          />
          <TextField
            id="quote-name"
            name="name"
            label={labels.name}
            placeholder={placeholders.name}
            autoComplete="name"
            required
          />
        </div>
        <TextAreaField
          id="quote-message"
          name="message"
          label={labels.message}
          placeholder={placeholders.message}
          required
        />
      </fieldset>

      <div className="grid gap-[var(--grid-gap)] lg:grid-cols-2">
        <fieldset className="border-0 p-0">
          <legend className="mb-[var(--space-5)] text-h4 font-semibold text-white rtl:text-ar-h3">
            {labels.budget}
          </legend>
          <div className="grid gap-[var(--space-3)]">
            {budgetOptions.map((option) => (
              <OptionCardField
                key={option.value}
                type="radio"
                name="budget"
                value={option.value}
                label={option.label}
                required
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="border-0 p-0">
          <legend className="mb-[var(--space-5)] text-h4 font-semibold text-white rtl:text-ar-h3">
            {labels.timeline}
          </legend>
          <div className="grid gap-[var(--space-3)]">
            {timelineOptions.map((option) => (
              <OptionCardField
                key={option.value}
                type="radio"
                name="timeline"
                value={option.value}
                label={option.label}
                required
              />
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset className="grid gap-[var(--space-5)] border-0 p-0">
        <legend className="mb-[var(--space-5)] text-h4 font-semibold text-white rtl:text-ar-h3">
          {labels.contact}
        </legend>
        <div className="grid gap-[var(--space-5)] sm:grid-cols-2">
          <TextField
            id="quote-email"
            name="email"
            type="email"
            label={labels.email}
            placeholder={placeholders.email}
            autoComplete="email"
            required
          />
          <TextField
            id="quote-phone"
            name="phone"
            type="tel"
            label={labels.phone}
            placeholder={placeholders.phone}
            autoComplete="tel"
          />
          <SelectField
            id="quote-preferred-contact"
            name="preferredContact"
            label={labels.preferredContact}
            options={preferredContactOptions}
            className="sm:col-span-2"
            required
          />
        </div>
      </fieldset>

      <FormStatus state={state} />
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? `${submitLabel}...` : submitLabel}
      </Button>
    </form>
  );
}
