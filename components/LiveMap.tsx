"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MOCK_EVENTS } from "@/lib/mockEvents";
import { groupEventsByVenue, type GigEvent, type VenueGroup } from "@/lib/venues";
import Hero from "@/components/Hero";
import MapControls from "@/components/MapControls";
import Logo from "@/components/Logo";
import EventSidePanel from "@/components/events/EventSidePanel";

const CLOSE_MS = 200;

const MapSkeleton = () => (
  <div className="w-full h-full bg-cafetal flex flex-col items-center justify-center gap-5">
    <Logo size={64} animate className="drop-shadow-[0_0_30px_rgba(230,50,63,0.35)]" />
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
  const [closing, setClosing] = useState(false);
  const [resetTick, setResetTick] = useState(0);
  const [booted, setBooted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedRef = useRef<VenueGroup | null>(null);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 900);
    return () => clearTimeout(t);
  }, []);

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

  // cerrar el panel con una salida animada antes de desmontarlo
  const handleSelect = useCallback((venue: VenueGroup | null) => {
    if (venue) {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      setClosing(false);
      setSelected(venue);
      return;
    }
    if (!selectedRef.current || closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setSelected(null);
      setClosing(false);
      closeTimer.current = null;
    }, CLOSE_MS);
  }, [closing]);

  const handleReset = useCallback(() => {
    handleSelect(null);
    setProvince(null);
    setResetTick((t) => t + 1);
  }, [handleSelect]);

  const enterClass = booted ? "" : "anim-rise";

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
          onSelectVenue={handleSelect}
        />
      </div>

      {loading && (
        <div className="absolute inset-0 z-10">
          <MapSkeleton />
        </div>
      )}

      {/* hero */}
      <div className={`absolute top-20 left-4 right-4 md:right-auto md:max-w-md z-20 ${enterClass}`}>
        <Hero totalEvents={events.length} totalVenues={groups.length} loading={loading} />
      </div>

      {/* panel de eventos (desktop) */}
      <div className="hidden md:block absolute top-28 right-4 z-30 w-[360px]">
        {selected && (
          <EventSidePanel
            venue={selected}
            closing={closing}
            onClose={() => handleSelect(null)}
          />
        )}
      </div>

      {/* hoja inferior (mobile): controles o lugar elegido */}
      <div className="md:hidden absolute inset-x-4 bottom-4 z-30">
        {selected ? (
          <EventSidePanel
            venue={selected}
            closing={closing}
            onClose={() => handleSelect(null)}
          />
        ) : (
          <div className={enterClass}>
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
        )}
      </div>

      {/* controles (desktop) */}
      <div className={`hidden md:block absolute bottom-4 left-4 z-20 w-[360px] ${enterClass}`}>
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