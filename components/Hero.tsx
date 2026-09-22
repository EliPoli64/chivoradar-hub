interface HeroProps {
  totalEvents: number;
  totalVenues: number;
  loading: boolean;
}

export default function Hero({ totalEvents, totalVenues, loading }: HeroProps) {
  return (
    <div className="bg-panel/90 backdrop-blur-xl border border-hueso/10 rounded-2xl shadow-2xl p-5 max-w-md">
      <div className="flex items-center gap-2">
        <span className="carreta-mark w-4 h-4" aria-hidden="true" />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-hueso-dim">
          Radar de la música en vivo
        </p>
      </div>

      <h1 className="font-display text-4xl md:text-5xl leading-[0.95] text-hueso mt-3">
        La noche
        <br />
        tiene <span className="text-rojo">mapa.</span>
      </h1>

      <p className="hero-sub hidden sm:block text-sm text-hueso-dim mt-3 leading-relaxed">
        Del garaje al estadio, de San José a Limón. Encontrá tu próximo chivo en
        el mapa y salí esta noche.
      </p>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-hueso/10">
        <span className="relative flex h-2 w-2">
          {!loading && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rojo opacity-60" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 bg-rojo ${
              loading ? "animate-pulse" : ""
            }`}
          />
        </span>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-hueso-dim">
          {loading ? (
            "Sincronizando el radar…"
          ) : (
            <>
              <span className="text-hueso font-bold">{totalEvents}</span> chivos ·{" "}
              <span className="text-hueso font-bold">{totalVenues}</span> lugares en vivo
            </>
          )}
        </p>
      </div>
    </div>
  );
}