import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import type { Locale } from "@/lib/i18n/routing";
import { loadHomeHero } from "@/lib/sanity/loaders";
import type { LocalizedValue } from "@/lib/sanity/types";

function renderLocalizedValue(value: LocalizedValue, locale: Locale): ReactNode {
  if (value.lang === locale) {
    return value.text;
  }

  return <span lang={value.lang}>{value.text}</span>;
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const hero = await loadHomeHero(locale);

  if (!hero) {
    return null;
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
    </>
  );
}
