import "server-only";

import type { Locale } from "@/lib/i18n/routing";
import {
  mapFooterSettings,
  mapHomeHero,
  mapHomeServices,
  mapHomeTestimonials,
  mapServicesPage,
} from "@/lib/sanity/mappers";
import {
  footerSettingsQuery,
  homeHeroQuery,
  homeServicesQuery,
  homeTestimonialsQuery,
  servicesPageQuery,
} from "@/lib/sanity/queries";
import type {
  FooterContent,
  HeroContent,
  SanityFooterSettings,
  SanityHomeHero,
  SanityHomeServices,
  SanityServiceDocument,
  SanityTestimonial,
  ServicesContent,
  ServicesPageContent,
  TestimonialsContent,
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

export async function loadHomeTestimonials(
  locale: Locale,
): Promise<TestimonialsContent | null> {
  try {
    const { publicClient } = await import("@/lib/sanity/publicClient");
    const data =
      await publicClient.fetch<SanityTestimonial[]>(homeTestimonialsQuery);

    return mapHomeTestimonials(data, locale);
  } catch (error) {
    console.error("loadHomeTestimonials failed", error);

    return null;
  }
}

export async function loadServicesPage(
  locale: Locale,
): Promise<ServicesPageContent | null> {
  try {
    const { publicClient } = await import("@/lib/sanity/publicClient");
    const data =
      await publicClient.fetch<SanityServiceDocument[]>(servicesPageQuery);

    return mapServicesPage(data, locale);
  } catch (error) {
    console.error("loadServicesPage failed", error);

    return null;
  }
}

export async function loadFooterSettings(
  locale: Locale,
): Promise<FooterContent | null> {
  try {
    const { publicClient } = await import("@/lib/sanity/publicClient");
    const data = await publicClient.fetch<SanityFooterSettings>(
      footerSettingsQuery,
    );

    return mapFooterSettings(data, locale);
  } catch (error) {
    console.error("loadFooterSettings failed", error);

    return null;
  }
}
