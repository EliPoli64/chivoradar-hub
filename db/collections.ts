// Nombres de las colecciones. Fuente única de verdad: los modelos se fijan a
// estos nombres y las agregaciones los leen de los modelos, así el read path no
// puede desviarse de lo que hay en la DB. Ver dbstructure.md.
export const COLLECTIONS = {
  eventos: "eventos",
  venues: "venues",
  tiersPrecio: "tiersPrecio",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
