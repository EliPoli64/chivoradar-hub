import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteTransition from "@/components/RouteTransition";
import { Music, Users, Sparkles } from "lucide-react";

export const metadata = {
  title: "Nuestra Misión | Chivo Radar",
  description:
    "Acercar a la gente a la música en vivo en Costa Rica e incentivar la interacción social a través de los shows.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(230,50,63,0.16),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-rojo/10 blur-3xl" />
      <div className="pointer-events-none absolute top-40 left-[-12%] h-80 w-80 rounded-full bg-dorado/10 blur-3xl" />

      <Navbar />
      <RouteTransition>
        <section className="relative pt-28 pb-20 px-5">
          <div className="max-w-4xl mx-auto">
            <header className="mb-12 text-center anim-rise">
              <div className="relative inline-flex mb- items-center gap-2 rounded-full border border-hueso/20 px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-hueso overflow-hidden">
                <span className="absolute inset-0 bg-[radial-gradient(circle,rgba(230,50,63,0.25),transparent_70%)]" />
                <Sparkles size={14} className="relative text-dorado animate-pulse" />
                <span className="relative">El chivo es salir</span>
              </div>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl mt-6 leading-[0.95]">
                Donde el ritmo
                <span className="block h-20 bg-gradient-to-r from-rojo via-dorado to-rojo bg-clip-text text-transparent">
                  junta a todos
                </span>
              </h1>
              <p className="text-hueso-dim mt-5 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
                Encendemos el radar para que más gente se encuentre entre tarimas,
                luces y sudor, listo para el siguiente tema.
              </p>
            </header>

            <div className="grid gap-6 md:grid-cols-3">
              <article className="group relative overflow-hidden rounded-2xl border border-hueso/12 bg-gradient-to-b from-white/8 to-white/3 p-6 shadow-[0_40px_80px_-60px_rgba(230,50,63,0.9)] transition-transform duration-300 hover:-translate-y-1 anim-rise">
                <div className="pointer-events-none absolute -top-16 right-[-20%] h-40 w-40 rounded-full bg-rojo/15 blur-3xl transition-opacity group-hover:opacity-80" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rojo/20 text-rojo">
                    <Music size={22} />
                  </div>
                  <h2 className="font-display text-2xl mt-5">La escena al alcance</h2>
                  <p className="text-hueso-dim mt-3 leading-relaxed">
                    Costa Rica vibra con bandas nuevas, garajes, salas y bares todos
                    los días. Chivo Radar junta esos shows en un solo mapa para que
                    encontrarlos sea cuestión de un vistazo.
                  </p>
                </div>
              </article>

              <article className="group relative overflow-hidden rounded-2xl border border-hueso/12 bg-gradient-to-b from-white/8 to-white/3 p-6 shadow-[0_40px_80px_-60px_rgba(245,179,1,0.7)] transition-transform duration-300 hover:-translate-y-1 anim-rise [animation-delay:80ms]">
                <div className="pointer-events-none absolute -top-16 right-[-20%] h-40 w-40 rounded-full bg-dorado/15 blur-3xl transition-opacity group-hover:opacity-80" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dorado/20 text-dorado">
                    <Users size={22} />
                  </div>
                  <h2 className="font-display text-2xl mt-5">Gente que se encuentra</h2>
                  <p className="text-hueso-dim mt-3 leading-relaxed">
                    Un cartel basta para romper el hielo. Queremos incentivar la
                    interacción social acercando a más gente a esos momentos donde
                    la conversación empieza sola.
                  </p>
                </div>
              </article>

              <article className="group relative overflow-hidden rounded-2xl border border-hueso/12 bg-gradient-to-b from-white/8 to-white/3 p-6 shadow-[0_40px_80px_-60px_rgba(52,211,153,0.7)] transition-transform duration-300 hover:-translate-y-1 anim-rise [animation-delay:160ms]">
                <div className="pointer-events-none absolute -top-16 right-[-20%] h-40 w-40 rounded-full bg-caribe/15 blur-3xl transition-opacity group-hover:opacity-80" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-caribe/20 text-caribe">
                    <Sparkles size={22} />
                  </div>
                  <h2 className="font-display text-2xl mt-5">Impulsando la escena</h2>
                  <p className="text-hueso-dim mt-3 leading-relaxed">
                    Cada show que llega a más personas ayuda a que la escena siga
                    viva. Apoyamos a bandas, locales y promotores para que haya un
                    motivo más para salir esta semana.
                  </p>
                </div>
              </article>
            </div>

            <div className="relative mt-12 overflow-hidden rounded-3xl border border-hueso/12 bg-gradient-to-r from-rojo/25 via-cafetal to-dorado/20 p-8 sm:p-10 text-center anim-rise [animation-delay:240ms]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,239,228,0.12),transparent_55%)]" />
              <div className="relative">
                <p className="font-display text-2xl sm:text-4xl">
                  Sale. Conoce. Quédate por otro tema.
                </p>
                <p className="text-hueso-dim mt-3 max-w-2xl mx-auto">
                  Esa es la energía que queremos llevar por todo Costa Rica, un show
                  a la vez.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 anim-rise [animation-delay:320ms]">
              <section className="rounded-2xl border border-hueso/12 bg-white/4 p-6 sm:p-8">
                <h2 className="font-display text-2xl sm:text-3xl">Misión</h2>
                <p className="text-hueso-dim mt-4 leading-relaxed">
                  Traer a la gente junta a través de la música en vivo en Costa Rica
                  e incentivar la interacción social para crear más momentos juntos.
                </p>
              </section>

              <section className="rounded-2xl border border-hueso/12 bg-white/4 p-6 sm:p-8">
                <h2 className="font-display text-2xl sm:text-3xl">Visión</h2>
                <p className="text-hueso-dim mt-4 leading-relaxed">
                  Que salir a un show sea lo más fácil que hay en Costa Rica. Un
                  país donde nadie se quede en casa por no saber qué hay y donde cada
                  noche puede empezar una nueva historia.
                </p>
              </section>
            </div>
          </div>
        </section>
      </RouteTransition>
      <Footer />
    </main>
  );
}
