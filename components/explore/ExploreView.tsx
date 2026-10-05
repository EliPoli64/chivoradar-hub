"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { PROVINCE_BY_SLUG } from "@/lib/cr-provinces";
import { isSinCategoria, type GigEvent } from "@/lib/venues";
import ProvinceSignal, { type Counts } from "@/components/ProvinceSignal";
import EventCard from "@/components/events/EventCard";

interface Props {
  events: GigEvent[];
  categories: string[];
  region: string | null;
  provinceCounts: Counts;
}

export default function ExploreView({
  events,
  categories,
  region,
  provinceCounts,
}: Props) {
  const [genre, setGenre] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const provinceName = region ? PROVINCE_BY_SLUG[region]?.name : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const gOk = !genre || e.categoria === genre;
      const qOk =
        !q ||
        `${e.artista} ${e.titulo} ${e.venueObj?.nombre ?? ""} ${e.venue ?? ""}`
          .toLowerCase()
          .includes(q);
      return gOk && qOk;
    });
  }, [events, genre, query]);

  /** cuántos chivos tiene cada género, para que el filtro diga qué estás eligiendo */
  const genreCounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out: Record<string, number> = {};
    for (const e of events) {
      if (q) {
        const hit =
          `${e.artista} ${e.titulo} ${e.venueObj?.nombre ?? ""} ${e.venue ?? ""}`
            .toLowerCase()
            .includes(q);
        if (!hit) continue;
      }
      if (isSinCategoria(e.categoria)) continue;
      out[e.categoria] = (out[e.categoria] ?? 0) + 1;
    }
    return out;
  }, [events, query]);

  // el género elegido nunca se oculta, aunque la búsqueda lo deje en cero:
  // si desapareciera de la fila seguiría filtrando y no habría cómo quitarlo
  const facets = categories
    .filter((c) => (genreCounts[c] ?? 0) > 0 || c === genre)
    .sort((a, b) => (genreCounts[b] ?? 0) - (genreCounts[a] ?? 0));

  const limpiarTodo = () => {
    setGenre(null);
    setQuery("");
  };

  return (
    <div className="lg:flex lg:items-start lg:gap-12">
      {/* control de región */}
      <div className="lg:w-[248px] lg:shrink-0">
        <h1 className="font-display text-4xl leading-[0.95] text-hueso md:text-5xl">
          {provinceName ?? "¿A dónde esta noche?"}
        </h1>
        <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-hueso-dim">
          {provinceName
            ? `Chivos programados en ${provinceName}.`
            : "Del garaje al estadio, de San José a Limón."}
        </p>

        <div className="mt-7 lg:sticky lg:top-24">
          <ProvinceSignal
            counts={provinceCounts}
            active={provinceName}
            hrefFor={(s) =>
              s === region ? "/explore" : `/explore?region=${s}`
            }
          />

          {/* búsqueda */}
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-hueso/10 bg-panel px-3 py-2 transition-colors focus-within:border-rojo/60">
            <Search size={16} className="shrink-0 text-hueso-dim" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar artista o lugar"
              aria-label="Buscar artista o lugar"
              className="w-full border-none bg-transparent text-sm text-hueso outline-none placeholder:text-hueso-dim/70"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="shrink-0 text-hueso-dim hover:text-hueso"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* géneros */}
          {facets.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {facets.map((g) => {
                const on = genre === g;
                return (
                  <button
                    key={g}
                    onClick={() => setGenre(on ? null : g)}
                    aria-pressed={on}
                    className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                      on
                        ? "border-rojo bg-rojo text-white"
                        : "border-hueso/15 text-hueso-dim hover:border-hueso/40 hover:text-hueso"
                    }`}
                  >
                    {g}
                    <span className="ml-1.5 font-mono text-[10px] tabular-nums opacity-60">
                      {genreCounts[g] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* resultados */}
      <div className="mt-10 min-w-0 flex-1 lg:mt-0">
        <p className="text-sm text-hueso-dim">
          <span className="text-hueso tabular-nums">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "chivo" : "chivos"}
          {provinceName ? ` en ${provinceName}` : " en todo el país"}
          {genre ? ` de ${genre}` : ""}.
        </p>

        {filtered.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((gig) => (
              <EventCard
                key={gig.id}
                id={gig.id}
                title={gig.titulo}
                artist={gig.artista}
                venue={gig.venue ?? ""}
                date={gig.date ?? ""}
                genre={gig.categoria}
                image={gig.urlImagen ?? ""}
                coordinates={gig.venueObj?.coordinates}
                link={gig.link}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            provinceName={provinceName}
            genre={genre}
            query={query}
            onClearGenre={() => setGenre(null)}
            onClearQuery={() => setQuery("")}
            onClearAll={limpiarTodo}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Sin resultados hay que decir por qué. Se nombran los filtros que están
 * puestos y se ofrece quitar cada uno por separado.
 */
function EmptyState({
  provinceName,
  genre,
  query,
  onClearGenre,
  onClearQuery,
  onClearAll,
}: {
  provinceName: string | null;
  genre: string | null;
  query: string;
  onClearGenre: () => void;
  onClearQuery: () => void;
  onClearAll: () => void;
}) {
  const reasons: { label: string; clear: () => void }[] = [];
  if (query) reasons.push({ label: `“${query}”`, clear: onClearQuery });
  if (genre) reasons.push({ label: genre, clear: onClearGenre });

  return (
    <div className="mt-5 border-t border-hueso/10 pt-6">
      <p className="max-w-[46ch] text-hueso">
        {provinceName
          ? `No hay chivos en ${provinceName} con estos filtros.`
          : "No hay chivos que coincidan con estos filtros."}
      </p>

      {reasons.length > 0 ? (
        <>
          <p className="mt-2 text-sm text-hueso-dim">Quitando:</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {reasons.map((r) => (
              <li key={r.label}>
                <button
                  onClick={r.clear}
                  className="inline-flex items-center gap-1.5 rounded-full border border-hueso/15 px-3 py-1 text-xs text-hueso transition-colors hover:border-rojo hover:text-rojo"
                >
                  {r.label}
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={onClearAll}
            className="mt-4 text-sm font-bold text-rojo hover:underline"
          >
            Quitar todos los filtros
          </button>
        </>
      ) : provinceName ? (
        <Link
          href="/explore"
          className="mt-3 inline-block text-sm font-bold text-rojo hover:underline"
        >
          Ver todo el país
        </Link>
      ) : (
        <p className="mt-3 max-w-[46ch] text-sm text-hueso-dim">
          No hay nada en el radar ahora mismo. Volvé en unos días.
        </p>
      )}
    </div>
  );
}
