/**
 * Lógica del panel administrativo. Solo se ejecuta en el servidor.
 * Todas las fechas se agrupan en hora de Colombia (America/Bogota, UTC-5).
 */
import { z } from "zod";

export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  closed: "Cerrado",
  spam: "Spam",
};

const TZ = "America/Bogota";
const BOGOTA_OFFSET = "-05:00";

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "2026-10-15" en hora de Colombia */
export function dayKey(date: Date | string): string {
  return dayKeyFormat.format(typeof date === "string" ? new Date(date) : date);
}

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) {
    days.push(dayKey(new Date(now - i * 86_400_000)));
  }
  return days;
}

/** Inicio del día (hora Colombia) como ISO UTC */
function startOfDayIso(day: string): string {
  return new Date(`${day}T00:00:00${BOGOTA_OFFSET}`).toISOString();
}

function nextDayIso(day: string): string {
  return new Date(new Date(`${day}T00:00:00${BOGOTA_OFFSET}`).getTime() + 86_400_000).toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function db(): Promise<any> {
  const { supabaseAdmin } = await import("../../integrations/supabase/client.server");
  return supabaseAdmin;
}

// ---------------------------------------------------------------------------
// Métricas
// ---------------------------------------------------------------------------

type LeadLite = { created_at: string; area: string; status: LeadStatus };
type UsageLite = {
  created_at: string;
  session_id: string | null;
  status: string;
  latency_ms: number | null;
};

async function fetchAll<T>(table: string, columns: string, sinceIso?: string): Promise<T[]> {
  const supabase = await db();
  const pageSize = 1000;
  const rows: T[] = [];
  for (let from = 0; from < 20_000; from += pageSize) {
    let query = supabase
      .from(table)
      .select(columns)
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);
    if (sinceIso) query = query.gte("created_at", sinceIso);
    const { data, error } = await query;
    if (error) throw error;
    rows.push(...((data ?? []) as T[]));
    if (!data || data.length < pageSize) break;
  }
  return rows;
}

export async function getStats() {
  const days30 = lastNDays(30);
  const firstDay = days30[0] ?? dayKey(new Date());
  const since60 = new Date(new Date(startOfDayIso(firstDay)).getTime() - 30 * 86_400_000).toISOString();

  const [leads, usage] = await Promise.all([
    fetchAll<LeadLite>("leads", "created_at, area, status"),
    fetchAll<UsageLite>("llm_usage", "created_at, session_id, status, latency_ms", startOfDayIso(firstDay)),
  ]);

  const today = dayKey(new Date());
  const monthPrefix = today.slice(0, 7);
  const days7 = new Set(lastNDays(7));
  const days30Set = new Set(days30);
  const start30 = startOfDayIso(firstDay);

  const byStatus: Record<LeadStatus, number> = { new: 0, contacted: 0, qualified: 0, closed: 0, spam: 0 };
  const byArea = new Map<string, number>();
  const daily = new Map<string, number>(days30.map((d) => [d, 0]));
  let last7 = 0;
  let last30 = 0;
  let previous30 = 0;
  let thisMonth = 0;
  let todayCount = 0;

  for (const lead of leads) {
    const key = dayKey(lead.created_at);
    if (lead.status in byStatus) byStatus[lead.status] += 1;
    if (lead.status !== "spam") byArea.set(lead.area, (byArea.get(lead.area) ?? 0) + 1);
    if (key === today) todayCount += 1;
    if (days7.has(key)) last7 += 1;
    if (days30Set.has(key)) {
      last30 += 1;
      daily.set(key, (daily.get(key) ?? 0) + 1);
    } else if (lead.created_at >= since60 && lead.created_at < start30) {
      previous30 += 1;
    }
    if (key.startsWith(monthPrefix)) thisMonth += 1;
  }

  const valid = leads.length - byStatus.spam;
  const chatDaily = new Map<string, number>(days30.map((d) => [d, 0]));
  const sessions = new Set<string>();
  let chatErrors = 0;
  let latencySum = 0;
  let latencyCount = 0;

  for (const row of usage) {
    const key = dayKey(row.created_at);
    chatDaily.set(key, (chatDaily.get(key) ?? 0) + 1);
    if (row.session_id) sessions.add(row.session_id);
    if (row.status !== "success") chatErrors += 1;
    if (typeof row.latency_ms === "number") {
      latencySum += row.latency_ms;
      latencyCount += 1;
    }
  }

  const areas = [...new Set(leads.map((l) => l.area))].sort((a, b) => a.localeCompare(b, "es"));

  return {
    generatedAt: new Date().toISOString(),
    areas,
    leads: {
      total: leads.length,
      today: todayCount,
      last7,
      last30,
      previous30,
      thisMonth,
      pending: byStatus.new,
      conversionRate: valid > 0 ? byStatus.closed / valid : 0,
      byStatus,
      byArea: [...byArea.entries()]
        .map(([area, count]) => ({ area, count }))
        .sort((a, b) => b.count - a.count),
      daily: days30.map((day) => ({ day, count: daily.get(day) ?? 0 })),
    },
    chat: {
      messages30: usage.length,
      conversations30: sessions.size,
      errors30: chatErrors,
      avgLatencyMs: latencyCount > 0 ? Math.round(latencySum / latencyCount) : null,
      daily: days30.map((day) => ({ day, count: chatDaily.get(day) ?? 0 })),
    },
  };
}

// ---------------------------------------------------------------------------
// Listado y filtros
// ---------------------------------------------------------------------------

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const leadFiltersSchema = z.object({
  q: z.string().trim().max(100).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  area: z.string().trim().max(100).optional(),
  from: dateString.optional(),
  to: dateString.optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(25),
});
export type LeadFilters = z.infer<typeof leadFiltersSchema>;

export function parseFilters(url: URL) {
  const raw: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    if (value !== "") raw[key] = value;
  });
  return leadFiltersSchema.safeParse(raw);
}

const LEAD_COLUMNS =
  "id, created_at, updated_at, company, email, area, comment, status, source, consent_privacy, consent_at, metadata";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(query: any, f: LeadFilters) {
  let q = query;
  if (f.status) q = q.eq("status", f.status);
  if (f.area) q = q.eq("area", f.area);
  if (f.from) q = q.gte("created_at", startOfDayIso(f.from));
  if (f.to) q = q.lt("created_at", nextDayIso(f.to));
  if (f.q) {
    // Se quitan caracteres que tienen significado en los filtros de PostgREST
    const term = f.q.replace(/[,()%*\\]/g, " ").trim();
    if (term) q = q.or(`company.ilike.%${term}%,email.ilike.%${term}%,comment.ilike.%${term}%`);
  }
  return q;
}

export async function listLeads(f: LeadFilters) {
  const supabase = await db();
  const from = (f.page - 1) * f.pageSize;
  const query = applyFilters(
    supabase.from("leads").select(LEAD_COLUMNS, { count: "exact" }).order("created_at", { ascending: false }),
    f,
  ).range(from, from + f.pageSize - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0, page: f.page, pageSize: f.pageSize };
}

// ---------------------------------------------------------------------------
// Edición
// ---------------------------------------------------------------------------

export const leadUpdateSchema = z
  .object({
    id: z.string().uuid(),
    status: z.enum(LEAD_STATUSES).optional(),
    notes: z.string().max(4000).optional(),
  })
  .refine((v) => v.status !== undefined || v.notes !== undefined, {
    message: "Nada que actualizar",
  });

export async function updateLead(
  input: z.infer<typeof leadUpdateSchema>,
  editorEmail: string,
) {
  const supabase = await db();
  const patch: Record<string, unknown> = {};

  if (input.status) patch["status"] = input.status;

  if (input.notes !== undefined) {
    const { data: current, error: readError } = await supabase
      .from("leads")
      .select("metadata")
      .eq("id", input.id)
      .single();
    if (readError) throw readError;
    const metadata = (current?.metadata ?? {}) as Record<string, unknown>;
    patch["metadata"] = {
      ...metadata,
      admin_notes: input.notes.trim(),
      notes_updated_by: editorEmail,
      notes_updated_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from("leads")
    .update(patch)
    .eq("id", input.id)
    .select(LEAD_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteLead(id: string) {
  const supabase = await db();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Exportación CSV (se abre bien en Excel)
// ---------------------------------------------------------------------------

const dateTimeFormat = new Intl.DateTimeFormat("es-CO", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);
  // Evita que Excel interprete el contenido como fórmula
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function exportLeadsCsv(f: LeadFilters): Promise<string> {
  const supabase = await db();
  const { data, error } = await applyFilters(
    supabase.from("leads").select(LEAD_COLUMNS).order("created_at", { ascending: false }),
    f,
  ).range(0, 9_999);
  if (error) throw error;

  const header = ["Fecha", "Empresa", "Correo", "Área", "Comentario", "Estado", "Notas internas"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lines = (data ?? []).map((row: any) =>
    [
      dateTimeFormat.format(new Date(row.created_at)),
      row.company,
      row.email,
      row.area,
      row.comment,
      STATUS_LABELS[row.status as LeadStatus] ?? row.status,
      row.metadata?.admin_notes ?? "",
    ]
      .map(csvCell)
      .join(";"),
  );

  // BOM + separador ";" para que Excel en español abra tildes y columnas bien
  return "\uFEFF" + [header.map(csvCell).join(";"), ...lines].join("\r\n");
}
