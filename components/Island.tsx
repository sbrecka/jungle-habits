"use client";

import React, { useMemo } from "react";
import { useJungle } from "@/lib/store";
import {
  TILE_W, TILE_H, isoX, isoY, isLand, isGrass, landRadius, tileHash, shopItem, growthStage
} from "@/lib/constants";
import { DecorationSprite } from "./art/Decorations";
import { SittingMonkey } from "./art/Monkeys";

interface IslandProps {
  editMode?: boolean;
  selectedItemId?: string | null;
  selectedVariant?: number;
  onPlace?: (x: number, y: number) => void;
  onRemove?: (placedId: string) => void;
  preview?: boolean;
}

function diamondPoints(cx: number, cy: number, inset = 0): string {
  const w = TILE_W / 2 - inset;
  const h = TILE_H / 2 - inset;
  return `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;
}

export default function Island({
  editMode = false,
  selectedItemId = null,
  selectedVariant = 0,
  onPlace,
  onRemove,
  preview = false
}: IslandProps) {
  const level = useJungle((s) => s.level);
  const placed = useJungle((s) => s.placed);
  const night = useJungle((s) => s.night);

  const r = landRadius(level);
  const stage = growthStage(level);
  const range = r + 5;

  const tiles = useMemo(() => {
    const land: { x: number; y: number; grass: boolean }[] = [];
    const ocean: { x: number; y: number }[] = [];
    for (let x = -range; x <= range; x++) {
      for (let y = -range; y <= range; y++) {
        if (Math.abs(x) + Math.abs(y) > range) continue;
        if (isLand(x, y, level)) land.push({ x, y, grass: isGrass(x, y, level) });
        else ocean.push({ x, y });
      }
    }
    land.sort((a, b) => a.x + a.y - (b.x + b.y));
    return { land, ocean };
  }, [level, range]);

  const occupied = useMemo(() => {
    const set = new Set<string>();
    placed.forEach((p) => set.add(`${p.x},${p.y}`));
    return set;
  }, [placed]);

  const sorted = useMemo(
    () => [...placed].sort((a, b) => a.x + a.y - (b.x + b.y) || a.x - b.x),
    [placed]
  );

  const selectedIsWater = selectedItemId ? !!shopItem(selectedItemId)?.water : false;
  const monkeysAtFire = Math.min(3, Math.max(1, Math.floor(level / 3)));

  const vb = (range + 1.5) * (TILE_W / 2);
  const vbH = (range + 2.5) * TILE_H;

  return (
    <svg
      viewBox={`${-vb} ${-vbH / 2 - 40} ${vb * 2} ${vbH + 60}`}
      className="w-full h-full select-none"
      role="img"
      aria-label="Your island"
    >
      <defs>
        <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={night ? "#20364F" : "#8CC3E3"} />
          <stop offset="100%" stopColor={night ? "#152436" : "#4E97C6"} />
        </linearGradient>
        <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD98A" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFD98A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ocean */}
      <rect x={-vb} y={-vbH / 2 - 40} width={vb * 2} height={vbH + 60} fill="url(#oceanGrad)" />

      {/* faint ocean grid */}
      <g stroke={night ? "#2E4763" : "#FFFFFF"} strokeOpacity={0.16} fill="none">
        {tiles.ocean.map((t) => (
          <polygon key={`o${t.x},${t.y}`} points={diamondPoints(isoX(t.x, t.y), isoY(t.x, t.y))} />
        ))}
      </g>

      {/* water shimmer */}
      {!preview && (
        <g fill="#fff">
          {[[-r - 3, 1], [r + 2, -2], [1, r + 3], [-2, -r - 3]].map(([x, y], i) => (
            <ellipse
              key={i}
              className="shimmer"
              style={{ animationDelay: `${i * 0.8}s` }}
              cx={isoX(x, y)}
              cy={isoY(x, y)}
              rx={16}
              ry={4}
              opacity={0.4}
            />
          ))}
        </g>
      )}

      {/* island cliff shadow */}
      <g>
        {tiles.land.map((t) => (
          <polygon
            key={`c${t.x},${t.y}`}
            points={diamondPoints(isoX(t.x, t.y), isoY(t.x, t.y) + 6)}
            fill={night ? "#0F1B29" : "#3E7AA6"}
            opacity={0.7}
          />
        ))}
      </g>

      {/* land tiles */}
      <g stroke="#00000022" strokeWidth={0.8}>
        {tiles.land.map((t) => {
          const h = tileHash(t.x * 3, t.y * 3);
          const grassFill = h > 0.5 ? "#8FBC5A" : "#82B14F";
          const sandFill = h > 0.5 ? "#EBD9A6" : "#E3CE96";
          return (
            <polygon
              key={`l${t.x},${t.y}`}
              points={diamondPoints(isoX(t.x, t.y), isoY(t.x, t.y))}
              fill={t.grass ? grassFill : sandFill}
            />
          );
        })}
      </g>

      {/* ambient monkey on empty starter island */}
      {stage === 1 && !placed.some((p) => p.itemId === "campfire") && (
        <g transform={`translate(${isoX(0, 0)}, ${isoY(0, 0) + 6}) scale(0.8)`}>
          <SittingMonkey />
        </g>
      )}

      {/* placed decorations, painter-sorted */}
      {sorted.map((p) => (
        <g
          key={p.id}
          transform={`translate(${isoX(p.x, p.y)}, ${isoY(p.x, p.y) + 5})`}
          onClick={(e) => {
            if (editMode && onRemove) {
              e.stopPropagation();
              onRemove(p.id);
            }
          }}
          className={editMode ? "cursor-pointer" : undefined}
          opacity={editMode ? 0.92 : 1}
        >
          <DecorationSprite
            itemId={p.itemId}
            variant={p.variant}
            night={night}
            monkeys={p.itemId === "campfire" ? monkeysAtFire : 0}
          />
          {editMode && (
            <circle cx={0} cy={-2} r={7} fill="#E06A62" stroke="#fff" strokeWidth={2} opacity={0.95} />
          )}
          {editMode && (
            <path d="M -3 -2 L 3 -2" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
          )}
        </g>
      ))}

      {/* night dimmer */}
      {night && (
        <rect
          x={-vb} y={-vbH / 2 - 40} width={vb * 2} height={vbH + 60}
          fill="#0B1A2E" opacity={0.35} pointerEvents="none"
        />
      )}

      {/* edit-mode target tiles (drawn above dimmer so always visible) */}
      {editMode && selectedItemId && (
        <g>
          {(selectedIsWater ? tiles.ocean : tiles.land)
            .filter((t) => !occupied.has(`${t.x},${t.y}`))
            .filter((t) => Math.abs(t.x) + Math.abs(t.y) <= r + 3)
            .map((t) => (
              <polygon
                key={`e${t.x},${t.y}`}
                points={diamondPoints(isoX(t.x, t.y), isoY(t.x, t.y), 4)}
                fill="#FFFFFF"
                opacity={0.18}
                stroke="#FFFFFF"
                strokeOpacity={0.75}
                strokeWidth={1.5}
                strokeDasharray="5 4"
                className="cursor-pointer hover:opacity-40"
                onClick={() => onPlace && onPlace(t.x, t.y)}
              />
            ))}
        </g>
      )}
    </svg>
  );
}
