import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';

interface EventProps {
  title: string;
  artist: string;
  venue: string;
  date: string;
  image: string;
  genre: string;
}

export default function EventCard({ title, artist, venue, date, image, genre }: EventProps) {
  return (
    <div className="group bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-neon-green/50 transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={image} 
          alt={artist} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-neon-green text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
          {genre}
        </span>
      </div>
      
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-bold leading-tight group-hover:text-neon-green transition-colors">{title}</h3>
        
        <div className="space-y-1 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-neon-green" />
            <span>{venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-neon-green" />
            <span>{date}</span>
          </div>
        </div>
        
        <button className="w-full py-2 mt-2 bg-zinc-800 group-hover:bg-neon-green group-hover:text-black rounded-lg text-sm font-bold transition-all">
          Conseguir Entradas
        </button>
      </div>
    </div>
  );
}