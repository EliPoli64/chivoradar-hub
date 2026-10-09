// Colección `usuarios`. Perfil autenticado con Firebase; no guarda credenciales.
// Ver dbstructure.md.
import mongoose from "mongoose";
import { COLLECTIONS } from "@/db/collections";

const preferenciasSchema = new mongoose.Schema(
  {
    notificacionesActivas: {
      type: Boolean,
      default: true,
    },
    // por ahora sólo email
    canal: {
      type: String,
      enum: ["email"],
      default: "email",
    },
    // hora local 0-23 del resumen diario
    hora: {
      type: Number,
      min: 0,
      max: 23,
      default: 8,
    },
    // zona IANA
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
    // espejo de Firebase email_verified
    emailVerificado: {
      type: Boolean,
      default: false,
    },
    preferencias: {
      type: preferenciasSchema,
      default: () => ({}),
    },
    // última vez que se envió un resumen; guarda de idempotencia
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
