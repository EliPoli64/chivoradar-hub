import mongoose from "mongoose";
import { COLLECTIONS } from "@/db/collections";

const preferenciasSchema = new mongoose.Schema(
  {
    notificacionesActivas: {
      type: Boolean,
      default: true,
    },
    canal: {
      type: String,
      enum: ["email"],
      default: "email",
    },
    hora: {
      type: Number,
      min: 0,
      max: 23,
      default: 8,
    },
    zonaHoraria: {
      type: String,
      default: "America/Costa_Rica",
    },
  },
  { _id: false },
);

const usuarioSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: false,
    },
    fotoUrl: {
      type: String,
      required: false,
    },
    emailVerificado: {
      type: Boolean,
      default: false,
    },
    preferencias: {
      type: preferenciasSchema,
      default: () => ({}),
    },
    ultimaNotificacion: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Usuario =
  mongoose.models.Usuario ||
  mongoose.model("Usuario", usuarioSchema, COLLECTIONS.usuarios);

export default Usuario;
