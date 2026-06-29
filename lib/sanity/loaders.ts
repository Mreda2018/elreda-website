import "server-only";

import type { Locale } from "@/lib/i18n/routing";
import { mapHomeHero } from "@/lib/sanity/mappers";
import { homeHeroQuery } from "@/lib/sanity/queries";
import type { HeroContent, SanityHomeHero } from "@/lib/sanity/types";

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
