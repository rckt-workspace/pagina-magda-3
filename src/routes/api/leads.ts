import { createFileRoute } from "@tanstack/react-router";
import { validateLeadInput, buildLeadPayload } from "../../server/leads/lead.service.server";

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const bodyData = await request.json();
          const validation = validateLeadInput(bodyData);

          if (!validation.valid) {
            return new Response(JSON.stringify({ error: validation.error }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const payload = buildLeadPayload(validation.data);

          const supabaseUrl = process.env["SUPABASE_URL"];
          const supabaseKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

          if (!supabaseUrl || !supabaseKey) {
            return new Response(JSON.stringify({ error: "Service unavailable" }), {
              status: 503,
              headers: { "content-type": "application/json" },
            });
          }

          try {
            const supabaseModule = await import("../../integrations/supabase/client.server");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const supabase: any = supabaseModule.supabaseAdmin;

            const { data, error } = await supabase
              .from("leads")
              .insert([payload])
              .select("id, status")
              .single();

            if (error) {
              console.error("Supabase insert error:", error);
              return new Response(JSON.stringify({ error: "Failed to save lead" }), {
                status: 500,
                headers: { "content-type": "application/json" },
              });
            }

            return new Response(
              JSON.stringify({
                id: data?.id,
                status: data?.status,
                message: "Lead received successfully",
              }),
              {
                status: 201,
                headers: { "content-type": "application/json" },
              },
            );
          } catch (supabaseError) {
            console.error("Supabase operation error:", supabaseError);
            return new Response(JSON.stringify({ error: "Service unavailable" }), {
              status: 503,
              headers: { "content-type": "application/json" },
            });
          }
        } catch (err) {
          console.error("POST /api/leads error:", err);
          return new Response(JSON.stringify({ error: "Request failed" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
