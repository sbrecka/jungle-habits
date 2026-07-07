"use client";

import React from "react";

export function BananaIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        d="M 5 4 Q 4 14 12 18 Q 19 21 21 14 Q 20 18 13 16 Q 6 13 7 4 Z"
        fill="#F5CE45"
        stroke="#2F2013"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path d="M 5.5 3.5 l 1.6 -1" stroke="#2F2013" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function FlameIcon({ size = 16, lit = true }: { size?: number; lit?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        d="M 12 2 Q 18 9 16.5 15 Q 15.5 20 12 20 Q 8.5 20 7.5 15 Q 6 9 12 2 Z"
        fill={lit ? "#F0883E" : "#9AA3AF"}
        stroke="#2F2013"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path d="M 12 9 Q 14.5 13 13 16.5 Q 12.5 18 12 18 Q 10 17.5 10.5 14 Q 11 11 12 9 Z" fill={lit ? "#F5CE45" : "#C6CCD4"} />
    </svg>
  );
}

export function ClockIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <circle cx={12} cy={12} r={9} fill="none" stroke="currentColor" strokeWidth={2} />
      <path d="M 12 7 V 12 L 15.5 14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function GearIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5 M 12 2 L 13 5 L 15.8 5.8 L 18.4 4.4 L 19.9 6.6 L 18.2 9 L 19 11.7 L 22 13 L 21 15.6 L 17.9 15.3 L 16 17.5 L 16.4 20.6 L 13.8 21.6 L 12 19 L 10.2 21.6 L 7.6 20.6 L 8 17.5 L 6.1 15.3 L 3 15.6 L 2 13 L 5 11.7 L 5.8 9 L 4.1 6.6 L 5.6 4.4 L 8.2 5.8 L 11 5 Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function PencilIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M 4 20 L 5 15.5 L 15.5 5 L 19 8.5 L 8.5 19 Z" fill="currentColor" />
      <path d="M 16.8 3.7 L 20.3 7.2 L 21.5 6 Q 22.5 5 21.5 4 L 20 2.5 Q 19 1.5 18 2.5 Z" fill="currentColor" />
    </svg>
  );
}

export function CartIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M 3 4 H 6 L 8.5 14.5 H 18.5 L 21 7 H 7" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={10} cy={19} r={1.8} fill="currentColor" />
      <circle cx={17} cy={19} r={1.8} fill="currentColor" />
    </svg>
  );
}

export function SoundIcon({ on, size = 18 }: { on: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M 4 9 H 8 L 13 4.5 V 19.5 L 8 15 H 4 Z" fill="currentColor" />
      {on ? (
        <path d="M 16 9 Q 18.5 12 16 15 M 18 6.5 Q 22 12 18 17.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      ) : (
        <path d="M 16 9.5 L 21 14.5 M 21 9.5 L 16 14.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      )}
    </svg>
  );
}

export function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M 6 6 L 18 18 M 18 6 L 6 18" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}

export function ChevronIcon({ dir = "left", size = 18 }: { dir?: "left" | "right" | "up" | "down"; size?: number }) {
  const rot = { left: 0, up: 90, right: 180, down: 270 }[dir];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
      <path d="M 15 5 L 8 12 L 15 19" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MoonSunIcon({ night, size = 18 }: { night: boolean; size?: number }) {
  return night ? (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M 20 14 A 8.5 8.5 0 1 1 10 4 A 7 7 0 0 0 20 14 Z" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <circle cx={12} cy={12} r={5} fill="currentColor" />
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </g>
    </svg>
  );
}
