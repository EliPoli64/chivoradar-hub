import {
  getCategoriesSafe,
  getEventsSafe,
  getProvinceEventsSafe,
} from "@/lib/events";
import {
  chivosPorProvincia,
  groupEventsByVenue,
  type GigEvent,
} from "@/lib/venues";
import { resolveProvinceSlug } from "@/lib/cr-provinces";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExploreView from "@/components/explore/ExploreView";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ region?: string }>;
}

export default async function ExplorePage({ searchParams }: Props) {
  const { region } = await searchParams;
  const slug = resolveProvinceSlug(region);

  // El conteo por provincia siempre es nacional, para que la silueta muestre
  // dónde más hay chivos y no solo lo ya seleccionado. Sale de la misma
  // entrada cacheada que la lista.
  const [events, categories, country] = await Promise.all([
    slug ? getProvinceEventsSafe(slug) : getEventsSafe(),
    getCategoriesSafe(),
    slug ? getEventsSafe() : Promise.resolve<GigEvent[]>([]),
  ]);

  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-5 pt-28 pb-16 md:px-6 lg:px-8">
        <ExploreView
          events={events}
          categories={categories}
          region={slug}
          provinceCounts={chivosPorProvincia(
            groupEventsByVenue(slug ? country : events),
          )}
        />
      </section>

      <Footer />
    </main>
  );
}
