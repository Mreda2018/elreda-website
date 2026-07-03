import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { Badge, Card, Container, Heading, Section } from "@/components/ui";
import { getOptionalPublicEnv } from "@/lib/env";
import type { Locale } from "@/lib/i18n/routing";

type AboutPageProps = {
  params: Promise<{ locale: Locale }>;
};

const heroStatKeys = ["model", "coverage", "mindset"] as const;
const storyParagraphKeys = ["first", "second", "third"] as const;
const valueKeys = [
  "professional",
  "innovative",
  "creative",
  "trustworthy",
  "resultsDriven",
] as const;
const teamKeys = ["strategy", "creative", "technology"] as const;

function getLocalizedHref(locale: Locale, path: "/" | `/${string}`): string {
  if (locale === "ar") {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}

function getCanonicalUrl(locale: Locale): string {
  const siteUrl = getOptionalPublicEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";

  return new URL(getLocalizedHref(locale, "/about"), siteUrl).toString();
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
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

async function AboutBreadcrumbs({ locale }: { locale: Locale }) {
  const t = await getTranslations("about");

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
          {t("breadcrumbs.about")}
        </li>
      </ol>
    </nav>
  );
}

async function AboutHero({ locale }: { locale: Locale }) {
  const t = await getTranslations("about");
  const headingId = "about-page-heading";

  return (
    <Section
      tone="dark"
      spacing="compact"
      aria-labelledby={headingId}
      className="overflow-hidden pt-[calc(var(--space-20)+var(--space-16))]"
    >
      <Container className="flex flex-col gap-[var(--space-12)]">
        <AboutBreadcrumbs locale={locale} />

        <div className="grid gap-[var(--space-12)] lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
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
            className="relative overflow-hidden border-[color:var(--glass-border)]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
            />
            <div className="flex flex-col gap-[var(--space-8)]">
              <p className="text-h4 font-semibold text-white rtl:text-ar-h3">
                {t("hero.signalLabel")}
              </p>
              <dl className="grid gap-[var(--space-5)] sm:grid-cols-3 lg:grid-cols-1">
                {heroStatKeys.map((key) => (
                  <div
                    key={key}
                    className="border-t border-[color:var(--glass-border)] pt-[var(--space-5)]"
                  >
                    <dt className="text-small text-text-muted rtl:text-ar-small">
                      {t(`hero.stats.${key}.label`)}
                    </dt>
                    <dd className="m-0 mt-[var(--space-2)] text-h3 font-semibold text-white rtl:text-ar-h3">
                      {t(`hero.stats.${key}.value`)}
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

async function CompanyStory() {
  const t = await getTranslations("about");
  const headingId = "about-story-heading";

  return (
    <Section tone="surface" aria-labelledby={headingId}>
      <Container className="grid gap-[var(--space-12)] lg:grid-cols-[0.82fr_1.18fr]">
        <header className="flex flex-col items-start gap-[var(--space-5)] text-start">
          <Badge variant="red" size="md">
            {t("story.eyebrow")}
          </Badge>
          <Heading id={headingId} level={2}>
            {t("story.title")}
          </Heading>
          <p className="text-body-lg text-text-secondary rtl:text-ar-body-lg">
            {t("story.lead")}
          </p>
        </header>

        <div className="grid gap-[var(--space-6)]">
          <Card
            variant="glass"
            padding="lg"
            className="grid gap-[var(--space-8)] border-[color:var(--glass-border)] lg:grid-cols-[0.85fr_1.15fr]"
          >
            <blockquote className="border-s border-red-primary ps-[var(--space-6)] text-h4 font-semibold leading-relaxed text-white rtl:text-ar-h3">
              {t("story.quote")}
            </blockquote>
            <div className="flex flex-col gap-[var(--space-5)]">
              {storyParagraphKeys.map((key) => (
                <p
                  key={key}
                  className="text-body leading-relaxed text-text-secondary rtl:text-ar-body"
                >
                  {t(`story.paragraphs.${key}`)}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

async function MissionVision() {
  const t = await getTranslations("about");
  const headingId = "about-mission-vision-heading";

  return (
    <Section tone="dark" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <header className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start">
          <Badge variant="red" size="md">
            {t("missionVision.eyebrow")}
          </Badge>
          <Heading id={headingId} level={2}>
            {t("missionVision.title")}
          </Heading>
        </header>

        <div className="grid gap-[var(--grid-gap)] lg:grid-cols-2">
          {(["mission", "vision"] as const).map((key) => (
            <Card
              key={key}
              variant="glass"
              padding="lg"
              className="flex min-h-[calc(var(--space-48)+var(--space-16))] flex-col gap-[var(--space-8)] text-start"
            >
              <Badge variant="glass" size="md">
                {t(`missionVision.${key}.label`)}
              </Badge>
              <div className="flex flex-col gap-[var(--space-4)]">
                <Heading level={3}>{t(`missionVision.${key}.title`)}</Heading>
                <p className="text-body text-text-secondary rtl:text-ar-body">
                  {t(`missionVision.${key}.description`)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

async function ValuesSection() {
  const t = await getTranslations("about");
  const headingId = "about-values-heading";

  return (
    <Section tone="elevated" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <header className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start">
          <Badge variant="red" size="md">
            {t("values.eyebrow")}
          </Badge>
          <Heading id={headingId} level={2}>
            {t("values.title")}
          </Heading>
        </header>

        <ul
          className="grid list-none gap-[var(--grid-gap)] p-0 md:grid-cols-2 xl:grid-cols-5"
          role="list"
        >
          {valueKeys.map((key, index) => (
            <li key={key}>
              <Card
                variant="glass"
                padding="lg"
                className="flex h-full flex-col gap-[var(--space-5)] text-start"
              >
                <span
                  aria-hidden="true"
                  className="text-h5 font-semibold text-red-primary"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-[var(--space-3)]">
                  <Heading level={3} className="text-h4">
                    {t(`values.items.${key}.title`)}
                  </Heading>
                  <p className="text-small text-text-secondary rtl:text-ar-small">
                    {t(`values.items.${key}.description`)}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

async function TeamSection() {
  const t = await getTranslations("about");
  const headingId = "about-team-heading";

  return (
    <Section tone="surface" aria-labelledby={headingId}>
      <Container className="grid gap-[var(--space-12)] lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <header className="flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start">
          <Badge variant="red" size="md">
            {t("team.eyebrow")}
          </Badge>
          <div className="flex flex-col gap-[var(--space-4)]">
            <Heading id={headingId} level={2}>
              {t("team.title")}
            </Heading>
            <p className="text-body-lg text-text-secondary rtl:text-ar-body-lg">
              {t("team.description")}
            </p>
          </div>
        </header>

        <ul className="grid list-none gap-[var(--grid-gap)] p-0" role="list">
          {teamKeys.map((key) => (
            <li key={key}>
              <Card
                variant="glass"
                padding="lg"
                className="grid gap-[var(--space-6)] text-start sm:grid-cols-[0.32fr_1fr]"
              >
                <div className="flex aspect-square min-h-28 items-center justify-center rounded-md border border-[color:var(--glass-border)] bg-[image:var(--gradient-subtle)]">
                  <span className="px-[var(--space-4)] text-center text-small font-medium text-text-muted rtl:text-ar-small">
                    {t("team.status")}
                  </span>
                </div>
                <div className="flex flex-col justify-center gap-[var(--space-3)]">
                  <Heading level={3} className="text-h4">
                    {t(`team.items.${key}.title`)}
                  </Heading>
                  <p className="text-body text-text-secondary rtl:text-ar-body">
                    {t(`team.items.${key}.description`)}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations("about");

  return (
    <>
      <AboutHero locale={locale} />
      <CompanyStory />
      <MissionVision />
      <ValuesSection />
      <TeamSection />
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
