import type { ReactNode } from "react";

import {
  Badge,
  Button,
  Card,
  Container,
  Heading,
  Section,
  SectionHeader,
} from "@/components/ui";

export type ServiceItem = {
  id: string;
  title: ReactNode;
  description: ReactNode;
  href: string;
  category?: ReactNode;
};

type ServicesSectionCta = {
  label: ReactNode;
  ariaLabel?: string;
};

export type ServicesSectionProps = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  description: ReactNode;
  services: ServiceItem[];
  cta?: ServicesSectionCta;
};

export type ServiceCardProps = {
  service: ServiceItem;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card
      variant="glass"
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
  const headingId = "services-section-heading";

  return (
    <Section tone="dark" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <SectionHeader
          badge={eyebrow}
          title={heading}
          description={description}
          headingId={headingId}
          layout="split"
          actions={cta ? (
            <Button
              variant="secondary"
              size="lg"
              aria-disabled="true"
              aria-label={cta.ariaLabel}
              tabIndex={-1}
              className="pointer-events-none opacity-50"
            >
              {cta.label}
            </Button>
          ) : null}
        />

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
