import Link from "next/link";
import { getEventsSafe } from "@/lib/events";
import { groupEventsByVenue, chivosPorProvincia } from "@/lib/venues";
import { PROVINCE_BY_SLUG, resolveProvinceSlug } from "@/lib/cr-provinces";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProvinceSignal from "@/components/ProvinceSignal";
import VenueCard from "@/components/venues/VenueCard";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ region?: string }>;
}

export default async function VenuesPage({ searchParams }: Props) {
  const { region } = await searchParams;
  const slug = resolveProvinceSlug(region);
  const province = slug ? PROVINCE_BY_SLUG[slug] : null;

  const events = await getEventsSafe();
  const all = groupEventsByVenue(events);

  // La silueta siempre muestra el país completo: desde una provincia se ve
  // dónde más hay señal, no solo lo que ya está seleccionado.
  const counts = chivosPorProvincia(all);
  const venues = slug ? all.filter((v) => v.province === province?.name) : all;

  const totalChivos = venues.reduce((n, v) => n + v.events.length, 0);

  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-5 pt-28 pb-16 md:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:gap-12">
          {/* control de región */}
          <div className="lg:w-[248px] lg:shrink-0">
            <h1 className="font-display text-4xl leading-[0.95] text-hueso md:text-5xl">
              {province ? province.name : "¿Dónde suena?"}
            </h1>
            <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-hueso-dim">
              Los lugares con más chivos primero.
            </p>

            <div className="mt-7 lg:sticky lg:top-24">
              <ProvinceSignal
                counts={counts}
                active={province?.name ?? null}
                hrefFor={(s) =>
                  s === slug ? "/venues" : `/venues?region=${s}`
                }
              />
              <p className="mt-3 text-sm text-hueso-dim">
                <span className="text-hueso">{venues.length}</span>{" "}
                {venues.length === 1 ? "lugar" : "lugares"} en el radar
              </p>
            </div>
          </div>

          {/* catálogo */}
          <div className="mt-10 min-w-0 flex-1 lg:mt-0">
            {venues.length > 0 ? (
              <div className="divide-y divide-hueso/10 border-t border-hueso/10">
                {venues.map((venue) => (
                  <VenueCard key={venue.key} venue={venue} />
                ))}
              </div>
            ) : (
              <div className="border-t border-hueso/10 pt-6">
                <p className="max-w-[46ch] text-hueso">
                  No hay lugares con chivos en{" "}
                  {province?.name ?? "esta provincia"} todavía.
                </p>
                <p className="mt-2 max-w-[46ch] text-sm text-hueso-dim">
                  El radar se actualiza a diario. Mientras tanto, mirá el resto
                  del país.
                </p>
                <Link
                  href="/venues"
                  className="mt-4 inline-block text-sm font-bold text-rojo hover:underline"
                >
                  Ver los {all.length} lugares del país
                </Link>
              </div>
            )}

            {venues.length > 0 && totalChivos > 0 && (
              <p className="mt-8 border-t border-hueso/10 pt-4 text-sm text-hueso-dim">
                <span className="text-hueso">{totalChivos}</span>{" "}
                {totalChivos === 1 ? "chivo" : "chivos"} en agenda
                {province ? ` en ${province.name}` : " en todo el país"}.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
