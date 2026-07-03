import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { isLocale, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = requestedLocale ?? routing.defaultLocale;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = {
    common: (await import(`../../messages/${locale}/common.json`)).default,
    home: (await import(`../../messages/${locale}/home.json`)).default,
    about: (await import(`../../messages/${locale}/about.json`)).default,
    services: (await import(`../../messages/${locale}/services.json`)).default,
    portfolio: (await import(`../../messages/${locale}/portfolio.json`)).default,
    industries: (await import(`../../messages/${locale}/industries.json`)).default,
    contact: (await import(`../../messages/${locale}/contact.json`)).default,
    quote: (await import(`../../messages/${locale}/quote.json`)).default,
    forms: (await import(`../../messages/${locale}/forms.json`)).default,
  };

  return {
    locale,
    messages,
  };
});
