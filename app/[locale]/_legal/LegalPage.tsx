import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { InnerPageHero } from "@/components/sections/InnerPageHero";
import { Card, Container, Heading, Section } from "@/components/ui";
import type { Locale } from "@/lib/i18n/routing";
import { buildPageMetadata, getLocalizedPath, type PublicPath } from "@/lib/seo/site";

export type LegalPageKey =
  | "privacyPolicy"
  | "terms"
  | "cookiesPolicy"
  | "accessibility";

export type LegalPageProps = {
  params: Promise<{ locale: Locale }>;
};

type LegalSection = {
  title: string;
  body: string[];
};

const legalPageConfig = {
  privacyPolicy: {
    path: "/privacy-policy",
    headingId: "privacy-policy-heading",
  },
  terms: {
    path: "/terms",
    headingId: "terms-heading",
  },
  cookiesPolicy: {
    path: "/cookies-policy",
    headingId: "cookies-policy-heading",
  },
  accessibility: {
    path: "/accessibility",
    headingId: "accessibility-heading",
  },
} as const satisfies Record<LegalPageKey, { path: PublicPath; headingId: string }>;

export async function generateLegalMetadata(
  pageKey: LegalPageKey,
  { params }: LegalPageProps,
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });

  return buildPageMetadata({
    locale,
    path: legalPageConfig[pageKey].path,
    title: t(`${pageKey}.metadata.title`),
    description: t(`${pageKey}.metadata.description`),
  });
}

export async function LegalPage({
  pageKey,
  params,
}: LegalPageProps & { pageKey: LegalPageKey }) {
  const { locale } = await params;
  const t = await getTranslations("legal");
  const page = legalPageConfig[pageKey];
  const sections = t.raw(`${pageKey}.sections`) as LegalSection[];

  return (
    <>
      <InnerPageHero
        variant="editorial"
        headingId={page.headingId}
        breadcrumbs={
          <nav
            aria-label={t("shared.breadcrumbsLabel")}
            className="text-small rtl:text-ar-small"
          >
            <ol
              className="flex list-none flex-wrap items-center gap-[var(--space-2)] p-0 text-text-secondary"
              role="list"
            >
              <li>
                <Link
                  href={getLocalizedPath(locale, "/")}
                  className="underline-offset-4 hover:text-white hover:underline"
                >
                  {t("shared.home")}
                </Link>
              </li>
              <li aria-hidden="true" className="text-text-muted">
                /
              </li>
              <li aria-current="page" className="text-text-primary">
                {t(`${pageKey}.breadcrumbsCurrent`)}
              </li>
            </ol>
          </nav>
        }
        eyebrow={t(`${pageKey}.eyebrow`)}
        title={t(`${pageKey}.title`)}
        description={t(`${pageKey}.description`)}
        aside={
          <Card variant="glass" padding="lg" className="overflow-hidden text-start">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
            />
            <div className="flex flex-col gap-[var(--space-5)]">
              <Heading level={2} className="text-h4">
                {t("shared.reviewNoticeTitle")}
              </Heading>
              <p className="text-body text-text-secondary rtl:text-ar-body">
                {t("shared.reviewNotice")}
              </p>
              <dl className="border-t border-[color:var(--glass-border)] pt-[var(--space-5)]">
                <dt className="text-small text-text-muted rtl:text-ar-small">
                  {t("shared.lastUpdatedLabel")}
                </dt>
                <dd className="m-0 mt-[var(--space-2)] text-body font-semibold text-white rtl:text-ar-body">
                  {t("shared.lastUpdated")}
                </dd>
              </dl>
            </div>
          </Card>
        }
      />

      <Section tone="dark" spacing="compact">
        <Container size="narrow" className="pb-[var(--space-20)]">
          <Card
            variant="glass"
            padding="lg"
            className="flex flex-col gap-[var(--space-10)] text-start"
          >
            {sections.map((section, index) => {
              const sectionId = `${pageKey}-section-${index}`;

              return (
                <section
                  key={section.title}
                  aria-labelledby={sectionId}
                  className="border-t border-[color:var(--glass-border)] pt-[var(--space-8)] first:border-t-0 first:pt-0"
                >
                  <Heading level={2} id={sectionId} className="text-h4">
                    {section.title}
                  </Heading>
                  <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-4)] text-body leading-relaxed text-text-secondary rtl:text-ar-body">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              );
            })}
          </Card>
        </Container>
      </Section>
    </>
  );
}
