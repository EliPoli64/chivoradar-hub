import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MapPin, Ticket } from "lucide-react";
import { getEventByIdSafe, getVenueEventsSafe } from "@/lib/events";
import { PROVINCES, provinceForPoint } from "@/lib/cr-provinces";
import {
  isSinCategoria,
  formatHora,
  formatPrecio,
  type VenueGroup,
} from "@/lib/venues";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import EventList from "@/components/events/EventList";
import VenueMiniMap from "@/components/venues/VenueMiniMap";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventByIdSafe(id);
  if (!event) return { title: "Chivo no encontrado | Chivo Radar" };
  const description = event.descripcion?.trim()
    ? event.descripcion.trim().slice(0, 160)
    : `Chivo en ${event.venue || event.venueObj?.nombre || "Lugar por confirmar"} · ${event.date ?? ""}`;
  return {
    title: `${event.artista} — ${event.titulo} | Chivo Radar`,
    description,
  };
}

export default async function EventoPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventByIdSafe(id);
  if (!event) notFound();

  const coords = event.venueObj?.coordinates;
  const position: [number, number] | null =
    coords && Array.isArray(coords) && coords.length === 2 && coords[0] != null && coords[1] != null
      ? [coords[0], coords[1]]
      : null;
  const province = position ? provinceForPoint(position[0], position[1]) : null;
  const prov = PROVINCES.find((p) => p.name === province);
  const color = prov?.color ?? "#E6323F";
  const venueSlug = event.venueObj?.slug ?? null;
  const venueName = event.venueObj?.nombre || event.venue || "Lugar por confirmar";

  const relatedKey = venueSlug ?? event.venueId;
  const venueEvents = relatedKey ? await getVenueEventsSafe(relatedKey) : [];
  const relatedEvents = venueEvents.filter((e) => e.id !== id);
  const relatedLimit = relatedEvents.slice(0, 6);
  const showMore = relatedEvents.length > relatedLimit.length;

  const venueGroup: VenueGroup | null = position
    ? {
        key: venueSlug ?? `${position[0]},${position[1]}`,
        slug: venueSlug,
        name: venueName,
        address: event.venueObj?.direccion ?? null,
        position,
        province: province || "Sin zona",
        color,
        events: venueEvents,
      }
    : null;

  const d = new Date(event.fechaHora);
  const day = d.getDate();
  const month = d
    .toLocaleDateString("es-ES", { month: "short" })
    .replace(".", "");

  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white">
      <Navbar />

      <section className="pt-28 pb-16 max-w-3xl mx-auto px-5 md:px-6 lg:px-8">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-hueso-dim hover:text-hueso transition-colors"
        >
          <ArrowLeft size={14} />
          Volver al radar
        </Link>

        {/* encabezado del chivo */}
        <div
          className="mt-4 rounded-2xl border border-hueso/10 bg-panel p-6 md:p-8 overflow-hidden relative"
          style={{ boxShadow: `inset 0 6px 0 ${color}` }}
        >
          <div className="flex items-center gap-2">
            {!isSinCategoria(event.categoria) && (
              <span
                className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider text-cafetal"
                style={{ background: color }}
              >
                {event.categoria}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-hueso-dim">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              {province || "Sin zona"}
            </span>
          </div>

          <p className="font-display text-2xl md:text-3xl text-hueso mt-5">
            {event.artista}
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-hueso mt-1">
            {event.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 text-sm text-hueso-dim">
            <span className="inline-flex items-center gap-2.5">
              <span className="flex flex-col items-center justify-center w-11 py-1.5 rounded-lg border border-hueso/15">
                <span className="font-mono font-bold text-lg leading-none text-hueso">
                  {day}
                </span>
                <span className="font-mono text-[9px] uppercase text-hueso-dim mt-0.5">
                  {month}
                </span>
              </span>
              <span className="font-mono" style={{ color }}>
                {formatHora(event.fechaHora)}
              </span>
            </span>

            {venueSlug ? (
              <Link
                href={`/venues/${venueSlug}`}
                className="inline-flex items-center gap-1.5 hover:text-hueso transition-colors"
              >
                <MapPin size={15} className="shrink-0" style={{ color }} />
                <span>
                  {venueName}
                  {event.venueObj?.direccion ? ` · ${event.venueObj.direccion}` : ""}
                </span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} className="shrink-0" style={{ color }} />
                <span>
                  {venueName}
                  {event.venueObj?.direccion ? ` · ${event.venueObj.direccion}` : ""}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* banner */}
        <div className="mt-6 relative h-64 md:h-80 w-full rounded-2xl overflow-hidden border border-hueso/10">
          {event.urlImagen ? (
            <Image
              src={event.urlImagen}
              alt={event.titulo}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-panel flex items-center justify-center">
              <Logo size={56} className="opacity-60" />
            </div>
          )}
        </div>

        {/* descripción */}
        <section className="mt-10">
          <h2 className="font-display text-2xl text-hueso">Sobre el chivo</h2>
          <p className="text-hueso-dim leading-relaxed mt-3 whitespace-pre-line">
            {event.descripcion?.trim() ||
              "No hay descripción disponible para este chivo todavía."}
          </p>
        </section>

        {/* entradas */}
        <section className="mt-10 rounded-2xl border border-hueso/10 bg-panel p-6">
          <h2 className="font-display text-2xl text-hueso">Entradas</h2>
          {event.tiersPrecio?.length ? (
            <ul className="mt-4 space-y-2">
              {event.tiersPrecio.map((tier, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-hueso">{tier.nombre}</span>
                  <span className="font-mono text-hueso">{formatPrecio(tier)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-hueso-dim text-sm mt-4">Precios por confirmar.</p>
          )}
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full mt-5 py-3 rounded-xl bg-rojo text-white text-sm font-bold hover:brightness-110 transition-[filter]"
            >
              <Ticket size={15} />
              Conseguir Entradas
            </a>
          )}
        </section>

        {/* mini mapa */}
        {venueGroup && (
          <section className="mt-10">
            <h2 className="font-display text-2xl text-hueso mb-4">Dónde es</h2>
            <VenueMiniMap venue={venueGroup} />
          </section>
        )}

        {/* otros chivos en el lugar */}
        {relatedKey && (
          <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl text-hueso">
                Más chivos en {venueName}
              </h2>
              {showMore && venueSlug && (
                <Link
                  href={`/venues/${venueSlug}`}
                  className="text-rojo hover:underline text-sm font-bold whitespace-nowrap"
                >
                  Ver todos →
                </Link>
              )}
            </div>
            {relatedLimit.length > 0 ? (
              <div className="mt-4">
                <EventList events={relatedLimit} color={color} />
              </div>
            ) : (
              <p className="text-hueso-dim mt-4">
                Por ahora, este es el único chivo en {venueName}.
              </p>
            )}
          </section>
        )}
      </section>

      <Footer />
    </main>
  );
}