import { groq } from "next-sanity";

export const homeHeroQuery = groq`
  *[_type == "settings" && _id == "settings"][0].homeHero{
    eyebrow,
    headline,
    description,
    primaryCta{
      label,
      href
    },
    secondaryCta{
      label,
      href
    },
    statistics[]{
      value,
      label
    }
  }
`;

export const homeServicesQuery = groq`
  *[_type == "settings" && _id == "settings"][0].homeServices{
    eyebrow,
    heading,
    description,
    serviceItems[]{
      _key,
      title,
      description,
      href,
      category,
      icon,
      isTranslated
    },
    cta{
      label,
      href
    }
  }
`;
