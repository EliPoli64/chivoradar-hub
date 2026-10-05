"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MOCK_EVENTS } from "@/lib/mockEvents";
import {
  groupEventsByVenue,
  chivosPorProvincia,
  type GigEvent,
  type VenueGroup,
} from "@/lib/venues";
import Hero from "@/components/Hero";
import MapControls from "@/components/MapControls";
import Logo from "@/components/Logo";
import EventSidePanel from "@/components/events/EventSidePanel";

const CLOSE_MS = 200;

const MapSkeleton = () => (
  <div className="w-full h-full bg-cafetal flex flex-col items-center justify-center gap-5">
    <Logo
      size={64}
      animate
      className="drop-shadow-[0_0_30px_rgba(230,50,63,0.35)]"
    />
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-hueso-dim animate-pulse">
      Sincronizando el radar…
    </p>
  </div>
);

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => null,
});

interface LiveMapProps {
  initialCategories?: string[];
}

export default function LiveMap({ initialCategories }: LiveMapProps) {
  const [events, setEvents] = useState<GigEvent[]>([]);
  const [categories] = useState<string[]>(initialCategories ?? []);
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

  // el conteo viene de la misma función que usa el mapa para filtrar, así que
  // las barras nunca contradicen los marcadores. Ignora el filtro de provincia
  // para que siempre se vea dónde más hay señal.
  const provinceCounts = useMemo(
    () => chivosPorProvincia(groups, search, genre),
    [groups, search, genre],
  );

  // cerrar el panel con una salida animada antes de desmontarlo
  const handleSelect = useCallback(
    (venue: VenueGroup | null) => {
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
    },
    [closing],
  );

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

      {/* riel izquierdo (desktop): hero arriba, controles abajo, en un solo
          contenedor flexible. Antes cada tarjeta se posicionaba sola contra
          un borde y, al crecer el panel de controles, tapaba al hero. Aquí el
          alto se reparte entre las dos y los controles internos se desplazan. */}
      <div
        className={`absolute top-20 bottom-4 left-5 z-20 hidden w-[380px] max-w-[calc(100vw-2rem)] flex-col gap-3 md:flex ${enterClass}`}
      >
        <div className="shrink-0">
          <Hero
            totalEvents={events.length}
            totalVenues={groups.length}
            loading={loading}
          />
        </div>
        <div className="mt-auto flex min-h-0 flex-1 flex-col justify-end">
          <MapControls
            search={search}
            onSearch={setSearch}
            genre={genre}
            onGenre={setGenre}
            categories={categories}
            province={province}
            onProvince={setProvince}
            onReset={handleReset}
            totalEvents={events.length}
            totalVenues={groups.length}
            provinceCounts={provinceCounts}
          />
        </div>
      </div>

      {/* riel inferior (mobile): hero arriba y, debajo, la hoja de controles o
          el lugar elegido. Mismo patrón que en desktop, para que en pantallas
          bajas la hoja no suba hasta tapar el hero. */}
      <div
        className={`absolute inset-x-4 top-20 bottom-4 z-30 flex flex-col gap-3 md:hidden ${enterClass}`}
      >
        <div className="shrink-0">
          <Hero
            totalEvents={events.length}
            totalVenues={groups.length}
            loading={loading}
          />
        </div>
        <div className="mt-auto flex min-h-0 flex-1 flex-col justify-end">
          {selected ? (
            <EventSidePanel
              venue={selected}
              closing={closing}
              onClose={() => handleSelect(null)}
            />
          ) : (
            <MapControls
              search={search}
              onSearch={setSearch}
              genre={genre}
              onGenre={setGenre}
              categories={categories}
              province={province}
              onProvince={setProvince}
              onReset={handleReset}
              totalEvents={events.length}
              totalVenues={groups.length}
              provinceCounts={provinceCounts}
            />
          )}
        </div>
      </div>

      {/* panel de eventos (desktop): va al lado contrario del riel, para no
          tapar el centro del mapa */}
      <div className="hidden md:block absolute top-28 right-4 z-30 w-[380px] max-w-[calc(100vw-2rem)]">
        {selected && (
          <EventSidePanel
            venue={selected}
            closing={closing}
            onClose={() => handleSelect(null)}
          />
        )}
      </div>
    </div>
  );
}
