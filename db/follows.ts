// Acceso a `seguimientos`. Aristas usuario → venue. Ver dbstructure.md.
import mongoose from "mongoose";
import { connectDB } from "@/db/mongodb";
import Seguimiento from "@/models/seguimiento";
import Venue from "@/models/venue";

export async function venueExiste(venueId: string): Promise<boolean> {
  await connectDB();
  if (!mongoose.isValidObjectId(venueId)) return false;
  return Boolean(await Venue.exists({ _id: venueId }));
}

export async function seguirVenue(
  usuarioId: unknown,
  venueId: string,
  venueSlug?: string | null,
) {
  await connectDB();
  await Seguimiento.updateOne(
    { usuario: usuarioId, venue: venueId },
    {
      $setOnInsert: {
        usuario: usuarioId,
        venue: venueId,
        venueSlug: venueSlug ?? null,
      },
    },
    { upsert: true },
  );
}

export async function dejarDeSeguir(usuarioId: unknown, venueId: string) {
  await connectDB();
  await Seguimiento.deleteOne({ usuario: usuarioId, venue: venueId });
}

export async function leSigue(
  usuarioId: unknown,
  venueId: string | null | undefined,
): Promise<boolean> {
  if (!usuarioId || !venueId) return false;
  await connectDB();
  return Boolean(await Seguimiento.exists({ usuario: usuarioId, venue: venueId }));
}

export interface VenueSeguido {
  venueId: string;
  slug: string | null;
  nombre: string | null;
  seguidoDesde: Date | null;
}

export async function venuesSeguidos(usuarioId: unknown): Promise<VenueSeguido[]> {
  await connectDB();
  const segs = await Seguimiento.find({ usuario: usuarioId })
    .sort({ createdAt: -1 })
    .lean();
  if (!segs.length) return [];

  const ids = segs.map((s) => s.venue);
  const venues = await Venue.find({ _id: { $in: ids } })
    .select("_id nombre slug")
    .lean();
  const porId = new Map(venues.map((v) => [String(v._id), v]));

  return segs.map((s) => ({
    venueId: String(s.venue),
    slug: s.venueSlug || porId.get(String(s.venue))?.slug || null,
    nombre: porId.get(String(s.venue))?.nombre ?? null,
    seguidoDesde: s.createdAt ?? null,
  }));
}