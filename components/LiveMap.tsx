"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MOCK_EVENTS } from "@/lib/mockEvents";
import { groupEventsByVenue, type GigEvent, type VenueGroup } from "@/lib/venues";
import Hero from "@/components/Hero";
import MapControls from "@/components/MapControls";
import EventSidePanel from "@/components/events/EventSidePanel";

const MapSkeleton = () => (
  <div className="w-full h-full bg-cafetal flex flex-col items-center justify-center gap-5">
    <div className="carreta-mark w-16 h-16 animate-[spin_2.5s_linear_infinite] shadow-[0_0_30px_rgba(230,50,63,0.35)]" />
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-hueso-dim animate-pulse">
      Sincronizando el radar…
    </p>
  </div>
);

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => null,
});

export default function LiveMap() {
  const [events, setEvents] = useState<GigEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Todos");
  const [province, setProvince] = useState<string | null>(null);
  const [selected, setSelected] = useState<VenueGroup | null>(null);
  const [resetTick, setResetTick] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/fetch");
        if (!res.ok) throw new Error("API no disponible");
        const data = await res.json();
        if (!alive) return;
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        } else {
          setEvents(MOCK_EVENTS);
        }
      } catch {
        if (alive) setEvents(MOCK_EVENTS);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const groups = useMemo(() => groupEventsByVenue(events), [events]);

  const handleReset = useCallback(() => {
    setSelected(null);
    setProvince(null);
    setResetTick((t) => t + 1);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-cafetal">
      {/* mapa */}
      <div className="absolute inset-0 z-0">
        <Map
          groups={groups}
          loading={loading}
          search={search}
          genre={genre}
          province={province}
          selectedVenueId={selected?.key ?? null}
          resetTick={resetTick}
          onSelectVenue={setSelected}
        />
      </div>

      {loading && (
        <div className="absolute inset-0 z-10">
          <MapSkeleton />
        </div>
      )}

      {/* hero */}
      <div className="absolute top-20 left-4 right-4 md:right-auto md:max-w-md z-20">
        <Hero totalEvents={events.length} totalVenues={groups.length} loading={loading} />
      </div>

{/* panel de eventos (desktop) */}
      <div className="hidden md:block absolute top-28 right-4 z-30 w-[360px]">
        {selected && (
          <EventSidePanel venue={selected} onClose={() => setSelected(null)} />
        )}
      </div>

      {/* hoja inferior (mobile): controles o lugar elegido */}
      <div className="md:hidden absolute inset-x-4 bottom-4 z-30">
        {selected ? (
          <EventSidePanel venue={selected} onClose={() => setSelected(null)} />
        ) : (
          <MapControls
            search={search}
            onSearch={setSearch}
            genre={genre}
            onGenre={setGenre}
            province={province}
            onProvince={setProvince}
            onReset={handleReset}
            totalEvents={events.length}
            totalVenues={groups.length}
          />
        )}
      </div>

      {/* controles (desktop) */}
      <div className="hidden md:block absolute bottom-4 left-4 z-20 w-[360px]">
        <MapControls
          search={search}
          onSearch={setSearch}
          genre={genre}
          onGenre={setGenre}
          province={province}
          onProvince={setProvince}
          onReset={handleReset}
          totalEvents={events.length}
          totalVenues={groups.length}
        />
      </div>
    </div>
  );
}