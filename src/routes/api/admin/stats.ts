import { createFileRoute } from "@tanstack/react-router";
import { json, requireAdmin } from "../../../server/admin/admin-auth.server";
import { getStats } from "../../../server/admin/admin.service.server";

export const Route = createFileRoute("/api/admin/stats")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireAdmin(request);
        if (!auth.ok) return auth.response;

        try {
          return json(await getStats());
        } catch (err) {
          console.error("GET /api/admin/stats error:", err);
          return json({ error: "No se pudieron cargar las métricas" }, 500);
        }
      },
    },
  },
});
