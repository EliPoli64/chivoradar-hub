// Gestión de envíos "Agregá tu chivo". Todo va a la cola con moderación.
import { connectDB } from "@/db/mongodb";
import Submission from "@/models/submission";
import type { Types } from "mongoose";

export interface CreateSubmissionInput {
  type?: "event_for_existing_venue" | "new_venue_and_event";
  submittedBy: Types.ObjectId | string;
  venueId?: Types.ObjectId | string | null;
  venueDraft?: Record<string, unknown> | null;
  event: {
    titulo: string;
    categoria: string;
    fechaHora: Date | string;
    descripcion?: string | null;
    link: string;
    urlImagen?: string | null;
  };
  proof?: string | null;
  ipHash?: string | null;
}

export async function createSubmission(input: CreateSubmissionInput) {
  await connectDB();
  const doc = await Submission.create({
    status: "pending",
    type: input.type || "event_for_existing_venue",
    submittedBy: input.submittedBy,
    venueId: input.venueId || undefined,
    venueDraft: input.venueDraft || undefined,
    event: {
      titulo: input.event.titulo,
      categoria: input.event.categoria,
      fechaHora: input.event.fechaHora,
      descripcion: input.event.descripcion || undefined,
      link: input.event.link,
      urlImagen: input.event.urlImagen || undefined,
    },
    proof: input.proof || undefined,
    ipHash: input.ipHash || undefined,
  });
  return doc.toObject();
}

export async function hasRecentSubmission(
  submittedBy: Types.ObjectId | string,
  windowHours = 24,
): Promise<boolean> {
  await connectDB();
  const since = new Date(Date.now() - windowHours * 60 * 60 * 1000);
  const count = await Submission.countDocuments({
    submittedBy,
    createdAt: { $gte: since },
    status: { $in: ["pending", "approved"] },
  });
  return count > 0;
}

export async function getPendingSubmissions(limit = 50) {
  await connectDB();
  return Submission.find({ status: "pending" })
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();
}
