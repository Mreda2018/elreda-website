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

export const homeTestimonialsQuery = groq`
  *[_type == "testimonial"] | order(_createdAt desc)[0...6]{
    _id,
    quote,
    clientName,
    company,
    rating
  }
`;

export const servicesPageQuery = groq`
  *[_type == "service" && defined(slug.current)] | order(_createdAt asc){
    _id,
    title,
    "slug": slug.current,
    description{
      en[]{
        children[]{
          text
        }
      },
      ar[]{
        children[]{
          text
        }
      }
    },
    isTranslated
  }
`;

export const portfolioPageQuery = groq`
  *[_type == "portfolio" && defined(slug.current)] | order(featured desc, publishedAt desc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    client,
    industry,
    services[]->{
      title,
      "slug": slug.current
    },
    challenge{
      en[]{
        children[]{
          text
        }
      },
      ar[]{
        children[]{
          text
        }
      }
    },
    featured,
    publishedAt,
    isTranslated
  }
`;

export const blogPageQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] | order(featured desc, publishedAt desc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    author->{
      name
    },
    category,
    tags,
    body{
      en[]{
        children[]{
          text
        }
      },
      ar[]{
        children[]{
          text
        }
      }
    },
    seo{
      description
    },
    publishedAt,
    featured,
    isTranslated
  }
`;

export const footerSettingsQuery = groq`
  *[_type == "settings" && _id == "settings"][0]{
    contactPhone,
    contactEmail,
    whatsappNumber,
    address,
    workingHours,
    socialMedia{
      instagram,
      facebook,
      linkedin,
      behance,
      tiktok,
      youtube
    }
  }
`;
