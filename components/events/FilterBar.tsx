import { GENEROS } from "@/lib/venues";

export default function FilterBar() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {GENEROS.map((genero) => (
        <button
          key={genero}
          className="px-4 py-1.5 rounded-full border border-hueso/15 bg-panel text-sm font-medium whitespace-nowrap text-hueso-dim hover:text-hueso hover:border-rojo/50 transition-all active:scale-95 shrink-0"
        >
          {genero}
        </button>
      ))}
    </div>
  );
}