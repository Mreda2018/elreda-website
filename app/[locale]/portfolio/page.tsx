import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { InnerPageHero } from "@/components/sections/InnerPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Badge, Button, Card, Container, Heading, Section, SectionHeader } from "@/components/ui";
import { getOptionalPublicEnv } from "@/lib/env";
import { renderLocalizedValue } from "@/lib/i18n/renderLocalizedValue";
import type { Locale } from "@/lib/i18n/routing";
import { loadPortfolioPage } from "@/lib/sanity/loaders";
import type { PortfolioPageProject } from "@/lib/sanity/types";

type PortfolioPageProps = {
  params: Promise<{ locale: Locale }>;
};

const filterKeys = [
  "all",
  "branding",
  "graphicDesign",
  "packaging",
  "websites",
  "ecommerce",
  "mobileApps",
  "erp",
  "ai",
  "printing",
  "socialMedia",
  "vehicleBranding",
  "signage",
] as const;

function getLocalizedHref(locale: Locale, path: "/" | `/${string}`): string {
  if (locale === "ar") {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}

function getCanonicalUrl(locale: Locale): string {
  const siteUrl = getOptionalPublicEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";

  return new URL(getLocalizedHref(locale, "/portfolio"), siteUrl).toString();
}

export async function generateMetadata({
  params,
}: PortfolioPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
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

async function PortfolioBreadcrumbs({ locale }: { locale: Locale }) {
  const t = await getTranslations("portfolio");

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
          {t("breadcrumbs.portfolio")}
        </li>
      </ol>
    </nav>
  );
}

async function PortfolioFilters() {
  const t = await getTranslations("portfolio");
  const headingId = "portfolio-filters-heading";

  return (
    <Section tone="surface" spacing="compact" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-8)]">
        <SectionHeader
          badge={t("filters.eyebrow")}
          title={t("filters.title")}
          description={t("filters.description")}
          headingId={headingId}
        />

        <ul
          aria-label={t("filters.label")}
          className="flex list-none flex-wrap gap-[var(--space-3)] p-0"
          role="list"
        >
          {filterKeys.map((key) => {
            const isActive = key === "all";

            return (
              <li key={key}>
                <Button
                  variant={isActive ? "primary" : "subtle"}
                  size="sm"
                  aria-disabled="true"
                  aria-pressed={isActive}
                  tabIndex={-1}
                  className="pointer-events-none opacity-50"
                >
                  {t(`filters.items.${key}`)}
                </Button>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

async function PortfolioListing({
  locale,
  projects,
}: {
  locale: Locale;
  projects: PortfolioPageProject[];
}) {
  const t = await getTranslations("portfolio");
  const headingId = "portfolio-listing-heading";
  const featuredProject = projects[0];
  const remainingProjects = projects.slice(1);

  return (
    <Section tone="dark" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <SectionHeader
          badge={t("listing.eyebrow")}
          title={t("listing.title")}
          description={t("listing.description")}
          headingId={headingId}
        />

        {featuredProject ? (
          <div className="grid gap-[var(--grid-gap)]">
            <article data-reveal-item>
              <Card
                variant="elevated"
                padding="lg"
                className="relative grid overflow-hidden text-start lg:grid-cols-[1.08fr_0.92fr]"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
                />
                <div className="flex min-h-[calc(var(--space-48)+var(--space-16))] flex-col gap-[var(--space-6)] lg:pe-[var(--space-8)]">
                  <div className="flex flex-wrap items-center gap-[var(--space-3)]">
                    {featuredProject.featured ? (
                      <Badge variant="red" size="sm">
                        {t("card.featured")}
                      </Badge>
                    ) : null}
                    {!featuredProject.isTranslated && locale === "ar" ? (
                      <Badge variant="glass" size="sm">
                        {t("card.fallback")}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-[var(--space-4)]">
                    <Heading level={3} className="max-w-4xl text-h2 rtl:text-ar-h2">
                      {renderLocalizedValue(featuredProject.title, locale)}
                    </Heading>
                    <p className="max-w-[var(--container-narrow)] whitespace-pre-line text-body-lg text-text-secondary rtl:text-ar-body-lg">
                      {featuredProject.description
                        ? renderLocalizedValue(featuredProject.description, locale)
                        : t("card.summaryFallback")}
                    </p>
                  </div>
                </div>

                <dl className="grid content-end gap-[var(--space-5)] border-t border-[color:var(--glass-border)] pt-[var(--space-6)] text-small rtl:text-ar-small lg:border-s lg:border-t-0 lg:ps-[var(--space-8)] lg:pt-0">
                  {featuredProject.client ? (
                    <div className="flex flex-col gap-[var(--space-1)]">
                      <dt className="text-text-muted">{t("card.client")}</dt>
                      <dd className="m-0 text-text-primary">{featuredProject.client}</dd>
                    </div>
                  ) : null}
                  {featuredProject.industry ? (
                    <div className="flex flex-col gap-[var(--space-1)]">
                      <dt className="text-text-muted">{t("card.industry")}</dt>
                      <dd className="m-0 text-text-primary">{featuredProject.industry}</dd>
                    </div>
                  ) : null}
                  {featuredProject.services.length > 0 ? (
                    <div className="flex flex-col gap-[var(--space-2)]">
                      <dt className="text-text-muted">{t("card.services")}</dt>
                      <dd className="m-0 flex flex-wrap gap-[var(--space-2)]">
                        {featuredProject.services.map((service) => (
                          <Badge
                            key={`${service.lang}-${service.text}`}
                            variant="glass"
                            size="sm"
                          >
                            {renderLocalizedValue(service, locale)}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </Card>
            </article>

            {remainingProjects.length > 0 ? (
              <ul
                className="grid list-none gap-[var(--grid-gap)] p-0 sm:grid-cols-2 lg:grid-cols-3"
                role="list"
              >
                {remainingProjects.map((project) => (
                  <li key={project.id} data-reveal-item>
                    <Card
                      variant="glass"
                      padding="lg"
                      className="flex min-h-[calc(var(--space-48)+var(--space-32))] flex-col gap-[var(--space-6)] text-start"
                    >
                      <div className="flex flex-wrap items-center gap-[var(--space-3)]">
                        {project.featured ? (
                          <Badge variant="red" size="sm">
                            {t("card.featured")}
                          </Badge>
                        ) : null}
                        {!project.isTranslated && locale === "ar" ? (
                          <Badge variant="glass" size="sm">
                            {t("card.fallback")}
                          </Badge>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-[var(--space-3)]">
                        <Heading level={3}>
                          {renderLocalizedValue(project.title, locale)}
                        </Heading>
                        <p className="whitespace-pre-line text-body text-text-secondary rtl:text-ar-body">
                          {project.description
                            ? renderLocalizedValue(project.description, locale)
                            : t("card.summaryFallback")}
                        </p>
                      </div>

                      <dl className="mt-auto grid gap-[var(--space-4)] border-t border-[color:var(--glass-border)] pt-[var(--space-5)] text-small rtl:text-ar-small">
                        {project.client ? (
                          <div className="flex flex-col gap-[var(--space-1)]">
                            <dt className="text-text-muted">{t("card.client")}</dt>
                            <dd className="m-0 text-text-primary">{project.client}</dd>
                          </div>
                        ) : null}
                        {project.industry ? (
                          <div className="flex flex-col gap-[var(--space-1)]">
                            <dt className="text-text-muted">{t("card.industry")}</dt>
                            <dd className="m-0 text-text-primary">{project.industry}</dd>
                          </div>
                        ) : null}
                        {project.services.length > 0 ? (
                          <div className="flex flex-col gap-[var(--space-2)]">
                            <dt className="text-text-muted">{t("card.services")}</dt>
                            <dd className="m-0 flex flex-wrap gap-[var(--space-2)]">
                              {project.services.map((service) => (
                                <Badge
                                  key={`${service.lang}-${service.text}`}
                                  variant="glass"
                                  size="sm"
                                >
                                  {renderLocalizedValue(service, locale)}
                                </Badge>
                              ))}
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <Card variant="glass" padding="lg" className="text-start">
            <p className="text-body text-text-secondary rtl:text-ar-body">
              {t("listing.empty")}
            </p>
          </Card>
        )}
      </Container>
    </Section>
  );
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  const t = await getTranslations("portfolio");
  const portfolioPage = await loadPortfolioPage(locale);
  const projects = portfolioPage?.projects ?? [];
  const headingId = "portfolio-page-heading";

  return (
    <>
      <InnerPageHero
        headingId={headingId}
        breadcrumbs={<PortfolioBreadcrumbs locale={locale} />}
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <Reveal variant="editorial">
        <PortfolioFilters />
      </Reveal>
      <Reveal variant="cards" itemSelector="[data-reveal-item]">
        <PortfolioListing locale={locale} projects={projects} />
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
