"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  DivIcon,
  LeafletMouseEvent,
  Map as LeafletMap,
} from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";
import type { VenueGroup } from "@/lib/venues";
import { PROVINCES } from "@/lib/cr-provinces";

interface LeafletBundle {
  MapContainer: typeof import("react-leaflet").MapContainer;
  Marker: typeof import("react-leaflet").Marker;
  TileLayer: typeof import("react-leaflet").TileLayer;
  ZoomControl: typeof import("react-leaflet").ZoomControl;
  MarkerClusterGroup: typeof import("react-leaflet-cluster").default;
  L: typeof import("leaflet");
}

interface ClusterLike {
  getChildCount: () => number;
}

function MapClickController({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      const target = e.originalEvent.target as HTMLElement | undefined;
      if (target?.closest?.(".leaflet-marker-icon")) return;
      onMapClick();
    },
  });
  return null;
}

// Aplica el blip-in a las ruedas recién visibles. Los marcadores dentro de un
// cluster disparan `add` antes de tener elemento DOM, así que el mejor momento
// es cuando el mapa termina de poblar/cambiar de zoom (el plugin ya colocó los
// marcadores). Como los iconos están memorizados, un re-render de búsqueda o
// selección NO dispara esto (los marcadores conservan su blip-in o no lo repiten).
function MapBlipController() {
  const map = useMap();
  useEffect(() => {
    const apply = () => {
      document
        .querySelectorAll(".carreta-wheel:not(.blip-in)")
        .forEach((el) => el.classList.add("blip-in"));
    };
    const t = setTimeout(apply, 450);
    map.on("load", apply);
    map.on("zoomend", apply);
    return () => {
      clearTimeout(t);
      map.off("load", apply);
      map.off("zoomend", apply);
    };
  }, [map]);
  return null;
}

interface MapProps {
  groups: VenueGroup[];
  loading: boolean;
  search: string;
  genre: string;
  province: string | null;
  selectedVenueId: string | null;
  resetTick: number;
  onSelectVenue: (venue: VenueGroup | null) => void;
}

function venueMatches(
  venue: VenueGroup,
  search: string,
  genre: string,
  province: string | null
): boolean {
  const q = search.trim().toLowerCase();
  const qOk =
    !q ||
    venue.events.some((e) =>
      `${e.artista} ${e.titulo} ${e.venueObj?.nombre} ${e.venue ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  const gOk =
    !genre || genre === "Todos" || venue.events.some((e) => e.categoria === genre);
  const pOk = !province || venue.province === province;
  return qOk && gOk && pOk;
}

function blipDelay(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return (h % 5) * 25; // 0–100ms: barrido sutil al poblar el radar
}

function markerHtml(venue: VenueGroup, selected: boolean, matching: boolean) {
  const count = venue.events.length;
  const size = 46;
  const fontSize = count > 99 ? 8 : count > 9 ? 10 : 13;
  const ring = selected
    ? `<div class="radar-ring" style="color:${venue.color};"></div>`
    : "";
  return `
    <div class="carreta-wheel${selected ? " selected" : ""}" style="width:${size}px;height:${size}px;animation-delay:${120 + blipDelay(venue.key)}ms;${matching ? "" : "opacity:0.3;"}">
      <div class="wheel-body" style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 30%, ${venue.color}, rgba(0,0,0,0.55) 150%);box-shadow:0 0 0 2px rgba(245,239,228,0.85), 0 6px 16px rgba(0,0,0,0.35);"></div>
      <div class="wheel-spokes" style="position:absolute;inset:9%;border-radius:50%;background:repeating-conic-gradient(from 0deg, rgba(245,239,228,0.55) 0deg 5deg, transparent 5deg 45deg);"></div>
      <div style="position:absolute;inset:25%;border-radius:50%;background:#f5efe4;box-shadow:inset 0 1px 3px rgba(0,0,0,0.25);"></div>
      <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-plex);font-weight:700;font-size:${fontSize}px;color:#16120d;line-height:1;">${count}</span>
      ${ring}
    </div>`;
}

export default function MapaChivos({
  groups,
  loading,
  search,
  genre,
  province,
  selectedVenueId,
  resetTick,
  onSelectVenue,
}: MapProps) {
  const [MapComponents, setMapComponents] = useState<LeafletBundle | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const loadMapLibraries = async () => {
      const { MapContainer, Marker, TileLayer, ZoomControl } = await import("react-leaflet");
      const L = await import("leaflet");
      const markerClusterGroup = await import("react-leaflet-cluster");
      await import("leaflet/dist/leaflet.css");

      setMapComponents({
        MapContainer,
        Marker,
        TileLayer,
        ZoomControl,
        MarkerClusterGroup: markerClusterGroup.default,
        L,
      });
    };
    loadMapLibraries();
  }, []);

  // volar a una provincia cuando se elige en el panel
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !province) return;
    const prov = PROVINCES.find((p) => p.name === province);
    if (prov) {
      map.flyTo(prov.centroid as [number, number], 9, { duration: 0.9 });
    }
  }, [province]);

  // botón "ver todo": volver a la vista centrada sin alejar tanto
  useEffect(() => {
    const map = mapRef.current;
    if (!map || resetTick === 0) return;
    map.flyTo([9.75, -84.2], 8, { duration: 0.9 });
  }, [resetTick]);

  const L = MapComponents?.L;

  // los iconos se memorizan por marcador: el objeto `icon` solo cambia cuando
  // cambia su estado (selección/búsqueda/género), así un re-render no reemplaza
  // el elemento del marcador ni borra la animación blip-in recién aplicada.
  const icons = useMemo(() => {
    const map = new Map<string, DivIcon>();
    if (!L) return map;
    for (const venue of groups) {
      const selected = selectedVenueId === venue.key;
      const matching = venueMatches(venue, search, genre, province);
      map.set(
        venue.key,
        L.divIcon({
          html: markerHtml(venue, selected, matching),
          className: "custom-marker-icon",
          iconSize: L.point(46, 46),
          iconAnchor: L.point(23, 23),
        })
      );
    }
    return map;
  }, [groups, selectedVenueId, search, genre, province, L]);

  if (!MapComponents || loading) return null;

  const { MapContainer, Marker, TileLayer, ZoomControl, MarkerClusterGroup } =
    MapComponents;

  const createClusterIcon = (cluster: ClusterLike) => {
    const count = cluster.getChildCount();
    const size = count > 10 ? 60 : count > 5 ? 52 : 44;
    return MapComponents.L.divIcon({
      html: `<div class="cluster-bubble blip-in" style="width:${size}px;height:${size}px;border-radius:50%;background:radial-gradient(circle at 35% 30%, #f5b301, #e6323f 75%);display:flex;align-items:center;justify-content:center;border:3px solid rgba(245,239,228,0.9);box-shadow:0 8px 20px rgba(0,0,0,0.4);">
        <span style="font-family:var(--font-plex);font-weight:700;font-size:${size > 45 ? 18 : 15}px;color:#16120d;line-height:1;">${count}</span>
      </div>`,
      className: "custom-cluster-icon",
      iconSize: MapComponents.L.point(size, size),
    });
  };

  return (
    <MapContainer
      ref={mapRef}
      center={[9.95, -84.4]}
      zoom={8}
      zoomControl={false}
      scrollWheelZoom
      zoomAnimation
      markerZoomAnimation
      className="w-full h-full"
      style={{ background: "#efe7d8" }}
    >
      <MapClickController onMapClick={() => onSelectVenue(null)} />
      <MapBlipController />
      <TileLayer
        url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${process.env.NEXT_PUBLIC_CARTO_API_KEY}`}
      />

      <ZoomControl position="bottomright" />

      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={70}
        iconCreateFunction={createClusterIcon}
        showCoverageOnHover={false}
        spiderfyOnMaxZoom
      >
        {groups.map((venue) => (
          <Marker
            key={venue.key}
            position={[venue.position[1], venue.position[0]]}
            icon={icons.get(venue.key)}
            eventHandlers={{
              click: (e: LeafletMouseEvent) => {
                e.originalEvent.stopPropagation();
                onSelectVenue(venue);
                mapRef.current?.flyTo([venue.position[1], venue.position[0]], 13, {
                  duration: 0.7,
                });
              },
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}