import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteTransition from "@/components/RouteTransition";
import { getSessionUsuario } from "@/lib/auth/session";
import SubmitForm from "@/components/submit/SubmitForm";

export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  const usuario = await getSessionUsuario();
  if (!usuario) {
    redirect("/login?next=/submit");
  }

  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white">
      <Navbar />
      <RouteTransition>
        <section className="pt-28 pb-20 px-5 max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl">Agregá tu chivo</h1>
            <p className="text-hueso-dim mt-2">
              Enviá un evento para que lo revise el equipo. Solo aceptamos eventos para
              lugares ya existentes en el radar.
            </p>
          </header>
          <SubmitForm />
        </section>
      </RouteTransition>
      <Footer />
    </main>
  );
}
