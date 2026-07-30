"use client";

import { recolour, rect, spriteHeight, spriteWidth } from "./pixel";
import {
  View,
  box,
  drawOnTile,
  drawOnWall,
  floor as drawFloor,
  isoX,
  isoY,
  tile,
  tileEdge,
  wallAnchorNE,
  wallAnchorNW,
  wallNE,
  wallNW
} from "./iso";
import {
  ART,
  BLANKET,
  BOOKS,
  CHAIR_BACK,
  CHAR,
  CHAR_BLINK,
  DOOR,
  LAMP,
  LAPTOP_ISO,
  MONITOR_BACK,
  MONITOR_BACK_SMALL,
  MUG,
  OUTFITS,
  PILLOW,
  PLANT,
  POSTER,
  SERVER,
  TV_WALL,
  WINDOW_DAY,
  WINDOW_NIGHT
} from "./isoSprites";
import { Owned } from "./store";

/** The flat grows as you move up in the world. */
const ROOM_SIZE: [number, number][] = [
  [4, 4],
  [5, 5],
  [6, 6],
  [7, 7],
  [8, 8],
  [8, 8]
];

const MARGIN = 6;
const CAP_H = 3;
const DESK_H = 12;

function roomSize(tier: number): [number, number] {
  return ROOM_SIZE[Math.max(0, Math.min(ROOM_SIZE.length - 1, tier))];
}

function wallHeight(tier: number): number {
  // Loft and villa get high ceilings.
  return tier === 3 || tier === 5 ? 68 : 56;
}

/**
 * The canvas is sized to the room itself, so a cramped cellar fills the screen
 * at a big zoom and a large flat naturally reads as more spacious.
 */
export function canvasSizeFor(tier: number): { w: number; h: number } {
  const [cols, rows] = roomSize(tier);
  const wallH = wallHeight(tier);
  return {
    w: (cols + rows) * 16 + MARGIN * 2,
    h: wallH + CAP_H + (cols + rows) * 8 + MARGIN * 2
  };
}

function viewFor(tier: number): View {
  const [cols, rows] = roomSize(tier);
  const wallH = wallHeight(tier);
  return {
    ox: MARGIN + (rows - 1) * 16 + 16,
    oy: MARGIN + wallH + CAP_H,
    cols,
    rows,
    wallH
  };
}

interface Palette {
  wallNE: string;
  wallNW: string;
  cap: string;
  base: string;
  floorA: string;
  floorB: string;
}

const PALETTES: Palette[] = [
  // 0 — cellar: damp concrete
  {
    wallNE: "#514c43",
    wallNW: "#3d3a34",
    cap: "#5e594e",
    base: "#292724",
    floorA: "#403c36",
    floorB: "#33302b"
  },
  // 1 — panel flat: tired wallpaper, wooden floor
  {
    wallNE: "#8f8471",
    wallNW: "#6f6759",
    cap: "#a0967f",
    base: "#4c443a",
    floorA: "#8e6742",
    floorB: "#7a5636"
  },
  // 2 — proper flat
  {
    wallNE: "#a6a396",
    wallNW: "#82806f",
    cap: "#bab7aa",
    base: "#5c5449",
    floorA: "#a67c51",
    floorB: "#8f6a44"
  },
  // 3 — loft: concrete and glass
  {
    wallNE: "#b2aea8",
    wallNW: "#8d8984",
    cap: "#c6c2bc",
    base: "#484441",
    floorA: "#94897a",
    floorB: "#7d746a"
  },
  // 4 — house: warm walls, oak floor
  {
    wallNE: "#d2c8b5",
    wallNW: "#aaa08e",
    cap: "#e5ddcc",
    base: "#6b5d49",
    floorA: "#b58551",
    floorB: "#9c7245"
  },
  // 5 — villa: bright plaster, sea light
  {
    wallNE: "#efe6d8",
    wallNW: "#cdc4b5",
    cap: "#faf3e8",
    base: "#877860",
    floorA: "#cebb98",
    floorB: "#b9a684"
  }
];

function palette(tier: number): Palette {
  return PALETTES[Math.max(0, Math.min(PALETTES.length - 1, tier))];
}

/* ---------- furniture layout, derived from the room size ---------- */

interface Layout {
  desk: [number, number];
  deskW: number;
  char: [number, number];
  bed: [number, number];
  sofa: [number, number];
  wardrobe: [number, number];
  shelf: [number, number];
  plant: [number, number];
  aquarium: [number, number];
  server: [number, number];
}

/**
 * Tiles are assigned so nothing ever overlaps, even in the 4x4 cellar:
 *   (0,0) shelf   (0,1) server   (0,rows-2..rows-1) bed
 *   (1..2,0) sofa   (cols-1,0) wardrobe   (cols-1,1) aquarium
 *   (cols-2,rows-3) you   (cols-2..cols-1,rows-2) desk   (cols-1,rows-1) plant
 */
function layoutFor(v: View): Layout {
  const { cols, rows } = v;
  return {
    desk: [cols - 2, rows - 2],
    deskW: 2,
    // One grid step diagonally back = directly above the desk on screen,
    // so you read as sitting at it rather than standing beside it.
    char: [cols - 3, rows - 3],
    bed: [0, rows - 2],
    sofa: [1, 0],
    wardrobe: [cols - 1, 0],
    shelf: [0, 0],
    plant: [cols - 1, rows - 1],
    aquarium: [cols - 1, 1],
    server: [0, 1]
  };
}

/** Soft round light — much kinder than a hard rectangle. */
function glow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  colour: string
): void {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, colour);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ---------- scene ---------- */

export interface SceneParams {
  tier: number;
  owned: Owned;
  night: boolean;
  energy: number;
  frame: number;
  still?: boolean;
}

export function drawScene(ctx: CanvasRenderingContext2D, p: SceneParams): void {
  const { tier, owned, night, energy, frame } = p;
  const v = viewFor(tier);
  const pal = palette(tier);
  const L = layoutFor(v);
  const { w: CW, h: CH } = canvasSizeFor(tier);
  const tired = energy < 30;
  const still = p.still || energy <= 0;

  ctx.clearRect(0, 0, CW, CH);
  rect(ctx, 0, 0, CW, CH, night ? "#0c0e16" : "#14141c");

  // ---- floor & walls
  drawFloor(ctx, v, pal.floorA, pal.floorB);
  wallNW(ctx, v, { face: pal.wallNW, cap: pal.cap, base: pal.base });
  wallNE(ctx, v, { face: pal.wallNE, cap: pal.cap, base: pal.base });

  // ---- things on the walls
  if (tier === 0) {
    const [bx, by] = wallAnchorNE(v, 1.2, v.wallH - 6);
    rect(ctx, bx, by - 12, 1, 12, "#332f2a");
    rect(ctx, bx - 2, by, 5, 4, night ? "#ffe9a8" : "#c9c2ac");
  } else {
    const win = night ? WINDOW_NIGHT : WINDOW_DAY;
    const [wx, wy] = wallAnchorNE(v, v.cols - 2.6, v.wallH - 14);
    drawOnWall(ctx, win, wx, wy, 1);
  }

  if (tier >= 1) {
    const [dx, dy] = wallAnchorNW(v, v.rows - 1.5, v.wallH - 4);
    drawOnWall(ctx, DOOR, dx - spriteWidth(DOOR), dy, -1);
  }
  if (owned.poster) {
    const [px, py] = wallAnchorNW(v, 1.2, v.wallH - 18);
    drawOnWall(ctx, POSTER, px - spriteWidth(POSTER), py, -1);
  }
  if (owned.art) {
    const [ax, ay] = wallAnchorNE(v, 2.1, v.wallH - 16);
    drawOnWall(ctx, ART, ax, ay, 1);
  }
  if (owned.tv) {
    const [tx, ty] = wallAnchorNE(v, 0.8, v.wallH - 20);
    drawOnWall(ctx, TV_WALL, tx, ty, 1);
  }

  // ---- rug
  if (owned.rug) {
    for (let j = 1; j < v.rows - 1; j++) {
      for (let i = 1; i < v.cols - 1; i++) {
        tile(ctx, v, i, j, (i + j) % 2 === 0 ? "#8d5f9e" : "#764e88");
      }
    }
    for (let i = 1; i < v.cols - 1; i++) tileEdge(ctx, v, i, v.rows - 2, "#5a3a6b");
  }

  // ---- furniture against the back walls, far to near
  if (owned.shelf) {
    box(ctx, v, L.shelf[0], L.shelf[1], 1, 1, 30, {
      top: "#8a5a34",
      left: "#5a3a20",
      right: "#754a2b"
    });
    drawOnTile(ctx, v, BOOKS, L.shelf[0], L.shelf[1], 0, -30);
    drawOnTile(ctx, v, BOOKS, L.shelf[0], L.shelf[1], 0, -18);
  }

  if (owned.sofa) {
    box(ctx, v, L.sofa[0], L.sofa[1], 2, 1, 22, {
      top: "#4a8c80",
      left: "#255049",
      right: "#2f6058"
    });
    box(ctx, v, L.sofa[0], L.sofa[1], 2, 1, 11, {
      top: "#3f7d72",
      left: "#255049",
      right: "#2f6058"
    });
  }

  if (tier >= 2) {
    box(ctx, v, L.wardrobe[0], L.wardrobe[1], 1, 1, 42, {
      top: "#a4693a",
      left: "#67401f",
      right: "#87532a"
    });
  }

  // bed, or a mattress on the floor while you're at the bottom
  if (tier >= 2) {
    box(ctx, v, L.bed[0], L.bed[1], 1, 2, 9, {
      top: "#7a5ba6",
      left: "#4a3670",
      right: "#5d4383"
    });
    drawOnTile(ctx, v, PILLOW, L.bed[0], L.bed[1], 0, -9);
    drawOnTile(ctx, v, BLANKET, L.bed[0], L.bed[1] + 1, 0, -16);
  } else {
    box(ctx, v, L.bed[0], L.bed[1], 1, 2, 3, {
      top: "#8d8577",
      left: "#5d574c",
      right: "#6e685b"
    });
    drawOnTile(ctx, v, BLANKET, L.bed[0], L.bed[1] + 1, 0, -11);
  }

  if (owned.aquarium) {
    box(ctx, v, L.aquarium[0], L.aquarium[1], 1, 1, 14, {
      top: "#5a3a20",
      left: "#442c17",
      right: "#4f331c"
    });
    box(ctx, v, L.aquarium[0], L.aquarium[1], 1, 1, 27, {
      top: "#7ec8e8",
      left: "#2f7ba8",
      right: "#4fa8d8"
    });
  }

  if (owned.server) drawOnTile(ctx, v, SERVER, L.server[0], L.server[1]);
  if (owned.plant) drawOnTile(ctx, v, PLANT, L.plant[0], L.plant[1]);

  // ---- chair, character, then the desk in front of them
  if (owned.chair) drawOnTile(ctx, v, CHAIR_BACK, L.char[0], L.char[1], 0, -4);

  const outfit = OUTFITS[Math.max(0, Math.min(OUTFITS.length - 1, tier))];
  const bodySprite = recolour(CHAR, `fit${tier}`, outfit);
  const bob = still ? 0 : Math.floor(frame / 8) % 2;
  // Sits so the desk edge crosses the hips — legs hidden, torso and head clear.
  const charDY = -6 + bob + (tired ? 2 : 0);
  drawOnTile(ctx, v, bodySprite, L.char[0], L.char[1], 0, charDY);

  // Eyes sit on row 8 of the sprite; drop the lids over them.
  if (!still && frame % 200 < 6) {
    drawOnTile(ctx, v, CHAR_BLINK, L.char[0], L.char[1], 1, charDY - spriteHeight(CHAR) + 9);
  }

  // desk
  box(ctx, v, L.desk[0], L.desk[1], L.deskW, 1, DESK_H, {
    top: tier >= 2 ? "#9f6f42" : "#8a5a34",
    left: "#523419",
    right: "#684325"
  });

  // ---- on the desk. `-DESK_H - 8` lands things mid-tile on the desk top
  // instead of hanging off its front edge.
  // The screen goes on the tile directly in front of you; clutter to the side.
  const midI = L.desk[0];
  const sideI = L.desk[0] + 1;
  const deskJ = L.desk[1];
  const onDesk = -DESK_H - 8;

  if (owned.ultrawide || owned.monitor2) {
    drawOnTile(ctx, v, MONITOR_BACK, midI, deskJ, 0, onDesk);
    if (owned.monitor2 && !owned.ultrawide) {
      drawOnTile(ctx, v, MONITOR_BACK_SMALL, sideI, deskJ, 8, onDesk + 2);
    }
  } else {
    drawOnTile(ctx, v, MONITOR_BACK_SMALL, midI, deskJ, 0, onDesk);
  }

  if (owned.laptop) drawOnTile(ctx, v, LAPTOP_ISO, sideI, deskJ, 4, onDesk + 4);

  // keyboard: a thin slab in front of the screen
  box(ctx, v, midI, deskJ, 1, 1, 3, {
    top: "#5c5f68",
    left: "#383b42",
    right: "#484b53"
  }, DESK_H);

  drawOnTile(ctx, v, MUG, sideI, deskJ, 8, onDesk + 8);
  if (owned.lamp) drawOnTile(ctx, v, LAMP, sideI, deskJ, -2, onDesk);

  // ---- light
  const sx = isoX(v, midI, deskJ);
  const sy = isoY(v, midI, deskJ) - DESK_H - 6;
  glow(ctx, sx, sy, 30, night ? "rgba(120,180,235,0.20)" : "rgba(150,195,235,0.10)");
  if (owned.lamp) {
    glow(ctx, isoX(v, sideI, deskJ), sy, 24, "rgba(255,220,140,0.16)");
  }

  // ---- grade
  if (night) {
    ctx.save();
    ctx.fillStyle = "rgba(20,28,56,0.32)";
    ctx.fillRect(0, 0, CW, CH);
    ctx.restore();
  }
  if (tired) {
    ctx.save();
    ctx.fillStyle = "rgba(58,58,70,0.16)";
    ctx.fillRect(0, 0, CW, CH);
    ctx.restore();
  }
}
