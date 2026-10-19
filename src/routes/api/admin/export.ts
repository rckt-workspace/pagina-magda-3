import { createFileRoute } from "@tanstack/react-router";
import { json, requireAdmin } from "../../../server/admin/admin-auth.server";
import { dayKey, exportLeadsCsv, parseFilters } from "../../../server/admin/admin.service.server";

export const Route = createFileRoute("/api/admin/export")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireAdmin(request);
        if (!auth.ok) return auth.response;

        const filters = parseFilters(new URL(request.url));
        if (!filters.success) return json({ error: "Filtros inválidos" }, 400);

        try {
          const csv = await exportLeadsCsv(filters.data);
          return new Response(csv, {
            status: 200,
            headers: {
              "content-type": "text/csv; charset=utf-8",
              "content-disposition": `attachment; filename="contactos-magda-${dayKey(new Date())}.csv"`,
              "cache-control": "no-store",
            },
          });
        } catch (err) {
          console.error("GET /api/admin/export error:", err);
          return json({ error: "No se pudo generar el archivo" }, 500);
        }
      },
    },
  },
});
