import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { adminApi, toQuery } from "./api";
import { formatDateTime } from "./format";
import { LeadDetail } from "./LeadDetail";
import {
  EMPTY_FILTERS,
  LEAD_STATUSES,
  STATUS_LABELS,
  type Lead,
  type LeadFilters,
  type LeadPage,
  type LeadStatus,
} from "./types";
import { Button, Field, Notice, StatusBadge, StatusSelect, cx, inputClass } from "./ui";

const PAGE_SIZE = 25;

export function LeadsTab({
  filters,
  onFiltersChange,
  areas,
  statusCounts,
  onDataChanged,
}: {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  areas: string[];
  statusCounts: Record<LeadStatus, number> | null;
  onDataChanged: () => void;
}) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<LeadPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [search, setSearch] = useState(filters.q);
  const [exporting, setExporting] = useState(false);

  // Espera a que se deje de escribir antes de buscar
  useEffect(() => {
    const id = setTimeout(() => {
      if (search !== filters.q) onFiltersChange({ ...filters, q: search });
    }, 350);
    return () => clearTimeout(id);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setPage(1), [filters]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.get<LeadPage>(
        `/api/admin/leads${toQuery({ ...filters, page, pageSize: PAGE_SIZE })}`,
      );
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeStatus(lead: Lead, status: LeadStatus) {
    try {
      const updated = await adminApi.patch<Lead>("/api/admin/leads", { id: lead.id, status });
      replaceLead(updated);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function replaceLead(updated: Lead) {
    setData((d) => (d ? { ...d, rows: d.rows.map((r) => (r.id === updated.id ? updated : r)) } : d));
    setSelected((s) => (s && s.id === updated.id ? updated : s));
    onDataChanged();
  }

  async function exportCsv() {
    setExporting(true);
    try {
      await adminApi.download(`/api/admin/export${toQuery({ ...filters })}`, "contactos.csv");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setExporting(false);
    }
  }

  const hasFilters = Object.values(filters).some(Boolean);
  const total = data?.total ?? 0;
  const firstRow = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(page * PAGE_SIZE, total);
  const allCount = statusCounts ? LEAD_STATUSES.reduce((sum, s) => sum + statusCounts[s], 0) : null;

  return (
    <div className="space-y-4">
      {/* Filtro rápido por estado */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
        {[{ value: "" as const, label: "Todos", count: allCount }, ...LEAD_STATUSES.map((s) => ({
          value: s,
          label: STATUS_LABELS[s],
          count: statusCounts?.[s] ?? null,
        }))].map((chip) => (
          <button
            key={chip.value || "all"}
            type="button"
            aria-pressed={filters.status === chip.value}
            onClick={() => onFiltersChange({ ...filters, status: chip.value })}
            className={cx(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              filters.status === chip.value
                ? "border-[#1e2a4a] bg-[#1e2a4a] text-white"
                : "border-[#d3dae5] bg-white text-[#1e2a4a] hover:border-[#9fadc7]",
            )}
          >
            {chip.label}
            {chip.count !== null && <span className="ml-1.5 tabular-nums opacity-70">{chip.count}</span>}
          </button>
        ))}
      </div>

      {/* Búsqueda y filtros */}
      <div className="grid gap-3 rounded-lg border border-[#d3dae5] bg-white p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1.3fr_1fr_1fr_auto]">
        <Field label="Buscar">
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7c879b]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Empresa, correo o mensaje"
              className={cx(inputClass, "pl-9")}
            />
          </span>
        </Field>
        <Field label="Área">
          <select
            value={filters.area}
            onChange={(e) => onFiltersChange({ ...filters, area: e.target.value })}
            className={inputClass}
          >
            <option value="">Todas las áreas</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Desde">
          <input
            type="date"
            value={filters.from}
            max={filters.to || undefined}
            onChange={(e) => onFiltersChange({ ...filters, from: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Hasta">
          <input
            type="date"
            value={filters.to}
            min={filters.from || undefined}
            onChange={(e) => onFiltersChange({ ...filters, to: e.target.value })}
            className={inputClass}
          />
        </Field>
        <div className="flex items-end gap-2">
          {hasFilters && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("");
                onFiltersChange(EMPTY_FILTERS);
              }}
            >
              Limpiar
            </Button>
          )}
          <Button onClick={exportCsv} disabled={exporting || total === 0} title="Descarga los contactos filtrados">
            <Download className="h-4 w-4" />
            {exporting ? "Generando…" : "Excel (CSV)"}
          </Button>
        </div>
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      <div className="overflow-hidden rounded-lg border border-[#d3dae5] bg-white">
        {loading && !data ? (
          <p className="px-5 py-10 text-center text-sm text-[#7c879b]">Cargando contactos…</p>
        ) : total === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-[#1e2a4a]">
              {hasFilters ? "Ningún contacto coincide con estos filtros." : "Todavía no hay contactos."}
            </p>
            <p className="mt-1 text-sm text-[#7c879b]">
              {hasFilters
                ? "Prueba con otra búsqueda o limpia los filtros."
                : "Aparecerán aquí en cuanto alguien llene el formulario del sitio."}
            </p>
          </div>
        ) : (
          <>
            {/* Escritorio: tabla */}
            <table className={cx("hidden w-full text-sm md:table", loading && "opacity-60")}>
              <thead className="border-b border-[#d3dae5] bg-[#f7f9fc] text-left text-xs text-[#4a4e57]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-3 py-3 font-semibold">Empresa</th>
                  <th className="px-3 py-3 font-semibold">Correo</th>
                  <th className="px-3 py-3 font-semibold">Área</th>
                  <th className="px-3 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef1f6]">
                {data?.rows.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#f7f9fc]">
                    <td className="whitespace-nowrap px-5 py-3 text-[#4a4e57]">{formatDateTime(lead.created_at)}</td>
                    <td className="px-3 py-3 font-medium text-[#1e2a4a]">{lead.company}</td>
                    <td className="max-w-[14rem] truncate px-3 py-3">
                      <a href={`mailto:${lead.email}`} className="text-[#4e6690] hover:underline">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-3 py-3 text-[#4a4e57]">{lead.area}</td>
                    <td className="px-3 py-3">
                      <StatusSelect
                        value={lead.status}
                        label={`Estado de ${lead.company}`}
                        onChange={(s) => changeStatus(lead, s)}
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="ghost" onClick={() => setSelected(lead)}>
                        Abrir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Celular: lista */}
            <ul className={cx("divide-y divide-[#eef1f6] md:hidden", loading && "opacity-60")}>
              {data?.rows.map((lead) => (
                <li key={lead.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(lead)}
                    className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-[#f7f9fc]"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium text-[#1e2a4a]">{lead.company}</span>
                      <StatusBadge status={lead.status} />
                    </span>
                    <span className="truncate text-sm text-[#4e6690]">{lead.email}</span>
                    <span className="text-xs text-[#7c879b]">
                      {lead.area}, {formatDateTime(lead.created_at)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-[#d3dae5] px-5 py-3 text-sm text-[#4a4e57]">
              <span className="tabular-nums">
                {firstRow}–{lastRow} de {total}
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" aria-label="Página anterior" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  aria-label="Página siguiente"
                  disabled={lastRow >= total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {selected && (
        <LeadDetail
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdated={replaceLead}
          onDeleted={(id) => {
            setSelected(null);
            setData((d) => (d ? { ...d, rows: d.rows.filter((r) => r.id !== id), total: d.total - 1 } : d));
            onDataChanged();
          }}
        />
      )}
    </div>
  );
}
