import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { InnerPageHero } from "@/components/sections/InnerPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { QuoteForm } from "@/components/forms";
import { Card, Container, Section, SectionHeader } from "@/components/ui";
import type { Locale } from "@/lib/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/site";

type QuotePageProps = {
  params: Promise<{ locale: Locale }>;
};

const stepKeys = ["services", "details", "budget", "contact"] as const;
const serviceKeys = ["branding", "web", "ecommerce", "erp", "ai", "printing"] as const;
const budgetKeys = ["starter", "growth", "premium", "notSure"] as const;
const timelineKeys = ["urgent", "month", "quarter", "flexible"] as const;

function getLocalizedHref(locale: Locale, path: "/" | `/${string}`): string {
  if (locale === "ar") {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quote" });
  const title = t("metadata.title");
  const description = t("metadata.description");

  return buildPageMetadata({
    locale,
    path: "/quote",
    title,
    description,
  });
}

async function QuoteBreadcrumbs({ locale }: { locale: Locale }) {
  const t = await getTranslations("quote");

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
          {t("breadcrumbs.quote")}
        </li>
      </ol>
    </nav>
  );
}

async function QuoteHero({ locale }: { locale: Locale }) {
  const t = await getTranslations("quote");
  const headingId = "quote-page-heading";

  return (
    <InnerPageHero
      variant="proof"
      headingId={headingId}
      breadcrumbs={<QuoteBreadcrumbs locale={locale} />}
      eyebrow={t("hero.eyebrow")}
      title={t("hero.title")}
      description={t("hero.description")}
      aside={
        <Card variant="glass" padding="lg" className="text-start">
          <p className="text-body text-text-secondary rtl:text-ar-body">
            {t("hero.note")}
          </p>
        </Card>
      }
    />
  );
}

async function QuoteFormLayout({ locale }: { locale: Locale }) {
  const t = await getTranslations("quote");
  const forms = await getTranslations("forms");
  const headingId = "quote-form-heading";
  const serviceOptions = serviceKeys.map((key) => ({
    value: key,
    label: t(`form.serviceOptions.${key}.label`),
    description: t(`form.serviceOptions.${key}.description`),
  }));
  const budgetOptions = budgetKeys.map((key) => ({
    value: key,
    label: t(`form.budgetOptions.${key}`),
  }));
  const timelineOptions = timelineKeys.map((key) => ({
    value: key,
    label: t(`form.timelineOptions.${key}`),
  }));

  return (
    <Section tone="surface" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <SectionHeader
          title={t("form.title")}
          description={t("form.description")}
          headingId={headingId}
        />

        <Card variant="glass" padding="lg" className="text-start">
          <QuoteForm
            locale={locale}
            ariaLabelledBy={headingId}
            steps={{
              label: t("steps.label"),
              current: t("steps.current"),
              items: stepKeys.map((key) => t(`steps.items.${key}`)),
            }}
            labels={{
              services: t("form.servicesLegend"),
              details: t("form.detailsLegend"),
              budget: t("form.budgetLegend"),
              timeline: t("form.timelineLegend"),
              contact: t("form.contactLegend"),
              company: forms("fields.company"),
              name: forms("fields.name"),
              message: forms("fields.message"),
              email: forms("fields.email"),
              phone: forms("fields.phone"),
              preferredContact: forms("fields.preferredContact"),
              honeypot: forms("common.honeypotLabel"),
            }}
            placeholders={{
              company: forms("placeholders.company"),
              name: forms("placeholders.name"),
              message: forms("placeholders.message"),
              email: forms("placeholders.email"),
              phone: forms("placeholders.phone"),
            }}
            serviceOptions={serviceOptions}
            budgetOptions={budgetOptions}
            timelineOptions={timelineOptions}
            preferredContactOptions={[
              {
                value: "whatsapp",
                label: t("form.preferredContactOptions.whatsapp"),
              },
              { value: "email", label: t("form.preferredContactOptions.email") },
              { value: "phone", label: t("form.preferredContactOptions.phone") },
            ]}
            submitLabel={t("form.submit")}
          />
        </Card>
      </Container>
    </Section>
  );
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { locale } = await params;
  const t = await getTranslations("quote");

  return (
    <>
      <QuoteHero locale={locale} />
      <Reveal variant="editorial">
        <QuoteFormLayout locale={locale} />
      </Reveal>
      <Reveal variant="statement">
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
      </Reveal>
    </>
  );
}
