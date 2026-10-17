"use client";
import { Search, LocateFixed, X } from "lucide-react";
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
  // El alto lo reparte el riel flex de LiveMap (desktop a la izquierda, móvil
  // en la hoja inferior). La búsqueda y la telemetría van fijas en los extremos
  // del panel; solo el medio scrollea, así que el conteo y el reinicio nunca
  // quedan fuera de vista. Los géneros no usan scroll horizontal: se envuelven
  // y se ven todos de una vez.
  return (
    <div className="relative flex max-h-full flex-col overflow-hidden rounded-2xl border border-hueso/10 bg-panel/95 shadow-2xl backdrop-blur-xl">
      {/* búsqueda */}
      <div className="shrink-0 p-4 pb-3">
        <div className="flex items-center gap-2 rounded-xl border border-hueso/10 bg-cafetal/95 px-3 py-2 backdrop-blur transition-colors focus-within:border-rojo/60">
          <Search size={16} className="shrink-0 text-hueso-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar artista, género o lugar…"
            aria-label="Buscar artista, género o lugar"
            className="w-full border-none bg-transparent text-sm text-hueso outline-none placeholder:text-hueso-dim/70"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              aria-label="Limpiar búsqueda"
              className="shrink-0 text-hueso-dim transition-colors hover:text-hueso"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* cuerpo con scroll: provincias y géneros */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 pb-4 [scrollbar-gutter:stable]">
        {/* provincias por señal */}
        <ProvinceSignal
          variant="bars"
          counts={provinceCounts}
          active={province}
          onSelect={onProvince}
        />

        {/* géneros: se envuelven en varias líneas, todos visibles */}
        <div className="flex flex-wrap gap-1.5">
          {["Todos", ...categories].map((g) => (
            <button
              key={g}
              onClick={() => onGenre(g)}
              aria-pressed={genre === g}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                genre === g
                  ? "border-rojo bg-rojo text-white"
                  : "border-hueso/15 text-hueso-dim hover:border-hueso/40 hover:text-hueso"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* telemetría + reinicio, siempre a la vista */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-hueso/10 px-4 py-3">
        <p aria-live="polite" className="text-sm text-hueso-dim">
          <span className="text-hueso">{totalEvents}</span>{" "}
          {totalEvents === 1 ? "chivo" : "chivos"} en {totalVenues} lugares
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-hueso/15 px-3 py-1.5 text-xs text-hueso-dim transition-colors hover:border-hueso/40 hover:text-hueso"
        >
          <LocateFixed size={13} />
          Ver todo el país
        </button>
      </div>
    </div>
  );
}
