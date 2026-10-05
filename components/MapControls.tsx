"use client";
import { useEffect, useRef, useState } from "react";
import { Search, LocateFixed, ChevronLeft, ChevronRight } from "lucide-react";
import ProvinceSignal, { type Counts } from "@/components/ProvinceSignal";

interface Props {
  search: string;
  onSearch: (s: string) => void;
  genre: string;
  onGenre: (g: string) => void;
  categories: string[];
  province: string | null;
  onProvince: (p: string | null) => void;
  onReset: () => void;
  totalEvents: number;
  totalVenues: number;
  /** chivos por provincia, ya filtrados por búsqueda y género */
  provinceCounts: Counts;
}

export default function MapControls({
  search,
  onSearch,
  genre,
  onGenre,
  categories,
  province,
  onProvince,
  onReset,
  totalEvents,
  totalVenues,
  provinceCounts,
}: Props) {
  // refs distintas: la fila de géneros se desplaza en horizontal, el cuerpo
  // del panel en vertical
  const generosRef = useRef<HTMLDivElement>(null);
  const cuerpoRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: true });
  // el riel de LiveMap reparte el alto; cuando falta, la lista se desplaza y
  // hay que avisarlo con un degradado, si no el corte parece error de maquetación
  const [desplaza, setDesplaza] = useState(false);

  const updateEdges = () => {
    const g = generosRef.current;
    if (g) {
      setEdges({
        left: g.scrollLeft > 8,
        right: g.scrollLeft + g.clientWidth < g.scrollWidth - 8,
      });
    }
    const c = cuerpoRef.current;
    if (c) setDesplaza(c.scrollHeight > c.clientHeight + 1);
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    const c = cuerpoRef.current;
    if (typeof ResizeObserver !== "undefined" && c) {
      // el alto disponible depende del hero y del viewport
      const ro = new ResizeObserver(updateEdges);
      ro.observe(c);
      return () => {
        window.removeEventListener("resize", updateEdges);
        ro.disconnect();
      };
    }
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  const nudge = (dir: number) => {
    generosRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    // El alto lo reparte el riel flex de LiveMap (desktop a la izquierda,
    // móvil en la hoja inferior). El panel es la carcasa y el cuerpo scrollea,
    // para poder poner el degradado de "sigue abajo" por fuera del scroll.
    <div className="relative flex max-h-full flex-col overflow-hidden rounded-2xl border border-hueso/10 bg-panel/95 shadow-2xl backdrop-blur-xl">
      <div
        ref={cuerpoRef}
        onScroll={updateEdges}
        className="min-h-0 flex-1 overflow-y-auto p-4 pb-6"
      >
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

        {/* provincias por señal */}
        <ProvinceSignal
          variant="bars"
          className="mt-3"
          counts={provinceCounts}
          active={province}
          onSelect={onProvince}
        />

        {/* géneros */}
        <div className="relative mt-3">
          <div
            ref={generosRef}
            onScroll={updateEdges}
            className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1"
          >
            {["Todos", ...categories].map((g) => (
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
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-hueso/10 pt-3">
          <p className="text-sm text-hueso-dim">
            <span className="text-hueso">{totalEvents}</span>{" "}
            {totalEvents === 1 ? "chivo" : "chivos"} en {totalVenues} lugares
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

      {/* sólo cuando la lista no entra: el degradado deja claro que sigue */}
      {desplaza && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 rounded-b-2xl bg-gradient-to-t from-panel from-45% via-panel/85 to-transparent"
        />
      )}
    </div>
  );
}
