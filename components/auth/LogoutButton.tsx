"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { salir } from "@/lib/auth/client";

interface Props {
  className?: string;
  onDone?: () => void;
  children?: React.ReactNode;
}

export default function LogoutButton({ className, onDone, children = "Salir" }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    try {
      await salir();
      onDone?.();
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" onClick={onClick} disabled={pending} className={className}>
      {pending ? "Saliendo…" : children}
    </button>
  );
}
