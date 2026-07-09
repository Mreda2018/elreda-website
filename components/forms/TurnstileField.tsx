"use client";

import Script from "next/script";

import type { Locale } from "@/lib/i18n/routing";

export type TurnstileFieldProps = {
  id: string;
  locale: Locale;
  label: string;
  help: string;
  unavailable: string;
};

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js";

export function TurnstileField({
  id,
  locale,
  label,
  help,
  unavailable,
}: TurnstileFieldProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const descriptionId = `${id}-description`;

  return (
    <div className="flex flex-col gap-[var(--space-3)] text-start">
      <p id={id} className="text-small font-medium text-text-primary rtl:text-ar-small">
        {label}
      </p>
      <p id={descriptionId} className="text-small text-text-muted rtl:text-ar-small">
        {help}
      </p>
      {siteKey ? (
        <>
          <Script src={TURNSTILE_SCRIPT_SRC} strategy="afterInteractive" />
          <div
            className="cf-turnstile min-h-[65px]"
            data-sitekey={siteKey}
            data-theme="dark"
            data-language={locale}
            data-response-field-name="cf-turnstile-response"
            data-refresh-expired="auto"
            aria-labelledby={id}
            aria-describedby={descriptionId}
          />
        </>
      ) : (
        <>
          <input type="hidden" name="cf-turnstile-response" value="" />
          <p
            className="rounded-md border border-warning/40 bg-warning/10 px-[var(--space-4)] py-[var(--space-3)] text-small text-text-primary rtl:text-ar-small"
            role="status"
            aria-atomic="true"
          >
            {unavailable}
          </p>
        </>
      )}
    </div>
  );
}
