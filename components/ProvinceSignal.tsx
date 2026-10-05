import Link from "next/link";
import { PROVINCES, slugify, type Province } from "@/lib/cr-provinces";

/**
 * Control de región del radar. Dos formas, una sola lectura: la intensidad
 * del color de cada provincia es la parte de los chivos que le toca.
 *
 *  - variant="map"   silueta de Costa Rica a escala real (páginas de catálogo)
 *  - variant="bars"  lista de señal por provincia (panel angosto sobre el mapa)
 *
 * Sirve como enlace (hrefFor) o como botón (onSelect), para usarse desde un
 * server component o desde el estado del mapa.
 */

export type Counts = Record<string, number>;

interface BaseProps {
  /** chivos por nombre de provincia */
  counts: Counts;
  /** provincia activa, por nombre */
  active?: string | null;
  className?: string;
}

interface MapProps extends BaseProps {
  variant?: "map";
  /** href por provincia */
  hrefFor: (slug: string) => string;
  onSelect?: never;
}

interface BarsProps extends BaseProps {
  variant: "bars";
  hrefFor?: never;
  /** recibe el nombre de la provincia, o null para quitar el filtro */
  onSelect: (name: string | null) => void;
}

type Props = MapProps | BarsProps;

// Extremos del país en grados; los mismos que usa el mapa (CR_BOUNDS).
const LNG_MIN = -85.98;
const LNG_MAX = -82.4;
const LAT_MIN = 8.03;
const LAT_MAX = 11.23;

const SPAN_LNG = LNG_MAX - LNG_MIN;
const SPAN_LAT = LAT_MAX - LAT_MIN;

function toXY(lng: number, lat: number): [number, number] {
  return [
    ((lng - LNG_MIN) / SPAN_LNG) * 100,
    ((LAT_MAX - lat) / SPAN_LAT) * 100,
  ];
}

function pathFor(p: Province): string {
  const parts: string[] = [];
  for (const ring of p.rings) {
    ring.forEach(([lng, lat], i) => {
      const [x, y] = toXY(lng, lat);
      parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
    });
    parts.push("Z");
  }
  return parts.join(" ");
}

/** Área de la provincia en el espacio del viewBox (unidades 0–100). */
function areaOf(p: Province): number {
  let sum = 0;
  for (const ring of p.rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = toXY(ring[i][0], ring[i][1]);
      const [x2, y2] = toXY(ring[i + 1][0], ring[i + 1][1]);
      sum += x1 * y2 - x2 * y1;
    }
  }
  return Math.abs(sum / 2);
}

function totalDe(counts: Counts): number {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

/**
 * Escalón de señal. Va en pasos y no como número suelto porque el color de la
 * forma lo maneja el CSS (para poder subirlo en hover), y el `style` en línea
 * le gana a cualquier regla de la hoja: un `--w` en línea nunca se sobrescribe.
 *
 * El área del polígono no dice nada sobre la señal —Puntarenas y Guanacaste son
 * enormes y casi siempre están apagadas—, así que el valor se lee en la
 * intensidad y el contorno mantiene ubicables las apagadas.
 */
type Sig = "nada" | "bajo" | "medio" | "alto";

function signal(counts: Counts, name: string): Sig {
  const n = counts[name] ?? 0;
  if (n === 0) return "nada";
  const total = totalDe(counts);
  const share = total > 0 ? n / total : 0;
  if (share >= 0.3) return "alto";
  if (share >= 0.1) return "medio";
  return "bajo";
}

/**
 * Halo de golpe: un trazo invisible y grueso ensancha el área sensible,
 * porque San José y Heredia son demasiado chicos para un dedo. Se dimensiona
 * al revés que el área —las pequeñas necesitan proportionally más— y se
 * acota para que el halo no invada a la vecina.
 */
const HALO_MAX = 5;
const HALO_MIN = 1.2;

function haloFor(area: number): number {
  return Math.min(HALO_MAX, Math.max(HALO_MIN, 150 / Math.sqrt(area)));
}

/**
 * Se dibuja de mayor a menor área. En SVG el último en pintarse gana el clic,
 * y las provincias pequeñas son las que compiten por el borde: al ir de
 * ninguna vecina les roba el interior ni el halo.
 */
const SPECS = [...PROVINCES]
  .map((p) => ({ p, d: pathFor(p), area: Math.max(1, areaOf(p)) }))
  .sort((a, b) => b.area - a.area)
  .map(({ p, d, area }) => ({ p, d, area, halo: haloFor(area) }));

function MapVariant({ counts, active, hrefFor, className }: MapProps) {
  return (
    <div className={className}>
      {totalDe(counts) === 0 ? (
        <p className="text-hueso-dim text-sm">
          Sin chivos en el radar todavía.
        </p>
      ) : (
        <svg
          viewBox="-3 -3 106 106"
          className="aspect-square w-full max-w-[248px]"
          aria-label="Chivos por provincia"
        >
          {SPECS.map(({ p, d, halo }) => {
            const n = counts[p.name] ?? 0;
            const sig = signal(counts, p.name);
            const isActive = active === p.name;
            const label = `${p.name}, ${n} ${n === 1 ? "chivo" : "chivos"}`;

            return (
              <Link
                key={p.name}
                href={hrefFor(slugify(p.name))}
                className="province-link"
                aria-label={label}
              >
                <title>{label}</title>
                {/* el color es lo único en línea; el resto lo decide el CSS
                    para que hover y foco puedan subirlo */}
                <path
                  className="prov-shape"
                  d={d}
                  data-sig={sig}
                  data-active={isActive ? "true" : undefined}
                  fillRule="evenodd"
                  vectorEffect="non-scaling-stroke"
                  style={{ fill: n > 0 ? p.color : "transparent" }}
                />
                {/* ensancha el área sensible; el trazo es el que recibe el clic */}
                <path
                  d={d}
                  fill="transparent"
                  stroke="transparent"
                  strokeWidth={halo}
                  pointerEvents="stroke"
                />
              </Link>
            );
          })}
        </svg>
      )}
    </div>
  );
}

function BarsVariant({ counts, active, onSelect, className }: BarsProps) {
  const ranked = PROVINCES.map((p) => ({ p, n: counts[p.name] ?? 0 })).sort(
    (a, b) => b.n - a.n,
  );
  const max = Math.max(1, ...ranked.map((r) => r.n));

  return (
    <ul className={className}>
      {ranked.map(({ p, n }) => {
        const isActive = active === p.name;
        return (
          <li key={p.name}>
            <button
              onClick={() => onSelect(isActive ? null : p.name)}
              aria-pressed={isActive}
              className={`prov-row group -mx-2 flex w-[calc(100%+1rem)] items-center gap-2 rounded-md px-2 py-1 text-left ${
                isActive ? "bg-hueso/[0.07]" : ""
              }`}
            >
              <span
                className="prov-rule w-1 shrink-0 self-stretch rounded-full"
                style={
                  {
                    background: p.color,
                    "--o": n > 0 ? (isActive ? 1 : 0.65) : 0.2,
                    "--oh": n > 0 ? 1 : 0.45,
                  } as React.CSSProperties
                }
              />
              <span
                className={`w-[76px] shrink-0 truncate text-xs transition-colors ${
                  n === 0
                    ? "text-hueso-dim/45 group-hover:text-hueso-dim"
                    : isActive
                      ? "text-hueso"
                      : "text-hueso-dim group-hover:text-hueso"
                }`}
              >
                {p.name}
              </span>
              {/* carril: le da algo contra lo que se enciende la barra */}
              <span className="h-1 min-w-0 flex-1 rounded-full bg-hueso/[0.07]">
                <span
                  className="prov-fill block h-full rounded-full transition-[width] duration-300"
                  style={
                    {
                      width: n > 0 ? `${Math.max(5, (n / max) * 100)}%` : "0%",
                      background: p.color,
                      "--o": n > 0 ? (isActive ? 1 : 0.55) : 0,
                      "--oh": 1,
                    } as React.CSSProperties
                  }
                />
              </span>
              <span
                className={`w-5 shrink-0 text-right font-mono text-[11px] tabular-nums transition-colors ${
                  n > 0
                    ? "text-hueso"
                    : "text-hueso-dim/40 group-hover:text-hueso-dim"
                }`}
              >
                {n}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function ProvinceSignal(props: Props) {
  return props.variant === "bars" ? (
    <BarsVariant {...props} />
  ) : (
    <MapVariant {...props} />
  );
}
