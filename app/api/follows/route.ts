import { NextResponse } from "next/server";
import { getSessionUsuario } from "@/lib/auth/session";
import { seguirVenue, venueExiste, venuesSeguidos } from "@/db/follows";

// GET /api/follows → lugares que sigue el usuario actual
export async function GET() {
  const usuario = await getSessionUsuario();
  if (!usuario) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const seguimientos = await venuesSeguidos(usuario._id);
  return NextResponse.json({ seguimientos });
}

// POST /api/follows { venueId } → seguir un lugar
export async function POST(req: Request) {
  const usuario = await getSessionUsuario();
  if (!usuario) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let venueId: unknown;
  try {
    const body = await req.json();
    venueId = body?.venueId;
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  if (typeof venueId !== "string" || !(await venueExiste(venueId))) {
    return NextResponse.json({ error: "Lugar inválido" }, { status: 400 });
  }

  await seguirVenue(usuario._id, venueId);
  return NextResponse.json({ ok: true });
}