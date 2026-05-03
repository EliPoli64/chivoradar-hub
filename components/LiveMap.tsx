"use client";

export default function LiveMap() {
  const cantChivos = 0;
  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-zinc-800 rounded-2xl overflow-hidden group">
      {/* Grid Pattern Background for "Radar" effect */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-neon-green rounded-full animate-ping absolute" />
        <div className="w-4 h-4 bg-neon-green rounded-full shadow-[0_0_20px_#ccff00]" />
        <p className="text-xs uppercase tracking-widest font-bold text-neon-green animate-pulse">Escaneando toda Tiquicia...</p>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
        <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <p className="text-xs text-zinc-500 uppercase font-bold">Activos Ahora</p>
          <p className="text-2xl font-bold">{cantChivos} Chivos Ahora</p>
        </div>
      </div>
    </div>
  );
}