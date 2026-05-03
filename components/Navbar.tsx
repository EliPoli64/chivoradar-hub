import Link from 'next/link';
import { MapPin, Search, Music } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="bg-neon-green p-1 rounded">
            <Music size={20} className="text-black" />
          </div>
          CHIVO <span className="text-neon-green">RADAR</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/explore" className="hover:text-neon-green transition-colors">Explorar</Link>
          <Link href="/venues" className="hover:text-neon-green transition-colors">Lugares</Link>
          <Link href="/submit" className="px-4 py-2 bg-white text-black rounded-full hover:bg-neon-green transition-all">Posteá tu Chivo</Link>
        </div>

        <button className="md:hidden text-white"><Search size={24} /></button>
      </div>
    </nav>
  );
}