"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { completarRedirectGoogle, entrar, registrar } from "@/lib/auth/client";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { isFirebaseConfigured } from "@/lib/firebase/client";

interface Props {
  modo: "login" | "registro";
}

const ERRORES: Record<string, string> = {
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/invalid-email": "El correo no es válido.",
  "auth/user-not-found": "No existe una cuenta con ese correo.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Esperá un momento.",
  "auth/popup-closed-by-user": "Cerraste la ventana de Google.",
  "auth/cancelled-popup-request": "Se canceló el inicio con Google.",
  "auth/popup-blocked": "El navegador bloqueó la ventana de Google. Reintentá.",
  "auth/unauthorized-domain": "Este dominio no está autorizado en Firebase.",
  "auth/operation-not-allowed":
    "Ese método de acceso no está habilitado en Firebase (Authentication → Sign-in method).",
  "auth/configuration-not-found":
    "Firebase Auth no está configurado para este proyecto.",
  "auth/network-request-failed": "Sin conexión. Revisá tu internet.",
  "auth/internal-error": "Error interno de Firebase. Reintentá.",
  "auth/api-key-not-valid": "La API key de Firebase no es válida.",
  "auth/invalid-api-key": "La API key de Firebase no es válida.",
};

function mensajeError(e: unknown): string {
  const code = (e as { code?: string })?.code;
  const mensaje = (e as { message?: string })?.message;
  const base = (code && ERRORES[code]) || mensaje || "No se pudo completar. Intentá de nuevo.";
  return process.env.NODE_ENV !== "production" && code ? `${base} (${code})` : base;
}

export default function AuthForm({ modo }: Props) {
  const router = useRouter();
  const esRegistro = modo === "registro";
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function listo() {
    router.push("/cuenta");
    router.refresh();
  }

  // Al volver del redirect de Google, completar la sesión.
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let activo = true;
    completarRedirectGoogle()
      .then((ok) => {
        if (activo && ok) {
          setPending(true);
          listo();
        }
      })
      .catch((err) => {
        if (activo) setError(mensajeError(err));
      });
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (esRegistro) await registrar(email, password, nombre);
      else await entrar(email, password);
      listo();
    } catch (err) {
      setError(mensajeError(err));
      setPending(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="rounded-2xl border border-dorado/30 bg-panel p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dorado">
          Falta configurar
        </p>
        <p className="text-sm text-hueso-dim mt-3 leading-relaxed">
          La autenticación no está configurada. Agregá las variables{" "}
          <code className="font-mono text-hueso">NEXT_PUBLIC_FIREBASE_*</code> en{" "}
          <code className="font-mono text-hueso">.env.local</code> y reiniciá el
          servidor.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-hueso-dim">
        {esRegistro ? "Creá tu cuenta" : "Bienvenido de vuelta"}
      </p>
      <h1 className="font-display text-4xl text-hueso mt-2 mb-8">
        {esRegistro ? "Registrate" : "Entrá"}
      </h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {esRegistro && (
          <div>
            <label htmlFor="nombre" className="block text-xs font-bold uppercase tracking-widest text-hueso-dim mb-2">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl border border-hueso/15 bg-panel-soft px-4 py-3 text-hueso placeholder-hueso-dim/60 outline-none focus:border-rojo transition-colors"
              placeholder="Tu nombre"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-hueso-dim mb-2">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-hueso/15 bg-panel-soft px-4 py-3 text-hueso placeholder-hueso-dim/60 outline-none focus:border-rojo transition-colors"
            placeholder="vos@correo.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-hueso-dim mb-2">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={esRegistro ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-hueso/15 bg-panel-soft px-4 py-3 text-hueso placeholder-hueso-dim/60 outline-none focus:border-rojo transition-colors"
            placeholder="Al menos 6 caracteres"
          />
        </div>

        {error && (
          <p className="text-sm text-rojo" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-rojo px-4 py-3 font-bold text-white hover:brightness-110 disabled:opacity-60 transition-[filter]"
        >
          {pending ? "Un momento…" : esRegistro ? "Crear cuenta" : "Entrar"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <span className="h-px flex-1 bg-hueso/10" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-hueso-dim">o</span>
        <span className="h-px flex-1 bg-hueso/10" />
      </div>

      <GoogleSignIn onError={setError} />

      <p className="text-sm text-hueso-dim mt-8 text-center">
        {esRegistro ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
        <Link
          href={esRegistro ? "/login" : "/registro"}
          className="text-rojo font-bold hover:underline"
        >
          {esRegistro ? "Entrá" : "Registrate"}
        </Link>
      </p>
    </div>
  );
}
