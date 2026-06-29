import "server-only";

import type { Locale } from "@/lib/i18n/routing";
import { mapHomeHero } from "@/lib/sanity/mappers";
import { publicClient } from "@/lib/sanity/publicClient";
import { homeHeroQuery } from "@/lib/sanity/queries";
import type { HeroContent, SanityHomeHero } from "@/lib/sanity/types";

export async function loadHomeHero(locale: Locale): Promise<HeroContent | null> {
  try {
    const data = await publicClient.fetch<SanityHomeHero>(homeHeroQuery);

    return mapHomeHero(data, locale);
  } catch {
    return null;
  }
}
