import Link from "next/link";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-[1001] border-b border-hueso/10 bg-cafetal/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="carreta-mark w-8 h-8 shadow-[0_0_14px_rgba(230,50,63,0.4)]"
            aria-hidden="true"
          />
          <span className="font-display text-lg tracking-tight text-hueso">
            CHIVO<span className="text-rojo">RADAR</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-hueso-dim">
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

        <a
          href="#mapa"
          aria-label="Buscar en el mapa"
          className="md:hidden text-hueso p-1"
        >
          <Search size={22} />
        </a>
      </div>
    </nav>
  );
}