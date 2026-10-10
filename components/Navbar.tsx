import NavbarClient from "@/components/NavbarClient";
import { getSessionUsuario } from "@/lib/auth/session";

export default async function Navbar() {
  const usuario = await getSessionUsuario();
  return (
    <NavbarClient
      usuario={
        usuario
          ? {
              nombre: usuario.nombre ?? null,
              email: usuario.email,
              fotoUrl: usuario.fotoUrl ?? null,
            }
          : null
      }
    />
  );
}
