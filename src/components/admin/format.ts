const TZ = "America/Bogota";

const dateTime = new Intl.DateTimeFormat("es-CO", {
  timeZone: TZ,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dateShort = new Intl.DateTimeFormat("es-CO", { timeZone: TZ, day: "numeric", month: "short" });

export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
}

/** "2026-10-15" -> "15 oct" (la fecha ya viene en hora de Colombia) */
export function formatDay(day: string): string {
  return dateShort.format(new Date(`${day}T12:00:00-05:00`));
}

export function relativeTime(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "hace un momento";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? "ayer" : `hace ${days} días`;
}

export function percent(value: number): string {
  return `${Math.round(value * 100)} %`;
}

export function plural(n: number, one: string, many: string): string {
  return `${n.toLocaleString("es-CO")} ${n === 1 ? one : many}`;
}
