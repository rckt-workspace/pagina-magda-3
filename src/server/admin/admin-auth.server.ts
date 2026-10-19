/**
 * Verifica que una petición al panel /admin venga de un administrador.
 *
 * 1. El navegador inicia sesión con Supabase Auth y envía el token en
 *    el encabezado "Authorization: Bearer <token>".
 * 2. Aquí se valida ese token contra Supabase (no se confía en el navegador).
 * 3. El correo del usuario debe estar en la variable ADMIN_EMAILS
 *    (lista separada por comas, configurada en Render).
 *
 * Solo después de pasar las dos pruebas se usa la service role key.
 */

export type AdminCheck =
  | { ok: true; email: string }
  | { ok: false; response: Response };

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function allowedEmails(): string[] {
  const raw = process.env["ADMIN_EMAILS"] ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(request: Request): Promise<AdminCheck> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) {
    return { ok: false, response: json({ error: "Sesión requerida" }, 401) };
  }

  const admins = allowedEmails();
  if (admins.length === 0) {
    console.error("[admin] ADMIN_EMAILS no está configurada");
    return { ok: false, response: json({ error: "Panel no configurado" }, 503) };
  }

  try {
    const { supabaseAdmin } = await import("../../integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user?.email) {
      return { ok: false, response: json({ error: "Sesión inválida o vencida" }, 401) };
    }

    const email = data.user.email.toLowerCase();
    if (!admins.includes(email)) {
      return { ok: false, response: json({ error: "Este usuario no tiene acceso al panel" }, 403) };
    }

    return { ok: true, email };
  } catch (err) {
    console.error("[admin] Error verificando sesión:", err);
    return { ok: false, response: json({ error: "Servicio no disponible" }, 503) };
  }
}
