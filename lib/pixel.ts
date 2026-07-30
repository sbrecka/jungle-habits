"use client";

/**
 * Tiny pixel-art engine.
 *
 * Sprites are authored as rows of single characters; each character maps to a
 * colour through the sprite's palette. Anything not in the palette (typically
 * ".") stays transparent. Rows may be ragged — they are padded on the right.
 *
 * Every sprite is rasterised once into an offscreen canvas and cached by `key`,
 * so a frame costs one drawImage per visible sprite instead of thousands of
 * fillRect calls.
 */

export interface Sprite {
  /** Unique cache key. Palette variants must use distinct keys. */
  key: string;
  rows: string[];
  pal: Record<string, string>;
}

export function spriteWidth(s: Sprite): number {
  return s.rows.reduce((m, r) => Math.max(m, r.length), 0);
}

export function spriteHeight(s: Sprite): number {
  return s.rows.length;
}

const cache = new Map<string, HTMLCanvasElement>();

function rasterise(s: Sprite): HTMLCanvasElement {
  const w = Math.max(1, spriteWidth(s));
  const h = Math.max(1, spriteHeight(s));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  for (let y = 0; y < s.rows.length; y++) {
    const row = s.rows[y];
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      const colour = s.pal[ch];
      if (!colour) {
        x++;
        continue;
      }
      // Collapse horizontal runs of the same colour into one fillRect.
      let run = 1;
      while (x + run < row.length && row[x + run] === ch) run++;
      ctx.fillStyle = colour;
      ctx.fillRect(x, y, run, 1);
      x += run;
    }
  }
  return c;
}

export function spriteCanvas(s: Sprite): HTMLCanvasElement {
  const hit = cache.get(s.key);
  if (hit) return hit;
  const c = rasterise(s);
  cache.set(s.key, c);
  return c;
}

/** Returns a palette-swapped copy. Used for outfits, day/night tints, moods. */
export function recolour(s: Sprite, keySuffix: string, overrides: Record<string, string>): Sprite {
  return { key: `${s.key}:${keySuffix}`, rows: s.rows, pal: { ...s.pal, ...overrides } };
}

export interface DrawOpts {
  flip?: boolean;
  alpha?: number;
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  s: Sprite,
  x: number,
  y: number,
  opts: DrawOpts = {}
): void {
  const c = spriteCanvas(s);
  const px = Math.round(x);
  const py = Math.round(y);
  const { flip = false, alpha = 1 } = opts;

  const needsRestore = flip || alpha !== 1;
  if (needsRestore) ctx.save();
  if (alpha !== 1) ctx.globalAlpha = alpha;

  if (flip) {
    ctx.translate(px + c.width, py);
    ctx.scale(-1, 1);
    ctx.drawImage(c, 0, 0);
  } else {
    ctx.drawImage(c, px, py);
  }

  if (needsRestore) ctx.restore();
}

/* ---------- primitive helpers for procedural backgrounds ---------- */

export function rect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  colour: string
): void {
  ctx.fillStyle = colour;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/** Horizontal 1px line. */
export function hline(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  colour: string
): void {
  rect(ctx, x, y, w, 1, colour);
}

/** Vertical 1px line. */
export function vline(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  colour: string
): void {
  rect(ctx, x, y, 1, h, colour);
}

/** Deterministic pseudo-random in [0,1) — stable speckle//grime patterns. */
export function hash2(x: number, y: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

/** Scatters 1px specks in a box — floor grain, wall grime, stars. */
export function speckle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  colour: string,
  density: number,
  seed = 0
): void {
  ctx.fillStyle = colour;
  for (let iy = 0; iy < h; iy++) {
    for (let ix = 0; ix < w; ix++) {
      if (hash2(x + ix + seed * 13, y + iy - seed * 7) < density) {
        ctx.fillRect(x + ix, y + iy, 1, 1);
      }
    }
  }
}
