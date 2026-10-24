import { NextResponse } from "next/server";
import { getSessionUsuario } from "@/lib/auth/session";
import { createSubmission, hasRecentSubmission } from "@/db/submissions";
import { venueExiste } from "@/db/follows";
import Evento from "@/models/evento";
import { connectDB } from "@/db/mongodb";

function isValidHttpUrl(s: string) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const usuario = await getSessionUsuario();
  if (!usuario) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const type = body?.type === "new_venue_and_event" ? "new_venue_and_event" : "event_for_existing_venue";
  const venueId = typeof body?.venueId === "string" ? body.venueId : null;
  const titulo = typeof body?.titulo === "string" ? body.titulo.trim() : "";
  const categoria = typeof body?.categoria === "string" ? body.categoria.trim() : "";
  const fechaHoraStr = typeof body?.fechaHora === "string" ? body.fechaHora : "";
  const link = typeof body?.link === "string" ? body.link.trim() : "";
  const descripcion = typeof body?.descripcion === "string" ? body.descripcion.trim() : "";
  const urlImagen = typeof body?.urlImagen === "string" ? body.urlImagen.trim() : "";
  const proof = typeof body?.proof === "string" ? body.proof.trim() : "";
  const venueDraft = body?.venueDraft && typeof body.venueDraft === "object" ? body.venueDraft : null;

  if (!titulo || !categoria || !fechaHoraStr || !link) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  if (!isValidHttpUrl(link)) {
    return NextResponse.json({ error: "Link inválido" }, { status: 400 });
  }

  if (urlImagen && !isValidHttpUrl(urlImagen)) {
    return NextResponse.json({ error: "URL de imagen inválida" }, { status: 400 });
  }

  if (proof && !isValidHttpUrl(proof)) {
    return NextResponse.json({ error: "URL de prueba inválida" }, { status: 400 });
  }

  const fechaHora = new Date(fechaHoraStr);
  if (isNaN(fechaHora.getTime())) {
    return NextResponse.json({ error: "Fecha/hora inválida" }, { status: 400 });
  }
  if (fechaHora.getTime() <= Date.now()) {
    return NextResponse.json({ error: "La fecha debe ser futura" }, { status: 400 });
  }

  if (type === "event_for_existing_venue") {
    if (!venueId) {
      return NextResponse.json({ error: "Debés seleccionar un lugar" }, { status: 400 });
    }
    const exists = await venueExiste(venueId);
    if (!exists) {
      return NextResponse.json({ error: "Lugar inválido" }, { status: 400 });
    }
  } else if (type === "new_venue_and_event") {
    if (!venueDraft) {
      return NextResponse.json({ error: "Faltan datos del lugar" }, { status: 400 });
    }
  }

  // rate limit: max 1 submission per 24h (pending/approved)
  if (await hasRecentSubmission(usuario._id, 24)) {
    return NextResponse.json({ error: "Ya tenés un envío pendiente o aprobado en las últimas 24 horas" }, { status: 429 });
  }

  await connectDB();
  const existing = await Evento.findOne({ link }).lean();
  if (existing) {
    return NextResponse.json({ error: "Ya existe un evento con ese link" }, { status: 400 });
  }

  try {
    await createSubmission({
      type,
      submittedBy: usuario._id,
      venueId: type === "event_for_existing_venue" ? venueId : null,
      venueDraft: type === "new_venue_and_event" && venueDraft && typeof venueDraft === "object" ? (venueDraft as Record<string, unknown>) : null,
      event: {
        titulo,
        categoria,
        fechaHora,
        descripcion: descripcion || null,
        link,
        urlImagen: urlImagen || null,
      },
      proof: proof || null,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("Error creating submission:", e);
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 });
  }
}
