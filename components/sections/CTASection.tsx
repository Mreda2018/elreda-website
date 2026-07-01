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
};

export function CTASection({ heading, description, actions = [] }: CTASectionProps) {
  const headingId = "home-cta-heading";

  return (
    <Section
      tone="elevated"
      aria-labelledby={headingId}
      className="border-y border-[color:var(--glass-border)]"
    >
      <Container className="flex max-w-[var(--container-narrow)] flex-col items-center gap-[var(--space-8)] text-center">
        <div className="flex flex-col items-center gap-[var(--space-4)]">
          <Heading id={headingId} level={2} align="center">
            {heading}
          </Heading>
          <p className="text-body-lg text-text-secondary rtl:text-ar-body-lg">
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
