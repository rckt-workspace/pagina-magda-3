import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { adminApi } from "./api";
import { formatDateTime } from "./format";
import { STATUS_HELP, type Lead, type LeadStatus } from "./types";
import { Button, Field, Notice, SERIF, StatusSelect, inputClass } from "./ui";

export function LeadDetail({
  lead,
  onClose,
  onUpdated,
  onDeleted,
}: {
  lead: Lead;
  onClose: () => void;
  onUpdated: (lead: Lead) => void;
  onDeleted: (id: string) => void;
}) {
  const [notes, setNotes] = useState(lead.metadata?.admin_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setNotes(lead.metadata?.admin_notes ?? "");
    setMessage(null);
    setConfirmDelete(false);
  }, [lead.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save(patch: { status?: LeadStatus; notes?: string }, okText: string) {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await adminApi.patch<Lead>("/api/admin/leads", { id: lead.id, ...patch });
      onUpdated(updated);
      setMessage({ tone: "success", text: okText });
    } catch (err) {
      setMessage({ tone: "error", text: (err as Error).message });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    try {
      await adminApi.delete("/api/admin/leads", { id: lead.id });
      onDeleted(lead.id);
    } catch (err) {
      setMessage({ tone: "error", text: (err as Error).message });
      setSaving(false);
    }
  }

  const mailto = `mailto:${lead.email}?subject=${encodeURIComponent(
    `Su solicitud sobre ${lead.area} — Magda Gutiérrez`,
  )}`;
  const notesChanged = notes.trim() !== (lead.metadata?.admin_notes ?? "").trim();

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="lead-title">
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-[#141d33]/40" />

      <aside className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#d3dae5] px-6 py-5">
          <div>
            <h2 id="lead-title" className="text-2xl font-semibold text-[#1e2a4a]" style={{ fontFamily: SERIF }}>
              {lead.company}
            </h2>
            <p className="mt-1 text-sm text-[#7c879b]">Llegó el {formatDateTime(lead.created_at)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="rounded-md p-1.5 text-[#7c879b] hover:bg-[#eef1f6] hover:text-[#1e2a4a]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-6 px-6 py-6">
          {message && <Notice tone={message.tone}>{message.text}</Notice>}

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-[#7c879b]">Correo</dt>
            <dd>
              <a href={`mailto:${lead.email}`} className="break-all font-medium text-[#4e6690] underline-offset-2 hover:underline">
                {lead.email}
              </a>
            </dd>
            <dt className="text-[#7c879b]">Área</dt>
            <dd className="text-[#1e2a4a]">{lead.area}</dd>
            <dt className="text-[#7c879b]">Consentimiento</dt>
            <dd className="text-[#1e2a4a]">
              {lead.consent_privacy && lead.consent_at
                ? `Aceptó ser contactado (${formatDateTime(lead.consent_at)})`
                : "No registrado"}
            </dd>
          </dl>

          <div>
            <h3 className="mb-2 text-xs font-semibold text-[#4a4e57]">Lo que escribió</h3>
            <p className="whitespace-pre-wrap rounded-md bg-[#eef1f6] px-4 py-3 text-sm leading-relaxed text-[#1e2a4a]">
              {lead.comment}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold text-[#4a4e57]">Estado</h3>
            <div className="flex items-center gap-3">
              <StatusSelect
                value={lead.status}
                disabled={saving}
                onChange={(status) => save({ status }, "Estado actualizado.")}
              />
              <span className="text-xs text-[#7c879b]">{STATUS_HELP[lead.status]}</span>
            </div>
          </div>

          <Field
            label="Notas internas"
            hint={
              lead.metadata?.notes_updated_by && lead.metadata.notes_updated_at
                ? `Última edición: ${lead.metadata.notes_updated_by}, ${formatDateTime(lead.metadata.notes_updated_at)}`
                : "Solo las ve quien entra al panel."
            }
          >
            <textarea
              rows={4}
              value={notes}
              maxLength={4000}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej.: Le escribí el 15 oct, quedó de enviar la información del producto."
              className={inputClass}
            />
          </Field>
          <Button variant="secondary" disabled={saving || !notesChanged} onClick={() => save({ notes }, "Notas guardadas.")}>
            Guardar notas
          </Button>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d3dae5] px-6 py-4">
          <a
            href={mailto}
            onClick={() => lead.status === "new" && save({ status: "contacted" }, "Marcado como contactado.")}
            className="inline-flex items-center justify-center rounded-md bg-[#1e2a4a] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#141d33]"
          >
            Responder por correo
          </a>

          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7f2323]">Se borra para siempre.</span>
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </Button>
              <Button variant="danger" disabled={saving} onClick={remove}>
                Eliminar
              </Button>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
              Eliminar contacto
            </Button>
          )}
        </footer>
      </aside>
    </div>
  );
}
