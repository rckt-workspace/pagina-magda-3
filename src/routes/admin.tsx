import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";
import { AccountTab } from "../components/admin/AccountTab";
import { adminApi, ApiError } from "../components/admin/api";
import { relativeTime } from "../components/admin/format";
import { LeadsTab } from "../components/admin/LeadsTab";
import { LoginScreen } from "../components/admin/LoginScreen";
import { OverviewTab } from "../components/admin/OverviewTab";
import { EMPTY_FILTERS, type LeadFilters, type LeadStatus, type Stats } from "../components/admin/types";
import { Button, Notice, SERIF, cx } from "../components/admin/ui";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de contactos · Magda Gutiérrez" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Public+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: AdminPage,
});

type Tab = "overview" | "leads" | "account";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Resumen" },
  { id: "leads", label: "Contactos" },
  { id: "account", label: "Cuenta" },
];

function AdminPage() {
  // undefined = todavía comprobando la sesión (evita parpadeos y errores de SSR)
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [accessError, setAccessError] = useState<string | null>(null);

  const handleAccessDenied = useCallback((message: string) => {
    setAccessError(message);
    void supabase.auth.signOut();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#eef1f6] text-[#1e2a4a]" style={{ fontFamily: "'Public Sans', system-ui, sans-serif" }}>
      {session === undefined ? (
        <p className="p-10 text-center text-sm text-[#7c879b]">Cargando…</p>
      ) : session === null ? (
        <LoginScreen notice={accessError} />
      ) : (
        <Dashboard email={session.user.email ?? ""} onAccessDenied={handleAccessDenied} />
      )}
    </div>
  );
}

function Dashboard({ email, onAccessDenied }: { email: string; onAccessDenied: (message: string) => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeadFilters>(EMPTY_FILTERS);

  const loadStats = useCallback(async () => {
    try {
      setStats(await adminApi.get<Stats>("/api/admin/stats"));
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        onAccessDenied(err.message);
        return;
      }
      setError((err as Error).message);
    }
  }, [onAccessDenied]);

  useEffect(() => {
    void loadStats();
    // Se actualiza solo cada 2 minutos mientras el panel esté abierto
    const id = setInterval(() => void loadStats(), 120_000);
    return () => clearInterval(id);
  }, [loadStats]);

  function showStatus(status: LeadStatus) {
    setFilters({ ...EMPTY_FILTERS, status });
    setTab("leads");
  }

  return (
    <>
      <header className="bg-[#141d33] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              className="flex h-8 w-8 items-center justify-center rounded bg-white text-sm font-semibold text-[#1e2a4a]"
              style={{ fontFamily: SERIF }}
              aria-hidden
            >
              MG
            </span>
            <span className="text-base font-semibold" style={{ fontFamily: SERIF }}>
              Panel de contactos
            </span>
          </div>

          <nav aria-label="Secciones del panel" className="order-3 flex w-full gap-1 sm:order-none sm:w-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-current={tab === t.id ? "page" : undefined}
                onClick={() => setTab(t.id)}
                className={cx(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  tab === t.id ? "bg-white text-[#1e2a4a]" : "text-[#c9d2e3] hover:bg-white/10 hover:text-white",
                )}
              >
                {t.label}
                {t.id === "leads" && stats && stats.leads.pending > 0 && (
                  <span className="ml-1.5 rounded-full bg-[#c17f2e] px-1.5 text-xs font-semibold text-white">
                    {stats.leads.pending}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <span className="hidden truncate text-sm text-[#9fadc7] md:block">{email}</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {error && (
          <div className="mb-6">
            <Notice tone="error">
              {error}{" "}
              <Button variant="ghost" className="ml-2" onClick={() => void loadStats()}>
                Reintentar
              </Button>
            </Notice>
          </div>
        )}

        {tab === "overview" &&
          (stats ? (
            <OverviewTab stats={stats} onShowStatus={showStatus} />
          ) : (
            !error && <p className="text-sm text-[#7c879b]">Cargando métricas…</p>
          ))}

        {tab === "leads" && (
          <LeadsTab
            filters={filters}
            onFiltersChange={setFilters}
            areas={stats?.areas ?? []}
            statusCounts={stats?.leads.byStatus ?? null}
            onDataChanged={() => void loadStats()}
          />
        )}

        {tab === "account" && <AccountTab email={email} />}

        {stats && tab !== "account" && (
          <p className="mt-8 text-xs text-[#7c879b]">Datos actualizados {relativeTime(stats.generatedAt)}.</p>
        )}
      </main>
    </>
  );
}
