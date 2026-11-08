import { createServerFn } from "@tanstack/react-start";

export const getPublicDbConfig = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["PROD_SUPABASE_URL"];
  const publishableKey = process.env["PROD_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !publishableKey) {
    const missing = [
      ...(!url ? ["PROD_SUPABASE_URL"] : []),
      ...(!publishableKey ? ["PROD_SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    throw new Error(`Missing production database environment variable(s): ${missing.join(", ")}`);
  }
  return { url, publishableKey };
});