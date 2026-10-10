"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

interface Props {
  venueId: string;
  venueSlug?: string | null;
  iniciarSiguiendo?: boolean;
  autenticado?: boolean;
  compacto?: boolean;
}

export default function FollowButton({
  venueId,
  iniciarSiguiendo = false,
  autenticado = true,
  compacto = false,
}: Props) {
  const router = useRouter();
  const [siguiendo, setSiguiendo] = useState(iniciarSiguiendo);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (!autenticado) {
      router.push("/login");
      return;
    }
    setPending(true);
    setError(null);
    try {
      if (siguiendo) {
        const res = await fetch(`/api/follows/${encodeURIComponent(venueId)}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Falla al dejar de seguir");
        setSiguiendo(false);
      } else {
        const res = await fetch("/api/follows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ venueId }),
        });
        if (!res.ok) throw new Error("Falla al seguir");
        setSiguiendo(true);
      }
      router.refresh();
    } catch {
      setError("No se pudo guardar. Intentá de nuevo.");
    } finally {
      setPending(false);
    }
  }

  const base = compacto
    ? "px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
    : "px-4 py-2 rounded-full text-sm font-bold border transition-colors";
  const estilo = siguiendo
    ? "border-rojo/40 text-rojo hover:bg-rojo/10"
    : "border-hueso/20 text-hueso hover:border-rojo hover:text-rojo";

  const etiqueta = pending
    ? "Un momento…"
    : !autenticado
      ? "Seguir"
      : siguiendo
        ? compacto
          ? "Dejar de seguir"
          : "Siguiendo"
        : compacto
          ? "Seguir"
          : "Seguir este lugar";

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={siguiendo}
        className={`${base} ${estilo} inline-flex items-center gap-2 disabled:opacity-60`}
      >
        <Heart size={compacto ? 12 : 15} className={`${siguiendo ? "fill-current" : ""}`} />
        {etiqueta}
      </button>
      {error && <p className="mt-2 text-xs text-rojo">{error}</p>}
    </div>
  );
}