import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { InnerPageHero } from "@/components/sections/InnerPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { OptionCardField, SelectField, TextAreaField, TextField } from "@/components/forms";
import { Button, Card, Container, Section, SectionHeader } from "@/components/ui";
import { getOptionalPublicEnv } from "@/lib/env";
import type { Locale } from "@/lib/i18n/routing";

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

function getCanonicalUrl(locale: Locale): string {
  const siteUrl = getOptionalPublicEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";

  return new URL(getLocalizedHref(locale, "/quote"), siteUrl).toString();
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quote" });
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

async function QuoteProgress() {
  const t = await getTranslations("quote");

  return (
    <nav aria-label={t("steps.label")}>
      <ol className="grid list-none gap-[var(--space-3)] p-0 md:grid-cols-4" role="list">
        {stepKeys.map((key, index) => (
          <li
            key={key}
            aria-current={index === 0 ? "step" : undefined}
            className="rounded-md border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-[var(--space-4)] text-small text-text-secondary rtl:text-ar-small"
          >
            <span
              aria-hidden="true"
              className="mb-[var(--space-2)] block font-body font-semibold text-red-primary"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={index === 0 ? "text-text-primary" : undefined}>
              {t(`steps.items.${key}`)}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

async function QuoteFormLayout() {
  const t = await getTranslations("quote");
  const forms = await getTranslations("forms");
  const headingId = "quote-form-heading";
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
          <form className="grid gap-[var(--space-10)]" aria-labelledby={headingId}>
            <QuoteProgress />
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {t("steps.current")}
            </div>

            <fieldset className="grid gap-[var(--space-5)] border-0 p-0">
              <legend className="mb-[var(--space-5)] text-h4 font-semibold text-white rtl:text-ar-h3">
                {t("form.servicesLegend")}
              </legend>
              <div className="grid gap-[var(--grid-gap)] md:grid-cols-2 xl:grid-cols-3">
                {serviceKeys.map((key) => (
                  <OptionCardField
                    key={key}
                    name="services"
                    value={key}
                    label={t(`form.serviceOptions.${key}.label`)}
                    description={t(`form.serviceOptions.${key}.description`)}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset className="grid gap-[var(--space-5)] border-0 p-0">
              <legend className="mb-[var(--space-5)] text-h4 font-semibold text-white rtl:text-ar-h3">
                {t("form.detailsLegend")}
              </legend>
              <div className="grid gap-[var(--space-5)] sm:grid-cols-2">
                <TextField
                  id="quote-company"
                  name="company"
                  label={forms("fields.company")}
                  placeholder={forms("placeholders.company")}
                  autoComplete="organization"
                />
                <TextField
                  id="quote-name"
                  name="name"
                  label={forms("fields.name")}
                  placeholder={forms("placeholders.name")}
                  autoComplete="name"
                />
              </div>
              <TextAreaField
                id="quote-message"
                name="message"
                label={forms("fields.message")}
                placeholder={forms("placeholders.message")}
              />
            </fieldset>

            <div className="grid gap-[var(--grid-gap)] lg:grid-cols-2">
              <fieldset className="border-0 p-0">
                <legend className="mb-[var(--space-5)] text-h4 font-semibold text-white rtl:text-ar-h3">
                  {t("form.budgetLegend")}
                </legend>
                <div className="grid gap-[var(--space-3)]">
                  {budgetOptions.map((option) => (
                    <OptionCardField
                      key={option.value}
                      type="radio"
                      name="budget"
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="border-0 p-0">
                <legend className="mb-[var(--space-5)] text-h4 font-semibold text-white rtl:text-ar-h3">
                  {t("form.timelineLegend")}
                </legend>
                <div className="grid gap-[var(--space-3)]">
                  {timelineOptions.map((option) => (
                    <OptionCardField
                      key={option.value}
                      type="radio"
                      name="timeline"
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </div>
              </fieldset>
            </div>

            <fieldset className="grid gap-[var(--space-5)] border-0 p-0">
              <legend className="mb-[var(--space-5)] text-h4 font-semibold text-white rtl:text-ar-h3">
                {t("form.contactLegend")}
              </legend>
              <div className="grid gap-[var(--space-5)] sm:grid-cols-2">
                <TextField
                  id="quote-email"
                  name="email"
                  type="email"
                  label={forms("fields.email")}
                  placeholder={forms("placeholders.email")}
                  autoComplete="email"
                />
                <TextField
                  id="quote-phone"
                  name="phone"
                  type="tel"
                  label={forms("fields.phone")}
                  placeholder={forms("placeholders.phone")}
                  autoComplete="tel"
                />
                <SelectField
                  id="quote-preferred-contact"
                  name="preferredContact"
                  label={forms("fields.preferredContact")}
                  options={[
                    {
                      value: "whatsapp",
                      label: t("form.preferredContactOptions.whatsapp"),
                    },
                    { value: "email", label: t("form.preferredContactOptions.email") },
                    { value: "phone", label: t("form.preferredContactOptions.phone") },
                  ]}
                  className="sm:col-span-2"
                />
              </div>
            </fieldset>

            <Button type="submit" size="lg" disabled className="w-full sm:w-auto">
              {t("form.submit")}
            </Button>
          </form>
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
        <QuoteFormLayout />
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
