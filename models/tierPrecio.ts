import mongoose from "mongoose"

const tierSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  evento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evento",
    required: true
  }
})

const TierPrecio = mongoose.models.TierPrecio || mongoose.model("TierPrecio", tierSchema);