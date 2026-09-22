import Link from "next/link";
import { MapPin, Ticket } from "lucide-react";
import type { VenueGroup } from "@/lib/venues";
import { formatFechaHora } from "@/lib/venues";

export default function VenueCard({ venue }: { venue: VenueGroup }) {
  const next = venue.events
    .slice()
    .sort(
      (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    )[0];

  return (
    <Link
      href={`/venues/${venue.slug ?? venue.key}`}
      className="group block bg-panel border border-hueso/10 rounded-2xl p-5 hover:border-hueso/25 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ background: venue.color, boxShadow: `0 0 10px ${venue.color}` }}
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-hueso-dim">
          {venue.province}
        </p>
      </div>

      <h3 className="font-display text-2xl leading-tight mt-3 text-hueso group-hover:text-rojo transition-colors">
        {venue.name}
      </h3>

      <p className="flex items-center gap-1.5 text-xs text-hueso-dim mt-2">
        <MapPin size={13} className="shrink-0" style={{ color: venue.color }} />
        <span className="line-clamp-1">{venue.address || "Dirección por confirmar"}</span>
      </p>

      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-hueso/10">
        <span className="font-mono text-xs text-hueso">
          {venue.events.length} {venue.events.length === 1 ? "chivo" : "chivos"}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-hueso-dim flex items-center gap-1">
          <Ticket size={12} />
          {next ? `próximo ${formatFechaHora(next.fechaHora)}` : "sin fechas"}
        </span>
      </div>
    </Link>
  );
}