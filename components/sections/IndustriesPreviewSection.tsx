import type { ReactNode } from "react";

import { Badge, Button, Card, Container, Heading, Section } from "@/components/ui";

export type IndustryPreviewItem = {
  id: string;
  title: ReactNode;
  description: ReactNode;
};

export type IndustriesPreviewSectionProps = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  description: ReactNode;
  items: IndustryPreviewItem[];
  ctaLabel?: ReactNode;
};

export function IndustriesPreviewSection({
  eyebrow,
  heading,
  description,
  items,
  ctaLabel,
}: IndustriesPreviewSectionProps) {
  const headingId = "industries-preview-heading";

  return (
    <Section tone="dark" aria-labelledby={headingId}>
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
          className="grid list-none gap-[var(--grid-gap)] p-0 sm:grid-cols-2 lg:grid-cols-4"
          role="list"
        >
          {items.map((item) => (
            <li key={item.id}>
              <Card
                variant="glass"
                padding="md"
                className="flex min-h-40 flex-col gap-[var(--space-3)] text-start"
              >
                <Heading level={3} className="text-h4">
                  {item.title}
                </Heading>
                <p className="text-small text-text-secondary rtl:text-ar-small">
                  {item.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
