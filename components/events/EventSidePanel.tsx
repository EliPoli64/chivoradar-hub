"use client";
import { X, MapPin } from "lucide-react";
import type { VenueGroup } from "@/lib/venues";
import EventList from "@/components/events/EventList";

interface Props {
  venue: VenueGroup;
  closing?: boolean;
  onClose: () => void;
}

export default function EventSidePanel({ venue, closing = false, onClose }: Props) {
  const count = venue.events.length;

  return (
    <div
      data-testid="side-panel"
      className={`flex flex-col h-full max-h-[70vh] bg-panel/95 backdrop-blur-xl border border-hueso/10 rounded-2xl shadow-2xl overflow-hidden ${
        closing ? "anim-panel-out" : "anim-panel-in"
      }`}
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

        <p
          className="font-mono text-[10px] uppercase tracking-[0.2em] mt-3"
          style={{ color: venue.color }}
        >
          {count} {count === 1 ? "chivo" : "chivos"} en este lugar
        </p>
      </div>

      {/* lista de eventos */}
      <div className="flex-1 overflow-y-auto p-3">
        <EventList events={venue.events} color={venue.color} />
      </div>
    </div>
  );
}