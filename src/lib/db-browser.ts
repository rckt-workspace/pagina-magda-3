import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { getPublicDbConfig } from "./db-config.functions";

let clientPromise: Promise<ReturnType<typeof createClient<Database>>> | undefined;

export function getBrowserSupabase() {
  if (typeof window === "undefined") {
    throw new Error("getBrowserSupabase is only available in the browser");
  }
  if (!clientPromise) {
    clientPromise = getPublicDbConfig()
      .then(({ url, publishableKey }) => createClient<Database>(url, publishableKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      }))
      .catch((error: unknown) => {
        clientPromise = undefined;
        throw error;
      });
  }
  return clientPromise;
}