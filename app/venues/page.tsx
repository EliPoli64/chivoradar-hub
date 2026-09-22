import Link from "next/link";
import { getEventsSafe } from "@/lib/events";
import { groupEventsByVenue } from "@/lib/venues";
import { PROVINCES, PROVINCE_BY_SLUG, resolveProvinceSlug } from "@/lib/cr-provinces";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VenueCard from "@/components/venues/VenueCard";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ region?: string }>;
}

export default async function VenuesPage({ searchParams }: Props) {
  const { region } = await searchParams;
  const slug = resolveProvinceSlug(region);
  const provinceName = slug ? PROVINCE_BY_SLUG[slug]?.name : null;

  const events = await getEventsSafe();
  const venues = groupEventsByVenue(events)
    .filter((v) => !provinceName || v.province === provinceName)
    .sort((a, b) => b.events.length - a.events.length);

  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white">
      <Navbar />

      <section className="pt-28 pb-16 max-w-7xl mx-auto px-5 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-hueso-dim">
          Lugares
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-hueso mt-2">
          {provinceName ? `Lugares en ${provinceName}` : "¿Dónde suena?"}
        </h1>
        <p className="text-hueso-dim mt-2">
          {venues.length} {venues.length === 1 ? "lugar" : "lugares"} en el radar.
        </p>

        {/* filtro por provincia */}
        <div className="flex gap-2 mt-6 flex-wrap">
          <Link
            href="/venues"
            className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
              !provinceName
                ? "bg-rojo text-white border-rojo"
                : "border-hueso/15 text-hueso-dim hover:text-hueso hover:border-hueso/40"
            }`}
          >
            Todos
          </Link>
          {PROVINCES.map((p) => {
            const s = p.name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/\s+/g, "-");
            const active = slug === s;
            return (
              <Link
                key={p.name}
                href={`/venues?region=${s}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95"
                style={
                  active
                    ? { background: p.color, borderColor: p.color, color: "#16120d" }
                    : { borderColor: "rgba(245,239,228,0.15)", color: "#f5efe4" }
                }
              >
                <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                {p.name}
              </Link>
            );
          })}
        </div>

        {venues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {venues.map((venue) => (
              <VenueCard key={venue.key} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="mt-8 border-2 border-dashed border-hueso/10 rounded-2xl p-10 text-center bg-panel/30">
            <p className="text-hueso-dim">
              Aún no hay lugares con chivos en {provinceName}. Probá otra provincia.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}