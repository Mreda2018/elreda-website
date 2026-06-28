import { createClient } from "next-sanity";

import { sanityConfig } from "@/lib/sanity/config";

export const publicClient = createClient({
  ...sanityConfig,
  perspective: "published",
  useCdn: true,
});
