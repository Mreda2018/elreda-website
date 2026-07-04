import type { ReactNode } from "react";

import { Container, Section, SectionHeader, Card } from "@/components/ui";
import { editorialSpacing } from "@/components/ui/editorial";
import { cn } from "@/lib/utils";

export type InnerPageHeroVariant = "editorial" | "proof";

export type InnerPageHeroStat = {
  id: string;
  label: ReactNode;
  value: ReactNode;
};

export type InnerPageHeroProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  breadcrumbs?: ReactNode;
  aside?: ReactNode;
  actions?: ReactNode;
  stats?: InnerPageHeroStat[];
  variant?: InnerPageHeroVariant;
  children?: ReactNode;
  headingId?: string;
  className?: string;
};

export function InnerPageHero({
  title,
  eyebrow,
  description,
  breadcrumbs,
  aside,
  actions,
  stats,
  variant = "proof",
  children,
  headingId = "inner-page-heading",
  className,
}: InnerPageHeroProps) {
  const hasAside = Boolean(aside) || Boolean(stats?.length);

  return (
    <Section
      tone="dark"
      spacing="compact"
      aria-labelledby={headingId}
      className={cn(editorialSpacing.heroShell, className)}
    >
      <Container className={editorialSpacing.heroStack}>
        {breadcrumbs}

        <div
          className={cn(
            editorialSpacing.heroGrid,
            hasAside
              ? variant === "editorial"
                ? "lg:grid-cols-[1.12fr_0.88fr]"
                : "lg:grid-cols-[1.08fr_0.92fr]"
              : "lg:grid-cols-1",
          )}
        >
          <SectionHeader
            badge={eyebrow}
            title={title}
            description={description}
            actions={actions}
            headingId={headingId}
            headingLevel={1}
            layout={variant === "editorial" ? "editorial" : "stacked"}
          />

          {aside ?? (stats?.length ? <InnerPageHeroStats stats={stats} /> : null)}
        </div>

        {children}
      </Container>
    </Section>
  );
}

function InnerPageHeroStats({ stats }: { stats: InnerPageHeroStat[] }) {
  return (
    <Card variant="glass" padding="lg" className="relative overflow-hidden text-start">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
      />
      <dl className="grid gap-[var(--space-5)]">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="border-t border-[color:var(--glass-border)] pt-[var(--space-5)] first:border-t-0 first:pt-0"
          >
            <dt className="text-small text-text-muted rtl:text-ar-small">{stat.label}</dt>
            <dd className="m-0 mt-[var(--space-2)] font-body text-h4 font-semibold text-white">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

