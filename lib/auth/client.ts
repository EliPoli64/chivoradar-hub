// Helpers de auth para el cliente: hablan con Firebase y con /api/auth/session.
"use client";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

async function sincronizarSesion(user: User) {
  const idToken = await user.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "No se pudo crear la sesión.");
  }
}

// Si Firebase crea la cuenta pero falla la sesión, no dejamos al usuario a medias.
async function conSesion(user: User) {
  try {
    await sincronizarSesion(user);
  } catch (err) {
    await signOut(getFirebaseAuth()).catch(() => {});
    throw err;
  }
}

export async function registrar(email: string, password: string, nombre?: string) {
  const cred = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  if (nombre) await updateProfile(cred.user, { displayName: nombre });
  await conSesion(cred.user);
}

export async function entrar(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  await conSesion(cred.user);
}

// Google: redirect-first. El popup se rompe por las cookies particionadas
// (third-party storage partitioning) del iframe de firebaseapp.com; con
// redirect la página navega top-level a Firebase y vuelve con la sesión.
// Devuelve "redirect": la página se va a Google, el caller no debe navegar.
export async function entrarConGoogle(): Promise<"done" | "redirect"> {
  await signInWithRedirect(getFirebaseAuth(), new GoogleAuthProvider());
  return "redirect";
}

// Google: intercambio del token de Google Identity Services (GIS) con Firebase.
// GIS corre first-party en nuestro origen, así que no sufre el particionado de
// storage que rompe popup/redirect del iframe de firebaseapp.com.
export async function entrarConGoogleToken(googleIdToken: string) {
  const cred = GoogleAuthProvider.credential(googleIdToken);
  const userCred = await signInWithCredential(getFirebaseAuth(), cred);
  await conSesion(userCred.user);
}

// Se llama al volver del redirect de Google. Devuelve true si completó sesión.
export async function completarRedirectGoogle(): Promise<boolean> {
  const result = await getRedirectResult(getFirebaseAuth());
  if (!result?.user) return false;
  await conSesion(result.user);
  return true;
}

export async function salir() {
  await fetch("/api/auth/session", { method: "DELETE" });
  await signOut(getFirebaseAuth());
}
