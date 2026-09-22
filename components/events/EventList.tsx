"use client";
import { ExternalLink, Ticket } from "lucide-react";
import type { GigEvent } from "@/lib/venues";
import { formatHora, formatPrecio } from "@/lib/venues";

interface Props {
  events: GigEvent[];
  color: string;
}

export default function EventList({ events, color }: Props) {
  const sorted = events
    .slice()
    .sort(
      (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    );

  return (
    <div className="space-y-2.5 w-full">
      {sorted.map((e) => {
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
                    style={{ color, background: `${color}1f` }}
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
  );
}