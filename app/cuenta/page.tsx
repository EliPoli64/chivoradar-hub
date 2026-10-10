import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LogoutButton from "@/components/auth/LogoutButton";
import FollowButton from "@/components/follows/FollowButton";
import { requireSessionUsuario } from "@/lib/auth/session";
import { venuesSeguidos } from "@/db/follows";

export const dynamic = "force-dynamic";

export default async function CuentaPage() {
  const usuario = await requireSessionUsuario();
  const prefs = usuario.preferencias;
  const seguimientos = await venuesSeguidos(usuario._id);

  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white">
      <Navbar />

      <section className="pt-28 pb-20 px-5 max-w-2xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-hueso-dim">
          Tu cuenta
        </p>
        <h1 className="font-display text-4xl text-hueso mt-2 mb-8">
          {usuario.nombre || "Tu perfil"}
        </h1>

        <div className="rounded-2xl border border-hueso/10 bg-panel p-6">
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-hueso-dim">
                Nombre
              </dt>
              <dd className="text-hueso mt-1">{usuario.nombre || "Sin nombre"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-hueso-dim">
                Correo
              </dt>
              <dd className="text-hueso mt-1">{usuario.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-hueso-dim">
                Avisos de chivos
              </dt>
              <dd className="text-hueso mt-1">
                {prefs?.notificacionesActivas === false ? "Apagados" : "Activados"} ·{" "}
                {prefs?.hora ?? 8}:00 ({prefs?.zonaHoraria ?? "America/Costa_Rica"})
              </dd>
            </div>
          </dl>

          <div className="mt-6 pt-6 border-t border-hueso/10">
            <LogoutButton className="text-sm text-rojo font-bold hover:underline disabled:opacity-60" />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-hueso/10 bg-panel p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-display text-2xl text-hueso">Lugares que seguís</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-hueso-dim">
              {seguimientos.length === 1 ? "1 lugar" : `${seguimientos.length} lugares`}
            </span>
          </div>

          {seguimientos.length === 0 ? (
            <p className="text-sm text-hueso-dim leading-relaxed">
              Todavía no seguís ningún lugar. Entrá a un lugar con chivos y tocá{" "}
              <span className="text-hueso font-bold">Seguir este lugar</span> para
              recibir el aviso cuando aparezca uno nuevo.
            </p>
          ) : (
            <ul className="divide-y divide-hueso/10">
              {seguimientos.map((s) => (
                <li
                  key={s.venueId}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <Link
                    href={`/venues/${s.slug ?? ""}`}
                    className="text-hueso font-bold hover:text-rojo transition-colors"
                  >
                    {s.nombre || s.slug || "Lugar"}
                  </Link>
                  <FollowButton
                    venueId={s.venueId}
                    venueSlug={s.slug}
                    iniciarSiguiendo
                    autenticado
                    compacto
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-hueso/10 bg-panel-soft p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-hueso-dim">
            Próximamente
          </p>
          <p className="text-sm text-hueso-dim mt-3 leading-relaxed">
            Vas a poder elegir a qué hora querés que te avisemos por correo cuando
            aparezca un chivo nuevo en tus lugares.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
