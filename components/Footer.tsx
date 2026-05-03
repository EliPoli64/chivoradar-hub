import Link from 'next/link';
import { Music, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter mb-4">
              <div className="bg-neon-green p-1 rounded">
                <Music size={20} className="text-white" />
              </div>
              <span className="text-neon-green">CHIVO RADAR</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              El mejor mapa para música en vivo en Costa Rica. Desde bandas de garaje subterráneas hasta tours de estadio.
            </p>
          </div>

          {/* por provincia */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Provincias</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/explore?region=sanjose" className="hover:text-neon-green transition-colors">San José</Link></li>
              <li><Link href="/explore?region=heredia" className="hover:text-neon-green transition-colors">Heredia</Link></li>
              <li><Link href="/explore?region=alajuela" className="hover:text-neon-green transition-colors">Alajuela</Link></li>
              <li><Link href="/explore?region=guanacaste" className="hover:text-neon-green transition-colors">Guanacaste</Link></li>
              <li><Link href="/explore?region=puntarenas" className="hover:text-neon-green transition-colors">Puntarenas</Link></li>
              <li><Link href="/explore?region=cartago" className="hover:text-neon-green transition-colors">Cartago</Link></li>
              <li><Link href="/explore?region=limon" className="hover:text-neon-green transition-colors">Limón</Link></li>
            </ul>
          </div>

          {/* App Column */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Plataforma</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/submit" className="hover:text-neon-green transition-colors">Añada su Chivo</Link></li>
              <li><Link href="/lugares" className="hover:text-neon-green transition-colors">Lugares Patrocinados</Link></li>
              <li><Link href="/api" className="hover:text-neon-green transition-colors">API de Desarrollador</Link></li>
              <li><Link href="/about" className="hover:text-neon-green transition-colors">Nuestra Misión</Link></li>
            </ul>
          </div>

          {/* Newsletter / Social Column */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Conectar</h4>
            <div className="flex gap-4 mb-6">
              <Link href="#" className="text-zinc-400 hover:text-neon-green transition-colors"><Mail size={20} /></Link>
            </div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              Construido por ticos, para ticos.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs">
            © {currentYear} Chivo Radar. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-zinc-600">
            <Link href="/terms" className="hover:text-zinc-400">Términos</Link>
            <Link href="/privacy" className="hover:text-zinc-400">Privacidad</Link>
            <span className="flex items-center gap-1">
              MADE IN TIQUICIA<span className="text-red-500">🇨🇷</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}