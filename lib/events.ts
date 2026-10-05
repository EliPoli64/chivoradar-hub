/**
 * Feed de eventos: caché de lectura y API pública. La lectura a Mongo vive en
 * `db/events.ts`; acá no hay ni una consulta.
 *
 * Todas las funciones son de lectura y nunca lanzan: si la DB o la caché
 * fallan se devuelve MOCK_EVENTS para que la página siga viva.
 */
import { loadEventos } from "@/db/events";
import { provinceForPoint, PROVINCE_BY_SLUG } from "@/lib/cr-provinces";
import { KEYS, getCached, setCached, getTTL } from "@/lib/redis";
import { MOCK_EVENTS } from "@/lib/mockEvents";
import { distinctCategorias, isSinCategoria, type GigEvent } from "@/lib/venues";

function isUpcoming(e: GigEvent): boolean {
  return new Date(e.fechaHora).getTime() >= Date.now();
}

export async function getEventsFeed(): Promise<GigEvent[]> {
  const key = KEYS.events;
  const cached = await getCached<GigEvent[]>(key);
  // aunque la caché sea reciente, recortar chivos que ya pasaron
  if (cached) return cached.filter(isUpcoming);

  const events = await loadEventos();
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
  const upcoming = events.filter(isUpcoming);
  await setCached(key, upcoming, getTTL());
  return upcoming;
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

export async function getEventById(id: string): Promise<GigEvent | null> {
  const feed = await getEventsFeed();
  return feed.find((e) => e.id === id) ?? null;
}

export async function getEventByIdSafe(id: string): Promise<GigEvent | null> {
  try {
    return await getEventById(id);
  } catch {
    return MOCK_EVENTS.filter(isUpcoming).find((e) => e.id === id) ?? null;
  }
}