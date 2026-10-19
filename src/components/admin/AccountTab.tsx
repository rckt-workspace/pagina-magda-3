import { useState, type FormEvent } from "react";
import { supabase } from "../../integrations/supabase/client";
import { Button, Field, Notice, Section, inputClass } from "./ui";

export function AccountTab({ email }: { email: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    if (password.length < 10) {
      setMessage({ tone: "error", text: "Usa al menos 10 caracteres." });
      return;
    }
    if (password !== confirm) {
      setMessage({ tone: "error", text: "Las dos contraseñas no coinciden." });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setMessage({ tone: "error", text: "No se pudo cambiar la contraseña. Prueba con otra diferente." });
    } else {
      setPassword("");
      setConfirm("");
      setMessage({ tone: "success", text: "Contraseña actualizada. Úsala la próxima vez que entres." });
    }
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <Section title="Tu cuenta">
        <p className="text-sm text-[#4a4e57]">
          Entraste como <strong className="text-[#1e2a4a]">{email}</strong>.
        </p>
        <Button className="mt-4" onClick={() => supabase.auth.signOut()}>
          Cerrar sesión
        </Button>
      </Section>

      <Section title="Cambiar contraseña">
        <form onSubmit={changePassword} className="grid max-w-sm gap-4">
          {message && <Notice tone={message.tone}>{message.text}</Notice>}
          <Field label="Nueva contraseña" hint="Mínimo 10 caracteres.">
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Repite la nueva contraseña">
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Button type="submit" variant="primary" disabled={saving || !password}>
            {saving ? "Guardando…" : "Guardar contraseña"}
          </Button>
        </form>
      </Section>

      <Section title="Quién puede entrar">
        <p className="text-sm leading-relaxed text-[#4a4e57]">
          El acceso lo administra el equipo de RCKT. Para dar acceso a otra persona se crea su usuario en
          Supabase y se agrega su correo a la lista de administradores del sitio.
        </p>
      </Section>
    </div>
  );
}
