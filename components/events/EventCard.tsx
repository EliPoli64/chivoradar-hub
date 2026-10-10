"use client";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { PROVINCES, provinceForPoint } from "@/lib/cr-provinces";
import { isSinCategoria } from "@/lib/venues";

interface EventProps {
  id: string;
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
  id,
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
    // Altura fija: dimensionada para títulos de hasta 3 líneas (3 × 25px a
    // text-xl/leading-tight en el h3). Con el contenido en flex-col y el botón
    // en mt-auto, todas las cards de la grilla quedan idénticas.
    <article className="group flex h-[26rem] flex-col bg-panel border border-hueso/10 rounded-2xl overflow-hidden hover:border-hueso/25 transition-colors">
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

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/eventos/${id}`} className="group-hover:text-rojo transition-colors">
          {/* 3 líneas fijas: los títulos largos se cortan con puntos suspensivos */}
          <h3 className="line-clamp-3 h-[4.7rem] overflow-hidden text-xl font-bold leading-tight text-hueso group-hover:text-rojo transition-colors">
            {title}
          </h3>
        </Link>

        <div className="mt-3 space-y-1.5 text-sm text-hueso-dim">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0" style={{ color }} />
            <span className="truncate">{venue}</span>
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
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg border border-hueso/10 bg-cafetal py-2.5 text-sm font-bold text-hueso transition-colors group-hover:border-rojo group-hover:bg-rojo group-hover:text-white"
        >
          <Ticket size={14} />
          Conseguir Entradas
        </a>
      </div>
    </article>
  );
}