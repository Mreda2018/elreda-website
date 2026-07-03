import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { SelectField, TextAreaField, TextField } from "@/components/forms";
import { Badge, Button, Card, Container, Heading, Section } from "@/components/ui";
import { getOptionalPublicEnv } from "@/lib/env";
import type { Locale } from "@/lib/i18n/routing";

type ContactPageProps = {
  params: Promise<{ locale: Locale }>;
};

const contactCardKeys = ["whatsapp", "email", "location"] as const;
const serviceOptionKeys = [
  "branding",
  "web",
  "ecommerce",
  "marketing",
  "erp",
  "ai",
  "printing",
  "notSure",
] as const;

function getLocalizedHref(locale: Locale, path: "/" | `/${string}`): string {
  if (locale === "ar") {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}

function getCanonicalUrl(locale: Locale): string {
  const siteUrl = getOptionalPublicEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";

  return new URL(getLocalizedHref(locale, "/contact"), siteUrl).toString();
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
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

async function ContactBreadcrumbs({ locale }: { locale: Locale }) {
  const t = await getTranslations("contact");

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
          {t("breadcrumbs.contact")}
        </li>
      </ol>
    </nav>
  );
}

async function ContactHero({ locale }: { locale: Locale }) {
  const t = await getTranslations("contact");
  const headingId = "contact-page-heading";

  return (
    <Section
      tone="dark"
      spacing="compact"
      aria-labelledby={headingId}
      className="overflow-hidden pt-[calc(var(--space-20)+var(--space-16))]"
    >
      <Container className="flex flex-col gap-[var(--space-10)]">
        <ContactBreadcrumbs locale={locale} />

        <div className="grid gap-[var(--space-12)] lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start">
            <Badge variant="red" size="md">
              {t("hero.eyebrow")}
            </Badge>
            <div className="flex flex-col gap-[var(--space-4)]">
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
            <dl className="flex flex-col gap-[var(--space-4)]">
              <div>
                <dt className="text-small text-text-muted rtl:text-ar-small">
                  {t("hero.response.label")}
                </dt>
                <dd className="m-0 mt-[var(--space-2)] font-body text-h3 font-semibold text-white rtl:text-ar-h3">
                  {t("hero.response.value")}
                </dd>
              </div>
              <p className="m-0 text-body text-text-secondary rtl:text-ar-body">
                {t("hero.response.description")}
              </p>
            </dl>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

async function ContactInformation() {
  const t = await getTranslations("contact");
  const headingId = "contact-info-heading";

  return (
    <Section tone="surface" aria-labelledby={headingId}>
      <Container className="grid gap-[var(--space-12)] lg:grid-cols-[0.9fr_1.1fr]">
        <header className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start">
          <Badge variant="red" size="md">
            {t("info.eyebrow")}
          </Badge>
          <div className="flex flex-col gap-[var(--space-4)]">
            <Heading id={headingId} level={2}>
              {t("info.title")}
            </Heading>
            <p className="text-body-lg text-text-secondary rtl:text-ar-body-lg">
              {t("info.description")}
            </p>
          </div>
        </header>

        <div className="grid gap-[var(--grid-gap)] sm:grid-cols-2 lg:grid-cols-3">
          {contactCardKeys.map((key) => (
            <Card
              key={key}
              variant="glass"
              padding="lg"
              className="flex min-h-[calc(var(--space-40)+var(--space-8))] flex-col gap-[var(--space-4)] text-start"
            >
              <Heading level={3} className="text-h4">
                {t(`info.cards.${key}.title`)}
              </Heading>
              <p className="font-body text-h5 font-semibold text-white">
                {t(`info.cards.${key}.value`)}
              </p>
              <p className="text-small text-text-secondary rtl:text-ar-small">
                {t(`info.cards.${key}.description`)}
              </p>
            </Card>
          ))}

          <Card
            variant="glass"
            padding="lg"
            className="flex min-h-[calc(var(--space-40)+var(--space-8))] flex-col gap-[var(--space-5)] text-start sm:col-span-2 lg:col-span-3"
          >
            <Heading level={3} className="text-h4">
              {t("info.hours.title")}
            </Heading>
            <dl className="grid gap-[var(--space-4)] sm:grid-cols-2">
              <div>
                <dt className="text-small text-text-muted rtl:text-ar-small">
                  {t("info.hours.weekdays")}
                </dt>
                <dd className="m-0 mt-[var(--space-1)] text-body text-text-primary rtl:text-ar-body">
                  {t("info.hours.weekdayHours")}
                </dd>
              </div>
              <div>
                <dt className="text-small text-text-muted rtl:text-ar-small">
                  {t("info.hours.weekend")}
                </dt>
                <dd className="m-0 mt-[var(--space-1)] text-body text-text-primary rtl:text-ar-body">
                  {t("info.hours.weekendHours")}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

async function ContactFormLayout() {
  const t = await getTranslations("contact");
  const forms = await getTranslations("forms");
  const headingId = "contact-form-heading";
  const serviceOptions = serviceOptionKeys.map((key) => ({
    value: key,
    label: t(`form.serviceOptions.${key}`),
  }));

  return (
    <Section tone="dark" aria-labelledby={headingId}>
      <Container className="grid gap-[var(--space-12)] lg:grid-cols-[0.82fr_1.18fr]">
        <header className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start">
          <Badge variant="red" size="md">
            {t("form.eyebrow")}
          </Badge>
          <div className="flex flex-col gap-[var(--space-4)]">
            <Heading id={headingId} level={2}>
              {t("form.title")}
            </Heading>
            <p className="text-body-lg text-text-secondary rtl:text-ar-body-lg">
              {t("form.description")}
            </p>
          </div>
        </header>

        <Card variant="glass" padding="lg" className="text-start">
          <form className="grid gap-[var(--space-6)]" aria-labelledby={headingId}>
            <div className="grid gap-[var(--space-5)] sm:grid-cols-2">
              <TextField
                id="contact-name"
                name="name"
                label={forms("fields.name")}
                placeholder={forms("placeholders.name")}
                autoComplete="name"
              />
              <TextField
                id="contact-company"
                name="company"
                label={forms("fields.company")}
                placeholder={forms("placeholders.company")}
                autoComplete="organization"
              />
              <TextField
                id="contact-email"
                name="email"
                type="email"
                label={forms("fields.email")}
                placeholder={forms("placeholders.email")}
                autoComplete="email"
              />
              <TextField
                id="contact-phone"
                name="phone"
                type="tel"
                label={forms("fields.phone")}
                placeholder={forms("placeholders.phone")}
                autoComplete="tel"
              />
            </div>

            <SelectField
              id="contact-service"
              name="service"
              label={forms("fields.service")}
              placeholder={t("form.servicePlaceholder")}
              options={serviceOptions}
            />
            <TextAreaField
              id="contact-message"
              name="message"
              label={forms("fields.message")}
              placeholder={forms("placeholders.message")}
            />
            <Button type="submit" size="lg" disabled className="w-full sm:w-auto">
              {t("form.submit")}
            </Button>
          </form>
        </Card>
      </Container>
    </Section>
  );
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations("contact");

  return (
    <>
      <ContactHero locale={locale} />
      <ContactInformation />
      <ContactFormLayout />
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
