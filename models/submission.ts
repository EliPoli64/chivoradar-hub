import mongoose from "mongoose";
import { COLLECTIONS } from "@/db/collections";

const venueDraftSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: false },
    direccion: { type: String, required: false },
    ubicacion: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], required: false },
    },
    slug: { type: String, required: false },
    redesSociales: { type: mongoose.Schema.Types.Mixed, required: false },
  },
  { _id: false },
);

const eventSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    categoria: { type: String, required: true },
    fechaHora: { type: Date, required: true },
    descripcion: { type: String, required: false },
    link: { type: String, required: true },
    urlImagen: { type: String, required: false },
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    by: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: false },
    at: { type: Date, required: false },
    reason: { type: String, required: false },
  },
  { _id: false },
);

const submissionSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "spam"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["event_for_existing_venue", "new_venue_and_event"],
      default: "event_for_existing_venue",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: false,
    },
    venueDraft: {
      type: venueDraftSchema,
      required: false,
    },
    event: {
      type: eventSchema,
      required: true,
    },
    proof: { type: String, required: false },
    ipHash: { type: String, required: false },
    review: { type: reviewSchema, required: false },
  },
  { timestamps: true },
);

submissionSchema.index({ status: 1, createdAt: -1 });
submissionSchema.index({ submittedBy: 1, createdAt: -1 });
submissionSchema.index({ "event.link": 1 });

const Submission =
  mongoose.models.Submission ||
  mongoose.model("Submission", submissionSchema, COLLECTIONS.submissions);

export default Submission;
