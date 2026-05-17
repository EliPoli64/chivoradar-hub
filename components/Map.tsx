"use client";
import { useEffect, useState } from "react";

const clusterStyles = `
  @keyframes clusterPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.9;
    }
  }

  @keyframes clusterBounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.08);
    }
  }

  .cluster-bubble {
    animation: clusterBounce 2s ease-in-out infinite;
  }

  .cluster-bubble:hover {
    animation: clusterPulse 0.6s ease-in-out !important;
  }

  .cluster-inner {
    transition: all 0.3s ease;
  }
`;

export default function MapaChivos({ position, zoom }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [customIcon, setCustomIcon] = useState<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = clusterStyles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  useEffect(() => {
    const loadMapLibraries = async () => {
      const { MapContainer, Marker, Popup, TileLayer } = await import("react-leaflet");
      const L = await import("leaflet");
      const markerClusterGroup = await import("react-leaflet-cluster");
      
      await import("leaflet/dist/leaflet.css");
      
      const icon = new L.default.Icon({
        iconUrl: "https://www.freepnglogos.com/uploads/pin-png/map-pin-png-apex-dance-studio-16.png",
        iconRetinaUrl: "https://www.freepnglogos.com/uploads/pin-png/map-pin-png-apex-dance-studio-16.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [50, 50],
        iconAnchor: [25, 50],
      });
      
      setMapComponents({ MapContainer, Marker, Popup, TileLayer, MarkerClusterGroup: markerClusterGroup.default });
      setCustomIcon(icon);
    };

    loadMapLibraries();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/fetch");
        const json = await response.json();
        setEvents(json);
      } catch (err) {
        console.error("Error loading map data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (MapComponents && customIcon && !loading) {
      setMapReady(true);
    }
  }, [MapComponents, customIcon, loading]);

  const validEvents = events.filter(evento => {
    const hasCoordinates = evento.venueObj?.coordinates && 
                          Array.isArray(evento.venueObj.coordinates) && 
                          evento.venueObj.coordinates.length === 2 &&
                          evento.venueObj.coordinates[0] !== null &&
                          evento.venueObj.coordinates[1] !== null;
    
    return hasCoordinates;
  });

  const groupedEvents = validEvents.reduce((acc: any, evento) => {
    const coordKey = `${evento.venueObj.coordinates[0]},${evento.venueObj.coordinates[1]}`;
    if (!acc[coordKey]) {
      acc[coordKey] = [];
    }
    acc[coordKey].push(evento);
    return acc;
  }, {});

  const createClusterCustomIcon = (cluster: any) => {
    const L = require("leaflet");
    const count = cluster.getChildCount();
    let size = 40;
    let backgroundColor = "#3b82f6"; // Light blue
    let borderColor = "#1e40af"; // Dark blue for border
    
    if (count > 10) {
      size = 56;
      backgroundColor = "#1e3a8a"; // Dark blue
      borderColor = "#0f172a"; // Darker border
    } else if (count > 5) {
      size = 48;
      backgroundColor = "#1e40af"; // Medium blue
      borderColor = "#1e3a8a"; // Dark blue border
    } else if (count > 1) {
      size = 40;
      backgroundColor = "#3b82f6"; // Light blue
      borderColor = "#1e40af"; // Medium border
    }
    
    return L.divIcon({
      html: `<div class="cluster-bubble" style="background: linear-gradient(135deg, ${backgroundColor} 0%, ${borderColor} 100%); width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #60a5fa; box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3), 0 8px 16px rgba(30, 58, 138, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.1);">
              <div class="cluster-inner" style="text-align: center;">
                <span style="color: white; font-weight: 900; font-size: ${size > 45 ? '18px' : '15px'}; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">${count}</span>
              </div>
            </div>`,
      className: "custom-cluster-icon",
      iconSize: L.point(size, size),
    });
  };

  if (!mapReady) {
    return (
      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neon-green mb-2"></div>
          <p className="text-sm text-zinc-400">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <MapComponents.MapContainer 
      center={[9.800090306914088, -84.03119843292991]} 
      zoom={8} 
      scrollWheelZoom={true} 
      className="w-full h-full"
      style={{ background: "#555561" }}
    >
      <MapComponents.TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <MapComponents.MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={80}
        iconCreateFunction={createClusterCustomIcon}
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
        spiderLegPolylineOptions={{
          weight: 1.5,
          color: "#10b981",
          opacity: 0.5
        }}
      >
        {validEvents.map((evento) => (
          <MapComponents.Marker 
            key={evento.id} 
            position={[evento.venueObj.coordinates[1], evento.venueObj.coordinates[0]]} 
            icon={customIcon}
          >
            <MapComponents.Popup>
              <div className="p-2 max-w-xs">
                <p className="text-xs font-black uppercase text-neon-green mb-1">{evento.artista}</p>
                <h4 className="font-bold text-sm leading-tight mb-1">{evento.titulo}</h4>
                <p className="text-xs text-zinc-500 mb-2">{evento.venueObj?.nombre}</p>
                {groupedEvents[`${evento.venueObj.coordinates[0]},${evento.venueObj.coordinates[1]}`]?.length > 1 && (
                  <div className="mb-2 text-xs text-neon-green">
                    🎫 {groupedEvents[`${evento.venueObj.coordinates[0]},${evento.venueObj.coordinates[1]}`].length} eventos en este lugar
                  </div>
                )}
                <a 
                  href={evento.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block mt-1 text-center bg-zinc-900 text-white text-[10px] py-1.5 rounded uppercase font-bold hover:bg-zinc-700 transition-colors"
                >
                  Ver Info
                </a>
              </div>
            </MapComponents.Popup>
          </MapComponents.Marker>
        ))}
      </MapComponents.MarkerClusterGroup>
    </MapComponents.MapContainer>
  );
}