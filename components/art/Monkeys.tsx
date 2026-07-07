import React from "react";
import { MonkeyIcon } from "@/lib/types";

const INK = "#2F2013";
const FUR = "#8A5A33";
const FUR_DARK = "#6E4626";
const FACE = "#C89B6C";

function Eyes({ cx, cy, gap = 9, r = 4.5 }: { cx: number; cy: number; gap?: number; r?: number }) {
  return (
    <g className="monkey-eyes">
      <circle cx={cx - gap / 2} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth={2} />
      <circle cx={cx + gap / 2} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth={2} />
      <circle cx={cx - gap / 2} cy={cy} r={1.8} fill={INK} />
      <circle cx={cx + gap / 2} cy={cy} r={1.8} fill={INK} />
    </g>
  );
}

function Head({ cx, cy, r = 16 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx - r * 0.85} cy={cy - r * 0.2} r={r * 0.38} fill={FUR} stroke={INK} strokeWidth={2.5} />
      <circle cx={cx + r * 0.85} cy={cy - r * 0.2} r={r * 0.38} fill={FUR} stroke={INK} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={r} fill={FUR} stroke={INK} strokeWidth={2.5} />
      <ellipse cx={cx} cy={cy + r * 0.22} rx={r * 0.72} ry={r * 0.6} fill={FACE} />
      <Eyes cx={cx} cy={cy - 1} />
      <path
        d={`M ${cx - 4} ${cy + 8} Q ${cx} ${cy + 11} ${cx + 4} ${cy + 8}`}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
}

/** Monkey sitting cross-legged (campfire buddy). ~56px tall, anchored at feet (0,0). */
export function SittingMonkey({ flip = false }: { flip?: boolean }) {
  return (
    <g transform={`${flip ? "scale(-1,1)" : ""} translate(0,-2)`}>
      {/* body */}
      <ellipse cx={0} cy={-16} rx={15} ry={14} fill={FUR} stroke={INK} strokeWidth={2.5} />
      <ellipse cx={0} cy={-13} rx={9} ry={9} fill={FACE} opacity={0.9} />
      {/* legs crossed */}
      <path d="M -14 -6 Q 0 4 14 -6 Q 8 0 0 0 Q -8 0 -14 -6 Z" fill={FUR_DARK} stroke={INK} strokeWidth={2.5} />
      {/* arms */}
      <path d="M -13 -20 Q -20 -12 -12 -6" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M 13 -20 Q 20 -12 12 -6" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <Head cx={0} cy={-36} r={13} />
      {/* tail */}
      <path d="M 12 -8 Q 26 -10 24 -22" fill="none" stroke={FUR} strokeWidth={4} strokeLinecap="round" />
      <path d="M 12 -8 Q 26 -10 24 -22" fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
    </g>
  );
}

/** Sleeping monkey (for the hammock). Lying pose, ~46 wide. */
export function SleepingMonkey() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={20} ry={9} fill={FUR} stroke={INK} strokeWidth={2.5} />
      <circle cx={-16} cy={-6} r={10} fill={FUR} stroke={INK} strokeWidth={2.5} />
      <ellipse cx={-16} cy={-4} rx={7} ry={5.5} fill={FACE} />
      {/* closed eyes */}
      <path d="M -20 -6 q 2 2 4 0 M -14 -6 q 2 2 4 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      <text x={-2} y={-16} fontSize={10} fill={INK} opacity={0.7} fontFamily="sans-serif">z z</text>
    </g>
  );
}

/** Big monkey for the Focus screen — hunched over, "locked in". Renders in a 220x260 box. */
export function LockedInMonkey() {
  return (
    <svg viewBox="0 0 220 260" className="w-56 h-64 mx-auto" aria-hidden>
      <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
        {/* body hunched */}
        <path d="M 50 210 Q 40 120 110 105 Q 185 115 175 210 Q 175 235 110 235 Q 45 235 50 210 Z" fill={FUR} />
        <path d="M 70 225 Q 110 240 150 225 L 150 235 Q 110 248 70 235 Z" fill={FUR_DARK} />
        {/* arms holding a book/phone */}
        <path d="M 62 150 Q 45 185 78 196" fill="none" strokeLinecap="round" />
        <path d="M 158 150 Q 175 185 142 196" fill="none" strokeLinecap="round" />
        <rect x={78} y={182} width={64} height={34} rx={5} fill="#E8DFC8" />
        <path d="M 86 192 h 48 M 86 200 h 48 M 86 208 h 30" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        {/* head */}
        <circle cx={70} cy={82} r={14} fill={FUR} />
        <circle cx={150} cy={82} r={14} fill={FUR} />
        <circle cx={110} cy={85} r={44} fill={FUR} />
        <ellipse cx={110} cy={95} rx={30} ry={26} fill={FACE} strokeWidth={0} />
      </g>
      <g className="monkey-eyes">
        <circle cx={97} cy={86} r={11} fill="#fff" stroke={INK} strokeWidth={3} />
        <circle cx={123} cy={86} r={11} fill="#fff" stroke={INK} strokeWidth={3} />
        <circle cx={99} cy={89} r={4.5} fill={INK} />
        <circle cx={121} cy={89} r={4.5} fill={INK} />
      </g>
      <path d="M 102 112 Q 110 116 118 112" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <path d="M 104 74 q 6 -5 12 0 M 118 74 q 6 -5 12 0" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
    </svg>
  );
}

/** Small habit-card illustrations, 64x64 viewBox. */
export function HabitMonkey({ icon, size = 56 }: { icon: MonkeyIcon; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      {icon === "checkin" && (
        <g>
          {/* monkey high-fiving its mirror reflection */}
          <rect x={33} y={6} width={26} height={34} rx={3} fill="#EAF2F7" stroke={INK} strokeWidth={2} />
          <g opacity={0.45}>
            <circle cx={46} cy={22} r={8} fill={FUR} stroke={INK} strokeWidth={2} />
            <ellipse cx={46} cy={24} rx={5} ry={4} fill={FACE} />
          </g>
          <circle cx={20} cy={26} r={10} fill={FUR} stroke={INK} strokeWidth={2.5} />
          <ellipse cx={20} cy={28} rx={6.5} ry={5} fill={FACE} />
          <Eyes cx={20} cy={25} gap={7} r={3} />
          <path d="M 26 34 Q 34 28 36 20" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <ellipse cx={22} cy={48} rx={12} ry={9} fill={FUR} stroke={INK} strokeWidth={2.5} />
        </g>
      )}
      {icon === "gym" && (
        <g>
          <ellipse cx={32} cy={44} rx={15} ry={12} fill={FUR} stroke={INK} strokeWidth={2.5} />
          <circle cx={32} cy={24} r={11} fill={FUR} stroke={INK} strokeWidth={2.5} />
          <ellipse cx={32} cy={26} rx={7} ry={5.5} fill={FACE} />
          <Eyes cx={32} cy={23} gap={8} r={3.2} />
          {/* barbell */}
          <path d="M 12 40 H 52" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <rect x={8} y={33} width={7} height={14} rx={2} fill="#555" stroke={INK} strokeWidth={2} />
          <rect x={49} y={33} width={7} height={14} rx={2} fill="#555" stroke={INK} strokeWidth={2} />
          <path d="M 22 34 Q 18 38 15 40 M 42 34 Q 46 38 49 40" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      )}
      {icon === "read" && (
        <g>
          <ellipse cx={30} cy={46} rx={15} ry={11} fill={FUR} stroke={INK} strokeWidth={2.5} />
          <circle cx={30} cy={22} r={12} fill={FUR} stroke={INK} strokeWidth={2.5} />
          <ellipse cx={30} cy={24} rx={8} ry={6} fill={FACE} />
          <Eyes cx={30} cy={21} gap={8} r={3.2} />
          <rect x={38} y={36} width={18} height={13} rx={2} fill="#fff" stroke={INK} strokeWidth={2} transform="rotate(-8 47 42)" />
          <path d="M 42 40 h 10 M 42 44 h 10" stroke={INK} strokeWidth={1.6} transform="rotate(-8 47 42)" />
        </g>
      )}
      {icon === "drink" && (
        <g>
          <ellipse cx={28} cy={46} rx={14} ry={11} fill={FUR} stroke={INK} strokeWidth={2.5} />
          <circle cx={28} cy={22} r={12} fill={FUR} stroke={INK} strokeWidth={2.5} />
          <ellipse cx={28} cy={24} rx={8} ry={6} fill={FACE} />
          <Eyes cx={28} cy={21} gap={8} r={3.2} />
          <circle cx={49} cy={40} r={8} fill="#8A5A33" stroke={INK} strokeWidth={2} />
          <path d="M 49 32 L 52 22" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <path d="M 38 40 Q 43 38 42 40" stroke={INK} strokeWidth={2.5} fill="none" />
        </g>
      )}
      {(icon === "sleep" || icon === "generic") && (
        <g>
          <ellipse cx={32} cy={45} rx={15} ry={11} fill={FUR} stroke={INK} strokeWidth={2.5} />
          <circle cx={32} cy={22} r={12} fill={FUR} stroke={INK} strokeWidth={2.5} />
          <ellipse cx={32} cy={24} rx={8} ry={6} fill={FACE} />
          <Eyes cx={32} cy={21} gap={8} r={3.2} />
          <path d="M 27 30 Q 32 33 37 30" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

/** Tiny monkey face for buttons / chips. */
export function MonkeyFace({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
      <circle cx={6} cy={14} r={5} fill={FUR} stroke={INK} strokeWidth={2} />
      <circle cx={26} cy={14} r={5} fill={FUR} stroke={INK} strokeWidth={2} />
      <circle cx={16} cy={16} r={12} fill={FUR} stroke={INK} strokeWidth={2} />
      <ellipse cx={16} cy={19} rx={8} ry={6.5} fill={FACE} />
      <circle cx={12} cy={14} r={3} fill="#fff" stroke={INK} strokeWidth={1.5} />
      <circle cx={20} cy={14} r={3} fill="#fff" stroke={INK} strokeWidth={1.5} />
      <circle cx={12} cy={14.5} r={1.3} fill={INK} />
      <circle cx={20} cy={14.5} r={1.3} fill={INK} />
      <path d="M 13 22 Q 16 24.5 19 22" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}
