"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { buttonVariants, Container, Heading, Section } from "@/components/ui";
import { getLocalizedHref, type Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export type CTASectionAction = {
  label: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
};

export type CTASectionProps = {
  heading: ReactNode;
  description: ReactNode;
  actions?: CTASectionAction[];
  headingId?: string;
};

function getDefaultActionHref(pathname: string, index: number): string {
  const pathWithoutLocale =
    pathname.replace(/^\/(?:ar|en)(?=\/|$)/, "").replace(/\/$/, "") || "/";

  if (pathWithoutLocale === "/contact") {
    return index === 0 ? "/quote" : "/services";
  }

  if (pathWithoutLocale === "/quote") {
    return index === 0 ? "/contact" : "/services";
  }

  return index === 0 ? "/quote" : "/contact";
}

export function CTASection({
  heading,
  description,
  actions = [],
  headingId = "site-cta-heading",
}: CTASectionProps) {
  const pathname = usePathname();
  const locale: Locale =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ar";

  return (
    <Section
      tone="elevated"
      aria-labelledby={headingId}
      className="relative overflow-hidden border-y border-[color:var(--glass-border)] bg-[image:var(--gradient-subtle)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-brand)]"
      />
      <Container className="flex max-w-5xl flex-col items-center gap-[var(--space-8)] text-center md:gap-[var(--space-10)]">
        <div className="flex flex-col items-center gap-[var(--space-5)] px-0 sm:border-x sm:border-[color:var(--glass-border)] sm:px-[var(--space-6)] md:gap-[var(--space-6)] md:px-[var(--space-12)]">
          <Heading id={headingId} level={2} align="center">
            {heading}
          </Heading>
          <p className="max-w-[var(--container-narrow)] text-body-lg leading-relaxed text-text-secondary rtl:text-ar-body-lg">
            {description}
          </p>
        </div>

        {actions.length > 0 ? (
          <div className="flex w-full flex-col justify-center gap-[var(--space-4)] sm:w-auto sm:flex-row">
            {actions.map((action, index) => (
              <Link
                key={`${action.variant ?? "primary"}-${index}`}
                href={getLocalizedHref(
                  locale,
                  action.href ?? getDefaultActionHref(pathname, index),
                )}
                className={cn(
                  buttonVariants({
                    variant: action.variant ?? "primary",
                    size: "lg",
                  }),
                  "w-full sm:w-auto",
                )}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
