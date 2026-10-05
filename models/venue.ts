// Colección `venues`. Ver dbstructure.md.
import mongoose from "mongoose";
import { COLLECTIONS } from "@/db/collections";

const venueSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  // salida del geocoding: { type: "Point", coordinates: [lng, lat] }
  ubicacion: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  direccion: {
    type: String,
    required: false,
  },
  // objeto libre: cada lugar tiene las redes que tenga
  redesSociales: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
    default: undefined,
  },
});

venueSchema.index({ ubicacion: "2dsphere" });

const Venue =
  mongoose.models.Venue || mongoose.model("Venue", venueSchema, COLLECTIONS.venues);

export default Venue;
