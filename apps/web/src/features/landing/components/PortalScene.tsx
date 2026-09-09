"use client";

import type { CSSProperties } from "react";

/**
 * Soft/fluid hand-drawn SVG layers for the immersive portal Hero.
 * Paths use gentle bezier curves (C/Q) for a children's-book feel.
 */

type LayerProps = {
  className?: string;
  style?: CSSProperties;
};

export function SkyWash({ className = "", style }: LayerProps) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={style}
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde8ef" />
          <stop offset="55%" stopColor="#f8d9e4" />
          <stop offset="100%" stopColor="#e6f3e9" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#skyGrad)" />
    </svg>
  );
}

export function CloudsLayer({ className = "", style }: LayerProps) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={style}
    >
      {/* Soft cloud blobs — hand-curved */}
      <path
        fill="#ffffff"
        fillOpacity="0.55"
        d="M120 180 C160 140, 220 140, 260 170 C290 130, 360 130, 390 175 C440 155, 490 180, 480 220 C500 250, 460 270, 420 260 C390 290, 320 285, 290 255 C250 275, 190 265, 170 230 C120 240, 90 210, 120 180 Z"
      />
      <path
        fill="#ffffff"
        fillOpacity="0.45"
        d="M980 140 C1020 105, 1090 110, 1125 145 C1165 115, 1235 120, 1265 160 C1315 150, 1355 185, 1335 225 C1355 255, 1305 275, 1260 260 C1225 290, 1155 280, 1125 250 C1080 270, 1020 255, 1005 220 C960 230, 940 185, 980 140 Z"
      />
      <path
        fill="#ffffff"
        fillOpacity="0.4"
        d="M620 90 C660 60, 720 65, 750 95 C790 70, 850 80, 870 115 C910 110, 940 140, 920 170 C935 195, 900 210, 865 200 C840 225, 780 220, 755 195 C715 210, 665 200, 650 170 C610 175, 590 130, 620 90 Z"
      />
    </svg>
  );
}

export function HillsLayer({ className = "", style }: LayerProps) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={style}
    >
      {/* Far hills */}
      <path
        fill="#5faf6a"
        fillOpacity="0.35"
        d="M0 620 C180 540, 340 560, 520 600 C700 640, 880 520, 1080 580 C1240 620, 1360 560, 1440 590 L1440 900 L0 900 Z"
      />
      {/* Near hills */}
      <path
        fill="#5faf6a"
        fillOpacity="0.55"
        d="M0 700 C220 640, 400 680, 580 720 C780 760, 960 650, 1180 700 C1320 730, 1400 690, 1440 710 L1440 900 L0 900 Z"
      />
      {/* Soft grass tufts */}
      <path
        fill="#4e9858"
        fillOpacity="0.5"
        d="M80 780 C95 750, 110 755, 120 780 C130 755, 145 750, 160 780 Z"
      />
      <path
        fill="#4e9858"
        fillOpacity="0.45"
        d="M1280 800 C1295 770, 1310 775, 1320 800 C1330 775, 1345 770, 1360 800 Z"
      />
    </svg>
  );
}

export function FloatingPaws({ className = "", style }: LayerProps) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={style}
    >
      {/* Soft paw prints as organic ellipses */}
      <g fill="#e07a96" fillOpacity="0.28">
        <ellipse cx="200" cy="320" rx="28" ry="24" />
        <circle cx="178" cy="292" r="10" />
        <circle cx="198" cy="282" r="10" />
        <circle cx="220" cy="282" r="10" />
        <circle cx="238" cy="294" r="10" />
      </g>
      <g fill="#5faf6a" fillOpacity="0.25">
        <ellipse cx="1180" cy="380" rx="26" ry="22" transform="rotate(18 1180 380)" />
        <circle cx="1160" cy="352" r="9" />
        <circle cx="1178" cy="342" r="9" />
        <circle cx="1198" cy="344" r="9" />
        <circle cx="1214" cy="356" r="9" />
      </g>
      <g fill="#e07a96" fillOpacity="0.2">
        <ellipse cx="1050" cy="220" rx="18" ry="15" transform="rotate(-12 1050 220)" />
        <circle cx="1036" cy="200" r="7" />
        <circle cx="1050" cy="194" r="7" />
        <circle cx="1064" cy="196" r="7" />
        <circle cx="1075" cy="206" r="7" />
      </g>
    </svg>
  );
}

/** Central portal / map-pin frame */
export function PortalArch({ className = "", style }: LayerProps) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={style}
    >
      <defs>
        <radialGradient id="portalGlow" cx="50%" cy="52%" r="42%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f8d9e4" stopOpacity="0" />
        </radialGradient>
        <filter id="softShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#e07a96" floodOpacity="0.22" />
        </filter>
      </defs>

      <ellipse cx="720" cy="500" rx="300" ry="340" fill="url(#portalGlow)" />

      <path
        fill="#ffffff"
        fillOpacity="0.96"
        filter="url(#softShadow)"
        d="M720 180
           C560 180, 430 320, 430 480
           C430 620, 520 740, 720 820
           C920 740, 1010 620, 1010 480
           C1010 320, 880 180, 720 180 Z
           M720 260
           C840 260, 930 360, 930 480
           C930 580, 860 680, 720 740
           C580 680, 510 580, 510 480
           C510 360, 600 260, 720 260 Z"
        fillRule="evenodd"
      />

      <path
        fill="none"
        stroke="#e07a96"
        strokeWidth="14"
        strokeLinecap="round"
        strokeOpacity="0.85"
        d="M720 200
           C575 200, 455 330, 455 480
           C455 610, 545 720, 720 790
           C895 720, 985 610, 985 480
           C985 330, 865 200, 720 200 Z"
      />

      <g transform="translate(720 165)" fill="#f0c84a">
        <rect x="-28" y="-6" width="56" height="12" rx="6" />
        <circle cx="-28" cy="-10" r="10" />
        <circle cx="-28" cy="10" r="10" />
        <circle cx="28" cy="-10" r="10" />
        <circle cx="28" cy="10" r="10" />
      </g>
    </svg>
  );
}

/** Foreground grass / bushes that sit in front of the portal */
export function ForegroundBushes({ className = "", style }: LayerProps) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={style}
    >
      <path
        fill="#5faf6a"
        d="M0 820 C60 760, 140 770, 180 820 C220 760, 300 750, 360 820 C400 780, 460 790, 500 840 L0 900 Z"
      />
      <path
        fill="#4e9858"
        d="M1440 830 C1380 770, 1300 780, 1260 830 C1220 770, 1140 760, 1080 830 C1040 790, 980 800, 940 850 L1440 900 Z"
      />
      {/* Soft leaves */}
      <ellipse cx="90" cy="780" rx="40" ry="22" fill="#e07a96" fillOpacity="0.35" transform="rotate(-20 90 780)" />
      <ellipse cx="1350" cy="790" rx="36" ry="20" fill="#e07a96" fillOpacity="0.3" transform="rotate(25 1350 790)" />
    </svg>
  );
}
