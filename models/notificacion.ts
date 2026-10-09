import mongoose from "mongoose";
import { COLLECTIONS } from "@/db/collections";

const notificacionSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    tipo: {
      type: String,
      default: "nuevos_eventos",
    },
    canal: {
      type: String,
      default: "email",
    },
    eventos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evento",
      },
    ],
    estado: {
      type: String,
      enum: ["pendiente", "enviada", "fallida"],
      default: "pendiente",
    },
    // hora preferida del usuario, resuelta a UTC
    programadaPara: {
      type: Date,
      required: true,
    },
    enviadaEn: {
      type: Date,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// consulta del cron: pendientes cuyo turno ya llegó
notificacionSchema.index({ estado: 1, programadaPara: 1 });
// historial por usuario
notificacionSchema.index({ usuario: 1, programadaPara: -1 });

const Notificacion =
  mongoose.models.Notificacion ||
  mongoose.model("Notificacion", notificacionSchema, COLLECTIONS.notificaciones);

export default Notificacion;
