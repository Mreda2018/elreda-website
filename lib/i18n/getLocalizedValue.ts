import type { Locale } from "@/lib/i18n/routing";

type LocalizedInput = Partial<Record<Locale, string | null | undefined>> | null | undefined;

export type LocalizedValue = {
  text: string;
  lang: Locale;
};

export function getLocalizedValue(
  value: LocalizedInput,
  locale: Locale,
): LocalizedValue {
  const requestedValue = value?.[locale];

  if (requestedValue) {
    return { text: requestedValue, lang: locale };
  }

  const fallbackLocale: Locale = locale === "ar" ? "en" : "ar";
  const fallbackValue = value?.[fallbackLocale];

  if (fallbackValue) {
    return { text: fallbackValue, lang: fallbackLocale };
  }

  return { text: "", lang: locale };
}
