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
    // Denominormalización opcional para pintar /mis-lugares sin un $lookup.
    venueSlug: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

// No se puede seguir dos veces el mismo lugar.
seguimientoSchema.index({ usuario: 1, venue: 1 }, { unique: true });
// Fan-out: "¿quién sigue este venue?".
seguimientoSchema.index({ venue: 1 });

const Seguimiento =
  mongoose.models.Seguimiento ||
  mongoose.model("Seguimiento", seguimientoSchema, COLLECTIONS.seguimientos);

export default Seguimiento;
