import type { ReactNode } from "react";

import { Badge, Button, Card, Container, Heading, Section } from "@/components/ui";

export type ServiceSectionItem = {
  id: string;
  title: ReactNode;
  description: ReactNode;
  category?: ReactNode;
};

export type ServicesSectionCta = {
  label: ReactNode;
  ariaLabel?: string;
};

export type ServicesSectionProps = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  description: ReactNode;
  services: ServiceSectionItem[];
  cta?: ServicesSectionCta;
};

type ServiceCardProps = {
  service: ServiceSectionItem;
};

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card
      variant="surface"
      padding="lg"
      className="flex h-full flex-col items-start gap-[var(--space-6)] text-start"
    >
      {service.category ? (
        <Badge variant="glass" size="md">
          {service.category}
        </Badge>
      ) : null}

      <div className="flex flex-col gap-[var(--space-3)]">
        <Heading level={3}>{service.title}</Heading>
        <p className="text-body text-text-secondary rtl:text-ar-body">
          {service.description}
        </p>
      </div>
    </Card>
  );
}

export function ServicesSection({
  eyebrow,
  heading,
  description,
  services,
  cta,
}: ServicesSectionProps) {
  return (
    <Section tone="dark">
      <Container className="flex flex-col gap-[var(--space-12)]">
        <div className="flex flex-col gap-[var(--space-6)] lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start">
            {eyebrow ? (
              <Badge variant="red" size="md">
                {eyebrow}
              </Badge>
            ) : null}

            <div className="flex flex-col gap-[var(--space-4)]">
              <Heading level={2}>{heading}</Heading>
              <p className="max-w-[var(--container-narrow)] text-body-lg text-text-secondary rtl:text-ar-body-lg">
                {description}
              </p>
            </div>
          </div>

          {cta ? (
            <Button
              variant="secondary"
              size="lg"
              disabled
              aria-disabled="true"
              aria-label={cta.ariaLabel}
            >
              {cta.label}
            </Button>
          ) : null}
        </div>

        <ul
          className="grid list-none gap-[var(--grid-gap)] p-0 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {services.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
