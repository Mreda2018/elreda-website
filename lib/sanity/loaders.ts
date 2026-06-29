import "server-only";

import type { Locale } from "@/lib/i18n/routing";
import { mapHomeHero, mapHomeServices } from "@/lib/sanity/mappers";
import { homeHeroQuery, homeServicesQuery } from "@/lib/sanity/queries";
import type {
  HeroContent,
  SanityHomeHero,
  SanityHomeServices,
  ServicesContent,
} from "@/lib/sanity/types";

export async function loadHomeHero(locale: Locale): Promise<HeroContent | null> {
  try {
    const { publicClient } = await import("@/lib/sanity/publicClient");
    const data = await publicClient.fetch<SanityHomeHero>(homeHeroQuery);

    return mapHomeHero(data, locale);
  } catch (error) {
    console.error("loadHomeHero failed", error);

    return null;
  }
}

export async function loadHomeServices(
  locale: Locale,
): Promise<ServicesContent | null> {
  try {
    const { publicClient } = await import("@/lib/sanity/publicClient");
    const data = await publicClient.fetch<SanityHomeServices>(homeServicesQuery);

    return mapHomeServices(data, locale);
  } catch (error) {
    console.error("loadHomeServices failed", error);

    return null;
  }
}
