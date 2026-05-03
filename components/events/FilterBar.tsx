const generos = ["Todos", "Rock", "Electrónica", "Metal", "Jazz", "Reggae", "Indie", "Salsa"];
export default function FilterBar() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
      {generos.map((genero) => (
        <button 
          key={genero}
          className="px-6 py-2 rounded-full border border-white/10 bg-zinc-900 text-sm font-medium whitespace-nowrap hover:bg-neon-green hover:text-black transition-all active:scale-95"
        >
          {genero}
        </button>
      ))}
    </div>
  );
}