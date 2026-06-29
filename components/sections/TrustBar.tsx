import type { ReactNode } from "react";

import { Container, Section } from "@/components/ui";

export type TrustBarItem = {
  value: ReactNode;
  label: ReactNode;
};

export type TrustBarProps = {
  ariaLabel: string;
  items: TrustBarItem[];
};

export function TrustBar({ ariaLabel, items }: TrustBarProps) {
  return (
    <Section
      tone="dark"
      spacing="compact"
      aria-label={ariaLabel}
      className="border-y border-[color:var(--glass-border)] bg-surface/80"
    >
      <Container>
        <dl className="grid gap-px overflow-hidden rounded-md border border-[color:var(--glass-border)] bg-[color:var(--glass-border)] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex min-h-32 flex-col-reverse justify-center gap-2 bg-[color:color-mix(in_srgb,var(--black)_70%,transparent)] p-6 text-start"
            >
              <dt className="text-small font-medium text-text-secondary rtl:text-ar-small">
                {item.label}
              </dt>
              <dd className="font-body text-h3 font-semibold text-white rtl:text-ar-h3">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
