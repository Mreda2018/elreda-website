import type {
  SanityImageCrop,
  SanityImageHotspot,
  SanityImageObject,
  SanityReference,
} from "@sanity/image-url";

import type { Locale } from "@/lib/i18n/routing";
import type { LocalizedValue } from "@/lib/i18n/getLocalizedValue";

export type LocalizedString = Partial<Record<Locale, string>>;
export type { LocalizedValue };

export type SanityCmsImage = {
  asset?: SanityReference | null;
  crop?: SanityImageCrop | null;
  hotspot?: SanityImageHotspot | null;
  alt?: LocalizedString | null;
};

export type CmsImage = {
  source: SanityImageObject;
  alt?: LocalizedValue;
};

export type SanityHeroAction = {
  label?: LocalizedString | null;
  href?: string | null;
};

export type SanityHeroStatistic = {
  value?: LocalizedString | null;
  label?: LocalizedString | null;
};

export type SanityHomeHero = {
  eyebrow?: LocalizedString | null;
  headline?: LocalizedString | null;
  description?: LocalizedString | null;
  homeHeroImage?: SanityCmsImage | null;
  primaryCta?: SanityHeroAction | null;
  secondaryCta?: SanityHeroAction | null;
  statistics?: SanityHeroStatistic[] | null;
} | null;

export type HeroContent = {
  eyebrow: LocalizedValue;
  title: LocalizedValue;
  description: LocalizedValue;
  image?: CmsImage;
  primaryAction: {
    href: string;
    label: LocalizedValue;
  };
  secondaryAction: {
    href: string;
    label: LocalizedValue;
  };
  stats: Array<{
    value: LocalizedValue;
    label: LocalizedValue;
  }>;
};

export type SanityServicesAction = {
  label?: LocalizedString | null;
  href?: string | null;
};

export type SanityServiceItem = {
  _key?: string | null;
  title?: LocalizedString | null;
  description?: LocalizedString | null;
  href?: string | null;
  category?: LocalizedString | null;
  icon?: string | null;
  isTranslated?: boolean | null;
};

export type SanityHomeServices = {
  eyebrow?: LocalizedString | null;
  heading?: LocalizedString | null;
  description?: LocalizedString | null;
  serviceItems?: SanityServiceItem[] | null;
  cta?: SanityServicesAction | null;
} | null;

export type ServicesContent = {
  eyebrow?: LocalizedValue;
  heading: LocalizedValue;
  description: LocalizedValue;
  services: Array<{
    id: string;
    title: LocalizedValue;
    description: LocalizedValue;
    href: string;
    category?: LocalizedValue;
    icon?: string;
    isTranslated: boolean;
  }>;
  cta?: {
    href: string;
    label: LocalizedValue;
  };
};

export type SanityTestimonial = {
  _id?: string | null;
  quote?: LocalizedString | null;
  clientName?: string | null;
  company?: string | null;
  rating?: number | null;
};

export type TestimonialItem = {
  id: string;
  quote: LocalizedValue;
  clientName: string;
  company?: string;
  rating?: number;
};

export type TestimonialsContent = {
  testimonials: TestimonialItem[];
};

export type SanityPortableTextSpan = {
  text?: string | null;
};

export type SanityPortableTextBlock = {
  children?: SanityPortableTextSpan[] | null;
};

export type LocalizedPortableText = Partial<
  Record<Locale, SanityPortableTextBlock[] | null>
>;

export type SanityServiceDocument = {
  _id?: string | null;
  title?: LocalizedString | null;
  slug?: string | null;
  description?: LocalizedPortableText | null;
  isTranslated?: boolean | null;
};

export type ServicesPageService = {
  id: string;
  title: LocalizedValue;
  description: LocalizedValue;
  href: string;
  isTranslated: boolean;
};

export type ServicesPageContent = {
  services: ServicesPageService[];
};

export type SanityPortfolioServiceRef = {
  title?: LocalizedString | null;
  slug?: string | null;
};

export type SanityPortfolioDocument = {
  _id?: string | null;
  title?: LocalizedString | null;
  slug?: string | null;
  client?: string | null;
  industry?: string | null;
  services?: SanityPortfolioServiceRef[] | null;
  challenge?: LocalizedPortableText | null;
  featured?: boolean | null;
  publishedAt?: string | null;
  isTranslated?: boolean | null;
};

export type PortfolioPageProject = {
  id: string;
  title: LocalizedValue;
  href: string;
  description?: LocalizedValue;
  client?: string;
  industry?: string;
  services: LocalizedValue[];
  featured: boolean;
  publishedAt?: string;
  isTranslated: boolean;
};

export type PortfolioPageContent = {
  projects: PortfolioPageProject[];
};

export type SanityBlogAuthor = {
  name?: string | null;
};

export type SanityBlogSeo = {
  description?: string | null;
};

export type SanityBlogPostDocument = {
  _id?: string | null;
  title?: LocalizedString | null;
  slug?: string | null;
  author?: SanityBlogAuthor | null;
  category?: string | null;
  tags?: string[] | null;
  body?: LocalizedPortableText | null;
  seo?: SanityBlogSeo | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  isTranslated?: boolean | null;
};

export type BlogPageArticle = {
  id: string;
  title: LocalizedValue;
  href: string;
  excerpt?: LocalizedValue;
  author?: string;
  category?: string;
  tags: string[];
  publishedAt?: string;
  readTimeMinutes: number;
  featured: boolean;
  isTranslated: boolean;
};

export type BlogPageContent = {
  articles: BlogPageArticle[];
};

export type SanityFooterSettings = {
  logo?: SanityCmsImage | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  whatsappNumber?: string | null;
  address?: LocalizedString | null;
  workingHours?: LocalizedString | null;
  socialMedia?: Partial<
    Record<"instagram" | "facebook" | "linkedin" | "behance" | "tiktok" | "youtube", string | null>
  > | null;
} | null;

export type FooterSocialLink = {
  platform: "instagram" | "facebook" | "linkedin" | "behance" | "tiktok" | "youtube";
  href?: string;
};

export type FooterContent = {
  logo?: CmsImage;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  address?: LocalizedValue;
  workingHours?: LocalizedValue;
  socialLinks: FooterSocialLink[];
};
