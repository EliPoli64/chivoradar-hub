import mongoose from "mongoose";
import { COLLECTIONS } from "@/db/collections";

const seguimientoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    // denormalizado para la UI
    venueSlug: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

seguimientoSchema.index({ usuario: 1, venue: 1 }, { unique: true });
// fan-out: quién sigue este venue
seguimientoSchema.index({ venue: 1 });

const Seguimiento =
  mongoose.models.Seguimiento ||
  mongoose.model("Seguimiento", seguimientoSchema, COLLECTIONS.seguimientos);

export default Seguimiento;
