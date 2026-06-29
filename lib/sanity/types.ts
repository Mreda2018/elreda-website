import type { Locale } from "@/lib/i18n/routing";
import type { LocalizedValue } from "@/lib/i18n/getLocalizedValue";

export type LocalizedString = Partial<Record<Locale, string>>;
export type { LocalizedValue };

export type SanityHeroAction = {
  label?: LocalizedString | null;
  href?: string | null;
};

export type SanityHeroStatistic = {
  value?: LocalizedString | null;
  label?: LocalizedString | null;
};

export type SanityHomeHero = {
  eyebrow?: LocalizedString | null;
  headline?: LocalizedString | null;
  description?: LocalizedString | null;
  primaryCta?: SanityHeroAction | null;
  secondaryCta?: SanityHeroAction | null;
  statistics?: SanityHeroStatistic[] | null;
} | null;

export type HeroContent = {
  eyebrow: LocalizedValue;
  title: LocalizedValue;
  description: LocalizedValue;
  primaryAction: {
    href: string;
    label: LocalizedValue;
  };
  secondaryAction: {
    href: string;
    label: LocalizedValue;
  };
  stats: Array<{
    value: LocalizedValue;
    label: LocalizedValue;
  }>;
};
