import { Search, Navigation } from 'lucide-react';

export default function Hero() {
  return (
    <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
        Encuentre su <span className="text-neon-green underline decoration-4">próxima velada.</span>
      </h1>
      <p className="text-zinc-400 text-lg md:text-xl max-w-2xl">
        El mejor mapa para música en vivo en Costa Rica. Desde bandas de garaje subterráneas hasta tours de estadio.
      </p>
      
      <div className="flex w-full max-w-md items-center bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-neon-glow">
        <div className="pl-4 text-zinc-500"><Search size={20} /></div>
        <input 
          type="text" 
          placeholder="Buscar por artista, género, o lugar..." 
          className="bg-transparent border-none outline-none w-full px-4 text-white placeholder:text-zinc-600"
        />
        <button className="bg-white text-black p-3 rounded-xl hover:bg-neon-green transition-colors">
          <Navigation size={20} />
        </button>
      </div>
    </div>
  );
}