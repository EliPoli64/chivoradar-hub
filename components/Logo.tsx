interface LogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

// Marca "carreta-radar": el brazo del radar es una tajada de la rueda pintada
// de carreta, con una nota musical como el "chivo detectado".
export default function Logo({ size = 32, animate = false, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? "logo-spin" : ""} ${className ?? ""}`}
      role="img"
      aria-label="Chivo Radar"
    >
      <defs>
        <linearGradient id="chivo-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e6323f" />
          <stop offset="100%" stopColor="#f5b301" />
        </linearGradient>
      </defs>

      {/* aro exterior */}
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="#f5efe4"
        strokeOpacity="0.18"
        strokeWidth="1.75"
      />

      {/* anillos de alcance (radar) */}
      <circle
        cx="24"
        cy="24"
        r="16"
        stroke="#2dd4bf"
        strokeOpacity="0.8"
        strokeWidth="1.6"
        strokeDasharray="3 7"
      />
      <circle
        cx="24"
        cy="24"
        r="10"
        stroke="#f5b301"
        strokeOpacity="0.85"
        strokeWidth="1.6"
        strokeDasharray="2 6"
      />

      {/* barrido: tajada de carreta */}
      <g className="logo-sweep">
        <path
          d="M24,24 L34.6,7.04 A20,20 0 0 0 41.98,15.24 Z"
          fill="url(#chivo-sweep)"
          opacity="0.92"
        />

        {/* nota musical al final del barrido */}
        <g>
          <ellipse cx="40.5" cy="13" rx="3.2" ry="2.3" fill="#f5efe4" />
          <rect x="43" y="5.5" width="1.6" height="8.5" fill="#f5efe4" />
          <path d="M44.6 5.5 C45.8 6.2 46.2 7.6 45.9 9.2 C46.8 8 47 6.4 46.7 5.4 Z" fill="#f5efe4" />
        </g>
      </g>

      {/* núcleo */}
      <circle cx="24" cy="24" r="2.4" fill="#f5efe4" />
    </svg>
  );
}