// Colección `tiersPrecio`. Ver dbstructure.md.
// El nombre va explícito porque el de mongoose ("tierprecios", en minúscula) no
// es el real, y esa diferencia hacía que el $lookup del feed no encontrara nada.
import mongoose from "mongoose";
import { COLLECTIONS } from "@/db/collections";

const tierSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  // precio total con cargo incluido, en `moneda`
  precio: {
    type: Number,
    required: true,
  },
  moneda: {
    type: String,
    required: true,
    default: "CRC",
  },
  // zona / sección (ej. "400m Infantil A"). Los documentos anteriores al
  // scraping de estos campos simplemente no lo tienen.
  zona: {
    type: String,
    required: false,
    default: null,
  },
  // precio base sin cargo; precio = precioBase + cargo
  precioBase: {
    type: Number,
    required: false,
    default: null,
  },
  // cargo de servicio de eticket
  cargo: {
    type: Number,
    required: false,
    default: null,
  },
  evento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evento",
    required: true,
  },
});

const TierPrecio =
  mongoose.models.TierPrecio ||
  mongoose.model("TierPrecio", tierSchema, COLLECTIONS.tiersPrecio);

export default TierPrecio;
