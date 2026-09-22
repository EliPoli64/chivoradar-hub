import { GENEROS } from "@/lib/venues";

export default function FilterBar() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
      {GENEROS.map((genero) => (
        <button
          key={genero}
          className="px-5 py-2 rounded-full border border-hueso/15 bg-panel text-sm font-medium whitespace-nowrap text-hueso-dim hover:text-hueso hover:border-rojo/50 transition-all active:scale-95"
        >
          {genero}
        </button>
      ))}
    </div>
  );
}