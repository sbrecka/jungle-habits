import React from "react";
import { SittingMonkey, SleepingMonkey } from "./Monkeys";

const INK = "#2F2013";
const TRUNK = "#8A6238";
const TRUNK_DARK = "#6E4C29";
const LEAF = "#5D8F38";
const LEAF_LIGHT = "#79AC48";

/* All sprites are drawn with (0,0) at the base/anchor point on the tile. */

function PalmFrond({ angle, len = 34, color = LEAF }: { angle: number; len?: number; color?: string }) {
  return (
    <path
      d={`M 0 0 Q ${len * 0.5} ${-len * 0.35} ${len} ${-len * 0.1} Q ${len * 0.55} ${-len * 0.05} 0 6 Z`}
      fill={color}
      stroke={INK}
      strokeWidth={2.2}
      strokeLinejoin="round"
      transform={`rotate(${angle})`}
    />
  );
}

export function Palm({ variant = 0 }: { variant?: number }) {
  const lean = variant === 1 ? -8 : variant === 2 ? 6 : 0;
  const h = variant === 2 ? 52 : 64;
  const leafColor = variant === 1 ? LEAF_LIGHT : LEAF;
  return (
    <g className="sway">
      <path
        d={`M -4 0 Q ${lean - 2} ${-h * 0.6} ${lean} ${-h} L ${lean + 7} ${-h} Q ${lean + 6} ${-h * 0.6} 5 0 Z`}
        fill={TRUNK}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d={`M -2 -12 h 7 M -1 -26 h 7 M ${lean} -${h - 18} h 7`} stroke={TRUNK_DARK} strokeWidth={2} strokeLinecap="round" />
      <g transform={`translate(${lean + 3}, ${-h})`}>
        <PalmFrond angle={-160} color={leafColor} />
        <PalmFrond angle={-120} color={leafColor} />
        <PalmFrond angle={-60} color={leafColor} />
        <PalmFrond angle={-20} color={leafColor} />
        <circle r={4} fill={TRUNK_DARK} stroke={INK} strokeWidth={2} />
      </g>
    </g>
  );
}

export function BananaTree({ variant = 0 }: { variant?: number }) {
  const h = variant === 1 ? 48 : 58;
  return (
    <g className="sway">
      <path d={`M -3 0 L -2 ${-h} L 4 ${-h} L 4 0 Z`} fill="#9BB05A" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <g transform={`translate(1, ${-h})`}>
        {[-150, -100, -40, -10].map((a, i) => (
          <path
            key={i}
            d="M 0 0 Q 22 -14 40 -4 Q 22 4 0 6 Z"
            fill={i % 2 ? "#6FA34A" : "#57923B"}
            stroke={INK}
            strokeWidth={2.2}
            strokeLinejoin="round"
            transform={`rotate(${a})`}
          />
        ))}
        {/* banana bunch */}
        <g transform="translate(4, 10)">
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M ${i * 5 - 5} 0 q 3 8 8 9`}
              fill="none"
              stroke="#F5CE45"
              strokeWidth={4.5}
              strokeLinecap="round"
            />
          ))}
          <path d="M -6 -1 q 6 10 15 11" fill="none" stroke={INK} strokeWidth={1.4} opacity={0.5} />
        </g>
      </g>
    </g>
  );
}

export function Broadleaf({ variant = 0 }: { variant?: number }) {
  const w = variant === 1 ? 46 : 60;
  return (
    <g className="sway">
      <path d="M -3 0 L -2 -34 L 4 -34 L 4 0 Z" fill={TRUNK} stroke={INK} strokeWidth={2.4} />
      <path d="M 1 -30 L -14 -44 M 1 -30 L 16 -46" stroke={TRUNK} strokeWidth={4} strokeLinecap="round" />
      <ellipse cx={0} cy={-52} rx={w / 2} ry={14} fill={LEAF_LIGHT} stroke={INK} strokeWidth={2.4} />
      <ellipse cx={-w * 0.22} cy={-44} rx={w * 0.32} ry={10} fill={LEAF} stroke={INK} strokeWidth={2.2} />
      <ellipse cx={w * 0.24} cy={-45} rx={w * 0.3} ry={9} fill={LEAF} stroke={INK} strokeWidth={2.2} />
    </g>
  );
}

export function GrassTuft({ variant = 0 }: { variant?: number }) {
  const colors = ["#57923B", "#79AC48", "#3E7A2E"];
  const c = colors[variant % 3];
  return (
    <g>
      {[-8, -3, 2, 7].map((x, i) => (
        <path
          key={i}
          d={`M ${x} 2 Q ${x + (i % 2 ? 4 : -4)} -12 ${x + (i % 2 ? 7 : -6)} -18`}
          fill="none"
          stroke={c}
          strokeWidth={4}
          strokeLinecap="round"
        />
      ))}
      <path d="M -1 2 Q 0 -14 1 -22" fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

export function Rock({ variant = 0 }: { variant?: number }) {
  return variant === 1 ? (
    <g>
      <path d="M -14 0 Q -12 -12 0 -13 Q 13 -12 14 0 Q 0 5 -14 0 Z" fill="#9A958C" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -4 -9 L 2 -3" stroke="#7B766D" strokeWidth={2} strokeLinecap="round" />
    </g>
  ) : (
    <g>
      <path d="M -10 0 L -7 -9 L 3 -11 L 10 -3 L 8 1 Q 0 4 -10 0 Z" fill="#B0AAA0" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
    </g>
  );
}

export function Flowers({ variant = 0 }: { variant?: number }) {
  const petal = variant === 1 ? "#F4877F" : "#E8B7D4";
  return (
    <g>
      {[-8, 0, 8].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${i === 1 ? -4 : 0})`}>
          <path d={`M 0 2 L 0 -8`} stroke="#57923B" strokeWidth={2.5} strokeLinecap="round" />
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-12} rx={3} ry={4.5} fill={petal} stroke={INK} strokeWidth={1.4} transform={`rotate(${a} 0 -8)`} />
          ))}
          <circle cx={0} cy={-8} r={2.4} fill="#F5CE45" stroke={INK} strokeWidth={1.2} />
        </g>
      ))}
    </g>
  );
}

export function Torch({ glow = false }: { glow?: boolean }) {
  return (
    <g>
      {glow && <ellipse cx={0} cy={-34} rx={30} ry={22} fill="url(#warmGlow)" opacity={0.85} />}
      <path d="M -2.5 0 L -1.5 -28 L 3.5 -28 L 3.5 0 Z" fill={TRUNK} stroke={INK} strokeWidth={2.2} />
      <path d="M -4 -28 h 10 l -1.5 6 h -7 Z" fill={TRUNK_DARK} stroke={INK} strokeWidth={2} />
      <g className="flicker">
        <path d="M 1 -46 Q 8 -38 4 -30 Q 1 -27 -3 -30 Q -7 -37 1 -46 Z" fill="#F0883E" stroke={INK} strokeWidth={1.8} />
        <path d="M 1 -40 Q 4 -35 2 -31 Q -1 -29 -3 -33 Q -3 -37 1 -40 Z" fill="#F5CE45" />
      </g>
    </g>
  );
}

export function Campfire({ glow = false, monkeys = 0 }: { glow?: boolean; monkeys?: number }) {
  return (
    <g>
      {glow && <ellipse cx={0} cy={-8} rx={54} ry={34} fill="url(#warmGlow)" opacity={0.9} />}
      {/* monkeys sitting around */}
      {monkeys >= 1 && (
        <g transform="translate(-34, 8) scale(0.72)">
          <SittingMonkey />
        </g>
      )}
      {monkeys >= 2 && (
        <g transform="translate(36, 8) scale(0.72)">
          <SittingMonkey flip />
        </g>
      )}
      {monkeys >= 3 && (
        <g transform="translate(2, -18) scale(0.62)">
          <SittingMonkey />
        </g>
      )}
      {/* logs */}
      <g transform="translate(0, 2)">
        <rect x={-16} y={-5} width={32} height={6} rx={3} fill={TRUNK} stroke={INK} strokeWidth={2} transform="rotate(14)" />
        <rect x={-16} y={-5} width={32} height={6} rx={3} fill={TRUNK_DARK} stroke={INK} strokeWidth={2} transform="rotate(-16)" />
      </g>
      <g className="flicker">
        <path d="M 0 -34 Q 11 -22 7 -10 Q 3 -4 0 -4 Q -4 -4 -8 -10 Q -11 -22 0 -34 Z" fill="#F0883E" stroke={INK} strokeWidth={2} />
        <path d="M 0 -24 Q 6 -16 4 -10 Q 1 -6 -1 -7 Q -5 -10 -5 -15 Q -4 -20 0 -24 Z" fill="#F5CE45" />
      </g>
    </g>
  );
}

export function Hut({ variant = 0 }: { variant?: number }) {
  const wall = variant === 1 ? "#C9A46A" : "#D8B77E";
  return (
    <g>
      <path d="M -22 0 L -22 -22 Q 0 -30 22 -22 L 22 0 Q 0 8 -22 0 Z" fill={wall} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M -6 2 L -6 -16 Q 0 -18 6 -16 L 6 2 Q 0 4 -6 2 Z" fill="#5A4326" stroke={INK} strokeWidth={2.2} />
      <path d="M -30 -18 Q 0 -66 30 -18 Q 16 -26 0 -27 Q -16 -26 -30 -18 Z" fill="#C9B26A" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M -20 -24 Q 0 -52 20 -24" fill="none" stroke="#A88F4C" strokeWidth={2.4} />
      <path d="M -10 -32 Q 0 -44 10 -32" fill="none" stroke="#A88F4C" strokeWidth={2.2} />
      <path d="M 0 -27 L 0 -56 M -4 -56 q 4 -6 8 0" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Hammock() {
  return (
    <g className="bob">
      <path d="M -34 -2 L -32 -34 M 34 -2 L 32 -34" stroke={TRUNK} strokeWidth={5} strokeLinecap="round" />
      <path d="M -34 -2 L -32 -34 M 34 -2 L 32 -34" stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={0.4} />
      <path d="M -32 -30 Q 0 -8 32 -30" fill="none" stroke={INK} strokeWidth={2.4} />
      <path d="M -32 -30 Q 0 -12 32 -30 Q 0 -2 -32 -30 Z" fill="#E8DFC8" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <g transform="translate(2, -20) scale(0.8)">
        <SleepingMonkey />
      </g>
    </g>
  );
}

export function Treehouse() {
  return (
    <g className="sway">
      <path d="M -5 0 L -4 -46 L 6 -46 L 6 0 Z" fill={TRUNK} stroke={INK} strokeWidth={2.6} />
      <ellipse cx={0} cy={-58} rx={30} ry={16} fill={LEAF} stroke={INK} strokeWidth={2.4} />
      <rect x={-16} y={-44} width={32} height={20} rx={3} fill="#C9A46A" stroke={INK} strokeWidth={2.4} />
      <rect x={-5} y={-38} width={10} height={14} rx={2} fill="#5A4326" stroke={INK} strokeWidth={2} />
      <path d="M -20 -44 L 0 -54 L 20 -44 Z" fill="#A88F4C" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -2 -24 L -2 0 M 4 -24 L 4 0 M -3 -8 h 8 M -3 -16 h 8" stroke={INK} strokeWidth={1.8} />
    </g>
  );
}

export function Pond() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={26} ry={13} fill="#7FC4E8" stroke={INK} strokeWidth={2.4} />
      <ellipse cx={-4} cy={-1} rx={16} ry={7} fill="#A9DBF2" className="shimmer" />
      <ellipse cx={10} cy={3} rx={5} ry={2} fill="#fff" opacity={0.7} className="shimmer" />
      <ellipse cx={-14} cy={4} rx={4} ry={1.8} fill="#57923B" stroke={INK} strokeWidth={1.4} />
    </g>
  );
}

export function Canoe() {
  return (
    <g className="bob">
      <path d="M -26 -4 Q 0 8 26 -4 Q 20 4 0 5 Q -20 4 -26 -4 Z" fill="#A9713F" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M -18 -2 Q 0 4 18 -2" fill="none" stroke={TRUNK_DARK} strokeWidth={2} />
      <path d="M 6 -2 L 16 -18 M 13 -19 q 5 -2 6 4" stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Sailboat() {
  return (
    <g className="bob">
      <path d="M -24 -4 Q 0 8 24 -4 L 18 4 Q 0 9 -18 4 Z" fill="#8A5A33" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M 0 -4 L 0 -44" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M 2 -42 Q 24 -30 4 -8 Z" fill="#EAF2F7" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M -2 -38 Q -16 -26 -2 -12 Z" fill="#F4877F" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
    </g>
  );
}

export function MonkeyDecor({ variant = 0 }: { variant?: number }) {
  return (
    <g transform="scale(0.85)">
      <SittingMonkey flip={variant === 1} />
    </g>
  );
}

/** Render a decoration sprite by shop item id. */
export function DecorationSprite({
  itemId,
  variant = 0,
  night = false,
  monkeys = 0
}: {
  itemId: string;
  variant?: number;
  night?: boolean;
  monkeys?: number;
}) {
  switch (itemId) {
    case "palm": return <Palm variant={variant} />;
    case "banana-tree": return <BananaTree variant={variant} />;
    case "broadleaf": return <Broadleaf variant={variant} />;
    case "grass": return <GrassTuft variant={variant} />;
    case "rock": return <Rock variant={variant} />;
    case "flowers": return <Flowers variant={variant} />;
    case "torch": return <Torch glow={night} />;
    case "campfire": return <Campfire glow={night} monkeys={monkeys} />;
    case "hut": return <Hut variant={variant} />;
    case "hammock": return <Hammock />;
    case "treehouse": return <Treehouse />;
    case "pond": return <Pond />;
    case "canoe": return <Canoe />;
    case "sailboat": return <Sailboat />;
    case "monkey": return <MonkeyDecor variant={variant} />;
    default: return null;
  }
}

/** Standalone preview (for shop cards / inventory chips). */
export function SpritePreview({ itemId, variant = 0, size = 72 }: { itemId: string; variant?: number; size?: number }) {
  return (
    <svg viewBox="-40 -78 80 92" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD98A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFD98A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform="translate(0, 6)">
        <DecorationSprite itemId={itemId} variant={variant} monkeys={itemId === "campfire" ? 0 : 0} />
      </g>
    </svg>
  );
}
