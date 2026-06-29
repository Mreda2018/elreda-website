import type { Locale } from "@/lib/i18n/routing";
import { getLocalizedValue } from "@/lib/i18n/getLocalizedValue";
import type { HeroContent, SanityHomeHero } from "@/lib/sanity/types";

function normalizeHref(href: string | null | undefined): string {
  if (!href) {
    return "/";
  }

  if (href.startsWith("/")) {
    return href;
  }

  return "/";
}

export function mapHomeHero(data: SanityHomeHero, locale: Locale): HeroContent | null {
  if (!data) {
    return null;
  }

  const primaryActionLabel = getLocalizedValue(data.primaryCta?.label, locale);
  const secondaryActionLabel = getLocalizedValue(data.secondaryCta?.label, locale);

  if (primaryActionLabel.text === "" || secondaryActionLabel.text === "") {
    return null;
  }

  return {
    eyebrow: getLocalizedValue(data.eyebrow, locale),
    title: getLocalizedValue(data.headline, locale),
    description: getLocalizedValue(data.description, locale),
    primaryAction: {
      href: normalizeHref(data.primaryCta?.href),
      label: primaryActionLabel,
    },
    secondaryAction: {
      href: normalizeHref(data.secondaryCta?.href),
      label: secondaryActionLabel,
    },
    stats:
      data.statistics?.map((stat) => ({
        value: getLocalizedValue(stat.value, locale),
        label: getLocalizedValue(stat.label, locale),
      })) ?? [],
  };
}
