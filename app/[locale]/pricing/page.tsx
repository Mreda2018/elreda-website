import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { Badge, Card, Container, Heading, Section } from "@/components/ui";
import { getOptionalPublicEnv } from "@/lib/env";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

type PricingPageProps = {
  params: Promise<{ locale: Locale }>;
};

const proofKeys = ["clarity", "fit", "momentum"] as const;
const planKeys = ["creative", "growth", "systems"] as const;
const featureKeys = ["first", "second", "third", "fourth"] as const;
const faqKeys = ["startingPrice", "customQuote", "retainers", "changes"] as const;

function getLocalizedHref(locale: Locale, path: "/" | `/${string}`): string {
  if (locale === "ar") {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}

function getCanonicalUrl(locale: Locale): string {
  const siteUrl = getOptionalPublicEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";

  return new URL(getLocalizedHref(locale, "/pricing"), siteUrl).toString();
}

function formatIndex(locale: Locale, index: number): string {
  return new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(index);
}

export async function generateMetadata({
  params,
}: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  const title = t("metadata.title");
  const description = t("metadata.description");
  const canonical = getCanonicalUrl(locale);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      url: canonical,
    },
  };
}

async function PricingBreadcrumbs({ locale }: { locale: Locale }) {
  const t = await getTranslations("pricing");

  return (
    <nav aria-label={t("breadcrumbs.label")} className="text-small rtl:text-ar-small">
      <ol
        className="flex list-none flex-wrap items-center gap-[var(--space-2)] p-0 text-text-secondary"
        role="list"
      >
        <li>
          <Link
            href={getLocalizedHref(locale, "/")}
            className="underline-offset-4 hover:text-white hover:underline"
          >
            {t("breadcrumbs.home")}
          </Link>
        </li>
        <li aria-hidden="true" className="text-text-muted">
          /
        </li>
        <li aria-current="page" className="text-text-primary">
          {t("breadcrumbs.pricing")}
        </li>
      </ol>
    </nav>
  );
}

async function PricingHero({ locale }: { locale: Locale }) {
  const t = await getTranslations("pricing");
  const headingId = "pricing-page-heading";

  return (
    <Section
      tone="dark"
      spacing="compact"
      aria-labelledby={headingId}
      className="overflow-hidden pt-[calc(var(--space-20)+var(--space-16))]"
    >
      <Container className="flex flex-col gap-[var(--space-12)]">
        <PricingBreadcrumbs locale={locale} />

        <div className="grid gap-[var(--space-12)] lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
          <div className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-6)] text-start">
            <Badge variant="red" size="md">
              {t("hero.eyebrow")}
            </Badge>
            <div className="flex flex-col gap-[var(--space-5)]">
              <Heading id={headingId} level={1}>
                {t("hero.title")}
              </Heading>
              <p className="text-body-lg text-text-secondary rtl:text-ar-body-lg">
                {t("hero.description")}
              </p>
            </div>
          </div>

          <Card
            variant="glass"
            padding="lg"
            className="relative overflow-hidden border-[color:var(--glass-border)] text-start"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
            />
            <div className="flex flex-col gap-[var(--space-8)]">
              <p className="text-h4 font-semibold leading-relaxed text-white rtl:text-ar-h3">
                {t("hero.panel.title")}
              </p>
              <dl className="grid gap-[var(--space-5)]">
                {proofKeys.map((key) => (
                  <div
                    key={key}
                    className="border-t border-[color:var(--glass-border)] pt-[var(--space-5)]"
                  >
                    <dt className="text-small text-text-muted rtl:text-ar-small">
                      {t(`hero.panel.items.${key}.label`)}
                    </dt>
                    <dd className="m-0 mt-[var(--space-2)] text-body font-semibold text-white rtl:text-ar-body">
                      {t(`hero.panel.items.${key}.value`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

async function PricingPlans({ locale }: { locale: Locale }) {
  const t = await getTranslations("pricing");
  const headingId = "pricing-plans-heading";

  return (
    <Section tone="surface" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <header className="grid gap-[var(--space-8)] lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="flex flex-col items-start gap-[var(--space-5)] text-start">
            <Badge variant="red" size="md">
              {t("plans.eyebrow")}
            </Badge>
            <Heading id={headingId} level={2}>
              {t("plans.title")}
            </Heading>
          </div>
          <p className="max-w-[var(--container-narrow)] text-body-lg text-text-secondary rtl:text-ar-body-lg">
            {t("plans.description")}
          </p>
        </header>

        <ul
          className="grid list-none gap-[var(--grid-gap)] p-0 lg:grid-cols-3"
          role="list"
        >
          {planKeys.map((key, index) => {
            const isRecommended = key === "growth";

            return (
              <li key={key}>
                <Card
                  variant={isRecommended ? "elevated" : "glass"}
                  padding="lg"
                  className={cn(
                    "relative flex h-full flex-col gap-[var(--space-7)] overflow-hidden text-start",
                    isRecommended &&
                      "border-border-light bg-[image:var(--gradient-subtle)] lg:-mt-[var(--space-6)] lg:pb-[calc(var(--space-8)+var(--space-6))]",
                  )}
                >
                  {isRecommended ? (
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
                    />
                  ) : null}

                  <div className="flex items-start justify-between gap-[var(--space-4)]">
                    <Badge variant={isRecommended ? "red" : "glass"} size="sm">
                      {isRecommended
                        ? t("plans.recommended")
                        : t(`plans.items.${key}.category`)}
                    </Badge>
                    <span
                      aria-hidden="true"
                      className="font-body text-small font-semibold text-red-primary rtl:text-ar-small"
                    >
                      {formatIndex(locale, index + 1)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[var(--space-4)]">
                    <Heading level={3}>{t(`plans.items.${key}.title`)}</Heading>
                    <p className="text-body text-text-secondary rtl:text-ar-body">
                      {t(`plans.items.${key}.summary`)}
                    </p>
                  </div>

                  <div className="border-y border-[color:var(--glass-border)] py-[var(--space-6)]">
                    <p className="text-small text-text-muted rtl:text-ar-small">
                      {t(`plans.items.${key}.priceLabel`)}
                    </p>
                    <p className="mt-[var(--space-2)] text-h3 font-semibold text-white rtl:text-ar-h2">
                      {t(`plans.items.${key}.price`)}
                    </p>
                  </div>

                  <div className="grid gap-[var(--space-5)]">
                    <div>
                      <p className="text-small font-semibold uppercase tracking-wide text-text-muted rtl:tracking-normal rtl:text-ar-small">
                        {t("plans.bestFor")}
                      </p>
                      <p className="mt-[var(--space-2)] text-body text-text-primary rtl:text-ar-body">
                        {t(`plans.items.${key}.bestFor`)}
                      </p>
                    </div>

                    <ul className="grid list-none gap-[var(--space-3)] p-0" role="list">
                      {featureKeys.map((featureKey) => (
                        <li
                          key={featureKey}
                          className="flex gap-[var(--space-3)] text-body text-text-secondary rtl:text-ar-body"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.55em] size-2 shrink-0 rounded-full bg-red-primary"
                          />
                          <span>{t(`plans.items.${key}.features.${featureKey}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto border-t border-[color:var(--glass-border)] pt-[var(--space-5)]">
                    <p className="text-small text-text-muted rtl:text-ar-small">
                      {t("plans.nextStep")}
                    </p>
                    <p className="mt-[var(--space-2)] text-body font-medium text-text-primary rtl:text-ar-body">
                      {t(`plans.items.${key}.nextStep`)}
                    </p>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

async function PricingFaqPreview() {
  const t = await getTranslations("pricing");
  const headingId = "pricing-faq-heading";

  return (
    <Section tone="dark" aria-labelledby={headingId}>
      <Container className="grid gap-[var(--space-12)] lg:grid-cols-[0.78fr_1.22fr]">
        <header className="flex flex-col items-start gap-[var(--space-5)] text-start">
          <Badge variant="red" size="md">
            {t("faq.eyebrow")}
          </Badge>
          <Heading id={headingId} level={2}>
            {t("faq.title")}
          </Heading>
          <p className="text-body-lg text-text-secondary rtl:text-ar-body-lg">
            {t("faq.description")}
          </p>
        </header>

        <ul className="grid list-none gap-[var(--grid-gap)] p-0 md:grid-cols-2" role="list">
          {faqKeys.map((key) => (
            <li key={key}>
              <Card
                variant="glass"
                padding="lg"
                className="flex h-full flex-col gap-[var(--space-4)] text-start"
              >
                <Heading level={3} className="text-h4">
                  {t(`faq.items.${key}.question`)}
                </Heading>
                <p className="text-body text-text-secondary rtl:text-ar-body">
                  {t(`faq.items.${key}.answer`)}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  const t = await getTranslations("pricing");

  return (
    <>
      <PricingHero locale={locale} />
      <PricingPlans locale={locale} />
      <PricingFaqPreview />
      <CTASection
        heading={t("cta.title")}
        description={t("cta.subtitle")}
        actions={[
          {
            label: t("cta.primary"),
          },
          {
            label: t("cta.secondary"),
            variant: "secondary",
          },
        ]}
      />
    </>
  );
}
