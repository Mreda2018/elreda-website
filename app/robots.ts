import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo/site";

const disallowedRoutes = [
  "/api/",
  "/studio/",
  "/admin/",
  "/preview/",
  "/drafts/",
  "/private/",
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "GPTBot",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
        disallow: disallowedRoutes,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedRoutes,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
