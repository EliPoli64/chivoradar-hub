"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import MapaChivos from "@/components/Map";

const MapSkeleton = () => (
  <div className="relative inset-0 flex flex-col items-center justify-center bg-zinc-900 z-2">
    {/* Animated Radar Pulse */}
    <div className="relative flex items-center justify-center w-32 h-32">
      <div className="absolute inset-0 border-2 border-neon-green/30 rounded-full animate-ping" />
      <div className="absolute inset-4 border border-neon-green/50 rounded-full animate-[ping_1.5s_linear_infinite]" />
      <div className="w-4 h-4 bg-neon-green rounded-full shadow-[0_0_20px_#ccff00] z-20" />
      
      {/* Rotating Radar Line */}
      <div className="absolute w-full h-full border-t border-neon-green/20 rounded-full animate-spin [animation-duration:3s]" />
    </div>

    <div className="mt-8 flex flex-col items-center gap-2">
      <p className="text-xs uppercase tracking-[0.3em] font-black text-neon-green animate-pulse">
        Sincronizando Satélites...
      </p>
      <div className="w-48 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-neon-green animate-[loading_2s_ease-in-out_infinite]" />
      </div>
    </div>

    {/* Decorative Coordinates for flavor */}
    <div className="absolute bottom-10 font-mono text-[10px] text-zinc-500 flex gap-10">
      <span>LAT: 9.9281° N</span>
      <span>LON: 84.0907° W</span>
    </div>

    <style jsx>{`
      @keyframes loading {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export default function LiveMap(props: any) {
  const [cantChivos, setCantChivos] = useState(0);
  const { position, zoom } = props;

  return (
    <div className="relative mx-auto w-[1000px] h-[400px] md:h-[550px] bg-zinc-900 rounded-2xl overflow-hidden group border border-white/5">
      {/* fondo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-10" />
      
      {/* dynamapa */}
      <MapaChivos position={position} zoom={zoom} />
    </div>
  );
}