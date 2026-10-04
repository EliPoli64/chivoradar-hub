import type { VenueGroup } from "@/lib/venues";

export function blipDelay(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return (h % 5) * 25; // 0–100ms: barrido sutil al poblar el radar
}

interface MarkerHtmlOptions {
  selected?: boolean;
  matching?: boolean;
  size?: number;
}

// Rueda de carreta que marca un lugar en el mapa. Compartida por el mapa
// principal y el mini-mapa de la página de lugar.
export function markerHtml(
  venue: VenueGroup,
  opts: MarkerHtmlOptions = {}
): string {
  const count = venue.events.length;
  const selected = opts.selected ?? false;
  const matching = opts.matching ?? true;
  const size = opts.size ?? 46;
  const fontSize = count > 99 ? 8 : count > 9 ? 10 : Math.round(size * 0.28);
  const ring = selected
    ? `<div class="radar-ring" style="color:${venue.color};"></div>`
    : "";
  return `
    <div class="carreta-wheel${selected ? " selected" : ""}" style="width:${size}px;height:${size}px;animation-delay:${120 + blipDelay(venue.key)}ms;${matching ? "" : "opacity:0.3;"}">
      <div class="wheel-body" style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 30%, ${venue.color}, rgba(0,0,0,0.55) 150%);box-shadow:0 0 0 2px rgba(245,239,228,0.85), 0 6px 16px rgba(0,0,0,0.35);"></div>
      <div class="wheel-spokes" style="position:absolute;inset:9%;border-radius:50%;background:repeating-conic-gradient(from 0deg, rgba(245,239,228,0.55) 0deg 5deg, transparent 5deg 45deg);"></div>
      <div style="position:absolute;inset:25%;border-radius:50%;background:#f5efe4;box-shadow:inset 0 1px 3px rgba(0,0,0,0.25);"></div>
      <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-plex);font-weight:700;font-size:${fontSize}px;color:#16120d;line-height:1;">${count}</span>
      ${ring}
    </div>`;
}