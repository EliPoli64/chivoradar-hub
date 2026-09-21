# Chivo Radar

The best map for live music in Costa Rica. From underground garage bands to stadium tours. Find your next gig ("chivo") across the country.

## Features

- **Interactive Map** — Live map (Leaflet) with event pins across the country, grouped by zone with animated clusters.
- **Live Radar** — Real-time counter of gigs found.
- **Event Grid** — Recommended events ("Cerca Tuyo") with image cards, genre, venue, and date.
- **Genre Filters** — Filter bar (Rock, Electronic, Metal, Jazz, Reggae, Indie, Salsa).
- **Search** — By artist, genre, or venue.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- [Tailwind CSS 4](https://tailwindcss.com)
- [MongoDB](https://www.mongodb.com) + [Mongoose](https://mongoosejs.com)
- [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) + [react-leaflet-cluster](https://www.npmjs.com/package/react-leaflet-cluster)

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or remote)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```
CONN_STRING=mongodb://localhost:27017/loudmap
```

> `CONN_STRING` is the MongoDB connection string. If not set, it defaults to `mongodb://localhost:27017/loudmap`.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
├── api/fetch/       # API route: events with venues and price tiers
├── layout.tsx       # Root layout (metadata: "Chivo Radar")
└── page.tsx         # Home: Hero, live map, event grid, footer
components/
├── events/          # EventCard, EventGrid, FilterBar
├── Hero.tsx         # Hero with search bar
├── LiveMap.tsx      # Map wrapper with animated skeleton
├── Map.tsx          # Leaflet map with clusters and popups
├── Navbar.tsx
└── Footer.tsx
db/
└── mongodb.ts       # MongoDB connection with Mongoose
models/              # Mongoose models: Evento, Venue, TierPrecio
```

## Data Models

- **Evento** — Title, category, image, location (ref to `Venue`), date/time, description, ticketing link.
- **Venue** — Name, slug, GeoJSON coordinates `[longitude, latitude]`, address, social media links.
- **TierPrecio** — Priced tier per event (e.g., VIP, General, etc.).

## API

### `GET /api/fetch`

Returns events with their venues and price tiers, sorted by date. Each event includes: `id`, `titulo`, `artista`, `categoria`, `fechaHora`, `descripcion`, `link`, `urlImagen`, `venueObj` (with `lat`/`lng`), `venue`, and `tiersPrecio`.

## Roadmap / In Progress

- User gig submissions ("+ Add Your Gig")
- Province-based exploration routes (`/explore`, `/venues`, `/submit`)
- Ticket-selling site scraping (moved to a separate repository)
