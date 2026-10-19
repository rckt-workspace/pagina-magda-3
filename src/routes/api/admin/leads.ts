import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { json, requireAdmin } from "../../../server/admin/admin-auth.server";
import {
  deleteLead,
  leadUpdateSchema,
  listLeads,
  parseFilters,
  updateLead,
} from "../../../server/admin/admin.service.server";

export const Route = createFileRoute("/api/admin/leads")({
  server: {
    handlers: {
      // Listado con filtros: ?q=&status=&area=&from=YYYY-MM-DD&to=YYYY-MM-DD&page=1
      GET: async ({ request }) => {
        const auth = await requireAdmin(request);
        if (!auth.ok) return auth.response;

        const filters = parseFilters(new URL(request.url));
        if (!filters.success) return json({ error: "Filtros inválidos" }, 400);

        try {
          return json(await listLeads(filters.data));
        } catch (err) {
          console.error("GET /api/admin/leads error:", err);
          return json({ error: "No se pudieron cargar los contactos" }, 500);
        }
      },

      // Cambiar estado y/o notas internas: { id, status?, notes? }
      PATCH: async ({ request }) => {
        const auth = await requireAdmin(request);
        if (!auth.ok) return auth.response;

        const parsed = leadUpdateSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return json({ error: "Datos inválidos" }, 400);

        try {
          return json(await updateLead(parsed.data, auth.email));
        } catch (err) {
          console.error("PATCH /api/admin/leads error:", err);
          return json({ error: "No se pudo guardar el cambio" }, 500);
        }
      },

      // Eliminar definitivamente: { id }
      DELETE: async ({ request }) => {
        const auth = await requireAdmin(request);
        if (!auth.ok) return auth.response;

        const parsed = z
          .object({ id: z.string().uuid() })
          .safeParse(await request.json().catch(() => null));
        if (!parsed.success) return json({ error: "Datos inválidos" }, 400);

        try {
          await deleteLead(parsed.data.id);
          console.info(`[admin] Lead ${parsed.data.id} eliminado por ${auth.email}`);
          return json({ ok: true });
        } catch (err) {
          console.error("DELETE /api/admin/leads error:", err);
          return json({ error: "No se pudo eliminar el contacto" }, 500);
        }
      },
    },
  },
});
