"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import Logo from "@/components/Logo";
import AccountMenu, { type UsuarioNav } from "@/components/auth/AccountMenu";
import LogoutButton from "@/components/auth/LogoutButton";

export default function NavbarClient({ usuario }: { usuario: UsuarioNav | null }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-[1001] border-b border-hueso/10 bg-cafetal/80 backdrop-blur-md">
      <div className="relative max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={30} className="drop-shadow-[0_0_10px_rgba(230,50,63,0.4)]" />
          <span className="font-display text-lg tracking-tight text-hueso">
            CHIVO<span className="text-rojo">RADAR</span>
          </span>
        </Link>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-medium text-hueso-dim">
          <Link href="/explore" className="hover:text-hueso transition-colors">
            Explorar
          </Link>
          <Link href="/venues" className="hover:text-hueso transition-colors">
            Lugares
          </Link>
          <Link
            href="/submit"
            className="px-4 py-2 bg-rojo text-white rounded-full hover:brightness-110 transition-[filter] font-bold text-sm"
          >
            Posteá tu Chivo
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <a
            href="#mapa"
            aria-label="Buscar en el mapa"
            className="hidden md:flex text-hueso p-1"
          >
            <Search size={22} />
          </a>
          <AccountMenu usuario={usuario} />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
            className="md:hidden text-hueso p-1"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* mobile overlay */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bg-cafetal/95 backdrop-blur-xl border-b border-hueso/10 transition-all duration-300 overflow-hidden ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-5 py-4 space-y-3">
          <Link
            href="/explore"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-hueso-dim hover:text-hueso transition-colors py-2"
          >
            Explorar
          </Link>
          <Link
            href="/venues"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-hueso-dim hover:text-hueso transition-colors py-2"
          >
            Lugares
          </Link>
          <a
            href="#mapa"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-sm font-medium text-hueso-dim hover:text-hueso transition-colors py-2"
          >
            <Search size={18} />
            Buscar en el mapa
          </a>
          <Link
            href="/submit"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 bg-rojo text-white rounded-full text-center font-bold text-sm hover:brightness-110 transition-[filter]"
          >
            Posteá tu Chivo
          </Link>

          <div className="pt-3 border-t border-hueso/10 space-y-2">
            {usuario ? (
              <>
                <p className="text-xs text-hueso-dim truncate px-1">{usuario.email}</p>
                <Link
                  href="/cuenta"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 border border-hueso/15 text-hueso rounded-full text-center font-bold text-sm hover:border-rojo transition-colors"
                >
                  Mi cuenta
                </Link>
                <LogoutButton
                  onDone={() => setOpen(false)}
                  className="block w-full px-4 py-2.5 text-rojo rounded-full text-center font-bold text-sm hover:bg-rojo/10 transition-colors"
                />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-hueso-dim rounded-full text-center font-bold text-sm hover:text-hueso transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 border border-hueso/15 text-hueso rounded-full text-center font-bold text-sm hover:border-rojo transition-colors"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
