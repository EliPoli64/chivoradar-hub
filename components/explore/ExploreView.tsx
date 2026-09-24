"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PROVINCES, PROVINCE_BY_SLUG } from "@/lib/cr-provinces";
import { type GigEvent } from "@/lib/venues";
import EventCard from "@/components/events/EventCard";

interface Props {
  events: GigEvent[];
  categories: string[];
  region: string | null;
}

export default function ExploreView({ events, categories, region }: Props) {
  const [genre, setGenre] = useState("Todos");
  const [query, setQuery] = useState("");

  const provinceName = region ? PROVINCE_BY_SLUG[region]?.name : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const gOk = genre === "Todos" || e.categoria === genre;
      const qOk =
        !q ||
        `${e.artista} ${e.titulo} ${e.venueObj?.nombre ?? ""} ${e.venue ?? ""}`
          .toLowerCase()
          .includes(q);
      return gOk && qOk;
    });
  }, [events, genre, query]);

  return (
    <div>
      {/* provincias */}
      <div className="flex gap-2 mt-6 flex-wrap">
        <Link
          href="/explore"
          className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
            !region
              ? "bg-rojo text-white border-rojo"
              : "border-hueso/15 text-hueso-dim hover:text-hueso hover:border-hueso/40"
          }`}
        >
          Todo el país
        </Link>
        {PROVINCES.map((p) => {
          const slug = p.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");
          const active = region === slug;
          return (
            <Link
              key={p.name}
              href={`/explore?region=${slug}`}
              aria-pressed={active}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95"
              style={
                active
                  ? { background: p.color, borderColor: p.color, color: "#16120d" }
                  : { borderColor: "rgba(245,239,228,0.15)", color: "#f5efe4" }
              }
            >
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </Link>
          );
        })}
      </div>

      {/* géneros + búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mt-5">
        <div className="flex items-center gap-2 bg-cafetal border border-hueso/10 rounded-xl px-3 py-2 focus-within:border-rojo/60 transition-colors w-full md:w-auto">
          <Search size={16} className="text-hueso-dim shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar artista, género o lugar…"
            className="w-full bg-transparent border-none outline-none text-sm text-hueso placeholder:text-hueso-dim/70"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible">
          {["Todos", ...categories].map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              aria-pressed={genre === g}
              className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                genre === g
                  ? "bg-rojo text-white border-rojo"
                  : "border-hueso/15 text-hueso-dim hover:text-hueso hover:border-hueso/40"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* conteo */}
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-hueso-dim mt-6">
        <span className="text-hueso font-bold">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "chivo" : "chivos"} en el radar
        {provinceName ? ` · ${provinceName}` : ""}
      </p>

      {/* grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filtered.map((gig, i) => (
            <div
              key={gig.id}
              className="anim-rise"
              style={{ animationDelay: `${Math.min(i * 70, 420)}ms` }}
            >
              <EventCard
                title={gig.titulo}
                artist={gig.artista}
                venue={gig.venue ?? ""}
                date={gig.date ?? ""}
                genre={gig.categoria}
                image={gig.urlImagen ?? ""}
                coordinates={gig.venueObj?.coordinates}
                link={gig.link}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 border-2 border-dashed border-hueso/10 rounded-2xl p-10 text-center bg-panel/30">
          <p className="text-hueso-dim">
            {provinceName
              ? `No hay chivos en ${provinceName} todavía.`
              : "No hay chivos que matcheen tu búsqueda."}
          </p>
          <Link
            href={provinceName ? "/explore" : "#"}
            onClick={
              provinceName
                ? undefined
                : () => {
                    setGenre("Todos");
                    setQuery("");
                  }
            }
            className="inline-block mt-3 text-rojo font-bold hover:underline"
          >
            {provinceName ? "Ver todo el país →" : "Limpiar filtros →"}
          </Link>
        </div>
      )}
    </div>
  );
}