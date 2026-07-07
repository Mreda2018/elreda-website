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
import { loadBlogPage } from "@/lib/sanity/loaders";
import type { BlogPageArticle } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

type BlogPageProps = {
  params: Promise<{ locale: Locale }>;
};

const filterKeys = [
  "all",
  "branding",
  "design",
  "web",
  "technology",
  "ai",
  "marketing",
  "printing",
  "business",
] as const;

function getLocalizedHref(locale: Locale, path: "/" | `/${string}`): string {
  if (locale === "ar") {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}

function getCanonicalUrl(locale: Locale): string {
  const siteUrl = getOptionalPublicEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";

  return new URL(getLocalizedHref(locale, "/blog"), siteUrl).toString();
}

function formatDate(locale: Locale, value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
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

async function BlogBreadcrumbs({ locale }: { locale: Locale }) {
  const t = await getTranslations("blog");

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
          {t("breadcrumbs.blog")}
        </li>
      </ol>
    </nav>
  );
}

async function BlogHero({ locale }: { locale: Locale }) {
  const t = await getTranslations("blog");
  const headingId = "blog-page-heading";

  return (
    <InnerPageHero
      variant="editorial"
      headingId={headingId}
      breadcrumbs={<BlogBreadcrumbs locale={locale} />}
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
          <div className="flex flex-col gap-[var(--space-5)]">
            <p className="text-h4 font-semibold leading-relaxed text-white rtl:text-ar-h3">
              {t("hero.panel.title")}
            </p>
            <p className="text-body text-text-secondary rtl:text-ar-body">
              {t("hero.panel.description")}
            </p>
          </div>
        </Card>
      }
    />
  );
}

async function BlogFilters() {
  const t = await getTranslations("blog");
  const headingId = "blog-filters-heading";

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

async function ArticleCard({
  article,
  locale,
  featured = false,
}: {
  article: BlogPageArticle;
  locale: Locale;
  featured?: boolean;
}) {
  const t = await getTranslations("blog");
  const publishedDate = formatDate(locale, article.publishedAt);

  return (
    <Card
      data-reveal-item
      variant={featured ? "elevated" : "glass"}
      padding="lg"
      className={cn(
        "flex h-full flex-col gap-[var(--space-6)] text-start",
        featured &&
          "relative overflow-hidden border-border-light bg-[image:var(--gradient-subtle)] lg:grid lg:grid-cols-[1.12fr_0.88fr]",
      )}
    >
      {featured ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
        />
      ) : null}
      <div className="flex flex-col gap-[var(--space-6)]">
        <div className="flex flex-wrap items-center gap-[var(--space-3)]">
          {featured ? (
            <Badge variant="red" size="sm">
              {t("card.featured")}
            </Badge>
          ) : null}
          {article.category ? (
            <Badge variant="glass" size="sm">
              {article.category}
            </Badge>
          ) : null}
          {!article.isTranslated && locale === "ar" ? (
            <Badge variant="glass" size="sm">
              {t("card.fallback")}
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-col gap-[var(--space-4)]">
          <Heading
            level={3}
            className={featured ? "max-w-4xl text-h2 rtl:text-ar-h2" : undefined}
          >
            {renderLocalizedValue(article.title, locale)}
          </Heading>
          <p
            className={cn(
              "whitespace-pre-line text-body text-text-secondary rtl:text-ar-body",
              featured && "max-w-[var(--container-narrow)] text-body-lg rtl:text-ar-body-lg",
            )}
          >
            {article.excerpt
              ? renderLocalizedValue(article.excerpt, locale)
              : t("card.excerptFallback")}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-[var(--space-6)]",
          featured && "lg:border-s lg:border-[color:var(--glass-border)] lg:ps-[var(--space-8)]",
        )}
      >
        {article.tags.length > 0 ? (
          <ul className="flex list-none flex-wrap gap-[var(--space-2)] p-0" role="list">
            {article.tags.slice(0, 3).map((tag) => (
              <li key={tag}>
                <span className="rounded-full border border-[color:var(--glass-border)] px-3 py-1 text-small text-text-secondary rtl:text-ar-small">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <dl className="mt-auto grid gap-[var(--space-4)] border-t border-[color:var(--glass-border)] pt-[var(--space-5)] text-small rtl:text-ar-small">
          <div className="flex flex-col gap-[var(--space-1)]">
            <dt className="text-text-muted">{t("card.readTime")}</dt>
            <dd className="m-0 text-text-primary">
              {t("card.minutes", { minutes: article.readTimeMinutes })}
            </dd>
          </div>
          {publishedDate ? (
            <div className="flex flex-col gap-[var(--space-1)]">
              <dt className="text-text-muted">{t("card.published")}</dt>
              <dd className="m-0 text-text-primary">{publishedDate}</dd>
            </div>
          ) : null}
          {article.author ? (
            <div className="flex flex-col gap-[var(--space-1)]">
              <dt className="text-text-muted">{t("card.author")}</dt>
              <dd className="m-0 text-text-primary">{article.author}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </Card>
  );
}

async function BlogListing({
  locale,
  articles,
}: {
  locale: Locale;
  articles: BlogPageArticle[];
}) {
  const t = await getTranslations("blog");
  const headingId = "blog-listing-heading";
  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <Section tone="dark" aria-labelledby={headingId}>
      <Container className="flex flex-col gap-[var(--space-12)]">
        <header className="grid gap-[var(--space-8)] lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="flex flex-col items-start gap-[var(--space-5)] text-start">
            <Badge variant="red" size="md">
              {t("listing.eyebrow")}
            </Badge>
            <Heading id={headingId} level={2}>
              {t("listing.title")}
            </Heading>
          </div>
          <p className="max-w-[var(--container-narrow)] text-body-lg text-text-secondary rtl:text-ar-body-lg">
            {t("listing.description")}
          </p>
        </header>

        {featuredArticle ? (
          <div className="grid gap-[var(--grid-gap)]">
            <ArticleCard article={featuredArticle} locale={locale} featured />
            {remainingArticles.length > 0 ? (
              <ul
                className="grid list-none gap-[var(--grid-gap)] p-0 sm:grid-cols-2 lg:grid-cols-3"
                role="list"
              >
                {remainingArticles.map((article) => (
                  <li key={article.id}>
                    <ArticleCard article={article} locale={locale} />
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

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations("blog");
  const blogPage = await loadBlogPage(locale);
  const articles = blogPage?.articles ?? [];

  return (
    <>
      <BlogHero locale={locale} />
      <Reveal variant="editorial">
        <BlogFilters />
      </Reveal>
      <Reveal variant="cards" itemSelector="[data-reveal-item]">
        <BlogListing locale={locale} articles={articles} />
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
