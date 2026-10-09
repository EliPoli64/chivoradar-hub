// Helpers de auth para el cliente: hablan con Firebase y con /api/auth/session.
"use client";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
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
  if (!res.ok) throw new Error("No se pudo crear la sesión.");
}

export async function registrar(email: string, password: string, nombre?: string) {
  const cred = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  if (nombre) await updateProfile(cred.user, { displayName: nombre });
  await sincronizarSesion(cred.user);
}

export async function entrar(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  await sincronizarSesion(cred.user);
}

export async function entrarConGoogle() {
  const cred = await signInWithPopup(
    getFirebaseAuth(),
    new GoogleAuthProvider(),
  );
  await sincronizarSesion(cred.user);
}

export async function salir() {
  await fetch("/api/auth/session", { method: "DELETE" });
  await signOut(getFirebaseAuth());
}
