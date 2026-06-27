import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { isLocale, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = requestedLocale ?? routing.defaultLocale;

  if (!isLocale(locale)) {
    notFound();
  }

  return {
    locale,
    messages: {},
  };
});
