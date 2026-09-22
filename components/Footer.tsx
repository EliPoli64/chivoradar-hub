import Link from "next/link";
import { Mail } from "lucide-react";
import { PROVINCES } from "@/lib/cr-provinces";
import Logo from "@/components/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cafetal border-t border-hueso/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Logo size={32} />
              <span className="font-display text-xl tracking-tight text-hueso">
                CHIVO<span className="text-rojo">RADAR</span>
              </span>
            </Link>
            <p className="text-hueso-dim text-sm leading-relaxed">
              El radar de la música en vivo en Costa Rica. Del garaje al estadio,
              de San José a Limón.
            </p>
          </div>

          {/* por provincia */}
          <div>
            <h4 className="text-hueso font-bold mb-4 uppercase text-xs tracking-widest">
              Provincias
            </h4>
            <ul className="space-y-2.5 text-sm text-hueso-dim">
              {PROVINCES.map((p) => (
                <li key={p.name}>
                  <Link
                    href={`/explore?region=${p.name
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-2 hover:text-hueso transition-colors"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: p.color }}
                    />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* plataforma */}
          <div>
            <h4 className="text-hueso font-bold mb-4 uppercase text-xs tracking-widest">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-sm text-hueso-dim">
              <li>
                <Link href="/submit" className="hover:text-hueso transition-colors">
                  Añada su Chivo
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-hueso transition-colors">
                  Lugares
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-hueso transition-colors">
                  API de Desarrollador
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-hueso transition-colors">
                  Nuestra Misión
                </Link>
              </li>
            </ul>
          </div>

          {/* conectar */}
          <div>
            <h4 className="text-hueso font-bold mb-4 uppercase text-xs tracking-widest">
              Conectar
            </h4>
            <div className="flex gap-4 mb-6">
              <Link
                href="#"
                className="text-hueso-dim hover:text-rojo transition-colors"
              >
                <Mail size={20} />
              </Link>
            </div>
            <p className="font-mono text-[10px] text-hueso-dim uppercase tracking-widest">
              Construido por ticos, para ticos.
            </p>
          </div>
        </div>

        {/* barra inferior */}
        <div className="pt-8 border-t border-hueso/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-hueso-dim text-xs">
            © {currentYear} Chivo Radar. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-hueso-dim">
            <Link href="/terms" className="hover:text-hueso">
              Términos
            </Link>
            <Link href="/privacy" className="hover:text-hueso">
              Privacidad
            </Link>
            <span className="flex items-center gap-1">
              MADE IN TIQUICIA
              <span className="text-rojo">🇨🇷</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}