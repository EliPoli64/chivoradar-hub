"use client";
import { X, MapPin, ExternalLink, Ticket } from "lucide-react";
import type { VenueGroup } from "@/lib/venues";
import { formatHora, formatPrecio } from "@/lib/venues";

interface Props {
  venue: VenueGroup;
  onClose: () => void;
}

export default function EventSidePanel({ venue, onClose }: Props) {
  const count = venue.events.length;

  return (
    <div
      data-testid="side-panel"
      className="flex flex-col h-full max-h-[65vh] bg-panel/95 backdrop-blur-xl border border-hueso/10 rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* encabezado del lugar */}
      <div className="px-5 pt-4 pb-3 border-b border-hueso/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: venue.color, boxShadow: `0 0 10px ${venue.color}` }}
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-hueso-dim">
              {venue.province}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar panel"
            className="p-1.5 rounded-lg text-hueso-dim hover:bg-hueso/10 hover:text-hueso transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <h3 className="font-display text-2xl leading-tight mt-2 text-hueso">{venue.name}</h3>

        <div className="flex items-center gap-1.5 mt-2 text-xs text-hueso-dim">
          <MapPin size={13} className="shrink-0" />
          <span>{venue.address || "Dirección por confirmar"}</span>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] mt-3" style={{ color: venue.color }}>
          {count} {count === 1 ? "chivo" : "chivos"} en este lugar
        </p>
      </div>

      {/* lista de eventos */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {venue.events
          .slice()
          .sort(
            (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
          )
          .map((e) => {
            const d = new Date(e.fechaHora);
            const day = d.getDate();
            const month = d
              .toLocaleDateString("es-ES", { month: "short" })
              .replace(".", "");
            const cheapest = e.tiersPrecio?.length
              ? e.tiersPrecio.reduce((a, b) =>
                  b.precio < a.precio && b.precio !== 0 ? b : a
                )
              : null;
            return (
              <div
                key={e.id}
                data-testid="event-row"
                className="group rounded-xl border border-hueso/10 bg-cafetal/60 p-3 hover:border-hueso/25 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* fecha */}
                  <div className="flex flex-col items-center justify-center w-12 shrink-0 py-1 rounded-lg border border-hueso/10">
                    <span className="font-mono font-bold text-lg leading-none text-hueso">
                      {day}
                    </span>
                    <span className="font-mono text-[9px] uppercase text-hueso-dim mt-0.5">
                      {month}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-snug text-hueso">
                      {e.artista}
                    </p>
                    <p className="text-xs text-hueso-dim leading-snug mt-0.5 line-clamp-2">
                      {e.titulo}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded"
                        style={{
                          color: venue.color,
                          background: `${venue.color}1f`,
                        }}
                      >
                        {e.categoria}
                      </span>
                      <span className="font-mono text-[10px] text-hueso-dim">
                        {formatHora(e.fechaHora)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3">
                  <p className="font-mono text-xs font-medium text-hueso">
                    {cheapest ? formatPrecio(cheapest) : "—"}
                  </p>
                  <a
                    href={e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rojo text-white text-xs font-bold hover:brightness-110 transition-[filter]"
                  >
                    <Ticket size={13} />
                    Entradas
                    <ExternalLink size={11} className="opacity-70" />
                  </a>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}