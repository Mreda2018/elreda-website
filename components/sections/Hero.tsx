import Link from "next/link";
import type { ReactNode } from "react";

import { SanityImage } from "@/components/common/SanityImage";
import {
  Badge,
  Container,
  Divider,
  Heading,
  Section,
  buttonVariants,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import type { CmsImage } from "@/lib/sanity/types";

export type HeroStat = {
  value: ReactNode;
  label: ReactNode;
};

export type HeroAction = {
  href: string;
  label: ReactNode;
  ariaLabel?: string;
};

export type HeroProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  primaryAction: HeroAction;
  secondaryAction: HeroAction;
  stats: HeroStat[];
  image?: CmsImage;
  className?: string;
};

export function Hero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats,
  image,
  className,
}: HeroProps) {
  return (
    <Section
      tone="dark"
      spacing="none"
      className={cn("isolate overflow-hidden pt-24", className)}
    >
      <Container className="grid min-h-[calc(100svh-var(--space-24))] items-center gap-[var(--space-12)] py-section-y lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.68fr)]">
        <div className="flex max-w-5xl flex-col items-start gap-[var(--space-10)] text-start">
          <Badge variant="glass" size="md">
            {eyebrow}
          </Badge>

          <div className="flex flex-col gap-[var(--space-6)]">
            <Heading
              level={1}
              className="max-w-5xl text-hero leading-none rtl:text-ar-hero"
            >
              {title}
            </Heading>
            <p className="max-w-[var(--container-narrow)] text-body-lg text-text-secondary rtl:text-ar-body-lg">
              {description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-[var(--space-4)] sm:w-auto sm:flex-row">
            <Link
              href={primaryAction.href}
              aria-label={primaryAction.ariaLabel}
              className={buttonVariants({ size: "lg" })}
            >
              {primaryAction.label}
            </Link>
            <Link
              href={secondaryAction.href}
              aria-label={secondaryAction.ariaLabel}
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              {secondaryAction.label}
            </Link>
          </div>

          {stats.length > 0 ? (
            <div className="flex w-full flex-col gap-[var(--space-5)] border-t border-[color:var(--glass-border)] pt-[var(--space-6)] sm:flex-row sm:items-stretch">
              {stats.map((stat, index) => (
                <div key={index} className="flex gap-[var(--space-5)]">
                  {index > 0 ? (
                    <Divider
                      orientation="vertical"
                      tone="glass"
                      className="hidden self-stretch sm:block"
                    />
                  ) : null}
                  <div className="flex flex-col gap-[var(--space-1)]">
                    <span className="font-body text-h4 font-semibold text-white rtl:text-ar-h3">
                      {stat.value}
                    </span>
                    <span className="text-small leading-relaxed text-text-secondary rtl:text-ar-small">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div
          aria-hidden={image ? undefined : true}
          className="relative min-h-[360px] overflow-hidden rounded-md border border-[color:var(--glass-border)] bg-[image:var(--gradient-hero)] shadow-xl lg:min-h-[560px]"
        >
          {image ? (
            <>
              <SanityImage
                image={image.source}
                alt={image.alt?.text ?? ""}
                lang={image.alt?.lang}
                fill
                preload
                unoptimized
                sizes="(max-width: 1023px) 100vw, 41vw"
                sourceWidth={1920}
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/2 bg-[image:linear-gradient(to_top,var(--black),transparent)]"
              />
            </>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
