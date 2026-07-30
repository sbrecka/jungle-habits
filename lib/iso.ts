"use client";

import { Sprite, spriteCanvas, spriteWidth } from "./pixel";

/**
 * 2:1 isometric primitives.
 *
 * A tile (i, j) is a 32x16 diamond whose TOP vertex sits at isoX/isoY(i, j).
 * i runs down-right on screen, j runs down-left. Larger i+j is nearer the
 * camera, so higher i+j must be drawn later.
 *
 * Everything is filled with 1px rects and integer coordinates, so the result
 * stays pixel-crisp when the canvas is scaled up with nearest-neighbour.
 */

export const TW = 32;
export const TH = 16;
export const HTW = 16;
export const HTH = 8;

export interface View {
  ox: number;
  oy: number;
  cols: number;
  rows: number;
  wallH: number;
}

export function isoX(v: View, i: number, j: number): number {
  return v.ox + (i - j) * HTW;
}

export function isoY(v: View, i: number, j: number): number {
  return v.oy + (i + j) * HTH;
}

/** Half-width of a tile diamond's scanline, row 0..15. */
function diamondHalf(y: number): number {
  return y < HTH ? y * 2 + 2 : (TH - 1 - y) * 2 + 2;
}

/** One floor tile. `lift` raises it (used for box top faces). */
export function tile(
  ctx: CanvasRenderingContext2D,
  v: View,
  i: number,
  j: number,
  colour: string,
  lift = 0
): void {
  const cx = isoX(v, i, j);
  const cy = isoY(v, i, j) - lift;
  ctx.fillStyle = colour;
  for (let y = 0; y < TH; y++) {
    const half = diamondHalf(y);
    ctx.fillRect(cx - half, cy + y, half * 2, 1);
  }
}

export interface BoxPal {
  top: string;
  left: string;
  right: string;
  /** Silhouette outline. Without it, neighbouring furniture blurs together. */
  edge?: string;
}

/** A 2:1 isometric line. `sx` is +1 for down-right, -1 for down-left. */
function isoLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  steps: number,
  sx: 1 | -1,
  sy: 1 | -1,
  colour: string
): void {
  ctx.fillStyle = colour;
  const x0 = sx === 1 ? x : x - 2;
  for (let k = 0; k < steps; k++) {
    ctx.fillRect(x0 + sx * k * 2, y + sy * k, 2, 1);
  }
}

/**
 * An axis-aligned box standing on tiles i..i+w-1, j..j+d-1, `h` pixels tall.
 * Draws the two camera-facing side faces and the top.
 */
export function box(
  ctx: CanvasRenderingContext2D,
  v: View,
  i: number,
  j: number,
  w: number,
  d: number,
  h: number,
  pal: BoxPal,
  lift = 0
): void {
  // west corner: left vertex of the near-left tile
  const wxx = isoX(v, i, j + d - 1) - HTW;
  const wyy = isoY(v, i, j + d - 1) + HTH - lift;
  // south corner: bottom vertex of the nearest tile
  const sxx = isoX(v, i + w - 1, j + d - 1);
  const syy = isoY(v, i + w - 1, j + d - 1) + TH - lift;
  // east corner: right vertex of the near-right tile
  const eyy = isoY(v, i + w - 1, j) + HTH - lift;
  const exx = isoX(v, i + w - 1, j) + HTW;

  // south-west face
  ctx.fillStyle = pal.left;
  for (let k = 0; k < w * HTH; k++) {
    ctx.fillRect(wxx + k * 2, wyy + k - h, 2, h + 1);
  }
  // south-east face
  ctx.fillStyle = pal.right;
  for (let k = 0; k < d * HTH; k++) {
    ctx.fillRect(sxx + k * 2, syy - k - h, 2, h + 1);
  }
  // top
  for (let a = 0; a < w; a++) {
    for (let b = 0; b < d; b++) {
      tile(ctx, v, i + a, j + b, pal.top, h + lift);
    }
  }

  if (!pal.edge) return;

  // Outline: the four edges of the top face, then the three visible verticals.
  const e = pal.edge;
  const nx = isoX(v, i, j);
  const ny = isoY(v, i, j) - h - lift;
  const topW = [wxx, wyy - h] as const;
  const topS = [sxx, syy - h] as const;
  const topE = [exx, eyy - h] as const;

  isoLine(ctx, nx, ny, w * HTH, 1, 1, e); // N -> E
  isoLine(ctx, nx, ny, d * HTH, -1, 1, e); // N -> W
  isoLine(ctx, topW[0], topW[1], w * HTH, 1, 1, e); // W -> S
  isoLine(ctx, topE[0], topE[1], d * HTH, -1, 1, e); // E -> S

  ctx.fillStyle = e;
  ctx.fillRect(topW[0], topW[1], 1, h);
  ctx.fillRect(topS[0], topS[1], 1, h);
  ctx.fillRect(topE[0] - 1, topE[1], 1, h);
}

/**
 * A horizontal detail line running along one of the two visible side faces,
 * `up` pixels above its base — drawer fronts, shelf edges, door splits.
 */
export function faceLineSW(
  ctx: CanvasRenderingContext2D,
  v: View,
  i: number,
  j: number,
  w: number,
  d: number,
  up: number,
  colour: string,
  lift = 0
): void {
  const x = isoX(v, i, j + d - 1) - HTW;
  const y = isoY(v, i, j + d - 1) + HTH - lift - up;
  isoLine(ctx, x, y, w * HTH, 1, 1, colour);
}

export function faceLineSE(
  ctx: CanvasRenderingContext2D,
  v: View,
  i: number,
  j: number,
  w: number,
  d: number,
  up: number,
  colour: string,
  lift = 0
): void {
  const x = isoX(v, i + w - 1, j + d - 1);
  const y = isoY(v, i + w - 1, j + d - 1) + TH - lift - up;
  isoLine(ctx, x, y, d * HTH, 1, -1, colour);
}

/** A small mark (handle, knob, button) on a side face. */
export function faceDotSW(
  ctx: CanvasRenderingContext2D,
  v: View,
  i: number,
  j: number,
  d: number,
  along: number,
  up: number,
  colour: string,
  size = 2,
  lift = 0
): void {
  const x = isoX(v, i, j + d - 1) - HTW + Math.round(along * 2);
  const y = isoY(v, i, j + d - 1) + HTH - lift - up + Math.round(along);
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, size, size);
}

export function faceDotSE(
  ctx: CanvasRenderingContext2D,
  v: View,
  i: number,
  j: number,
  w: number,
  d: number,
  along: number,
  up: number,
  colour: string,
  size = 2,
  lift = 0
): void {
  const x = isoX(v, i + w - 1, j + d - 1) + Math.round(along * 2);
  const y = isoY(v, i + w - 1, j + d - 1) + TH - lift - up - Math.round(along);
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, size, size);
}

/* ---------- floor & walls ---------- */

export function floor(
  ctx: CanvasRenderingContext2D,
  v: View,
  a: string,
  b: string
): void {
  for (let j = 0; j < v.rows; j++) {
    for (let i = 0; i < v.cols; i++) {
      tile(ctx, v, i, j, (i + j) % 2 === 0 ? a : b);
    }
  }
}

export interface WallPal {
  face: string;
  cap: string;
  base: string;
}

/** Back-right wall: stands on the floor edge running from N to E. */
export function wallNE(ctx: CanvasRenderingContext2D, v: View, pal: WallPal): void {
  const nx = isoX(v, 0, 0);
  const ny = isoY(v, 0, 0);
  const steps = v.cols * HTH;

  for (let k = 0; k < steps; k++) {
    const x = nx + k * 2;
    const y = ny + k;
    ctx.fillStyle = pal.face;
    ctx.fillRect(x, y - v.wallH, 2, v.wallH);
    ctx.fillStyle = pal.base;
    ctx.fillRect(x, y - 5, 2, 5);
    ctx.fillStyle = pal.cap;
    ctx.fillRect(x, y - v.wallH - 3, 2, 3);
  }
}

/** Back-left wall: stands on the floor edge running from N to W. */
export function wallNW(ctx: CanvasRenderingContext2D, v: View, pal: WallPal): void {
  const nx = isoX(v, 0, 0);
  const ny = isoY(v, 0, 0);
  const steps = v.rows * HTH;

  for (let k = 0; k < steps; k++) {
    const x = nx - 2 - k * 2;
    const y = ny + k;
    ctx.fillStyle = pal.face;
    ctx.fillRect(x, y - v.wallH, 2, v.wallH);
    ctx.fillStyle = pal.base;
    ctx.fillRect(x, y - 5, 2, 5);
    ctx.fillStyle = pal.cap;
    ctx.fillRect(x, y - v.wallH - 3, 2, 3);
  }
}

/* ---------- things hanging on walls ---------- */

/**
 * Draws a sprite sheared onto a wall plane, always left-to-right from (x0, y0).
 * `shear` is +1 on the back-right wall (the surface falls away to the right) and
 * -1 on the back-left wall (it rises to the right).
 */
export function drawOnWall(
  ctx: CanvasRenderingContext2D,
  s: Sprite,
  x0: number,
  y0: number,
  shear: 1 | -1
): void {
  const src = spriteCanvas(s);
  const w = spriteWidth(s);
  for (let x = 0; x < w; x++) {
    const dy = Math.floor(x / 2) * shear;
    ctx.drawImage(src, x, 0, 1, src.height, Math.round(x0 + x), Math.round(y0 + dy), 1, src.height);
  }
}

/**
 * Hangs a sprite on the back-right wall, `along` TILES from the room's north
 * corner and `up` px above the floor. One tile along a wall is half a tile
 * width on screen (HTW), not a full one.
 */
export function hangNE(
  ctx: CanvasRenderingContext2D,
  v: View,
  s: Sprite,
  along: number,
  up: number
): void {
  const x = isoX(v, 0, 0) + Math.round(along * HTW);
  const y = isoY(v, 0, 0) + Math.round(along * HTH) - up;
  drawOnWall(ctx, s, x, y, 1);
}

/** Same for the back-left wall; `along` measures to the sprite's right edge. */
export function hangNW(
  ctx: CanvasRenderingContext2D,
  v: View,
  s: Sprite,
  along: number,
  up: number
): void {
  const w = spriteWidth(s);
  const x = isoX(v, 0, 0) - Math.round(along * HTW) - w;
  const y = isoY(v, 0, 0) + Math.round(along * HTH) - up + Math.floor(w / 2);
  drawOnWall(ctx, s, x, y, -1);
}

/** Point on the back-right wall, for one-off details like a hanging bulb. */
export function wallPointNE(v: View, along: number, up: number): [number, number] {
  return [
    isoX(v, 0, 0) + Math.round(along * HTW),
    isoY(v, 0, 0) + Math.round(along * HTH) - up
  ];
}

/* ---------- objects standing on the floor ---------- */

/**
 * Draws a sprite standing upright on tile (i, j), horizontally centred on the
 * tile and with its base at the tile's bottom vertex.
 */
export function drawOnTile(
  ctx: CanvasRenderingContext2D,
  v: View,
  s: Sprite,
  i: number,
  j: number,
  dx = 0,
  dy = 0
): void {
  const src = spriteCanvas(s);
  const cx = isoX(v, i, j);
  const cy = isoY(v, i, j) + TH;
  ctx.drawImage(src, Math.round(cx - src.width / 2 + dx), Math.round(cy - src.height + dy));
}
