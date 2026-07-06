import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/sections/CTASection";
import { Hero } from "@/components/sections/Hero";
import { IndustriesPreviewSection } from "@/components/sections/IndustriesPreviewSection";
import { PortfolioPreviewSection } from "@/components/sections/PortfolioPreviewSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { Reveal } from "@/components/motion/Reveal";
import { renderLocalizedValue } from "@/lib/i18n/renderLocalizedValue";
import type { Locale } from "@/lib/i18n/routing";
import {
  loadHomeHero,
  loadHomeServices,
  loadHomeTestimonials,
} from "@/lib/sanity/loaders";
import type { LocalizedValue } from "@/lib/sanity/types";

function renderOptionalLocalizedValue(
  value: LocalizedValue | undefined,
  locale: Locale,
): ReactNode | undefined {
  return value ? renderLocalizedValue(value, locale) : undefined;
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const [hero, services, testimonials] = await Promise.all([
    loadHomeHero(locale),
    loadHomeServices(locale),
    loadHomeTestimonials(locale),
  ]);

  if (!hero) {
    return <div className="min-h-svh" />;
  }

  return (
    <>
      <Hero
        eyebrow={renderLocalizedValue(hero.eyebrow, locale)}
        title={renderLocalizedValue(hero.title, locale)}
        description={renderLocalizedValue(hero.description, locale)}
        primaryAction={{
          href: hero.primaryAction.href,
          label: renderLocalizedValue(hero.primaryAction.label, locale),
        }}
        secondaryAction={{
          href: hero.secondaryAction.href,
          label: renderLocalizedValue(hero.secondaryAction.label, locale),
        }}
        stats={hero.stats.map((stat) => ({
          value: renderLocalizedValue(stat.value, locale),
          label: renderLocalizedValue(stat.label, locale),
        }))}
      />
      <TrustBar
        ariaLabel={t("trustBar.ariaLabel")}
        items={[
          {
            value: t("trustBar.items.services.value"),
            label: t("trustBar.items.services.label"),
          },
          {
            value: t("trustBar.items.tiers.value"),
            label: t("trustBar.items.tiers.label"),
          },
          {
            value: t("trustBar.items.industries.value"),
            label: t("trustBar.items.industries.label"),
          },
          {
            value: t("trustBar.items.markets.value"),
            label: t("trustBar.items.markets.label"),
          },
        ]}
      />
      {services ? (
        <Reveal variant="cards" itemSelector="[data-reveal-item]">
          <ServicesSection
            eyebrow={renderOptionalLocalizedValue(services.eyebrow, locale)}
            heading={renderLocalizedValue(services.heading, locale)}
            description={renderLocalizedValue(services.description, locale)}
            services={services.services.map((service) => ({
              id: service.id,
              href: service.href,
              title: renderLocalizedValue(service.title, locale),
              description: renderLocalizedValue(service.description, locale),
              category: renderOptionalLocalizedValue(service.category, locale),
            }))}
            cta={
              services.cta
                ? {
                    label: renderLocalizedValue(services.cta.label, locale),
                  }
                : undefined
            }
          />
        </Reveal>
      ) : null}
      <Reveal variant="cards" itemSelector="[data-reveal-item]">
        <PortfolioPreviewSection
          eyebrow={t("portfolio.eyebrow")}
          heading={t("portfolio.title")}
          description={t("portfolio.subtitle")}
          ctaLabel={t("portfolio.cta")}
          items={[
            {
              id: "identity-system",
              category: t("portfolio.items.identity.category"),
              title: t("portfolio.items.identity.title"),
              description: t("portfolio.items.identity.description"),
            },
            {
              id: "commerce-experience",
              category: t("portfolio.items.commerce.category"),
              title: t("portfolio.items.commerce.title"),
              description: t("portfolio.items.commerce.description"),
            },
            {
              id: "operations-system",
              category: t("portfolio.items.operations.category"),
              title: t("portfolio.items.operations.title"),
              description: t("portfolio.items.operations.description"),
            },
          ]}
        />
      </Reveal>
      <Reveal variant="cards" itemSelector="[data-reveal-item]">
        <IndustriesPreviewSection
          eyebrow={t("industries.eyebrow")}
          heading={t("industries.title")}
          description={t("industries.subtitle")}
          ctaLabel={t("industries.cta")}
          items={[
            {
              id: "restaurants",
              title: t("industries.items.restaurants.title"),
              description: t("industries.items.restaurants.description"),
            },
            {
              id: "retail",
              title: t("industries.items.retail.title"),
              description: t("industries.items.retail.description"),
            },
            {
              id: "clinics",
              title: t("industries.items.clinics.title"),
              description: t("industries.items.clinics.description"),
            },
            {
              id: "real-estate",
              title: t("industries.items.realEstate.title"),
              description: t("industries.items.realEstate.description"),
            },
            {
              id: "ecommerce",
              title: t("industries.items.ecommerce.title"),
              description: t("industries.items.ecommerce.description"),
            },
            {
              id: "startups",
              title: t("industries.items.startups.title"),
              description: t("industries.items.startups.description"),
            },
            {
              id: "factories",
              title: t("industries.items.factories.title"),
              description: t("industries.items.factories.description"),
            },
            {
              id: "corporate",
              title: t("industries.items.corporate.title"),
              description: t("industries.items.corporate.description"),
            },
          ]}
        />
      </Reveal>
      {testimonials ? (
        <Reveal variant="cards" itemSelector="[data-reveal-item]">
          <TestimonialsSection
            eyebrow={t("testimonials.eyebrow")}
            heading={t("testimonials.title")}
            description={t("testimonials.subtitle")}
            ratingLabel={(rating) => t("testimonials.rating", { rating })}
            items={testimonials.testimonials.map((testimonial) => ({
              id: testimonial.id,
              quote: renderLocalizedValue(testimonial.quote, locale),
              clientName: testimonial.clientName,
              company: testimonial.company,
              rating: testimonial.rating,
            }))}
          />
        </Reveal>
      ) : null}
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
