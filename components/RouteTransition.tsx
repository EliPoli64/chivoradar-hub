import { ViewTransition } from "react";

/* Transiciones de ruta ("el barrido del radar"). Va alrededor del contenido
   de cada page.tsx - no del layout, porque los layouts persisten entre
   navegaciones y sus enter/exit nunca se disparan. Los links navegan con
   transitionTypes={["nav-forward"] | ["nav-back"]} para la animación
   direccional; todo lo demás (botón atrás, Suspense) cae en "page". */
const ENTER = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "page",
} as const;

const EXIT = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "page",
} as const;

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={ENTER} exit={EXIT}>
      {children}
    </ViewTransition>
  );
}
