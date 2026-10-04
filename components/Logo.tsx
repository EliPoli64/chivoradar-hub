"use client";
import { useId } from "react";

interface LogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

// Marca "carreta-radar": la rueda pintada de carreta con los 8 rayos en los
// colores de provincia, el radar reducido a un sector que la barre y la nota
// musical en el buje como el "chivo detectado".
//
// La geometría es la de app/icon.svg (export de boxy-svg), traída tal cual:
// los `transform` con su `transform-origin` explícito reproducen los rayos
// rotados, así que no se recalcula nada. Lo único que se agrega es el
// movimiento — ver `.logo-sweep` / `.logo-blip` en app/globals.css.
export default function Logo({ size = 32, animate = false, className }: LogoProps) {
  // El id del degradado debe ser único: la home renderiza el logo dos veces
  // (navbar + footer) y un id fijo se duplicaría en el DOM.
  const sweepId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? "logo-spin" : ""} ${className ?? ""}`}
      role="img"
      aria-label="Chivo Radar"
    >
      <defs>
        <linearGradient
          id={sweepId}
          gradientUnits="userSpaceOnUse"
          x1="41.67"
          y1="15.76"
          x2="35.19"
          y2="8.03"
        >
          <stop offset="0" stopColor="#f5b301" />
          <stop offset="0.55" stopColor="#e6323f" />
          <stop offset="1" stopColor="#e6323f" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <rect x="1" y="1" width="46" height="46" rx="11" fill="#2b2218" />

      {/* sector del radar: gira con la clase .logo-sweep y pasa por debajo del aro */}
      <g className="logo-sweep">
        <path
          d="M24,24 L35.19,8.03 A19.5,19.5 0 0 1 41.67,15.76 Z"
          fill={`url(#${sweepId})`}
        />
      </g>

      {/* rueda de carreta */}
      <circle
        cx="24"
        cy="24"
        r="19"
        strokeWidth="3"
        stroke="#e6323f"
        fill="#2b2218"
      />

      {/* 8 rayos, uno por color de provincia */}
      <g strokeWidth="2.6" fill="none">
        <path d="M24 15.5 V8.5" stroke="#f5b301" />
        <path
          d="M 32.485 19.015 L 32.485 12.015"
          style={{
            transformOrigin: "32.485px 15.515px 0px",
            transformBox: "view-box",
            stroke: "#34d399",
          }}
          transform="matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)"
        />
        <path
          d="M 36 27.5 L 36 20.5"
          style={{
            transformOrigin: "36px 24px 0px",
            transformBox: "view-box",
            stroke: "#9d5cff",
          }}
          transform="matrix(0, 1, -1, 0, 0, 0)"
        />
        <path
          d="M 32.485 35.985 L 32.485 28.985"
          style={{
            transformOrigin: "32.485px 32.485px 0px",
            transformBox: "view-box",
            stroke: "#f472b6",
          }}
          transform="matrix(-0.707107, 0.707107, -0.707107, -0.707107, 0, 0)"
        />
        <path
          d="M 24 39.5 L 24 32.5"
          style={{
            transformOrigin: "24px 36px 0px",
            transformBox: "view-box",
            stroke: "#f5b301",
          }}
          transform="matrix(-1, 0, 0, -1, 0, 0)"
        />
        <path
          d="M 15.515 35.985 L 15.515 28.985"
          style={{
            transformOrigin: "15.515px 32.485px 0px",
            transformBox: "view-box",
            stroke: "#34d399",
          }}
          transform="matrix(-0.707107, -0.707107, 0.707107, -0.707107, 0, 0)"
        />
        <path
          d="M 12 27.5 L 12 20.5"
          style={{
            transformOrigin: "12px 24px 0px",
            transformBox: "view-box",
            stroke: "#9d5cff",
          }}
          transform="matrix(0, -1, 1, 0, 0, 0)"
        />
        <path
          d="M 15.515 19.015 L 15.515 12.015"
          style={{
            transformOrigin: "15.515px 15.515px 0px",
            transformBox: "view-box",
            stroke: "#f472b6",
          }}
          transform="matrix(0.707107, -0.707107, 0.707107, 0.707107, 0, 0)"
        />
      </g>

      {/* buje con la nota: el "chivo" en el centro del radar */}
      <circle cx="24" cy="24" r="7" fill="#f5efe4" />
      <g transform="matrix(0.90821, 0, 0, 0.923678, 1.708544, 1.844319)">
        <ellipse
          cx="21.8"
          cy="27.2"
          rx="2.659"
          ry="2.225"
          transform="matrix(0.934086, -0.357049, 0.327624, 0.945333, -6.389223, 9.998609)"
          fill="#221a11"
        />
        <rect x="24.441" y="19.44" width="1.026" height="8.007" fill="#221a11" />
        <path
          d="M 25.009 20.302 C 26.672 21.003 28.638 23.794 28.459 25.263 C 28.97 23.933 28.505 21.081 27.812 19.989 L 25.009 20.302 Z"
          style={{
            transformOrigin: "26.178px 22.166px 0px",
            transformBox: "view-box",
          }}
          transform="matrix(0.956305, -0.292371, 0.292371, 0.956305, 0, 0)"
          fill="#221a11"
        />
        <path
          d="M 24.881 18.094 C 27.25 20.146 27.817 21.154 26.938 20.393 L 24.887 20.714 L 24.881 18.094 Z"
          fill="#221a11"
        />
      </g>

      {/* el chivo detectado: blip en el frente del barrido, sobre el aro */}
      <g className="logo-sweep">
        <circle className="logo-blip" cx="41.22" cy="15.97" r="2.9" fill="#f5efe4" />
      </g>
    </svg>
  );
}
