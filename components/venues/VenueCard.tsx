import Link from "next/link";
import { nombreArtista, partesFecha } from "@/lib/venues";
import type { GigEvent, VenueGroup } from "@/lib/venues";

function proximo(venue: VenueGroup): GigEvent | undefined {
  return venue.events
    .slice()
    .sort(
      (a, b) =>
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime(),
    )[0];
}

/**
 * Fila del catálogo de lugares. Un lugar es un punto fijo en el mapa con una
 * agenda debajo, así que se lee como una fila de agenda y no como una tarjeta:
 * nombre arriba, dirección en mono, y la próxima fecha como bloque-día.
 */
export default function VenueCard({ venue }: { venue: VenueGroup }) {
  const next = proximo(venue);
  const f = next ? partesFecha(next.fechaHora) : null;
  const count = venue.events.length;

  return (
    <Link
      href={`/venues/${venue.slug ?? venue.key}`}
      className="group flex items-center gap-4 py-4 sm:gap-6 focus-visible:bg-panel/40"
    >
      {/* regla de color: la provincia, sostenida por todo el alto de la fila */}
      <span
        aria-hidden
        className="w-[3px] self-stretch shrink-0 rounded-full opacity-60 transition-opacity group-hover:opacity-100"
        style={{ background: venue.color, opacity: 0.55 }}
      />

      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl leading-tight text-hueso transition-colors group-hover:text-rojo sm:text-2xl">
          {venue.name}
        </span>
        <span className="mt-1 block truncate font-mono text-[11px] text-hueso-dim">
          {venue.address || "Dirección por confirmar"}
        </span>
      </span>

      {/* agenda: el nombre del próximo chivo y la fecha como bloque-día.
          En móvil el nombre del lugar se queda con todo el ancho. */}
      <span className="hidden min-w-0 flex-[1.1] sm:block">
        {next ? (
          <>
            <span className="block truncate text-sm text-hueso">
              {nombreArtista(next)}
            </span>
            <span className="mt-0.5 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-hueso-dim sm:block">
              {count} {count === 1 ? "chivo" : "chivos"} en total
            </span>
          </>
        ) : (
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-hueso-dim">
            sin fechas
          </span>
        )}
      </span>

      {f ? (
        <span className="flex shrink-0 flex-col items-center leading-none">
          <span className="font-display text-3xl text-hueso tabular-nums">
            {f.dia}
          </span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-hueso-dim">
            {f.dow} {f.mes}
          </span>
        </span>
      ) : (
        <span className="shrink-0 font-mono text-[11px] text-hueso-dim sm:hidden">
          {count} {count === 1 ? "chivo" : "chivos"}
        </span>
      )}
    </Link>
  );
}
