import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function createSupabaseAdminClient() {
  const url = process.env["PROD_SUPABASE_URL"];
  const key = process.env["PROD_SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) {
    const missing = [
      ...(!url ? ["PROD_SUPABASE_URL"] : []),
      ...(!key ? ["PROD_SUPABASE_SERVICE_ROLE_KEY"] : []),
    ];
    throw new Error(`Missing production database environment variable(s): ${missing.join(", ")}`);
  }
  return createClient<Database>(url, key, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(input instanceof Request ? input.headers : undefined);
        if (init?.headers) {
          new Headers(init.headers).forEach((value, name) => headers.set(name, value));
        }
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

let client: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!client) client = createSupabaseAdminClient();
    return Reflect.get(client, prop, receiver);
  },
});