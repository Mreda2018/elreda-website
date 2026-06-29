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

export type SanityServicesAction = {
  label?: LocalizedString | null;
  href?: string | null;
};

export type SanityServiceItem = {
  _key?: string | null;
  title?: LocalizedString | null;
  description?: LocalizedString | null;
  href?: string | null;
  category?: LocalizedString | null;
  icon?: string | null;
  isTranslated?: boolean | null;
};

export type SanityHomeServices = {
  eyebrow?: LocalizedString | null;
  heading?: LocalizedString | null;
  description?: LocalizedString | null;
  serviceItems?: SanityServiceItem[] | null;
  cta?: SanityServicesAction | null;
} | null;

export type ServicesContent = {
  eyebrow?: LocalizedValue;
  heading: LocalizedValue;
  description: LocalizedValue;
  services: Array<{
    id: string;
    title: LocalizedValue;
    description: LocalizedValue;
    href: string;
    category?: LocalizedValue;
    icon?: string;
    isTranslated: boolean;
  }>;
  cta?: {
    href: string;
    label: LocalizedValue;
  };
};
