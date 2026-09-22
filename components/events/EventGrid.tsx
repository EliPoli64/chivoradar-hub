"use client";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";

interface Evento {
  id: string;
  titulo: string;
  artista: string;
  venue: string;
  date: string;
  categoria: string;
  urlImagen: string;
  link?: string;
  venueObj?: { coordinates?: number[] | null };
}

export default function EventGrid() {
  const [gigs, setGigs] = useState<Evento[]>([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch("/api/fetch");
        const data = await response.json();
        if (Array.isArray(data)) {
          setGigs(data);
        }
      } catch (error) {
        console.error("Error fetching eventos:", error);
      }
    };
    fetchEventos();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {gigs.slice(0, 12).map((gig, i) => (
        <div
          key={gig.id}
          className="anim-rise"
          style={{ animationDelay: `${Math.min(i * 70, 420)}ms` }}
        >
          <EventCard
            title={gig.titulo}
            artist={gig.artista}
            venue={gig.venue}
            date={gig.date}
            genre={gig.categoria}
            image={gig.urlImagen}
            coordinates={gig.venueObj?.coordinates}
            link={gig.link}
          />
        </div>
      ))}

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-hueso/10 rounded-2xl p-8 text-center bg-panel/30">
        <p className="text-hueso-dim mb-4">¿Su chivo no está en el radar?</p>
        <a
          href="/submit"
          className="text-rojo font-bold hover:underline transition-colors"
        >
          + Agregá tu Chivo
        </a>
      </div>
    </div>
  );
}