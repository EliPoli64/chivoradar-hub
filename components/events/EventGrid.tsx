"use client";
import { useEffect } from "react";
import EventCard from "./EventCard";

interface Evento {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  genre: string;
  image: string;
}

export default function EventGrid() {
  var gigs: Evento[] = [];

  useEffect(() => {
    const fetchEventos = async () => { 
      try {
        const response = await fetch('/api/fetch');
        gigs = await response.json();
        console.log('Fetched data:', gigs);
        
      } catch (error) {
        console.error('Error fetching eventos:', error);
      }
    }
    fetchEventos();
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {gigs.map((gig) => (
        <EventCard
          key={gig.id}
          title={gig.title}
          artist={gig.artist}
          venue={gig.venue}
          date={gig.date}
          genre={gig.genre}
          image={gig.image}
        />
      ))}

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-zinc-900/30">
        <p className="text-zinc-500 mb-4">¿Su chivo no está en el radar?</p>
        <button className="text-neon-green font-bold hover:scale-105 transition-transform">
          + Agregá tu Chivo
        </button>
      </div>
    </div>
  );
}