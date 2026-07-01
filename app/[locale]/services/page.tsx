import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { Badge, Card, Container, Heading, Section } from "@/components/ui";
import { renderLocalizedValue } from "@/lib/i18n/renderLocalizedValue";
import type { Locale } from "@/lib/i18n/routing";
import { loadServicesPage } from "@/lib/sanity/loaders";
import type { ServicesPageService } from "@/lib/sanity/types";

type ServicesPageProps = {
  params: Promise<{ locale: Locale }>;
};

function getLocalizedHref(locale: Locale, path: "/" | `/${string}`): string {
  if (locale === "ar") {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const title = t("metadata.title");
  const description = t("metadata.description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
  };
}

async function ServicesBreadcrumbs({ locale }: { locale: Locale }) {
  const t = await getTranslations("services");

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
          {t("breadcrumbs.services")}
        </li>
      </ol>
    </nav>
  );
}

async function ServicesList({
  locale,
  services,
}: {
  locale: Locale;
  services: ServicesPageService[];
}) {
  const t = await getTranslations("services");
  const headingId = "services-list-heading";

  return (
    <Section tone="elevated" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <header className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start">
          <Badge variant="red" size="md">
            {t("list.eyebrow")}
          </Badge>
          <div className="flex flex-col gap-[var(--space-4)]">
            <Heading id={headingId} level={2}>
              {t("list.title")}
            </Heading>
            <p className="text-body-lg text-text-secondary rtl:text-ar-body-lg">
              {t("list.description")}
            </p>
          </div>
        </header>

        {services.length > 0 ? (
          <ul
            className="grid list-none gap-[var(--grid-gap)] p-0 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {services.map((service, index) => (
              <li key={service.id}>
                <Card
                  variant="glass"
                  padding="lg"
                  className="flex min-h-[calc(var(--space-48)+var(--space-32))] flex-col gap-[var(--space-6)] text-start"
                >
                  <div className="flex items-center justify-between gap-[var(--space-4)]">
                    <span
                      aria-hidden="true"
                      className="text-small font-semibold text-red-primary rtl:text-ar-small"
                    >
                      {t("card.index", { index: index + 1 })}
                    </span>
                    {!service.isTranslated && locale === "ar" ? (
                      <Badge variant="glass" size="sm">
                        {t("card.fallback")}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-[var(--space-3)]">
                    <Heading level={3}>
                      {renderLocalizedValue(service.title, locale)}
                    </Heading>
                    <p className="whitespace-pre-line text-body text-text-secondary rtl:text-ar-body">
                      {renderLocalizedValue(service.description, locale)}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Card variant="glass" padding="lg" className="text-start">
            <p className="text-body text-text-secondary rtl:text-ar-body">
              {t("list.empty")}
            </p>
          </Card>
        )}
      </Container>
    </Section>
  );
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const t = await getTranslations("services");
  const servicesPage = await loadServicesPage(locale);
  const services = servicesPage?.services ?? [];
  const headingId = "services-page-heading";

  return (
    <>
      <Section
        tone="dark"
        spacing="compact"
        aria-labelledby={headingId}
        className="pt-[calc(var(--space-20)+var(--space-16))]"
      >
        <Container className="flex flex-col gap-[var(--space-10)]">
          <ServicesBreadcrumbs locale={locale} />
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
        </Container>
      </Section>

      <ServicesList locale={locale} services={services} />

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
