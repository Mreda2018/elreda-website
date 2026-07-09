import type { Metadata } from "next";

import { getOptionalPublicEnv } from "@/lib/env";
import type { Locale } from "@/lib/i18n/routing";

export type PublicPath =
  | "/"
  | "/about"
  | "/services"
  | "/portfolio"
  | "/industries"
  | "/pricing"
  | "/blog"
  | "/contact"
  | "/quote";

const DEFAULT_SITE_URL = "https://elreda.com";

export const publicPaths: PublicPath[] = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/industries",
  "/pricing",
  "/blog",
  "/contact",
  "/quote",
];

export function getSiteUrl(): URL {
  const configuredUrl = getOptionalPublicEnv("NEXT_PUBLIC_SITE_URL") ?? DEFAULT_SITE_URL;

  try {
    const siteUrl = new URL(configuredUrl);
    siteUrl.pathname = "";
    siteUrl.search = "";
    siteUrl.hash = "";

    return siteUrl;
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export function getLocalizedPath(locale: Locale, path: PublicPath): string {
  if (locale === "ar") {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}

export function getAbsoluteUrl(locale: Locale, path: PublicPath): string {
  return new URL(getLocalizedPath(locale, path), getSiteUrl()).toString();
}

export function getLanguageAlternates(path: PublicPath): Record<string, string> {
  return {
    "ar-EG": getAbsoluteUrl("ar", path),
    en: getAbsoluteUrl("en", path),
    "x-default": getAbsoluteUrl("ar", path),
  };
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: PublicPath;
  title: string;
  description: string;
}): Metadata {
  const canonical = getAbsoluteUrl(locale, path);
  const ogImage = new URL(getLocalizedPath(locale, "/"), getSiteUrl());
  ogImage.pathname = `${ogImage.pathname.replace(/\/$/, "")}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      type: "website",
      url: canonical,
      siteName: "elReda Advertising",
      images: [
        {
          url: ogImage.toString(),
          width: 1200,
          height: 630,
          alt:
            locale === "ar"
              ? "إلريدا للدعاية والإعلان"
              : "elReda Advertising",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.toString()],
    },
  };
}
