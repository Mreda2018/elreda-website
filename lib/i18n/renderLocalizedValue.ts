import { createElement, type ReactNode } from "react";

import type { Locale } from "@/lib/i18n/routing";
import type { LocalizedValue } from "@/lib/sanity/types";

export function renderLocalizedValue(
  value: LocalizedValue,
  locale: Locale,
): ReactNode {
  if (value.lang === locale) {
    return value.text;
  }

  return createElement("span", { lang: value.lang }, value.text);
}
