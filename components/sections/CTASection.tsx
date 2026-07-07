import type { ReactNode } from "react";

import { Button, Container, Heading, Section } from "@/components/ui";

export type CTASectionAction = {
  label: ReactNode;
  variant?: "primary" | "secondary";
};

export type CTASectionProps = {
  heading: ReactNode;
  description: ReactNode;
  actions?: CTASectionAction[];
  headingId?: string;
};

export function CTASection({
  heading,
  description,
  actions = [],
  headingId = "site-cta-heading",
}: CTASectionProps) {
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
      <Container className="flex max-w-5xl flex-col items-center gap-[var(--space-10)] text-center">
        <div className="flex flex-col items-center gap-[var(--space-6)] border-x border-[color:var(--glass-border)] px-[var(--space-6)] md:px-[var(--space-12)]">
          <Heading id={headingId} level={2} align="center">
            {heading}
          </Heading>
          <p className="max-w-[var(--container-narrow)] text-body-lg leading-relaxed text-text-secondary rtl:text-ar-body-lg">
            {description}
          </p>
        </div>

        {actions.length > 0 ? (
          <div className="flex w-full flex-col justify-center gap-[var(--space-4)] sm:w-auto sm:flex-row">
            {actions.map((action) => (
              <Button
                key={`${action.variant ?? "primary"}-${String(action.label)}`}
                variant={action.variant ?? "primary"}
                size="lg"
                aria-disabled="true"
                tabIndex={-1}
                className="pointer-events-none opacity-50"
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
