import type { ReactNode } from "react";

import { Hero } from "@/components/sections/Hero";
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
  const hero = await loadHomeHero(locale);

  if (!hero) {
    return null;
  }

  return (
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
  );
}
