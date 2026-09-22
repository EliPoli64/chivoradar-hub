"use client";
import { useEffect, useRef, useState } from "react";
import { Search, LocateFixed, ChevronLeft, ChevronRight } from "lucide-react";
import { PROVINCES } from "@/lib/cr-provinces";
import { GENEROS } from "@/lib/venues";

interface Props {
  search: string;
  onSearch: (s: string) => void;
  genre: string;
  onGenre: (g: string) => void;
  province: string | null;
  onProvince: (p: string | null) => void;
  onReset: () => void;
  totalEvents: number;
  totalVenues: number;
}

export default function MapControls({
  search,
  onSearch,
  genre,
  onGenre,
  province,
  onProvince,
  onReset,
  totalEvents,
  totalVenues,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: true });

  const updateEdges = () => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 8,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  const nudge = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <div className="bg-panel/95 backdrop-blur-xl border border-hueso/10 rounded-2xl shadow-2xl p-4 max-h-[55vh] overflow-y-auto md:max-h-none md:overflow-visible">
      {/* búsqueda */}
      <div className="flex items-center gap-2 bg-cafetal border border-hueso/10 rounded-xl px-3 py-2 focus-within:border-rojo/60 transition-colors w-full">
        <Search size={16} className="text-hueso-dim shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar artista, género o lugar…"
          className="w-full bg-transparent border-none outline-none text-sm text-hueso placeholder:text-hueso-dim/70"
        />
      </div>

      {/* provincias */}
      <div className="flex gap-1.5 mt-3 flex-wrap">
        {PROVINCES.map((p) => {
          const active = province === p.name;
          return (
            <button
              key={p.name}
              onClick={() => onProvince(active ? null : p.name)}
              aria-pressed={active}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95"
              style={
                active
                  ? { background: p.color, borderColor: p.color, color: "#16120d" }
                  : { borderColor: "rgba(245,239,228,0.15)", color: "#f5efe4" }
              }
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: p.color }}
              />
              {p.name}
            </button>
          );
        })}
      </div>

      {/* géneros */}
      <div className="relative mt-3">
        <div
          ref={scrollRef}
          onScroll={updateEdges}
          className="flex gap-1.5 overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible pb-1"
        >
          {GENEROS.map((g) => (
            <button
              key={g}
              onClick={() => onGenre(g)}
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

        {edges.right && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-panel to-transparent pointer-events-none" />
        )}
        {edges.left && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-panel to-transparent pointer-events-none" />
        )}

        {edges.right && (
          <button
            onClick={() => nudge(1)}
            aria-label="Más géneros"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-panel border border-hueso/15 text-hueso shadow-lg"
          >
            <ChevronRight size={14} />
          </button>
        )}
        {edges.left && (
          <button
            onClick={() => nudge(-1)}
            aria-label="Géneros anteriores"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-panel border border-hueso/15 text-hueso shadow-lg"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* telemetría + reinicio */}
      <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-hueso/10">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-hueso-dim">
          <span className="text-hueso font-bold">{totalEvents}</span> chivos ·{" "}
          <span className="text-hueso font-bold">{totalVenues}</span> lugares
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hueso/15 text-xs text-hueso-dim hover:text-hueso hover:border-hueso/40 transition-colors"
        >
          <LocateFixed size={13} />
          Ver todo el país
        </button>
      </div>
    </div>
  );
}