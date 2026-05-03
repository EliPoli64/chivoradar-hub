import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LiveMap from "@/components/LiveMap";
import EventGrid from "@/components/events/EventGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-neon-green selection:text-black">
      <Navbar />
      
      {/* hero */}
      <section className="px-6 pt-24 pb-12 md:pt-32">
        <Hero />
      </section>

      {/* mapa interactivo */}
      <section className="px-4 py-8">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-2 overflow-hidden">
          <LiveMap />
        </div>
      </section>

      {/* grid de eventos recomendados */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold tracking-tighter">Cerca Tuyo</h2>
          <button className="text-neon-green hover:underline">Ver todos en San José →</button>
        </div>
        <EventGrid />
      </section>

      <Footer />
    </main>
  );
}