"use client";

import { useActionState } from "react";

import {
  initialSubmissionActionState,
  type SubmissionActionState,
} from "@/app/actions/_shared/submissionState";
import { submitContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { SelectField, TextAreaField, TextField } from "./FormField";

type ContactFormOption = {
  value: string;
  label: string;
};

export type ContactFormProps = {
  locale: Locale;
  ariaLabelledBy?: string;
  labels: {
    name: string;
    company: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    honeypot: string;
  };
  placeholders: {
    name: string;
    company: string;
    email: string;
    phone: string;
    message: string;
    service: string;
  };
  serviceOptions: ContactFormOption[];
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
      aria-atomic="true"
    >
      {state.message}
    </p>
  );
}

export function ContactForm({
  locale,
  ariaLabelledBy,
  labels,
  placeholders,
  serviceOptions,
  submitLabel,
}: ContactFormProps) {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialSubmissionActionState,
  );

  return (
    <form
      className="grid gap-[var(--space-6)]"
      action={formAction}
      aria-labelledby={ariaLabelledBy}
      aria-busy={pending}
    >
      <input type="hidden" name="locale" value={locale} />
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">{labels.honeypot}</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-[var(--space-5)] sm:grid-cols-2">
        <TextField
          id="contact-name"
          name="name"
          label={labels.name}
          placeholder={placeholders.name}
          autoComplete="name"
          required
        />
        <TextField
          id="contact-company"
          name="company"
          label={labels.company}
          placeholder={placeholders.company}
          autoComplete="organization"
        />
        <TextField
          id="contact-email"
          name="email"
          type="email"
          label={labels.email}
          placeholder={placeholders.email}
          autoComplete="email"
          required
        />
        <TextField
          id="contact-phone"
          name="phone"
          type="tel"
          label={labels.phone}
          placeholder={placeholders.phone}
          autoComplete="tel"
        />
      </div>

      <SelectField
        id="contact-service"
        name="service"
        label={labels.service}
        placeholder={placeholders.service}
        options={serviceOptions}
      />
      <TextAreaField
        id="contact-message"
        name="message"
        label={labels.message}
        placeholder={placeholders.message}
        required
      />
      <FormStatus state={state} />
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? `${submitLabel}...` : submitLabel}
      </Button>
    </form>
  );
}
