import { createFileRoute } from "@tanstack/react-router";
import { validateChatInput, handleChatMessage } from "../../server/chat/chat.service.server";

const openrouterKey = process.env["OPENROUTER_API_KEY"];

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!openrouterKey) {
          return new Response(JSON.stringify({ error: "Assistant temporarily unavailable" }), {
            status: 503,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const bodyData = await request.json();
          const validation = validateChatInput(bodyData);

          if (!validation.valid) {
            return new Response(JSON.stringify({ error: validation.error }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 45000);

          try {
            const result = await handleChatMessage(validation.data, controller.signal);

            if (!result.success) {
              return new Response(JSON.stringify({ error: result.error || "Assistant error" }), {
                status: 500,
                headers: { "content-type": "application/json" },
              });
            }

            // Best-effort logging to llm_usage (don't fail if it does)
            try {
              const supabaseModule = await import("../../integrations/supabase/client.server");
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const sa: any = supabaseModule.supabaseAdmin;
              await sa.from("llm_usage").insert([
                {
                  session_id: validation.data.sessionId || null,
                  provider: "openrouter",
                  model: result.model || "unknown",
                  input_tokens: 0,
                  output_tokens: 0,
                  latency_ms: null,
                  cost_usd: null,
                  fallback_used: result.usedFallback || false,
                  status: "success",
                  error_code: null,
                  metadata: {},
                },
              ]);
            } catch (logErr) {
              // Silently ignore logging errors
              console.debug("llm_usage logging error (ignored):", logErr);
            }

            return new Response(
              JSON.stringify({
                message: result.message,
                model: result.model,
                usedFallback: result.usedFallback,
              }),
              {
                status: 200,
                headers: { "content-type": "application/json" },
              },
            );
          } finally {
            clearTimeout(timeoutId);
          }
        } catch (err) {
          console.error("POST /api/chat error:", err);
          return new Response(JSON.stringify({ error: "Request failed" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
