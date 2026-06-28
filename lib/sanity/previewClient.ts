import "server-only";

import { createClient } from "next-sanity";

import { getRequiredServerEnv } from "@/lib/env.server";
import { sanityConfig } from "@/lib/sanity/config";

export const previewClient = createClient({
  ...sanityConfig,
  perspective: "previewDrafts",
  token: getRequiredServerEnv("SANITY_API_READ_TOKEN"),
  useCdn: false,
});
