import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSessionUsuario } from "@/lib/auth/session";
import { dejarDeSeguir } from "@/db/follows";

interface Context {
  params: Promise<{ venueId: string }>;
}

// DELETE /api/follows/[venueId] → dejar de seguir
export async function DELETE(_req: Request, context: Context) {
  const usuario = await getSessionUsuario();
  if (!usuario) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { venueId } = await context.params;
  if (!mongoose.isValidObjectId(venueId)) {
    return NextResponse.json({ error: "Lugar inválido" }, { status: 400 });
  }

  await dejarDeSeguir(usuario._id, venueId);
  return NextResponse.json({ ok: true });
}