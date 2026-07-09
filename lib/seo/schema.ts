import { getSiteUrl } from "@/lib/seo/site";

export function getOrganizationSchema(): Record<string, unknown> {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "elReda Advertising",
    alternateName: "إلريدا للدعاية والإعلان",
    url: siteUrl,
    logo: `${siteUrl}/opengraph-image`,
    description:
      "Full-service creative and technology agency in Cairo, Egypt, serving businesses across Egypt, the GCC, and the wider Middle East.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cairo",
      addressCountry: "EG",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@elreda.com",
      availableLanguage: ["Arabic", "English"],
    },
    areaServed: ["EG", "AE", "SA"],
    sameAs: [
      "https://instagram.com/elreda",
      "https://facebook.com/elreda",
      "https://linkedin.com/company/elreda",
      "https://behance.net/elreda",
    ],
  };
}

export function getWebSiteSchema(): Record<string, unknown> {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "elReda Advertising",
    alternateName: "إلريدا للدعاية والإعلان",
    url: siteUrl,
    inLanguage: ["ar-EG", "en"],
    publisher: {
      "@type": "Organization",
      name: "elReda Advertising",
      url: siteUrl,
    },
  };
}
