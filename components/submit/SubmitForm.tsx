"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface VenueResult {
  id: string;
  nombre: string;
  slug: string;
  direccion: string | null;
  coordinates: number[] | null;
}

const CATEGORIES = [
  "Conciertos",
  "Teatro",
  "Fiesta",
  "Deportes",
  "Comedia",
  "Festival",
  "Otro",
];

export default function SubmitForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VenueResult[]>([]);
  const [venue, setVenue] = useState<VenueResult | null>(null);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [link, setLink] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urlImagen, setUrlImagen] = useState("");
  const [proof, setProof] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function searchVenues(q: string) {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/venues/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.venues || []);
    } catch {
      setResults([]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!venue) {
      setError("Debés seleccionar un lugar del listado");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "event_for_existing_venue",
          venueId: venue.id,
          titulo,
          categoria,
          fechaHora,
          link,
          descripcion,
          urlImagen,
          proof,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al enviar");
        return;
      }
      setSent(true);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
        <h2 className="font-display text-2xl">Envío recibido</h2>
        <p className="text-hueso-dim mt-2">
          Tu chivo quedó en revisión. Te avisaremos cuando sea aprobado.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 rounded bg-rojo text-white hover:bg-rojo/90"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm mb-1">Lugar *</label>
        {venue ? (
          <div className="flex items-center justify-between rounded border border-white/10 px-3 py-2">
            <div>
              <div className="font-semibold">{venue.nombre}</div>
              {venue.direccion && (
                <div className="text-xs text-hueso-dim">{venue.direccion}</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setVenue(null);
                setQuery("");
                setResults([]);
              }}
              className="text-xs text-hueso-dim hover:text-hueso"
            >
              Cambiar
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              value={query}
              onChange={(e) => searchVenues(e.target.value)}
              placeholder="Buscar lugar (mín. 2 letras)"
              className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
            />
            {results.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded border border-white/10 bg-cafetal shadow-lg">
                {results.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => {
                      setVenue(r);
                      setResults([]);
                      setQuery(r.nombre);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5"
                  >
                    <div className="font-semibold">{r.nombre}</div>
                    {r.direccion && (
                      <div className="text-xs text-hueso-dim">{r.direccion}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Título del evento *</label>
        <input
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Categoría *</label>
          <select
            required
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
          >
            <option value="">Seleccionar</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Fecha y hora *</label>
          <input
            required
            type="datetime-local"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Link de entradas *</label>
        <input
          required
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Imagen (URL)</label>
        <input
          type="url"
          value={urlImagen}
          onChange={(e) => setUrlImagen(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Prueba (post de IG / flyer) (URL)</label>
        <input
          type="url"
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded bg-black/30 border border-white/10"
        />
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-rojo text-white hover:bg-rojo/90 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar para revisión"}
      </button>
    </form>
  );
}
