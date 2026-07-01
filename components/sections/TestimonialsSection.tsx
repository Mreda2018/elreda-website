import type { ReactNode } from "react";

import { Badge, Card, Container, Heading, Section } from "@/components/ui";

export type TestimonialCardItem = {
  id: string;
  quote: ReactNode;
  clientName: string;
  company?: string;
  rating?: number;
};

export type TestimonialsSectionProps = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  description: ReactNode;
  items: TestimonialCardItem[];
  ratingLabel?: (rating: number) => ReactNode;
};

export function TestimonialsSection({
  eyebrow,
  heading,
  description,
  items,
  ratingLabel,
}: TestimonialsSectionProps) {
  const headingId = "home-testimonials-heading";

  if (items.length === 0) {
    return null;
  }

  return (
    <Section tone="elevated" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <header className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start">
          {eyebrow ? (
            <Badge variant="red" size="md">
              {eyebrow}
            </Badge>
          ) : null}

          <div className="flex flex-col gap-[var(--space-4)]">
            <Heading id={headingId} level={2}>
              {heading}
            </Heading>
            <p className="text-body-lg text-text-secondary rtl:text-ar-body-lg">
              {description}
            </p>
          </div>
        </header>

        <ul
          className="grid list-none gap-[var(--grid-gap)] p-0 md:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {items.map((item) => (
            <li key={item.id}>
              <Card
                variant="glass"
                padding="lg"
                className="flex min-h-[calc(var(--space-48)+var(--space-32))] flex-col text-start"
              >
                <figure className="flex h-full flex-col justify-between gap-[var(--space-8)]">
                  <blockquote className="text-body-lg leading-relaxed text-text-primary rtl:text-ar-body-lg">
                    <p>{item.quote}</p>
                  </blockquote>

                  <figcaption className="flex flex-col gap-[var(--space-3)]">
                    {item.rating && ratingLabel ? (
                      <span className="text-small font-medium text-text-secondary rtl:text-ar-small">
                        {ratingLabel(item.rating)}
                      </span>
                    ) : null}
                    <span className="text-h5 font-semibold text-white">
                      {item.clientName}
                    </span>
                    {item.company ? (
                      <span className="text-small text-text-secondary rtl:text-ar-small">
                        {item.company}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
