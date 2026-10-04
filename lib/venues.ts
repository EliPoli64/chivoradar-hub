import { provinceForPoint, PROVINCES } from "./cr-provinces";

export function isSinCategoria(c: string): boolean {
  const t = (c ?? "").trim().toLowerCase();
  return t === "" || t === "sin categoría" || t === "sin categoria";
}

export function distinctCategorias(events: { categoria: string }[]): string[] {
  const set = new Set<string>();
  for (const e of events) {
    const c = e.categoria?.trim();
    if (!c || isSinCategoria(c)) continue;
    set.add(c);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

export interface GigEvent {
  id: string;
  titulo: string;
  artista: string;
  categoria: string;
  fechaHora: string;
  descripcion?: string;
  link?: string;
  urlImagen?: string;
  venueId?: string;
  venueObj: {
    nombre: string;
    slug?: string;
    direccion?: string | null;
    coordinates?: number[] | null;
  };
  venue?: string;
  date?: string;
  tiersPrecio?: { nombre: string; precio: number; moneda: string }[];
}

export interface VenueGroup {
  key: string;
  slug: string | null;
  name: string;
  address: string | null;
  position: [number, number]; // [lng, lat]
  province: string;
  color: string;
  events: GigEvent[];
}

const FALLBACK_COLOR = "#E6323F";

export function groupEventsByVenue(events: GigEvent[]): VenueGroup[] {
  const map = new Map<string, VenueGroup>();
  const usedCoords = new Set<string>();

  for (const e of events) {
    const coords = e.venueObj?.coordinates;
    if (
      !coords ||
      !Array.isArray(coords) ||
      coords.length !== 2 ||
      coords[0] === null ||
      coords[1] === null
    ) {
      continue;
    }

    let [lng, lat] = coords as [number, number];
    if (!isValidCrPoint(lng, lat)) continue;

    let key = e.venueId || e.venueObj?.slug || "";

    if (!key) {
      // agrupar por coordenadas exactas como último recurso
      key = `${lng.toFixed(5)},${lat.toFixed(5)}`;
    }

    let group = map.get(key);
    if (!group) {
      // si dos lugares distintos comparten coordenadas exactas, separarlos un poco
      const coordKey = `${lng.toFixed(4)},${lat.toFixed(4)}`;
      if (usedCoords.has(coordKey)) {
        const nudge = (usedCoords.size % 4) + 1;
        const dir = nudge % 2 === 0 ? 1 : -1;
        lng += dir * 0.0009 * Math.ceil(nudge / 2);
        lat += dir * 0.0006 * Math.ceil(nudge / 2);
      }
      usedCoords.add(`${lng.toFixed(4)},${lat.toFixed(4)}`);

      const province = provinceForPoint(lng, lat);
      const prov = PROVINCES.find((p) => p.name === province);
      group = {
        key,
        slug: e.venueObj?.slug || null,
        name: e.venueObj?.nombre || e.venue || "Lugar por confirmar",
        address: e.venueObj?.direccion || null,
        position: [lng, lat],
        province: province || "Sin zona",
        color: prov?.color || FALLBACK_COLOR,
        events: [],
      };
      map.set(key, group);
    }
    group.events.push(e);
  }

  return Array.from(map.values()).sort((a, b) => b.events.length - a.events.length);
}

export const CR_BOUNDS: [[number, number], [number, number]] = [
  [8.03, -85.98],
  [11.23, -82.4],
];

const CR_MARGIN = { lngMin: -86.5, lngMax: -81.9, latMin: 7.8, latMax: 11.5 };

export function isValidCrPoint(lng: number, lat: number): boolean {
  return (
    lng >= CR_MARGIN.lngMin &&
    lng <= CR_MARGIN.lngMax &&
    lat >= CR_MARGIN.latMin &&
    lat <= CR_MARGIN.latMax
  );
}

export function formatFechaHora(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatHora(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export function formatPrecio(tier: { precio: number; moneda: string }): string {
  if (tier.precio === 0) return "Gratis";
  if (tier.moneda === "USD") return `US$${tier.precio.toFixed(0)}`;
  return `₡${tier.precio.toLocaleString("es-CR")}`;
}