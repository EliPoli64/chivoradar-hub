// Read/write de perfiles. El perfil se identifica por firebaseUid.
import { connectDB } from "@/db/mongodb";
import Usuario from "@/models/usuario";

export interface PerfilFirebase {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

export async function upsertUsuarioFromFirebase(perfil: PerfilFirebase) {
  await connectDB();
  return Usuario.findOneAndUpdate(
    { firebaseUid: perfil.uid },
    {
      // $set de campos mutables; no toca preferencias.
      $set: {
        email: perfil.email?.toLowerCase(),
        nombre: perfil.name,
        fotoUrl: perfil.picture,
        emailVerificado: perfil.email_verified ?? false,
      },
      $setOnInsert: { firebaseUid: perfil.uid },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
}

export async function getUsuarioByFirebaseUid(uid: string) {
  await connectDB();
  return Usuario.findOne({ firebaseUid: uid }).lean();
}
