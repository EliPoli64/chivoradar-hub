import { getCategoriesSafe } from "@/lib/events";
import Navbar from "@/components/Navbar";
import LiveMap from "@/components/LiveMap";
import EventGrid from "@/components/events/EventGrid";
import Footer from "@/components/Footer";

export default async function Home() {
  const categories = await getCategoriesSafe();
  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white">
      <Navbar />

      {/* mapa como protagonista */}
      <section id="mapa" className="h-[calc(100dvh-64px)] md:h-[86vh] min-h-[520px]">
        <LiveMap initialCategories={categories} />
      </section>

      {/* chivos recomendados */}
      <section className="px-5 md:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8 gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-hueso-dim mb-2">
              Próximamente
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-hueso">Cerca Tuyo</h2>
          </div>
          <button className="text-rojo hover:underline text-sm font-bold whitespace-nowrap">
            Ver todos en San José →
          </button>
        </div>
        <EventGrid />
      </section>

      <Footer />
    </main>
  );
}