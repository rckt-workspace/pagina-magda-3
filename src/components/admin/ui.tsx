import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LEAD_STATUSES, STATUS_LABELS, type LeadStatus } from "./types";

/** Paleta tomada del sitio de Magda (public/site.css) */
export const C = {
  ink: "#1e2a4a",
  deep: "#141d33",
  paper: "#eef1f6",
  line: "#d3dae5",
  accent: "#4e6690",
  accentSoft: "#9fadc7",
  ocre: "#c17f2e",
  faint: "#7c879b",
  soft: "#4a4e57",
};

export const SERIF = "'Newsreader', Georgia, serif";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ variant = "secondary", className, ...props }: ButtonProps) {
  const styles = {
    primary: "bg-[#1e2a4a] text-white hover:bg-[#141d33]",
    secondary: "bg-white text-[#1e2a4a] border border-[#d3dae5] hover:border-[#9fadc7]",
    ghost: "text-[#4e6690] hover:text-[#1e2a4a] hover:bg-[#e3e9f3]",
    danger: "bg-[#9b2c2c] text-white hover:bg-[#7f2323]",
  }[variant];
  return (
    <button
      type="button"
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4e6690]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        styles,
        className,
      )}
    />
  );
}

export const inputClass =
  "w-full rounded-md border border-[#d3dae5] bg-white px-3 py-2 text-sm text-[#1e2a4a] placeholder:text-[#7c879b] " +
  "focus:border-[#4e6690] focus:outline-none focus:ring-2 focus:ring-[#4e6690]/20";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#4a4e57]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[#7c879b]">{hint}</span>}
    </label>
  );
}

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-[#f6ead9] text-[#8a5a1f]",
  contacted: "bg-[#e3e9f3] text-[#384d75]",
  qualified: "bg-[#d5def0] text-[#1e2a4a]",
  closed: "bg-[#e1efe6] text-[#2f6b4f]",
  spam: "bg-[#eceef2] text-[#7c879b]",
};

export const STATUS_COLOR: Record<LeadStatus, string> = {
  new: C.ocre,
  contacted: C.accent,
  qualified: C.ink,
  closed: "#2f6b4f",
  spam: "#b7bfcc",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cx("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLE[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function StatusSelect({
  value,
  onChange,
  disabled,
  label = "Estado",
}: {
  value: LeadStatus;
  onChange: (status: LeadStatus) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as LeadStatus)}
      className={cx(
        "cursor-pointer rounded-full border-0 py-1 pl-2.5 pr-7 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4e6690]/40",
        STATUS_STYLE[value],
      )}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  const styles = {
    info: "border-[#d3dae5] bg-white text-[#4a4e57]",
    error: "border-[#e8c4c4] bg-[#fbf0f0] text-[#7f2323]",
    success: "border-[#c5dfcf] bg-[#eef7f1] text-[#2f6b4f]",
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cx("rounded-md border px-4 py-3 text-sm", styles)}>
      {children}
    </div>
  );
}

export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-[#d3dae5] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-[#1e2a4a]" style={{ fontFamily: SERIF }}>
          {title}
        </h2>
        {aside && <div className="text-xs text-[#7c879b]">{aside}</div>}
      </div>
      {children}
    </section>
  );
}
