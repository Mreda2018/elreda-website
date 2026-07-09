import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { InnerPageHero } from "@/components/sections/InnerPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/forms";
import { Card, Container, Heading, Section, SectionHeader } from "@/components/ui";
import type { Locale } from "@/lib/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/site";
import { cn } from "@/lib/utils";

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

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const title = t("metadata.title");
  const description = t("metadata.description");

  return buildPageMetadata({
    locale,
    path: "/contact",
    title,
    description,
  });
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
    <InnerPageHero
      variant="proof"
      headingId={headingId}
      breadcrumbs={<ContactBreadcrumbs locale={locale} />}
      eyebrow={t("hero.eyebrow")}
      title={t("hero.title")}
      description={t("hero.description")}
      aside={
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
      }
    />
  );
}

async function ContactInformation() {
  const t = await getTranslations("contact");
  const headingId = "contact-info-heading";

  return (
    <Section tone="surface" aria-labelledby={headingId}>
      <Container className="grid gap-[var(--space-12)] lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          badge={t("info.eyebrow")}
          title={t("info.title")}
          description={t("info.description")}
          headingId={headingId}
        />

        <div className="grid gap-[var(--grid-gap)] sm:grid-cols-2 lg:grid-cols-3">
          {contactCardKeys.map((key, index) => {
            const isPrimaryChannel = index === 0;

            return (
              <Card
                key={key}
                data-reveal-item
                variant={isPrimaryChannel ? "elevated" : "glass"}
                padding="lg"
                className={cn(
                  "flex min-h-[calc(var(--space-40)+var(--space-8))] flex-col gap-[var(--space-4)] text-start",
                  isPrimaryChannel &&
                    "relative overflow-hidden border-border-light bg-[image:var(--gradient-subtle)] sm:col-span-2 lg:col-span-1",
                )}
              >
                {isPrimaryChannel ? (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
                  />
                ) : null}
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
            );
          })}

          <Card
            data-reveal-item
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

async function ContactFormLayout({ locale }: { locale: Locale }) {
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
        <SectionHeader
          badge={t("form.eyebrow")}
          title={t("form.title")}
          description={t("form.description")}
          headingId={headingId}
        />

        <Card variant="glass" padding="lg" className="text-start">
          <ContactForm
            locale={locale}
            ariaLabelledBy={headingId}
            labels={{
              name: forms("fields.name"),
              company: forms("fields.company"),
              email: forms("fields.email"),
              phone: forms("fields.phone"),
              service: forms("fields.service"),
              message: forms("fields.message"),
              honeypot: forms("common.honeypotLabel"),
            }}
            placeholders={{
              name: forms("placeholders.name"),
              company: forms("placeholders.company"),
              email: forms("placeholders.email"),
              phone: forms("placeholders.phone"),
              message: forms("placeholders.message"),
              service: t("form.servicePlaceholder"),
            }}
            serviceOptions={serviceOptions}
            submitLabel={t("form.submit")}
          />
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
      <Reveal variant="cards" itemSelector="[data-reveal-item]">
        <ContactInformation />
      </Reveal>
      <Reveal variant="editorial">
        <ContactFormLayout locale={locale} />
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
