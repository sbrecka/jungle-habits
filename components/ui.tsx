"use client";

import React from "react";

/* ---------- primitives ---------- */

export function Sheet({
  title,
  subtitle,
  onClose,
  children
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="sheet-in absolute inset-0 z-40 flex flex-col bg-bg">
      <header className="flex items-baseline gap-3 border-b border-line px-4 py-3">
        <h2 className="font-display text-lg leading-none text-text">{title}</h2>
        {subtitle && <span className="text-xs text-dim">{subtitle}</span>}
        <button
          onClick={onClose}
          aria-label="Close"
          className="ml-auto grid h-8 w-8 place-items-center rounded border border-line text-dim active:scale-95"
        >
          <X />
        </button>
      </header>
      <div className="thin-scroll flex-1 overflow-y-auto p-3 pb-24">{children}</div>
    </div>
  );
}

export function Panel({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded border border-line bg-panel p-3 ${className}`}>{children}</div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "default",
  disabled,
  className = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "danger" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    default: "bg-panel2 border-line text-text",
    primary: "bg-gold border-goldDark text-black font-semibold",
    danger: "bg-danger border-dangerDark text-white",
    ghost: "bg-transparent border-line text-dim"
  }[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded border px-3 py-2 text-sm leading-none transition active:scale-95 disabled:opacity-40 disabled:active:scale-100 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

/** Segmented horizontal meter. */
export function Bar({
  value,
  max,
  colour,
  height = 6
}: {
  value: number;
  max: number;
  colour: string;
  height?: number;
}) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="w-full overflow-hidden rounded-sm bg-black/40"
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
    >
      <div className="h-full transition-[width] duration-300" style={{ width: `${pct}%`, background: colour }} />
    </div>
  );
}

export function Chip({
  children,
  tone = "dim"
}: {
  children: React.ReactNode;
  tone?: "dim" | "gold" | "green" | "warn" | "danger" | "blue";
}) {
  const tones = {
    dim: "border-line text-dim",
    gold: "border-gold/40 text-gold",
    green: "border-green/40 text-green",
    warn: "border-warn/40 text-warn",
    danger: "border-danger/50 text-danger",
    blue: "border-blue/40 text-blue"
  }[tone];
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${tones}`}>
      {children}
    </span>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 py-8 text-center text-sm leading-relaxed text-dim">{children}</p>
  );
}

/* ---------- icons: chunky, crisp-edged, pixel flavoured ---------- */

const crisp = { shapeRendering: "crispEdges" as const };

export function Coin({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={3} y={1} width={6} height={1} fill="#e0a53c" />
      <rect x={2} y={2} width={8} height={1} fill="#f2c05a" />
      <rect x={1} y={3} width={10} height={6} fill="#e0a53c" />
      <rect x={2} y={9} width={8} height={1} fill="#c4882a" />
      <rect x={3} y={10} width={6} height={1} fill="#a86f20" />
      <rect x={5} y={3} width={2} height={6} fill="#fff0c0" />
    </svg>
  );
}

export function Bolt({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={6} y={1} width={3} height={1} fill="#8fd35c" />
      <rect x={5} y={2} width={3} height={1} fill="#8fd35c" />
      <rect x={4} y={3} width={3} height={1} fill="#6aa84f" />
      <rect x={3} y={4} width={5} height={1} fill="#6aa84f" />
      <rect x={4} y={5} width={4} height={1} fill="#8fd35c" />
      <rect x={5} y={6} width={3} height={1} fill="#6aa84f" />
      <rect x={4} y={7} width={3} height={1} fill="#6aa84f" />
      <rect x={3} y={8} width={3} height={1} fill="#8fd35c" />
      <rect x={3} y={9} width={2} height={1} fill="#8fd35c" />
    </svg>
  );
}

export function Food({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={2} y={3} width={8} height={1} fill="#d98d4a" />
      <rect x={1} y={4} width={10} height={2} fill="#f0a862" />
      <rect x={1} y={6} width={10} height={1} fill="#c97a38" />
      <rect x={2} y={7} width={8} height={1} fill="#8a5a34" />
      <rect x={3} y={8} width={6} height={1} fill="#5f3d22" />
    </svg>
  );
}

export function HomeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={5} y={1} width={2} height={1} fill="currentColor" />
      <rect x={3} y={2} width={6} height={1} fill="currentColor" />
      <rect x={2} y={3} width={8} height={1} fill="currentColor" />
      <rect x={1} y={4} width={10} height={1} fill="currentColor" />
      <rect x={2} y={5} width={8} height={5} fill="currentColor" />
      <rect x={5} y={7} width={2} height={3} fill="#12121a" />
    </svg>
  );
}

export function WorkIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={1} y={2} width={10} height={6} fill="currentColor" />
      <rect x={2} y={3} width={8} height={4} fill="#12121a" />
      <rect x={4} y={8} width={4} height={1} fill="currentColor" />
      <rect x={2} y={9} width={8} height={1} fill="currentColor" />
    </svg>
  );
}

export function HabitIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={2} y={1} width={8} height={10} fill="currentColor" />
      <rect x={3} y={3} width={2} height={1} fill="#12121a" />
      <rect x={6} y={3} width={3} height={1} fill="#12121a" />
      <rect x={3} y={6} width={2} height={1} fill="#12121a" />
      <rect x={6} y={6} width={3} height={1} fill="#12121a" />
      <rect x={3} y={9} width={2} height={1} fill="#12121a" />
    </svg>
  );
}

export function CartIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={1} y={2} width={2} height={1} fill="currentColor" />
      <rect x={3} y={3} width={8} height={1} fill="currentColor" />
      <rect x={3} y={4} width={7} height={3} fill="currentColor" />
      <rect x={3} y={7} width={6} height={1} fill="currentColor" />
      <rect x={4} y={9} width={2} height={2} fill="currentColor" />
      <rect x={7} y={9} width={2} height={2} fill="currentColor" />
    </svg>
  );
}

export function Check({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={1} y={6} width={2} height={2} fill="currentColor" />
      <rect x={3} y={8} width={2} height={2} fill="currentColor" />
      <rect x={5} y={6} width={2} height={2} fill="currentColor" />
      <rect x={7} y={4} width={2} height={2} fill="currentColor" />
      <rect x={9} y={2} width={2} height={2} fill="currentColor" />
    </svg>
  );
}

export function X({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={2} y={2} width={2} height={2} fill="currentColor" />
      <rect x={4} y={4} width={2} height={2} fill="currentColor" />
      <rect x={6} y={6} width={2} height={2} fill="currentColor" />
      <rect x={8} y={8} width={2} height={2} fill="currentColor" />
      <rect x={8} y={2} width={2} height={2} fill="currentColor" />
      <rect x={6} y={4} width={2} height={2} fill="currentColor" />
      <rect x={4} y={6} width={2} height={2} fill="currentColor" />
      <rect x={2} y={8} width={2} height={2} fill="currentColor" />
    </svg>
  );
}

export function Plus({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={5} y={1} width={2} height={10} fill="currentColor" />
      <rect x={1} y={5} width={10} height={2} fill="currentColor" />
    </svg>
  );
}

export function Star({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={5} y={1} width={2} height={10} fill="currentColor" />
      <rect x={1} y={5} width={10} height={2} fill="currentColor" />
      <rect x={3} y={3} width={6} height={6} fill="currentColor" />
    </svg>
  );
}

export function MoonSun({ night, size = 14 }: { night: boolean; size?: number }) {
  return night ? (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={3} y={1} width={6} height={10} fill="currentColor" />
      <rect x={1} y={3} width={2} height={6} fill="currentColor" />
      <rect x={5} y={0} width={7} height={7} fill="#12121a" />
    </svg>
  ) : (
    <svg viewBox="0 0 12 12" width={size} height={size} {...crisp} aria-hidden>
      <rect x={4} y={4} width={4} height={4} fill="currentColor" />
      <rect x={5} y={1} width={2} height={2} fill="currentColor" />
      <rect x={5} y={9} width={2} height={2} fill="currentColor" />
      <rect x={1} y={5} width={2} height={2} fill="currentColor" />
      <rect x={9} y={5} width={2} height={2} fill="currentColor" />
    </svg>
  );
}
