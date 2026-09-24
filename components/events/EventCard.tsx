"use client";
import Image from "next/image";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { PROVINCES, provinceForPoint } from "@/lib/cr-provinces";
import { isSinCategoria } from "@/lib/venues";

interface EventProps {
  title: string;
  artist: string;
  venue: string;
  date: string;
  image: string;
  genre: string;
  coordinates?: number[] | null;
  link?: string;
}

export default function EventCard({
  title,
  artist,
  venue,
  date,
  image,
  genre,
  coordinates,
  link,
}: EventProps) {
  const color =
    coordinates && coordinates.length === 2
      ? PROVINCES.find((p) => p.name === provinceForPoint(coordinates[0], coordinates[1]))
          ?.color || "#E6323F"
      : "#E6323F";

  return (
    <article className="group bg-panel border border-hueso/10 rounded-2xl overflow-hidden hover:border-hueso/25 transition-colors">
      <div className="relative h-48 w-full overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={artist}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-cafetal flex items-center justify-center">
            <span className="text-hueso-dim text-sm">Sin imagen</span>
          </div>
        )}
        {!isSinCategoria(genre) && (
          <span
            className="absolute top-4 left-4 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider text-cafetal"
            style={{ background: color }}
          >
            {genre}
          </span>
        )}
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-xl font-bold leading-tight text-hueso group-hover:text-rojo transition-colors">
          {title}
        </h3>

        <div className="space-y-1.5 text-sm text-hueso-dim">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0" style={{ color }} />
            <span>{venue}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <Calendar size={14} className="shrink-0" style={{ color }} />
            <span>{date}</span>
          </div>
        </div>

        <a
          href={link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 mt-2 bg-cafetal group-hover:bg-rojo group-hover:text-white rounded-lg text-sm font-bold text-hueso transition-colors border border-hueso/10 group-hover:border-rojo"
        >
          <Ticket size={14} />
          Conseguir Entradas
        </a>
      </div>
    </article>
  );
}