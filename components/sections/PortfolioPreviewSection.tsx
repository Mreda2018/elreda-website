import type { ReactNode } from "react";

import { Badge, Button, Card, Container, Heading, Section } from "@/components/ui";

export type PortfolioPreviewItem = {
  id: string;
  title: ReactNode;
  description: ReactNode;
  category?: ReactNode;
};

export type PortfolioPreviewSectionProps = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  description: ReactNode;
  items: PortfolioPreviewItem[];
  ctaLabel?: ReactNode;
};

export function PortfolioPreviewSection({
  eyebrow,
  heading,
  description,
  items,
  ctaLabel,
}: PortfolioPreviewSectionProps) {
  const headingId = "portfolio-preview-heading";

  return (
    <Section tone="surface" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <header className="flex flex-col gap-[var(--space-6)] lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start">
            {eyebrow ? (
              <Badge variant="red" size="md">
                {eyebrow}
              </Badge>
            ) : null}

            <div className="flex flex-col gap-[var(--space-4)]">
              <Heading id={headingId} level={2}>
                {heading}
              </Heading>
              <p className="max-w-[var(--container-narrow)] text-body-lg text-text-secondary rtl:text-ar-body-lg">
                {description}
              </p>
            </div>
          </div>

          {ctaLabel ? (
            <Button
              variant="secondary"
              size="lg"
              aria-disabled="true"
              tabIndex={-1}
              className="pointer-events-none opacity-50"
            >
              {ctaLabel}
            </Button>
          ) : null}
        </header>

        <ul
          className="grid list-none gap-[var(--grid-gap)] p-0 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {items.map((item) => (
            <li key={item.id}>
              <Card
                variant="glass"
                padding="lg"
                className="flex min-h-64 flex-col text-start"
              >
                <div className="flex flex-col gap-[var(--space-5)]">
                  {item.category ? (
                    <Badge variant="glass" size="md">
                      {item.category}
                    </Badge>
                  ) : null}
                  <div className="flex flex-col gap-[var(--space-3)]">
                    <Heading level={3}>{item.title}</Heading>
                    <p className="text-body text-text-secondary rtl:text-ar-body">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
