// Conjunto de eventos de desarrollo para cuando la base de datos está vacía.
// Reproduce la forma exacta que devuelve GET /api/fetch.

export interface MockVenue {
  nombre: string;
  slug: string;
  direccion: string;
  coordinates: [number, number]; // [lng, lat]
  latitud: number;
  longitud: number;
}

export interface MockTier {
  nombre: string;
  precio: number;
  moneda: string;
}

export interface MockEvent {
  id: string;
  titulo: string;
  artista: string;
  categoria: string;
  fechaHora: string;
  descripcion: string;
  link: string;
  urlImagen: string;
  venueObj: MockVenue;
  venue: string;
  date: string;
  tiersPrecio: MockTier[];
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=70`;

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: "mock-peppers-1",
    titulo: "Los Cafetales - Noche de Garage",
    artista: "Los Cafetales",
    categoria: "Rock",
    fechaHora: "2026-10-10T21:00:00",
    descripcion:
      "Garage rock del Valle Central con guitarras crudas y ruido de vecindario. Entrada joven por izquierda.",
    link: "https://starticket.cr/e/los-cafetales-noche-de-garage/9001",
    urlImagen: img("photo-1501386761578-eac5c94b800a"),
    venueObj: {
      nombre: "Peppers Club",
      slug: "peppers-club",
      direccion: "Barrio Escalante, 75 m este de la iglesia",
      coordinates: [-84.0902, 9.9338],
      latitud: 9.9338,
      longitud: -84.0902,
    },
    venue: "Peppers Club",
    date: fmt("2026-10-10T21:00:00"),
    tiersPrecio: [{ nombre: "General", precio: 12000, moneda: "CRC" }],
  },
  {
    id: "mock-peppers-2",
    titulo: "Reggae Limón - Vibra Caribe",
    artista: "Reggae Limón",
    categoria: "Reggae",
    fechaHora: "2026-10-24T20:00:00",
    descripcion:
      "Reggae roots con influencia caribeña. Riddim lento, gente buena y marquesinas.",
    link: "https://starticket.cr/e/reggae-limon-vibra-caribe/9002",
    urlImagen: img("photo-1459749411175-04bf5292ceea"),
    venueObj: {
      nombre: "Peppers Club",
      slug: "peppers-club",
      direccion: "Barrio Escalante, 75 m este de la iglesia",
      coordinates: [-84.0902, 9.9338],
      latitud: 9.9338,
      longitud: -84.0902,
    },
    venue: "Peppers Club",
    date: fmt("2026-10-24T20:00:00"),
    tiersPrecio: [
      { nombre: "General", precio: 10000, moneda: "CRC" },
      { nombre: "VIP", precio: 18000, moneda: "CRC" },
    ],
  },
  {
    id: "mock-peppers-3",
    titulo: "Salsa Bocaracá - Bailadera",
    artista: "Salsa Bocaracá",
    categoria: "Salsa",
    fechaHora: "2026-11-06T21:30:00",
    descripcion:
      "Salsa dura con timbal y trompeta. Pista llena garantizada desde la primera pieza.",
    link: "https://starticket.cr/e/salsa-bocaraca-bailadera/9003",
    urlImagen: img("photo-1429962714451-bb934ecdc4ec"),
    venueObj: {
      nombre: "Peppers Club",
      slug: "peppers-club",
      direccion: "Barrio Escalante, 75 m este de la iglesia",
      coordinates: [-84.0902, 9.9338],
      latitud: 9.9338,
      longitud: -84.0902,
    },
    venue: "Peppers Club",
    date: fmt("2026-11-06T21:30:00"),
    tiersPrecio: [{ nombre: "General", precio: 14000, moneda: "CRC" }],
  },
  {
    id: "mock-aduana-1",
    titulo: "Tropikore - Electrónica al Aire Libre",
    artista: "Tropikore",
    categoria: "Electrónica",
    fechaHora: "2026-10-17T19:00:00",
    descripcion:
      "Noche de DJs en la plaza de la Antigua Aduana. Llevá suéter, cae sereno.",
    link: "https://starticket.cr/e/tropikore-electronica/9004",
    urlImagen: img("photo-1470229722913-7c0e2dbbafd3"),
    venueObj: {
      nombre: "La Antigua Aduana",
      slug: "la-antigua-aduana",
      direccion: "Calle 23, Avenida 3, Barrio La California",
      coordinates: [-84.0742, 9.9343],
      latitud: 9.9343,
      longitud: -84.0742,
    },
    venue: "La Antigua Aduana",
    date: fmt("2026-10-17T19:00:00"),
    tiersPrecio: [
      { nombre: "General", precio: 9000, moneda: "CRC" },
      { nombre: "VIP Terraza", precio: 20000, moneda: "CRC" },
    ],
  },
  {
    id: "mock-aduana-2",
    titulo: "Chorro de Luz - Concierto Aniversario",
    artista: "Chorro de Luz",
    categoria: "Rock",
    fechaHora: "2026-11-20T18:00:00",
    descripcion:
      "La banda de rock nacional celebra una década con invitados sorpresa y set doble.",
    link: "https://starticket.cr/e/chorro-de-luz-aniversario/9005",
    urlImagen: img("photo-1506157786151-b8491531f063"),
    venueObj: {
      nombre: "La Antigua Aduana",
      slug: "la-antigua-aduana",
      direccion: "Calle 23, Avenida 3, Barrio La California",
      coordinates: [-84.0742, 9.9343],
      latitud: 9.9343,
      longitud: -84.0742,
    },
    venue: "La Antigua Aduana",
    date: fmt("2026-11-20T18:00:00"),
    tiersPrecio: [{ nombre: "General", precio: 16000, moneda: "CRC" }],
  },
  {
    id: "mock-jazzescazu-1",
    titulo: "Canela y Miel - Jazz y Vino",
    artista: "Canela y Miel",
    categoria: "Jazz",
    fechaHora: "2026-10-15T20:00:00",
    descripcion:
      "Jazz fusión con voz y cello. Mesa reservada con copa de vino incluida en la entrada VIP.",
    link: "https://starticket.cr/e/canela-y-miel-jazz-vino/9006",
    urlImagen: img("photo-1511671782779-c97d3d27a1d4"),
    venueObj: {
      nombre: "Jazz Café Escazú",
      slug: "jazz-cafe-escazu",
      direccion: "Plaza Colonial, Escazú",
      coordinates: [-84.14, 9.94],
      latitud: 9.94,
      longitud: -84.14,
    },
    venue: "Jazz Café Escazú",
    date: fmt("2026-10-15T20:00:00"),
    tiersPrecio: [
      { nombre: "General", precio: 15000, moneda: "CRC" },
      { nombre: "Mesa VIP", precio: 25000, moneda: "CRC" },
    ],
  },
  {
    id: "mock-jazzescazu-2",
    titulo: "El Combo del Bato - Rock Acústico",
    artista: "El Combo del Bato",
    categoria: "Rock",
    fechaHora: "2026-11-13T20:30:00",
    descripcion:
      "Set desenchufado del combo favorito del país. Los clásicos en su versión más íntima.",
    link: "https://starticket.cr/e/el-combo-del-bato-acustico/9007",
    urlImagen: img("photo-1505245208761-ba872912fac0"),
    venueObj: {
      nombre: "Jazz Café Escazú",
      slug: "jazz-cafe-escazu",
      direccion: "Plaza Colonial, Escazú",
      coordinates: [-84.14, 9.94],
      latitud: 9.94,
      longitud: -84.14,
    },
    venue: "Jazz Café Escazú",
    date: fmt("2026-11-13T20:30:00"),
    tiersPrecio: [{ nombre: "General", precio: 13000, moneda: "CRC" }],
  },
  {
    id: "mock-melico",
    titulo: "La Nueva Estudiantina - Salsa Sinfónica",
    artista: "La Nueva Estudiantina",
    categoria: "Salsa",
    fechaHora: "2026-12-04T19:30:00",
    descripcion:
      "Salsa con orquesta completa en el teatro más tradicional del país. Gala de fin de año.",
    link: "https://starticket.cr/e/estudiantina-salsa-sinfonica/9008",
    urlImagen: img("photo-1524368535928-5b5e00ddc76b"),
    venueObj: {
      nombre: "Teatro Melico Salazar",
      slug: "teatro-melico-salazar",
      direccion: "Avenida 2, Calle 1, Centro de San José",
      coordinates: [-84.0811, 9.9352],
      latitud: 9.9352,
      longitud: -84.0811,
    },
    venue: "Teatro Melico Salazar",
    date: fmt("2026-12-04T19:30:00"),
    tiersPrecio: [
      { nombre: "Balcón", precio: 18000, moneda: "CRC" },
      { nombre: "Platina", precio: 28000, moneda: "CRC" },
      { nombre: "VIP", precio: 40000, moneda: "CRC" },
    ],
  },
  {
    id: "mock-hangar",
    titulo: "Metal Tico - Descarga Eléctrica",
    artista: "Metal Tico",
    categoria: "Metal",
    fechaHora: "2026-10-30T21:00:00",
    descripcion:
      "Noche de metal pesado en pleno Barrio Chino. Cuello listo para el headbanging.",
    link: "https://starticket.cr/e/metal-tico-descarga/9009",
    urlImagen: img("photo-1533174072545-7a4b6ad7a6c3"),
    venueObj: {
      nombre: "El Hangar",
      slug: "el-hangar",
      direccion: "Avenida 3, Barrio Chino, San José",
      coordinates: [-84.0776, 9.9357],
      latitud: 9.9357,
      longitud: -84.0776,
    },
    venue: "El Hangar",
    date: fmt("2026-10-30T21:00:00"),
    tiersPrecio: [{ nombre: "General", precio: 11000, moneda: "CRC" }],
  },
  {
    id: "mock-ambar-1",
    titulo: "Vibra Pura - Indie Tico",
    artista: "Vibra Pura",
    categoria: "Indie",
    fechaHora: "2026-10-23T20:00:00",
    descripcion:
      "Indie pop con sintetizadores y letras que hablan de la ciudad. Noche íntima en Heredia.",
    link: "https://starticket.cr/e/vibra-pura-indie/9010",
    urlImagen: img("photo-1493225457124-a3eb161ffa5f"),
    venueObj: {
      nombre: "Ámbar",
      slug: "ambar",
      direccion: "San Rafael de Heredia, contiguo a la plaza",
      coordinates: [-84.1167, 10.0],
      latitud: 10.0,
      longitud: -84.1167,
    },
    venue: "Ámbar",
    date: fmt("2026-10-23T20:00:00"),
    tiersPrecio: [{ nombre: "General", precio: 8000, moneda: "CRC" }],
  },
  {
    id: "mock-ambar-2",
    titulo: "Fuego Verde - Rave de Colina",
    artista: "Fuego Verde",
    categoria: "Electrónica",
    fechaHora: "2026-11-27T22:00:00",
    descripcion:
      "Techno y house en la colina de Heredia. Dj set hasta que amanezca el cafetal.",
    link: "https://starticket.cr/e/fuego-verde-rave/9011",
    urlImagen: img("photo-1470229722913-7c0e2dbbafd3"),
    venueObj: {
      nombre: "Ámbar",
      slug: "ambar",
      direccion: "San Rafael de Heredia, contiguo a la plaza",
      coordinates: [-84.1167, 10.0],
      latitud: 10.0,
      longitud: -84.1167,
    },
    venue: "Ámbar",
    date: fmt("2026-11-27T22:00:00"),
    tiersPrecio: [
      { nombre: "General", precio: 15000, moneda: "CRC" },
      { nombre: "VIP", precio: 30000, moneda: "CRC" },
    ],
  },
  {
    id: "mock-fabrica",
    titulo: "Los Palenques - Rock Volcán",
    artista: "Los Palenques",
    categoria: "Rock",
    fechaHora: "2026-11-14T19:00:00",
    descripcion:
      "Rock con raíces de guanacaste y tierra volcánica. Festival de cerveza artesanal al lado.",
    link: "https://starticket.cr/e/los-palenques-rock-volcan/9012",
    urlImagen: img("photo-1501386761578-eac5c94b800a"),
    venueObj: {
      nombre: "La Fábrica",
      slug: "la-fabrica",
      direccion: "Alajuela centro, 100 m norte del parque",
      coordinates: [-84.211, 10.018],
      latitud: 10.018,
      longitud: -84.211,
    },
    venue: "La Fábrica",
    date: fmt("2026-11-14T19:00:00"),
    tiersPrecio: [{ nombre: "General", precio: 9000, moneda: "CRC" }],
  },
  {
    id: "mock-ruinas",
    titulo: "Río Claro - Coro de Ruinas",
    artista: "Río Claro",
    categoria: "Indie",
    fechaHora: "2026-12-12T18:00:00",
    descripcion:
      "Concierto al atardecer entre las ruinas de la iglesia. Entrada libre hasta llenar.",
    link: "https://starticket.cr/e/rio-claro-ruinas/9013",
    urlImagen: img("photo-1516450360452-9312f5e86fc7"),
    venueObj: {
      nombre: "Ruinas de Cartago",
      slug: "ruinas-de-cartago",
      direccion: "Cartago centro, contiguo a la Basílica",
      coordinates: [-83.9194, 9.8644],
      latitud: 9.8644,
      longitud: -83.9194,
    },
    venue: "Ruinas de Cartago",
    date: fmt("2026-12-12T18:00:00"),
    tiersPrecio: [{ nombre: "Entrada libre", precio: 0, moneda: "CRC" }],
  },
  {
    id: "mock-liberia",
    titulo: "La Yegüita - Sabanera en vivo",
    artista: "La Yegüita",
    categoria: "Rock",
    fechaHora: "2026-11-21T19:00:00",
    descripcion:
      "Fiesta sabanera con rock de Guanacaste. Botas y sombrero bienvenidos, pura vida garantizada.",
    link: "https://starticket.cr/e/la-yeguita-sabanera/9014",
    urlImagen: img("photo-1508700115892-45ecd05ae2ad"),
    venueObj: {
      nombre: "Teatro Liberia",
      slug: "teatro-liberia",
      direccion: "Liberia centro, frente al parque central",
      coordinates: [-85.4377, 10.635],
      latitud: 10.635,
      longitud: -85.4377,
    },
    venue: "Teatro Liberia",
    date: fmt("2026-11-21T19:00:00"),
    tiersPrecio: [{ nombre: "General", precio: 8000, moneda: "CRC" }],
  },
  {
    id: "mock-cocos",
    titulo: "Son de Mangle - Sunset Reggae",
    artista: "Son de Mangle",
    categoria: "Reggae",
    fechaHora: "2026-11-07T16:00:00",
    descripcion:
      "Reggae al atardecer frente a la playa. Arena, brisa y buen sonido.",
    link: "https://starticket.cr/e/son-de-mangle-sunset/9015",
    urlImagen: img("photo-1429962714451-bb934ecdc4ec"),
    venueObj: {
      nombre: "Cocos Beach Bar",
      slug: "cocos-beach-bar",
      direccion: "Playa del Coco, frente al mar",
      coordinates: [-85.702, 10.553],
      latitud: 10.553,
      longitud: -85.702,
    },
    venue: "Cocos Beach Bar",
    date: fmt("2026-11-07T16:00:00"),
    tiersPrecio: [{ nombre: "General", precio: 7000, moneda: "CRC" }],
  },
  {
    id: "mock-roble",
    titulo: "Cumbia del Pacífico - Muelle en Fiesta",
    artista: "Cumbia del Pacífico",
    categoria: "Salsa",
    fechaHora: "2026-10-31T19:00:00",
    descripcion:
      "Cumbia y salsa junto al muelle de Puntarenas. Noche de farol y comida de mar.",
    link: "https://starticket.cr/e/cumbia-pacifico-muelle/9016",
    urlImagen: img("photo-1429962714451-bb934ecdc4ec"),
    venueObj: {
      nombre: "El Roble",
      slug: "el-roble",
      direccion: "Puntarenas, paseo de los turistas",
      coordinates: [-84.8337, 9.977],
      latitud: 9.977,
      longitud: -84.8337,
    },
    venue: "El Roble",
    date: fmt("2026-10-31T19:00:00"),
    tiersPrecio: [{ nombre: "General", precio: 6000, moneda: "CRC" }],
  },
  {
    id: "mock-jaco",
    titulo: "Reggae Jacó - Fin de Semana Largo",
    artista: "Reggae Jacó",
    categoria: "Reggae",
    fechaHora: "2026-12-05T20:00:00",
    descripcion:
      "Tres bandas, una tarima al aire libre en Jacó. El fin de semana más largo del año.",
    link: "https://starticket.cr/e/reggae-jaco-fds/9017",
    urlImagen: img("photo-1516450360452-9312f5e86fc7"),
    venueObj: {
      nombre: "Jacó Beach Stage",
      slug: "jaco-beach-stage",
      direccion: "Jacó, avenida Pastor Díaz",
      coordinates: [-84.63, 9.613],
      latitud: 9.613,
      longitud: -84.63,
    },
    venue: "Jacó Beach Stage",
    date: fmt("2026-12-05T20:00:00"),
    tiersPrecio: [
      { nombre: "General", precio: 10000, moneda: "CRC" },
      { nombre: "VIP", precio: 22000, moneda: "CRC" },
    ],
  },
  {
    id: "mock-selvatica-1",
    titulo: "Selvática Reggae - Fiesta de Playa",
    artista: "Selvática Reggae",
    categoria: "Reggae",
    fechaHora: "2026-10-18T21:00:00",
    descripcion:
      "El reggae de Puerto Viejo en su casa. Riddim junto a la selva y el mar caribeño.",
    link: "https://starticket.cr/e/selvatica-reggae/9018",
    urlImagen: img("photo-1459749411175-04bf5292ceea"),
    venueObj: {
      nombre: "Selvática",
      slug: "selvatica",
      direccion: "Puerto Viejo de Talamanca, a 200 m del mar",
      coordinates: [-82.772, 9.656],
      latitud: 9.656,
      longitud: -82.772,
    },
    venue: "Selvática",
    date: fmt("2026-10-18T21:00:00"),
    tiersPrecio: [{ nombre: "General", precio: 5000, moneda: "CRC" }],
  },
  {
    id: "mock-selvatica-2",
    titulo: "Fuego Caribe - Electrónica en la Selva",
    artista: "Fuego Caribe",
    categoria: "Electrónica",
    fechaHora: "2026-11-28T22:00:00",
    descripcion:
      "House y afrobeat entre la vegetación. Fiesta bajo las estrellas de Talamanca.",
    link: "https://starticket.cr/e/fuego-caribe-electronica/9019",
    urlImagen: img("photo-1470229722913-7c0e2dbbafd3"),
    venueObj: {
      nombre: "Selvática",
      slug: "selvatica",
      direccion: "Puerto Viejo de Talamanca, a 200 m del mar",
      coordinates: [-82.772, 9.656],
      latitud: 9.656,
      longitud: -82.772,
    },
    venue: "Selvática",
    date: fmt("2026-11-28T22:00:00"),
    tiersPrecio: [
      { nombre: "General", precio: 12000, moneda: "CRC" },
      { nombre: "VIP", precio: 25000, moneda: "CRC" },
    ],
  },
  {
    id: "mock-blackstar",
    titulo: "Calypso Caribe - Noche de Limón",
    artista: "Calypso Caribe",
    categoria: "Salsa",
    fechaHora: "2026-12-13T20:00:00",
    descripcion:
      "Calypso y son caribeño en el corazón de Limón. Ritmo de tambor y gente de toda la provincia.",
    link: "https://starticket.cr/e/calypso-caribe-limon/9020",
    urlImagen: img("photo-1493225457124-a3eb161ffa5f"),
    venueObj: {
      nombre: "Black Star Line",
      slug: "black-star-line",
      direccion: "Limón centro, parque Vargas",
      coordinates: [-83.036, 9.9907],
      latitud: 9.9907,
      longitud: -83.036,
    },
    venue: "Black Star Line",
    date: fmt("2026-12-13T20:00:00"),
    tiersPrecio: [{ nombre: "General", precio: 9000, moneda: "CRC" }],
  },
];

