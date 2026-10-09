// Sesión de servidor vía Firebase session cookie. Ver AGENTS/auth en el README.
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "@/lib/firebase/admin";
import {
  getUsuarioByFirebaseUid,
  upsertUsuarioFromFirebase,
} from "@/db/users";

export const SESSION_COOKIE = "chivoradar_session";
const EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

// Verifica el idToken, lo cambia por una session cookie y siembra el perfil.
export async function createSession(idToken: string) {
  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(idToken);

  await upsertUsuarioFromFirebase({
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name,
    picture: decoded.picture,
    email_verified: decoded.email_verified,
  });

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: EXPIRES_MS,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EXPIRES_MS / 1000,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

// Devuelve el perfil o null. No lanza si la cookie es inválida.
export async function getSessionUsuario() {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(cookie, true);
    return await getUsuarioByFirebaseUid(decoded.uid);
  } catch {
    return null;
  }
}

// Para páginas/acciones protegidas.
export async function requireSessionUsuario() {
  const usuario = await getSessionUsuario();
  if (!usuario) redirect("/login");
  return usuario;
}
