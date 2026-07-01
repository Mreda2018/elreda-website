import type { Locale } from "@/lib/i18n/routing";
import { getLocalizedValue } from "@/lib/i18n/getLocalizedValue";
import type {
  FooterContent,
  HeroContent,
  SanityFooterSettings,
  SanityHomeHero,
  SanityHomeServices,
  SanityServiceItem,
  SanityTestimonial,
  ServicesContent,
  TestimonialsContent,
} from "@/lib/sanity/types";

function normalizeHref(href: string | null | undefined): string {
  if (!href) {
    return "/";
  }

  if (href.startsWith("/")) {
    return href;
  }

  return "/";
}

function isInternalHref(href: string | null | undefined): href is string {
  return Boolean(href && href.startsWith("/") && !href.startsWith("//"));
}

export function mapHomeHero(data: SanityHomeHero, locale: Locale): HeroContent | null {
  if (!data) {
    return null;
  }

  const primaryActionLabel = getLocalizedValue(data.primaryCta?.label, locale);
  const secondaryActionLabel = getLocalizedValue(data.secondaryCta?.label, locale);

  if (primaryActionLabel.text === "" || secondaryActionLabel.text === "") {
    return null;
  }

  return {
    eyebrow: getLocalizedValue(data.eyebrow, locale),
    title: getLocalizedValue(data.headline, locale),
    description: getLocalizedValue(data.description, locale),
    primaryAction: {
      href: normalizeHref(data.primaryCta?.href),
      label: primaryActionLabel,
    },
    secondaryAction: {
      href: normalizeHref(data.secondaryCta?.href),
      label: secondaryActionLabel,
    },
    stats:
      data.statistics?.map((stat) => ({
        value: getLocalizedValue(stat.value, locale),
        label: getLocalizedValue(stat.label, locale),
      })) ?? [],
  };
}

function mapServiceItem(
  item: SanityServiceItem,
  locale: Locale,
  index: number,
): ServicesContent["services"][number] | null {
  if (!isInternalHref(item.href)) {
    return null;
  }

  const title = getLocalizedValue(item.title, locale);
  const description = getLocalizedValue(item.description, locale);

  if (title.text === "" || description.text === "") {
    return null;
  }

  const category = getLocalizedValue(item.category, locale);

  return {
    id: item._key ?? `${item.href}-${index}`,
    title,
    description,
    href: item.href,
    category: category.text === "" ? undefined : category,
    icon: item.icon ?? undefined,
    isTranslated: item.isTranslated ?? false,
  };
}

export function mapHomeServices(
  data: SanityHomeServices,
  locale: Locale,
): ServicesContent | null {
  if (!data) {
    return null;
  }

  const eyebrow = getLocalizedValue(data.eyebrow, locale);
  const heading = getLocalizedValue(data.heading, locale);
  const description = getLocalizedValue(data.description, locale);
  const services =
    data.serviceItems
      ?.map((item, index) => mapServiceItem(item, locale, index))
      .filter((item): item is ServicesContent["services"][number] => item !== null) ??
    [];
  const ctaLabel = getLocalizedValue(data.cta?.label, locale);
  const ctaHref = data.cta?.href;

  if (heading.text === "" || description.text === "" || services.length === 0) {
    return null;
  }

  return {
    ...(eyebrow.text === "" ? {} : { eyebrow }),
    heading,
    description,
    services,
    cta:
      ctaLabel.text !== "" && isInternalHref(ctaHref)
        ? {
            href: ctaHref,
            label: ctaLabel,
          }
        : undefined,
  };
}

function mapTestimonialItem(
  item: SanityTestimonial,
  locale: Locale,
  index: number,
): TestimonialsContent["testimonials"][number] | null {
  const quote = getLocalizedValue(item.quote, locale);

  if (quote.text === "" || !item.clientName) {
    return null;
  }

  const rating =
    typeof item.rating === "number" && item.rating >= 1 && item.rating <= 5
      ? item.rating
      : undefined;

  return {
    id: item._id ?? `${item.clientName}-${index}`,
    quote,
    clientName: item.clientName,
    company: item.company ?? undefined,
    rating,
  };
}

export function mapHomeTestimonials(
  data: SanityTestimonial[] | null,
  locale: Locale,
): TestimonialsContent | null {
  const testimonials =
    data
      ?.map((item, index) => mapTestimonialItem(item, locale, index))
      .filter(
        (item): item is TestimonialsContent["testimonials"][number] =>
          item !== null,
      ) ?? [];

  if (testimonials.length === 0) {
    return null;
  }

  return { testimonials };
}

function normalizeExternalHref(href: string | null | undefined): string | undefined {
  if (!href) {
    return undefined;
  }

  if (href.startsWith("https://") || href.startsWith("http://")) {
    return href;
  }

  return undefined;
}

export function mapFooterSettings(
  data: SanityFooterSettings,
  locale: Locale,
): FooterContent | null {
  if (!data) {
    return null;
  }

  const address = getLocalizedValue(data.address, locale);
  const workingHours = getLocalizedValue(data.workingHours, locale);
  const socialMedia = data.socialMedia ?? {};

  return {
    contactEmail: data.contactEmail ?? undefined,
    contactPhone: data.contactPhone ?? undefined,
    whatsappNumber: data.whatsappNumber ?? undefined,
    address: address.text === "" ? undefined : address,
    workingHours: workingHours.text === "" ? undefined : workingHours,
    socialLinks: [
      { platform: "instagram", href: normalizeExternalHref(socialMedia.instagram) },
      { platform: "facebook", href: normalizeExternalHref(socialMedia.facebook) },
      { platform: "linkedin", href: normalizeExternalHref(socialMedia.linkedin) },
      { platform: "behance", href: normalizeExternalHref(socialMedia.behance) },
      { platform: "tiktok", href: normalizeExternalHref(socialMedia.tiktok) },
      { platform: "youtube", href: normalizeExternalHref(socialMedia.youtube) },
    ],
  };
}
