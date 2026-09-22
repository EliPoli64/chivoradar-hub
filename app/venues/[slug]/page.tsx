import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { getVenueEventsSafe } from "@/lib/events";
import { PROVINCES, provinceForPoint } from "@/lib/cr-provinces";
import type { VenueGroup } from "@/lib/venues";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventList from "@/components/events/EventList";
import VenueMiniMap from "@/components/venues/VenueMiniMap";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const events = await getVenueEventsSafe(slug);
  if (events.length === 0) notFound();

  const first = events[0];
  const coords = first.venueObj?.coordinates;
  const position: [number, number] | null =
    coords && Array.isArray(coords) && coords.length === 2 && coords[0] != null && coords[1] != null
      ? [coords[0], coords[1]]
      : null;
  const province = position ? provinceForPoint(position[0], position[1]) : null;
  const prov = PROVINCES.find((p) => p.name === province);

  const venue: VenueGroup = {
    key: slug,
    slug: first.venueObj?.slug ?? slug,
    name: first.venueObj?.nombre || first.venue || "Lugar",
    address: first.venueObj?.direccion ?? null,
    position: position ?? [9.75, -84.2],
    province: province || "Sin zona",
    color: prov?.color || "#E6323F",
    events,
  };

  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white">
      <Navbar />

      <section className="pt-28 pb-16 max-w-4xl mx-auto px-5 md:px-6">
        <Link
          href="/venues"
          className="inline-flex items-center gap-1.5 text-sm text-hueso-dim hover:text-hueso transition-colors"
        >
          <ArrowLeft size={14} />
          Volver a Lugares
        </Link>

        {/* encabezado del lugar */}
        <div
          className="mt-4 rounded-2xl border border-hueso/10 bg-panel p-6 overflow-hidden relative"
          style={{ boxShadow: `inset 0 6px 0 ${venue.color}` }}
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

          <h1 className="font-display text-4xl md:text-5xl leading-[1.05] text-hueso mt-3">
            {venue.name}
          </h1>

          <div className="flex items-center gap-1.5 mt-3 text-sm text-hueso-dim">
            <MapPin size={15} className="shrink-0" style={{ color: venue.color }} />
            <span>{venue.address || "Dirección por confirmar"}</span>
          </div>

          <p
            className="font-mono text-[11px] uppercase tracking-[0.2em] mt-4"
            style={{ color: venue.color }}
          >
            {venue.events.length} {venue.events.length === 1 ? "chivo" : "chivos"} próximos
          </p>
        </div>

        {/* mini mapa */}
        {position && (
          <div className="mt-6">
            <VenueMiniMap venue={venue} />
          </div>
        )}

        <h2 className="font-display text-2xl mt-10 mb-4 text-hueso">
          Chivos en este lugar
        </h2>
        <EventList events={venue.events} color={venue.color} />
      </section>

      <Footer />
    </main>
  );
}