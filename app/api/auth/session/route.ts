import { NextResponse } from "next/server";
import { createSession, destroySession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Falta idToken" }, { status: 400 });
    }
    await createSession(idToken);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "No se pudo crear la sesión" },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
