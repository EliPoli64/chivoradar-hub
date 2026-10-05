/**
 * Único camino de lectura a Mongo. Todo lo que la app consume del feed sale de
 * acá; `lib/events.ts` sólo cachea y expone.
 *
 * Los nombres de colección no están escritos como strings: se leen de los
 * modelos (`Venue.collection.name`), que a su vez los fijan con COLLECTIONS.
 * Antes el $lookup de precios decía "tiersprecios" mientras la colección real
 * es "tiersPrecio", y el lookup devolvía vacío sin avisar.
 *
 * Referencia de campos: dbstructure.md.
 */
import { connectDB } from "@/db/mongodb";
import Evento from "@/models/evento";
import Venue from "@/models/venue";
import TierPrecio from "@/models/tierPrecio";
import type { GigEvent, TierPrecioDoc } from "@/lib/venues";

/** Documento tal como lo devuelve la agregación (sin castear por mongoose). */
interface EventoRaw {
  _id: string;
  titulo: string;
  categoria: string;
  fechaHora: Date;
  descripcion: string | null;
  link: string;
  urlImagen: string | null;
  venueId: string | null;
  venueObj: {
    nombre: string | null;
    slug: string | null;
    direccion: string | null;
    coordinates: number[] | null;
  };
  tiersPrecio: TierPrecioDoc[];
}

/**
 * Fechas que el origen manda corridas y se corrigen a mano. El scraper es la
 * fuente de verdad; esta tabla es un parche puntual, no una regla.
 * Clave: el `idevento` de la url de eticket.
 */
const FECHA_CORREGIDA: Record<string, string> = {
  "9339": "2026-05-31T17:05:00",
};

function idEvento(link: string | null | undefined): string | null {
  if (!link?.includes("eticket.cr")) return null;
  return new URLSearchParams(link.split("?")[1] ?? "").get("idevento");
}

export function formatEvento(event: EventoRaw): GigEvent {
  const patch = FECHA_CORREGIDA[idEvento(event.link) ?? ""];
  const fechaHora = patch ? new Date(patch) : new Date(event.fechaHora);

  return {
    id: event._id,
    titulo: event.titulo,
    // el título del feed trae la fecha pegada ("X • 09 OCTUBRE • 08 PM")
    artista: event.titulo.split(" - ")[0] || event.titulo,
    categoria: event.categoria,
    fechaHora: fechaHora.toISOString(),
    descripcion: event.descripcion || "",
    link: event.link,
    urlImagen: event.urlImagen || "",
    venueId: event.venueId ?? undefined,
    venueObj: {
      nombre: event.venueObj.nombre || "Lugar por confirmar",
      slug: event.venueObj.slug ?? undefined,
      direccion: event.venueObj.direccion ?? null,
      coordinates: event.venueObj.coordinates ?? null,
    },
    venue:
      event.venueObj.nombre ||
      (event.titulo.includes("ANTIGUA ADUANA") ? "Antigua Aduana" : "Lugar por confirmar"),
    date: fechaHora
      .toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(/\./g, ""),
    tiersPrecio: event.tiersPrecio ?? [],
  };
}

/**
 * Eventos futuros con su lugar y sus precios resueltos en una sola pasada.
 * `collection.aggregate` saltea el schema a propósito (la proyección ya trae
 * las formas finales) pero respeta el nombre de colección que fijó el modelo.
 */
export async function loadEventos(): Promise<GigEvent[]> {
  await connectDB();

  const raw = await Evento.collection
    .aggregate<EventoRaw>([
      // los chivos que ya pasaron nunca interested al radar
      { $match: { fechaHora: { $exists: true, $ne: null, $gte: new Date() } } },

      // eventos → venues. Sin lugar el evento igual sirve, sólo pierde la foto
      // del mapa, así que se conserva con preserveNullAndEmptyArrays.
      {
        $lookup: {
          from: Venue.collection.name,
          localField: "ubicacion",
          foreignField: "_id",
          as: "venue",
        },
      },
      { $unwind: { path: "$venue", preserveNullAndEmptyArrays: true } },

      // eventos → tiersPrecio
      {
        $lookup: {
          from: TierPrecio.collection.name,
          localField: "_id",
          foreignField: "evento",
          as: "tiers",
        },
      },

      {
        $project: {
          _id: 1,
          titulo: 1,
          categoria: 1,
          fechaHora: 1,
          descripcion: 1,
          link: 1,
          urlImagen: 1,
          venueId: { $toString: "$venue._id" },
          venueObj: {
            nombre: "$venue.nombre",
            slug: "$venue.slug",
            direccion: "$venue.direccion",
            coordinates: "$venue.ubicacion.coordinates",
          },
          // los tiers sin zona / precioBase / cargo son documentos anteriores
          // al scraping de esos campos: vienen null y se muestran igual.
          tiersPrecio: {
            $map: {
              input: "$tiers",
              as: "t",
              in: {
                nombre: "$$t.nombre",
                precio: "$$t.precio",
                moneda: "$$t.moneda",
                zona: "$$t.zona",
                precioBase: "$$t.precioBase",
                cargo: "$$t.cargo",
              },
            },
          },
        },
      },

      { $sort: { fechaHora: 1 } },
    ])
    .toArray();

  return raw.map(formatEvento);
}
