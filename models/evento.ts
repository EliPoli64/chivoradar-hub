import mongoose from "mongoose";
import { COLLECTIONS } from "@/db/collections";

const eventoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  urlImagen: {
    type: String,
    required: false,
  },
  // ref → venues._id
  ubicacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: false,
  },
  fechaHora: {
    type: Date,
    required: true,
  },
  descripcion: {
    type: String,
    required: false,
  },
  // url del evento en el origen; es la clave de upsert del scraper
  link: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: false,
  },
});

eventoSchema.index({ fechaHora: 1 });
eventoSchema.index({ link: 1 }, { unique: true });
eventoSchema.index({ createdAt: -1 });
eventoSchema.index({ ubicacion: 1, createdAt: -1 });

const Evento =
  mongoose.models.Evento || mongoose.model("Evento", eventoSchema, COLLECTIONS.eventos);

export default Evento;
