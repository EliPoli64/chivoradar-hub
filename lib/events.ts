import { connectDB } from '@/db/mongodb';
import Evento from '@/models/evento';
import { provinceForPoint, PROVINCE_BY_SLUG } from '@/lib/cr-provinces';
import { KEYS, getCached, setCached, getTTL } from '@/lib/redis';
import { MOCK_EVENTS } from '@/lib/mockEvents';
import { distinctCategorias, isSinCategoria, type GigEvent } from '@/lib/venues';

interface EventoRaw {
  _id: string;
  titulo: string;
  categoria: string;
  fechaHora: Date;
  descripcion: string | null;
  link: string;
  urlImagen: string | null;
  venueObj?: {
    nombre?: string;
    slug?: string;
    direccion?: string | null;
    coordinates?: number[] | null;
  } | null;
  tiersPrecio?: { nombre: string; precio: number; moneda: string }[];
}

export function formatEvent(event: EventoRaw): GigEvent {
  let fechaCorrecta = event.fechaHora;

  if (event.link && event.link.includes('eticket.cr')) {
    const urlParams = new URLSearchParams(event.link.split('?')[1]);
    const idevento = urlParams.get('idevento');

    if (idevento === '9339') {
      fechaCorrecta = new Date('2026-05-31T17:05:00');
    }
  }

  return {
    id: event._id,
    titulo: event.titulo,
    artista: event.titulo.split(' - ')[0] || event.titulo,
    categoria: event.categoria,
    fechaHora: fechaCorrecta.toISOString(),
    descripcion: event.descripcion || '',
    link: event.link,
    urlImagen: event.urlImagen || '',
    venueObj: {
      nombre: event.venueObj?.nombre || 'Lugar por confirmar',
      slug: event.venueObj?.slug,
      direccion: event.venueObj?.direccion ?? null,
      coordinates: event.venueObj?.coordinates ?? null,
    },
    venue: event.venueObj?.nombre || (event.titulo.includes('ANTIGUA ADUANA') ? 'Antigua Aduana' : 'Lugar por confirmar'),
    date: new Date(fechaCorrecta).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).replace(/\./g, ''),
    tiersPrecio: event.tiersPrecio || [],
  };
}

async function loadEventsFromMongo(): Promise<GigEvent[]> {
  await connectDB();

  const eventos = await Evento.aggregate<EventoRaw>([
    {
      $match: {
        fechaHora: { $exists: true, $ne: null, $gte: new Date() },
      },
    },
    {
      $lookup: {
        from: 'venues',
        localField: 'ubicacion',
        foreignField: '_id',
        as: 'venueInfo',
      },
    },
    {
      $unwind: {
        path: '$venueInfo',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'tiersprecios',
        localField: '_id',
        foreignField: 'evento',
        as: 'tiersPrecio',
      },
    },
    {
      $project: {
        _id: { $toString: '$_id' },
        titulo: 1,
        categoria: 1,
        fechaHora: 1,
        descripcion: 1,
        link: 1,
        urlImagen: 1,
        venueId: { $toString: '$venueInfo._id' },
        venueObj: {
          nombre: '$venueInfo.nombre',
          slug: '$venueInfo.slug',
          direccion: '$venueInfo.direccion',
          coordinates: '$venueInfo.ubicacion.coordinates',
          latitud: { $arrayElemAt: ['$venueInfo.ubicacion.coordinates', 1] },
          longitud: { $arrayElemAt: ['$venueInfo.ubicacion.coordinates', 0] },
        },
        tiersPrecio: {
          $map: {
            input: '$tiersPrecio',
            as: 'tier',
            in: {
              nombre: '$$tier.nombre',
              precio: '$$tier.precio',
              moneda: '$$tier.moneda',
            },
          },
        },
      },
    },
    {
      $sort: { fechaHora: 1 },
    },
  ]);

  return eventos.map(formatEvent);
}

function isUpcoming(e: GigEvent): boolean {
  return new Date(e.fechaHora).getTime() >= Date.now();
}

export async function getEventsFeed(): Promise<GigEvent[]> {
  const key = KEYS.events;
  const cached = await getCached<GigEvent[]>(key);
  // aunque la caché sea reciente, recortar chivos que ya pasaron
  if (cached) return cached.filter(isUpcoming);

  const events = await loadEventsFromMongo();
  await setCached(key, events, getTTL());
  return events;
}

export async function getVenueEvents(slug: string): Promise<GigEvent[]> {
  const key = KEYS.venue(slug);
  const cached = await getCached<GigEvent[]>(key);
  if (cached) return cached.filter(isUpcoming);

  const feed = await getEventsFeed();
  const events = feed.filter(
    (e) => e.venueObj?.slug === slug || e.venueId === slug || e.venue === slug,
  );
  await setCached(key, events, getTTL());
  return events;
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export async function getProvinceEvents(slug: string): Promise<GigEvent[]> {
  const key = KEYS.province(slug);
  const cached = await getCached<GigEvent[]>(key);
  if (cached) return cached;

  const feed = await getEventsFeed();
  const province = PROVINCE_BY_SLUG[normalize(slug)]?.name;
  if (!province) {
    await setCached(key, [], getTTL());
    return [];
  }
  const events = feed.filter((e) => {
    const coords = e.venueObj?.coordinates;
    if (!coords || !Array.isArray(coords) || coords.length !== 2) return false;
    return provinceForPoint(coords[0], coords[1]) === province;
  });
  await setCached(key, events.filter(isUpcoming), getTTL());
  return events.filter(isUpcoming);
}

export async function getEventsSafe(): Promise<GigEvent[]> {
  try {
    return await getEventsFeed();
  } catch {
    return MOCK_EVENTS.filter(isUpcoming);
  }
}

export async function getProvinceEventsSafe(slug: string): Promise<GigEvent[]> {
  try {
    return await getProvinceEvents(slug);
  } catch {
    const province = PROVINCE_BY_SLUG[normalize(slug)]?.name;
    return MOCK_EVENTS.filter((e) => {
      if (!isUpcoming(e)) return false;
      const coords = e.venueObj?.coordinates;
      if (!coords) return false;
      return province ? provinceForPoint(coords[0], coords[1]) === province : false;
    });
  }
}

export async function getVenueEventsSafe(slug: string): Promise<GigEvent[]> {
  try {
    return await getVenueEvents(slug);
  } catch {
    return MOCK_EVENTS.filter(
      (e) => isUpcoming(e) && (e.venueObj?.slug === slug || e.venue === slug),
    );
  }
}

export async function getCategories(): Promise<string[]> {
  const key = KEYS.categories;
  const cached = await getCached<string[]>(key);
  if (cached) return cached.filter((c) => !isSinCategoria(c));

  const feed = await getEventsFeed();
  const categories = distinctCategorias(feed);
  await setCached(key, categories, getTTL());
  return categories;
}

export async function getCategoriesSafe(): Promise<string[]> {
  try {
    return await getCategories();
  } catch {
    return distinctCategorias(MOCK_EVENTS);
  }
}