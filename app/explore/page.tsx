import { getEventsSafe, getProvinceEventsSafe } from "@/lib/events";
import { PROVINCE_BY_SLUG, resolveProvinceSlug } from "@/lib/cr-provinces";
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
  const events = slug ? await getProvinceEventsSafe(slug) : await getEventsSafe();
  const provinceName = slug ? PROVINCE_BY_SLUG[slug]?.name : null;

  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white">
      <Navbar />

      <section className="pt-28 pb-16 max-w-7xl mx-auto px-5 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-hueso-dim">
          Explorar
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-hueso mt-2">
          {provinceName ? provinceName : "¿A dónde esta noche?"}
        </h1>
        <p className="text-hueso-dim mt-2">
          {provinceName
            ? `Todos los chivos del radar en ${provinceName}.`
            : "Del garaje al estadio, de San José a Limón."}
        </p>

        <ExploreView events={events} region={slug} />
      </section>

      <Footer />
    </main>
  );
}