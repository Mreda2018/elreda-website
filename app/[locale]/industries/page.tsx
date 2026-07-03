import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { Badge, Card, Container, Heading, Section } from "@/components/ui";
import { getOptionalPublicEnv } from "@/lib/env";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

type IndustriesPageProps = {
  params: Promise<{ locale: Locale }>;
};

const industryKeys = [
  "restaurants",
  "retail",
  "clinics",
  "realEstate",
  "ecommerce",
  "startups",
  "factories",
  "corporate",
] as const;

const proofKeys = ["coverage", "model", "outcome"] as const;
const processKeys = ["diagnose", "connect", "scale"] as const;

function getLocalizedHref(locale: Locale, path: "/" | `/${string}`): string {
  if (locale === "ar") {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}

function getCanonicalUrl(locale: Locale): string {
  const siteUrl = getOptionalPublicEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";

  return new URL(getLocalizedHref(locale, "/industries"), siteUrl).toString();
}

function formatIndex(locale: Locale, index: number): string {
  return new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(index);
}

export async function generateMetadata({
  params,
}: IndustriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "industries" });
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

async function IndustriesBreadcrumbs({ locale }: { locale: Locale }) {
  const t = await getTranslations("industries");

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
          {t("breadcrumbs.industries")}
        </li>
      </ol>
    </nav>
  );
}

async function IndustriesHero({ locale }: { locale: Locale }) {
  const t = await getTranslations("industries");
  const headingId = "industries-page-heading";

  return (
    <Section
      tone="dark"
      spacing="compact"
      aria-labelledby={headingId}
      className="overflow-hidden pt-[calc(var(--space-20)+var(--space-16))]"
    >
      <Container className="flex flex-col gap-[var(--space-12)]">
        <IndustriesBreadcrumbs locale={locale} />

        <div className="grid gap-[var(--space-12)] lg:grid-cols-[1.16fr_0.84fr] lg:items-end">
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
                    <dd className="m-0 mt-[var(--space-2)] font-body text-h4 font-semibold text-white">
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

async function IndustriesGrid({ locale }: { locale: Locale }) {
  const t = await getTranslations("industries");
  const headingId = "industries-grid-heading";

  return (
    <Section tone="surface" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <header className="grid gap-[var(--space-8)] lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="flex flex-col items-start gap-[var(--space-5)] text-start">
            <Badge variant="red" size="md">
              {t("grid.eyebrow")}
            </Badge>
            <Heading id={headingId} level={2}>
              {t("grid.title")}
            </Heading>
          </div>
          <p className="max-w-[var(--container-narrow)] text-body-lg text-text-secondary rtl:text-ar-body-lg">
            {t("grid.description")}
          </p>
        </header>

        <ul className="grid list-none gap-[var(--grid-gap)] p-0 lg:grid-cols-2" role="list">
          {industryKeys.map((key, index) => {
            const isFeatureCard = index === 0 || index === 3;

            return (
              <li
                key={key}
                className={cn(
                  "lg:col-span-1",
                  isFeatureCard && "lg:col-span-2",
                )}
              >
                <Card
                  variant="glass"
                  padding="lg"
                  className={cn(
                    "flex h-full min-h-[calc(var(--space-48)+var(--space-8))] flex-col gap-[var(--space-6)] overflow-hidden text-start",
                    isFeatureCard &&
                      "border-border-light bg-[image:var(--gradient-subtle)]",
                  )}
                >
                  <div className="flex items-start justify-between gap-[var(--space-4)]">
                    <Badge variant={isFeatureCard ? "red" : "glass"} size="sm">
                      {t(`grid.items.${key}.market`)}
                    </Badge>
                    <span
                      aria-hidden="true"
                      className="font-body text-small font-semibold text-red-primary rtl:text-ar-small"
                    >
                      {formatIndex(locale, index + 1)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[var(--space-4)]">
                    <Heading level={3}>{t(`grid.items.${key}.title`)}</Heading>
                    <p className="text-body text-text-secondary rtl:text-ar-body">
                      {t(`grid.items.${key}.description`)}
                    </p>
                  </div>

                  <div className="mt-auto border-t border-[color:var(--glass-border)] pt-[var(--space-5)]">
                    <p className="text-small font-medium text-text-primary rtl:text-ar-small">
                      {t(`grid.items.${key}.focus`)}
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

async function IndustryProcess({ locale }: { locale: Locale }) {
  const t = await getTranslations("industries");
  const headingId = "industries-process-heading";

  return (
    <Section tone="dark" aria-labelledby={headingId}>
      <Container className="grid gap-[var(--space-12)] lg:grid-cols-[0.76fr_1.24fr]">
        <header className="flex flex-col items-start gap-[var(--space-5)] text-start">
          <Badge variant="red" size="md">
            {t("process.eyebrow")}
          </Badge>
          <Heading id={headingId} level={2}>
            {t("process.title")}
          </Heading>
          <p className="text-body-lg text-text-secondary rtl:text-ar-body-lg">
            {t("process.description")}
          </p>
        </header>

        <div className="grid gap-[var(--grid-gap)]">
          <Card
            variant="glass"
            padding="lg"
            className="grid gap-[var(--space-8)] border-[color:var(--glass-border)] lg:grid-cols-[0.8fr_1.2fr]"
          >
            <blockquote className="border-s border-red-primary ps-[var(--space-6)] text-h4 font-semibold leading-relaxed text-white rtl:text-ar-h3">
              {t("process.quote")}
            </blockquote>
            <ol className="grid list-none gap-[var(--space-5)] p-0" role="list">
              {processKeys.map((key, index) => (
                <li
                  key={key}
                  className="grid gap-[var(--space-4)] border-t border-[color:var(--glass-border)] pt-[var(--space-5)] sm:grid-cols-[auto_1fr]"
                >
                  <span
                    aria-hidden="true"
                    className="font-body text-h5 font-semibold text-red-primary"
                  >
                    {formatIndex(locale, index + 1)}
                  </span>
                  <div className="flex flex-col gap-[var(--space-2)] text-start">
                    <Heading level={3} className="text-h4">
                      {t(`process.items.${key}.title`)}
                    </Heading>
                    <p className="text-body text-text-secondary rtl:text-ar-body">
                      {t(`process.items.${key}.description`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

export default async function IndustriesPage({ params }: IndustriesPageProps) {
  const { locale } = await params;
  const t = await getTranslations("industries");

  return (
    <>
      <IndustriesHero locale={locale} />
      <IndustriesGrid locale={locale} />
      <IndustryProcess locale={locale} />
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
