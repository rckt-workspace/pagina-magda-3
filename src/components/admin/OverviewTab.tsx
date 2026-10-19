import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDay, percent, plural } from "./format";
import { LEAD_STATUSES, STATUS_LABELS, type DayCount, type LeadStatus, type Stats } from "./types";
import { Button, C, SERIF, STATUS_COLOR, Section } from "./ui";

function trend(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "sin datos del periodo anterior" : "igual que el periodo anterior";
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return "igual que los 30 días anteriores";
  return `${change > 0 ? "+" : ""}${change} % frente a los 30 días anteriores`;
}

function DailyChart({ data, color, label }: { data: DayCount[]; color: string; label: string }) {
  const last = data.length - 1;
  return (
    <div className="h-56 w-full" role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={C.line} strokeDasharray="2 4" />
          <XAxis
            dataKey="day"
            tickFormatter={formatDay}
            tick={{ fontSize: 11, fill: C.faint }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.faint }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "#e3e9f3" }}
            labelFormatter={(day) => formatDay(String(day))}
            formatter={(value) => [value, label]}
            contentStyle={{ borderRadius: 6, borderColor: C.line, fontSize: 12 }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={22}>
            {data.map((entry, index) => (
              <Cell key={entry.day} fill={index === last ? C.ocre : color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Figure({ value, label, detail }: { value: string; label: string; detail?: string }) {
  return (
    <div className="px-5 py-4">
      <p className="text-3xl font-semibold text-[#1e2a4a]" style={{ fontFamily: SERIF }}>
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-[#4a4e57]">{label}</p>
      {detail && <p className="mt-0.5 text-xs text-[#7c879b]">{detail}</p>}
    </div>
  );
}

export function OverviewTab({
  stats,
  onShowStatus,
}: {
  stats: Stats;
  onShowStatus: (status: LeadStatus) => void;
}) {
  const { leads, chat } = stats;
  const maxArea = Math.max(1, ...leads.byArea.map((a) => a.count));
  const statusTotal = Math.max(1, leads.total);

  return (
    <div className="space-y-6">
      {/* Lo primero: lo que requiere acción */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {leads.pending > 0 ? (
            <h1 className="text-3xl leading-tight text-[#1e2a4a] sm:text-4xl" style={{ fontFamily: SERIF }}>
              <span className="font-semibold text-[#c17f2e]">{leads.pending}</span>{" "}
              {leads.pending === 1 ? "contacto espera respuesta" : "contactos esperan respuesta"}
            </h1>
          ) : (
            <h1 className="text-3xl leading-tight text-[#1e2a4a] sm:text-4xl" style={{ fontFamily: SERIF }}>
              Todo al día: no hay contactos sin responder
            </h1>
          )}
          <p className="mt-2 text-sm text-[#4a4e57]">
            {leads.total === 0
              ? "Cuando alguien llene el formulario del sitio, aparecerá aquí."
              : `${plural(leads.total, "contacto", "contactos")} recibidos desde que se abrió el formulario.`}
          </p>
        </div>
        {leads.pending > 0 && (
          <Button variant="primary" onClick={() => onShowStatus("new")}>
            Ver los pendientes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#d3dae5] bg-[#d3dae5] lg:grid-cols-5 [&>*]:bg-white [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
        <Figure value={String(leads.today)} label="Hoy" />
        <Figure value={String(leads.last7)} label="Últimos 7 días" />
        <Figure value={String(leads.last30)} label="Últimos 30 días" detail={trend(leads.last30, leads.previous30)} />
        <Figure value={String(leads.thisMonth)} label="Este mes" />
        <Figure
          value={percent(leads.conversionRate)}
          label="Tasa de cierre"
          detail="Cerrados sobre el total, sin contar spam"
        />
      </div>

      <Section title="Contactos por día" aside="Últimos 30 días, en hora de Colombia. Hoy aparece en ocre.">
        <DailyChart data={leads.daily} color={C.ink} label="Contactos" />
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Por área solicitada" aside="Sin contar spam">
          {leads.byArea.length === 0 ? (
            <p className="text-sm text-[#7c879b]">Todavía no hay contactos para comparar.</p>
          ) : (
            <ul className="space-y-3">
              {leads.byArea.map(({ area, count }) => (
                <li key={area}>
                  <div className="mb-1 flex justify-between gap-3 text-sm">
                    <span className="text-[#1e2a4a]">{area}</span>
                    <span className="font-semibold tabular-nums text-[#1e2a4a]">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#eef1f6]">
                    <div
                      className="h-2 rounded-full bg-[#4e6690]"
                      style={{ width: `${(count / maxArea) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="En qué va cada contacto">
          <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-[#eef1f6]" aria-hidden>
            {LEAD_STATUSES.map((s) =>
              leads.byStatus[s] > 0 ? (
                <div
                  key={s}
                  style={{ width: `${(leads.byStatus[s] / statusTotal) * 100}%`, background: STATUS_COLOR[s] }}
                />
              ) : null,
            )}
          </div>
          <ul className="divide-y divide-[#eef1f6]">
            {LEAD_STATUSES.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => onShowStatus(s)}
                  className="flex w-full items-center justify-between gap-3 py-2 text-left text-sm hover:text-[#4e6690] focus-visible:outline-2 focus-visible:outline-[#4e6690]"
                >
                  <span className="flex items-center gap-2 text-[#1e2a4a]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[s] }} aria-hidden />
                    {STATUS_LABELS[s]}
                  </span>
                  <span className="font-semibold tabular-nums text-[#1e2a4a]">{leads.byStatus[s]}</span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Asistente “Habla con Magda”" aside="Últimos 30 días">
        <dl className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Conversaciones", chat.conversations30.toLocaleString("es-CO")],
            ["Mensajes respondidos", chat.messages30.toLocaleString("es-CO")],
            ["Respuestas con error", chat.errors30.toLocaleString("es-CO")],
            [
              "Tiempo de respuesta",
              chat.avgLatencyMs === null ? "—" : `${(chat.avgLatencyMs / 1000).toFixed(1)} s`,
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-[#7c879b]">{label}</dt>
              <dd className="text-2xl font-semibold text-[#1e2a4a]" style={{ fontFamily: SERIF }}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <DailyChart data={chat.daily} color={C.accentSoft} label="Mensajes" />
      </Section>
    </div>
  );
}
