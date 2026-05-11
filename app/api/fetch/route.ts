import { NextResponse } from "next/server";

interface Evento {
  id: string;
  titulo: string;
  artista: string;
  categoria: string;
  fechaHora: string;
  descripcion: string;
  link: string;
  urlImagen: string;
  venueObj: {
    nombre: string;
    slug: string;
    direccion: string;
    coordenadas: [number, number];
  };
  title: string;
  artist: string;
  genre: string;
  venue: string;
  date: string;
  image: string;
}

const mockEventos: Evento[] = [
  {
    id: "1",
    titulo: "NaNDie en Vivo",
    artista: "NaNDie",
    categoria: "concierto",
    fechaHora: "2026-06-15T20:00:00",
    descripcion: "Noche de electrónica experimental con NaNDie en San José.",
    link: "https://example.com/nandie",
    urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    venueObj: { nombre: "Teatro Melico Salazar", slug: "teatro-melico-salazar", direccion: "Av. 2, San José", coordenadas: [-84.0813, 9.9333] },
    title: "NaNDie en Vivo",
    artist: "NaNDie",
    genre: "concierto",
    venue: "Teatro Melico Salazar",
    date: "15 jun 2026",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
  },
  {
    id: "2",
    titulo: "Festival de las Artes",
    artista: "Varios Artistas",
    categoria: "festival",
    fechaHora: "2026-07-04T14:00:00",
    descripcion: "Festival multidisciplinario en el Parque Metropolitano La Sabana.",
    link: "https://example.com/festival-artes",
    urlImagen: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    venueObj: { nombre: "Parque Metropolitano La Sabana", slug: "la-sabana", direccion: "San José", coordenadas: [-84.1067, 9.9375] },
    title: "Festival de las Artes",
    artist: "Varios Artistas",
    genre: "festival",
    venue: "Parque Metropolitano La Sabana",
    date: "4 jul 2026",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
  },
  {
    id: "3",
    titulo: "Tropikal Forever",
    artista: "Tropikal",
    categoria: "fiesta",
    fechaHora: "2026-05-30T22:00:00",
    descripcion: "La mejor música tropical en El Steinvorth.",
    link: "https://example.com/tropikal",
    urlImagen: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800",
    venueObj: { nombre: "El Steinvorth", slug: "el-steinvorth", direccion: "Barrio Escalante, San José", coordenadas: [-84.0645, 9.9347] },
    title: "Tropikal Forever",
    artist: "Tropikal",
    genre: "fiesta",
    venue: "El Steinvorth",
    date: "30 may 2026",
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800",
  },
  {
    id: "4",
    titulo: "Noche de Jazz",
    artista: "Jazz CR Ensamble",
    categoria: "concierto",
    fechaHora: "2026-06-08T19:30:00",
    descripcion: "Jazz fusión costarricense en el Jazz Café Escazú.",
    link: "https://example.com/jazz-cr",
    urlImagen: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800",
    venueObj: { nombre: "Jazz Café Escazú", slug: "jazz-cafe-escazu", direccion: "Escazú", coordenadas: [-84.1333, 9.9167] },
    title: "Noche de Jazz",
    artist: "Jazz CR Ensamble",
    genre: "concierto",
    venue: "Jazz Café Escazú",
    date: "8 jun 2026",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800",
  },
  {
    id: "5",
    titulo: "Electrocaribe",
    artista: "Sistema Solar",
    categoria: "fiesta",
    fechaHora: "2026-07-12T21:00:00",
    descripcion: "Electrónica con influencias caribeñas en el Puerto.",
    link: "https://example.com/electrocaribe",
    urlImagen: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800",
    venueObj: { nombre: "Puerto Viejo Stage", slug: "puerto-viejo-stage", direccion: "Puerto Viejo, Limón", coordenadas: [-82.7558, 9.6558] },
    title: "Electrocaribe",
    artist: "Sistema Solar",
    genre: "fiesta",
    venue: "Puerto Viejo Stage",
    date: "12 jul 2026",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800",
  },
  {
    id: "6",
    titulo: "Semana del Rock Tico",
    artista: "Gandhi, Akasha, 424",
    categoria: "festival",
    fechaHora: "2026-08-20T16:00:00",
    descripcion: "Tres días de rock nacional en el Peppers Club.",
    link: "https://example.com/rock-tico",
    urlImagen: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800",
    venueObj: { nombre: "Peppers Club", slug: "peppers-club", direccion: "San Pedro, San José", coordenadas: [-84.0524, 9.9341] },
    title: "Semana del Rock Tico",
    artist: "Gandhi, Akasha, 424",
    genre: "festival",
    venue: "Peppers Club",
    date: "20 ago 2026",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800",
  },
];

export const GET = async () => {
  return NextResponse.json(
    { success: true, data: mockEventos },
    { status: 200 }
  )
}