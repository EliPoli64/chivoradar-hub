"use client";
import { useEffect, useState } from "react";
import type { VenueGroup } from "@/lib/venues";
import { markerHtml } from "@/lib/markers";

interface Props {
  venue: VenueGroup;
}

export default function VenueMiniMap({ venue }: Props) {
  const [RL, setRL] = useState<typeof import("react-leaflet") | null>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const reactLeaflet = await import("react-leaflet");
      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (!alive) return;
      setRL(reactLeaflet);
      setL(leaflet);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!RL || !L) {
    return (
      <div className="h-56 w-full rounded-2xl border border-hueso/10 bg-panel flex items-center justify-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-hueso-dim animate-pulse">
          Cargando mapa…
        </p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker } = RL;
  const [lng, lat] = venue.position;
  const size = 40;

  return (
    <div className="h-56 w-full rounded-2xl overflow-hidden border border-hueso/10 shadow-lg">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ background: "#efe7d8" }}
      >
        <TileLayer
          url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${process.env.NEXT_PUBLIC_CARTO_API_KEY}`}
        />
        <Marker
          position={[lat, lng]}
          icon={L.divIcon({
            html: markerHtml(venue, { size }),
            className: "custom-marker-icon",
            iconSize: L.point(size, size),
            iconAnchor: L.point(size / 2, size / 2),
          })}
        />
      </MapContainer>
    </div>
  );
}