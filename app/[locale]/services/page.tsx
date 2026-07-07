import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { InnerPageHero } from "@/components/sections/InnerPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Badge, Card, Container, Heading, Section, SectionHeader } from "@/components/ui";
import { renderLocalizedValue } from "@/lib/i18n/renderLocalizedValue";
import type { Locale } from "@/lib/i18n/routing";
import { loadServicesPage } from "@/lib/sanity/loaders";
import type { ServicesPageService } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

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
        <SectionHeader
          badge={t("list.eyebrow")}
          title={t("list.title")}
          description={t("list.description")}
          headingId={headingId}
        />

        {services.length > 0 ? (
          <ul
            className="grid list-none gap-[var(--grid-gap)] p-0 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {services.map((service, index) => {
              const isFeatured = index === 0;

              return (
                <li
                  key={service.id}
                  data-reveal-item
                  className={isFeatured ? "lg:col-span-2" : undefined}
                >
                  <Card
                    variant={isFeatured ? "elevated" : "glass"}
                    padding="lg"
                    className={cn(
                      "flex min-h-[calc(var(--space-48)+var(--space-32))] flex-col gap-[var(--space-6)] text-start",
                      isFeatured &&
                        "relative overflow-hidden border-border-light bg-[image:var(--gradient-subtle)]",
                    )}
                  >
                    {isFeatured ? (
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
                      />
                    ) : null}
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
                      <Heading
                        level={3}
                        className={isFeatured ? "max-w-4xl text-h2 rtl:text-ar-h2" : undefined}
                      >
                        {renderLocalizedValue(service.title, locale)}
                      </Heading>
                      <p
                        className={cn(
                          "whitespace-pre-line text-body text-text-secondary rtl:text-ar-body",
                          isFeatured &&
                            "max-w-[var(--container-narrow)] text-body-lg rtl:text-ar-body-lg",
                        )}
                      >
                        {renderLocalizedValue(service.description, locale)}
                      </p>
                    </div>
                  </Card>
                </li>
              );
            })}
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
      <InnerPageHero
        headingId={headingId}
        breadcrumbs={<ServicesBreadcrumbs locale={locale} />}
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <Reveal variant="cards" itemSelector="[data-reveal-item]">
        <ServicesList locale={locale} services={services} />
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
