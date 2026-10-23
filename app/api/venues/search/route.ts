import { NextResponse } from "next/server";
import { connectDB } from "@/db/mongodb";
import Venue from "@/models/venue";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (q.length < 2) {
      return NextResponse.json({ venues: [] });
    }

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const venues = await Venue.find(
      { $or: [{ nombre: regex }, { slug: regex }] },
      { nombre: 1, slug: 1, ubicacion: 1, direccion: 1 },
    )
      .limit(10)
      .lean();

    const result = venues.map((v: Record<string, unknown>) => {
      const ubicacion = v.ubicacion as { coordinates?: number[] } | undefined;
      return {
        id: String(v._id),
        nombre: v.nombre as string | undefined,
        slug: v.slug as string | undefined,
        direccion: (v.direccion as string | undefined) || null,
        coordinates: ubicacion?.coordinates || null,
      };
    });

    return NextResponse.json({ venues: result });
  } catch (error) {
    console.error("Error searching venues:", error);
    return NextResponse.json({ venues: [] }, { status: 500 });
  }
}
