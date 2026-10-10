import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { getSessionUsuario } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const usuario = await getSessionUsuario();
  if (usuario) redirect("/cuenta");

  return (
    <main className="min-h-screen bg-cafetal text-hueso selection:bg-rojo selection:text-white">
      <Navbar />
      <section className="pt-28 pb-20 px-5 max-w-md mx-auto">
        <AuthForm modo="login" />
      </section>
      <Footer />
    </main>
  );
}
