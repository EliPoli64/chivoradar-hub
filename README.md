# Chivo Radar

El mejor mapa para música en vivo en Costa Rica. Del garaje al estadio, de San José a Limón.
Find your next gig ("chivo") across the country.

## Features

- **Map-first homepage** — A full-bleed live map (Leaflet + CARTO Voyager tiles) as the centerpiece. Venues are **painted carreta-wheel markers** in their province color, with a live event-count badge.
- **7 provinces, 7 colors** — Markers, filters, and navigation are colored by province (San José rojo, Alajuela dorado, Cartago guaria, Heredia rosa, Guanacaste turquesa, Puntarenas azul, Limón caribe). Province chips fly the map to each region.
- **Multiple events at one place** — Markers group **by venue**; clicking one opens a side panel listing every gig at that venue (date, price tiers, ticket links) instead of popups.
- **Search + genre filters** — Filter markers live by artist, venue, or genre; non-matching blips dim.
- **Smooth expansions** — Markers and clusters blip-in in sync with the map zoom (respects `prefers-reduced-motion`).
- **/explore** — Browse events by province (`?region=`), genre, or search, list-first.
- **/venues + /venues/[slug]** — Catalog of every place with upcoming gigs; each venue has a detail page with all its events and a mini map.
- **Upcoming only** — Past concerts are filtered out at the data layer.
- **Redis-cached** — The feed and venue/province lookups are cached in Upstash Redis.

## Design System

- Dark "night" page (`cafetal`) with a bright carreta-painted map as the source of color.
- Typography: **Alfa Slab One** (display), **Karla** (body), **IBM Plex Mono** (radar telemetry: counts, coordinates, prices).
- Logo: the **carreta-radar** — a slice of the painted oxcart wheel sweeping like radar, tipped with a music note.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- [Tailwind CSS 4](https://tailwindcss.com)
- [MongoDB](https://www.mongodb.com) + [Mongoose](https://mongoosejs.com)
- [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) + [react-leaflet-cluster](https://www.npmjs.com/package/react-leaflet-cluster)
- [Upstash Redis](https://upstash.com) (`@upstash/redis`) for response caching

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or remote)
- (optional) Upstash Redis REST URL + token — the app works without it, falling back to Mongo every request

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```
CONN_STRING=mongodb://localhost:27017/chivoradar
DB_NAME=chivoradar
NEXT_PUBLIC_CARTO_API_KEY=your_carto_api_key
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
CACHE_TTL_SECONDS=300
```

> `CONN_STRING` defaults to `mongodb://localhost:27017` and `DB_NAME` to `chivoradar`.
> `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are optional; if unset the API reads Mongo directly.
> `CACHE_TTL_SECONDS` is optional (default 300). Bump the cache key version in `lib/redis.ts` when the response shape changes.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

If MongoDB is down or empty, the UI falls back to a built-in mock dataset (`lib/mockEvents.ts`).

### Production Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Starts the dev server            |
| `npm run build` | Production build                 |
| `npm run start` | Starts the production server     |
| `npm run lint`  | Runs ESLint                      |

## Project Structure

```
app/
├── api/fetch/           # API route: upcoming events (venues + price tiers), Redis-cached
├── explore/page.tsx     # /explore — events by province/genre/search
├── venues/page.tsx      # /venues — venue catalog
├── venues/[slug]/       # /venues/[slug] — venue detail with mini map
├── layout.tsx           # Root layout (fonts, metadata, lang="es")
├── icon.svg             # SVG favicon (carreta-radar mark)
├── globals.css          # Design tokens, carreta palette, animations
└── page.tsx             # Home: full-bleed live map + "Cerca Tuyo" grid
components/
├── events/              # EventCard, EventGrid, EventList, EventSidePanel, FilterBar
├── explore/             # ExploreView (province/genre/search client filters)
├── venues/              # VenueCard, VenueMiniMap
├── Hero.tsx             # Map overlay: headline + live telemetry
├── LiveMap.tsx          # Map hero container (state + overlays)
├── Map.tsx              # Leaflet map: carreta markers, clusters, province nav
├── MapControls.tsx      # Search, province chips, genres, reset, telemetry
├── Logo.tsx             # Carreta-radar SVG mark
├── Navbar.tsx
└── Footer.tsx
lib/
├── cr-provinces.ts      # Province polygons, centroids, colors, slug resolution
├── events.ts            # Mongo aggregation + Redis cache + mock fallbacks
├── markers.ts           # Shared carreta-wheel marker HTML
├── mockEvents.ts        # Dev fallback dataset
├── redis.ts             # Upstash client + cache helpers + key versions
└── venues.ts            # Venue grouping, formatting, CR bounds
db/
└── mongodb.ts           # MongoDB connection with Mongoose
models/                  # Mongoose models: Evento, Venue, TierPrecio
```

## Data Models

- **Evento** — Title, category, image, location (ref to `Venue`), date/time, description, ticketing link.
- **Venue** — Name, slug, GeoJSON coordinates `[longitude, latitude]`, address, social media links.
- **TierPrecio** — Priced tier per event (e.g., VIP, General, etc.).

## API

### `GET /api/fetch`

Returns **upcoming** events (past concerts are filtered at the aggregation) with their venues and price tiers, sorted by date, and cached in Redis for `CACHE_TTL_SECONDS` (response header `Cache-Control: public, s-maxage=300, stale-while-revalidate=300`).

Each event includes: `id`, `titulo`, `artista`, `categoria`, `fechaHora`, `descripcion`, `link`, `urlImagen`, `venueId`, `venueObj` (with `coordinates` `[lng, lat]`), `venue`, and `tiersPrecio`.

## Roadmap / In Progress

- User gig submissions ("+ Posteá tu Chivo") — `/submit`
- Ticket-selling site scraping (moved to a separate repository)