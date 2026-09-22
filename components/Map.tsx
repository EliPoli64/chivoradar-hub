"use client";
import { useEffect, useRef, useState } from "react";
import type { LeafletMouseEvent, Map as LeafletMap } from "leaflet";
import { useMapEvents } from "react-leaflet";
import { CR_BOUNDS, type VenueGroup } from "@/lib/venues";
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

function markerHtml(venue: VenueGroup, selected: boolean, matching: boolean) {
  const count = venue.events.length;
  const size = 46;
  const fontSize = count > 99 ? 8 : count > 9 ? 10 : 13;
  const ring = selected
    ? `<div class="radar-ring" style="color:${venue.color};"></div>`
    : "";
  return `
    <div class="carreta-wheel${selected ? " selected" : ""}" style="width:${size}px;height:${size}px;${matching ? "" : "opacity:0.3;"}">
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
  const fitted = useRef(false);

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

  // botón "ver todo": volver al país entero sin alejar tanto
  useEffect(() => {
    const map = mapRef.current;
    if (!map || resetTick === 0) return;
    map.flyTo([9.75, -84.2], 9, { duration: 0.9 });
  }, [resetTick]);

  if (!MapComponents || loading) return null;

  const { MapContainer, Marker, TileLayer, ZoomControl, MarkerClusterGroup, L } =
    MapComponents;

  const createClusterIcon = (cluster: ClusterLike) => {
    const count = cluster.getChildCount();
    const size = count > 10 ? 60 : count > 5 ? 52 : 44;
    return L.divIcon({
      html: `<div class="cluster-bubble" style="width:${size}px;height:${size}px;border-radius:50%;background:radial-gradient(circle at 35% 30%, #f5b301, #e6323f 75%);display:flex;align-items:center;justify-content:center;border:3px solid rgba(245,239,228,0.9);box-shadow:0 8px 20px rgba(0,0,0,0.4);">
        <span style="font-family:var(--font-plex);font-weight:700;font-size:${size > 45 ? 18 : 15}px;color:#16120d;line-height:1;">${count}</span>
      </div>`,
      className: "custom-cluster-icon",
      iconSize: L.point(size, size),
    });
  };

  const venueMatches = (venue: VenueGroup) => {
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
  };

  return (
    <MapContainer
      ref={(m) => {
        mapRef.current = m;
        if (m && !fitted.current) {
          fitted.current = true;
          m.fitBounds(CR_BOUNDS, { padding: [24, 24] });
        }
      }}
      center={[9.75, -84.2]}
      zoom={8}
      zoomControl={false}
      scrollWheelZoom
      className="w-full h-full"
      style={{ background: "#efe7d8" }}
    >
      <MapClickController onMapClick={() => onSelectVenue(null)} />
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
        {groups.map((venue) => {
          const selected = selectedVenueId === venue.key;
          const matching = venueMatches(venue);
          return (
            <Marker
              key={venue.key}
              position={[venue.position[1], venue.position[0]]}
              icon={L.divIcon({
                html: markerHtml(venue, selected, matching),
                className: "custom-marker-icon",
                iconSize: L.point(46, 46),
                iconAnchor: L.point(23, 23),
              })}
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
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}