"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { entrarConGoogle, entrarConGoogleToken } from "@/lib/auth/client";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

declare global {
  interface Window {
    google?: {
      accounts?: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
            },
          ) => void;
          prompt?: () => void;
        };
      };
    };
  }
}

function cargarGis(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Google Sign-In."));
    document.head.appendChild(script);
  });
}

interface Props {
  onError?: (mensaje: string) => void;
}

// Botón de Google Identity Services: el token de Google se cambia por una
// credencial de Firebase y se dispara el flujo normal de sesión.
export default function GoogleSignIn({ onError }: Props) {
  const router = useRouter();
  const botonRef = useRef<HTMLDivElement>(null);
  const inicializadoRef = useRef(false);
  // CLIENT_ID es constante; el estado inicial ya lo refleja sin setState en el effect.
  const [sinGis, setSinGis] = useState(() => !CLIENT_ID);

  useEffect(() => {
    if (!CLIENT_ID) {
      return;
    }
    let activo = true;
    cargarGis()
      .then(() => {
        if (!activo || inicializadoRef.current || !window.google?.accounts?.id) {
          return;
        }
        inicializadoRef.current = true;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async (resp) => {
            try {
              await entrarConGoogleToken(resp.credential);
              router.push("/cuenta");
              router.refresh();
            } catch (err) {
              onError?.(
                (err as { message?: string })?.message ||
                  "No se completó el inicio con Google.",
              );
            }
          },
        });
        if (botonRef.current) {
          window.google.accounts.id.renderButton(botonRef.current, {
            theme: "outline",
            size: "large",
            width: 400,
            text: "continue_with",
          });
        } else {
          window.google.accounts.id.prompt?.();
        }
      })
      .catch(() => {
        if (activo) setSinGis(true);
      });
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sin client id o script: caemos al redirect de Firebase.
  async function fallbackRedirect() {
    try {
      await entrarConGoogle();
    } catch (err) {
      onError?.(
        (err as { message?: string })?.message ||
          "No se completó el inicio con Google.",
      );
    }
  }

  if (sinGis) {
    return (
      <button
        type="button"
        onClick={fallbackRedirect}
        className="w-full rounded-full border border-hueso/15 px-4 py-3 font-bold text-hueso hover:border-rojo transition-colors"
      >
        Continuar con Google
      </button>
    );
  }

  return <div ref={botonRef} className="w-full flex justify-center" />;
}