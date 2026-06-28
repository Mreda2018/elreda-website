import { getRequiredPublicEnv } from "@/lib/env";

export const sanityConfig = {
  projectId: getRequiredPublicEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: getRequiredPublicEnv("NEXT_PUBLIC_SANITY_DATASET"),
  apiVersion: getRequiredPublicEnv("NEXT_PUBLIC_SANITY_API_VERSION"),
};

