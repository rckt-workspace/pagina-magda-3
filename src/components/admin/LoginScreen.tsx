import { useState, type FormEvent } from "react";
import { supabase } from "../../integrations/supabase/client";
import { Button, Field, Notice, SERIF, inputClass } from "./ui";

export function LoginScreen({ notice }: { notice?: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (authError) {
      setError(
        authError.message.toLowerCase().includes("invalid")
          ? "El correo o la contraseña no coinciden."
          : "No se pudo iniciar sesión. Intenta de nuevo en unos minutos.",
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef1f6] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1e2a4a] text-base font-semibold text-white"
            style={{ fontFamily: SERIF }}
            aria-hidden
          >
            MG
          </span>
          <div>
            <p className="text-lg font-semibold leading-tight text-[#1e2a4a]" style={{ fontFamily: SERIF }}>
              Magda Gutiérrez
            </p>
            <p className="text-sm text-[#7c879b]">Panel de contactos</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[#d3dae5] bg-white p-6">
          {notice && <Notice tone="error">{notice}</Notice>}
          {error && <Notice tone="error">{error}</Notice>}

          <Field label="Correo">
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Contraseña">
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Entrando…" : "Entrar al panel"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-[#7c879b]">
          ¿Olvidaste la contraseña? Pídele al equipo de RCKT que la restablezca.
        </p>
      </div>
    </main>
  );
}
