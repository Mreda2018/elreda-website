import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getRequiredPublicEnv } from "@/lib/env";
import { getRequiredServerEnv } from "@/lib/env.server";
import type { Database } from "@/lib/supabase/types";

export function createSupabaseServiceClient() {
  return createClient<Database>(
    getRequiredPublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredServerEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
