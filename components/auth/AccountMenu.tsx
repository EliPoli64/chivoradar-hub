"use client";
import { useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

export interface UsuarioNav {
  nombre?: string | null;
  email: string;
  fotoUrl?: string | null;
}

export default function AccountMenu({ usuario }: { usuario: UsuarioNav | null }) {
  const [open, setOpen] = useState(false);

  if (!usuario) {
    return (
      <div className="hidden md:flex items-center gap-5">
        <Link
          href="/login"
          className="text-sm font-medium text-hueso-dim hover:text-hueso transition-colors"
        >
          Ingresar
        </Link>
        <Link
          href="/registro"
          className="px-4 py-2 border border-hueso/20 text-hueso rounded-full hover:border-rojo hover:text-rojo transition-colors text-sm font-bold"
        >
          Crear cuenta
        </Link>
      </div>
    );
  }

  const inicial = (usuario.nombre?.trim()?.[0] || usuario.email[0] || "?").toUpperCase();

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Cuenta"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-hueso/15 p-0.5 pr-2 hover:border-rojo transition-colors"
      >
        {usuario.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={usuario.fotoUrl}
            alt=""
            className="w-7 h-7 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="w-7 h-7 rounded-full bg-rojo text-white text-xs font-bold flex items-center justify-center">
            {inicial}
          </span>
        )}
        <span className="text-sm text-hueso max-w-[8rem] truncate">
          {usuario.nombre?.split(" ")[0] || "Cuenta"}
        </span>
      </button>

      {open && (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[1000] cursor-default"
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-hueso/10 bg-panel p-2 shadow-2xl z-[1001]">
            <div className="px-3 py-2 border-b border-hueso/10 mb-1">
              <p className="text-sm text-hueso truncate">
                {usuario.nombre || "Tu cuenta"}
              </p>
              <p className="text-xs text-hueso-dim truncate">{usuario.email}</p>
            </div>
            <Link
              href="/cuenta"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-hueso-dim hover:text-hueso hover:bg-panel-soft transition-colors"
            >
              Mi cuenta y avisos
            </Link>
            <LogoutButton
              onDone={() => setOpen(false)}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm text-rojo hover:bg-rojo/10 transition-colors"
            />
          </div>
        </>
      )}
    </div>
  );
}
