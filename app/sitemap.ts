import type { MetadataRoute } from "next";

import {
  getAbsoluteUrl,
  getLanguageAlternates,
  publicPaths,
} from "@/lib/seo/site";

const routePriority = new Map<string, number>([
  ["/", 1],
  ["/services", 0.95],
  ["/contact", 0.9],
  ["/quote", 0.9],
  ["/portfolio", 0.85],
  ["/about", 0.8],
  ["/industries", 0.75],
  ["/pricing", 0.75],
  ["/blog", 0.7],
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicPaths.flatMap((path) =>
    (["ar", "en"] as const).map((locale) => ({
      url: getAbsoluteUrl(locale, path),
      lastModified,
      changeFrequency: path === "/blog" ? "weekly" : "monthly",
      priority: routePriority.get(path) ?? 0.7,
      alternates: {
        languages: getLanguageAlternates(path),
      },
    })),
  );
}
