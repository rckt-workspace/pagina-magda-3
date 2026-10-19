export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  closed: "Cerrado",
  spam: "Spam",
};

export const STATUS_HELP: Record<LeadStatus, string> = {
  new: "Llegó por el formulario y nadie le ha respondido",
  contacted: "Ya se le escribió o llamó",
  qualified: "Hay interés real y una posible propuesta",
  closed: "Se convirtió en cliente o proyecto",
  spam: "Mensaje falso o sin relación",
};

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  company: string;
  email: string;
  area: string;
  comment: string;
  status: LeadStatus;
  source: string;
  consent_privacy: boolean;
  consent_at: string | null;
  metadata: { admin_notes?: string; notes_updated_by?: string; notes_updated_at?: string } | null;
};

export type DayCount = { day: string; count: number };

export type Stats = {
  generatedAt: string;
  areas: string[];
  leads: {
    total: number;
    today: number;
    last7: number;
    last30: number;
    previous30: number;
    thisMonth: number;
    pending: number;
    conversionRate: number;
    byStatus: Record<LeadStatus, number>;
    byArea: { area: string; count: number }[];
    daily: DayCount[];
  };
  chat: {
    messages30: number;
    conversations30: number;
    errors30: number;
    avgLatencyMs: number | null;
    daily: DayCount[];
  };
};

export type LeadPage = { rows: Lead[]; total: number; page: number; pageSize: number };

export type LeadFilters = {
  q: string;
  status: LeadStatus | "";
  area: string;
  from: string;
  to: string;
};

export const EMPTY_FILTERS: LeadFilters = { q: "", status: "", area: "", from: "", to: "" };
