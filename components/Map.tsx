"use client";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

const customIcon = new L.Icon({
  iconUrl: "https://www.freepnglogos.com/uploads/pin-png/map-pin-png-apex-dance-studio-16.png",
  iconRetinaUrl: "https://www.freepnglogos.com/uploads/pin-png/map-pin-png-apex-dance-studio-16.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function MapaChivos({ position, zoom }: any) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("api/fetch");
        const json = await response.json();
        setEvents(json.data || []);
      } catch (err) {
        console.error("Error loading map data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <MapContainer 
      center={[9.800090306914088, -84.03119843292991]} 
      zoom={8} 
      scrollWheelZoom={true} 
      className="w-full h-full"
      style={{ background: "#555561" }}
    >
      {/* Dark Mode Tiles - CartoDB Voyager Dark is great for "Radar" themes */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Dynamic Event Markers */}
      {events.map((evento) => (
        <Marker 
          key={evento.id} 
          position={[evento.venueObj?.coordenadas[1], evento.venueObj?.coordenadas[0]]} 
          icon={customIcon}
        >
          <Popup>
            <div className="p-1">
              <p className="text-xs font-black uppercase text-neon-green mb-1">{evento.artista}</p>
              <h4 className="font-bold text-sm leading-tight mb-2">{evento.titulo}</h4>
              <p className="text-xs text-zinc-500">{evento.venueObj?.nombre}</p>
              <a 
                href={evento.link} 
                target="_blank" 
                className="block mt-2 text-center bg-zinc-900 text-white text-[10px] py-1 rounded uppercase font-bold"
              >
                Ver Info
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}