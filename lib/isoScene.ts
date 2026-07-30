"use client";

import { recolour, rect, spriteHeight, spriteWidth } from "./pixel";
import {
  View,
  box,
  drawOnTile,
  drawOnWall,
  faceDotSE,
  faceDotSW,
  faceLineSE,
  faceLineSW,
  floor as drawFloor,
  hangNE,
  hangNW,
  isoX,
  isoY,
  tile,
  wallNE,
  wallNW,
  wallPointNE
} from "./iso";
import {
  ART,
  BLANKET,
  BOOKS,
  CHAIR_BACK,
  CHAR,
  CHAR_BLINK,
  CURTAIN,
  CUSHION,
  DOOR,
  HEADPHONES_ON,
  KEYBOARD_ISO,
  KEYBOARD_MECH,
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
const DESK_H = 13;
/** A sit-stand desk rides higher and swaps the wooden frame for metal. */
const DESK_H_STANDING = 18;

/** Every piece of furniture is outlined in this, so nothing blurs together. */
const EDGE = "#1b1922";

function roomSize(tier: number): [number, number] {
  return ROOM_SIZE[Math.max(0, Math.min(ROOM_SIZE.length - 1, tier))];
}

function wallHeight(tier: number): number {
  return tier === 3 || tier === 5 ? 68 : 56;
}

/**
 * The canvas is sized to the room itself, so a cramped cellar fills the screen
 * at a big zoom and a large flat naturally reads as more spacious.
 */
export function canvasSizeFor(tier: number): { w: number; h: number } {
  const [cols, rows] = roomSize(tier);
  return {
    w: (cols + rows) * 16 + MARGIN * 2,
    h: wallHeight(tier) + CAP_H + (cols + rows) * 8 + MARGIN * 2
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
  /** Skirting board — pale from the panel flat up, bare concrete in the cellar. */
  base: string;
  floorA: string;
  floorB: string;
}

const PALETTES: Palette[] = [
  {
    wallNE: "#514c43",
    wallNW: "#3d3a34",
    cap: "#5e594e",
    base: "#2b2924",
    floorA: "#403c36",
    floorB: "#34312c"
  },
  {
    wallNE: "#8f8a6a",
    wallNW: "#706c50",
    cap: "#9f9a78",
    base: "#b9b58a",
    floorA: "#8e6742",
    floorB: "#7a5636"
  },
  {
    wallNE: "#a3a184",
    wallNW: "#827f65",
    cap: "#b4b294",
    base: "#cfcba2",
    floorA: "#a67c51",
    floorB: "#8f6a44"
  },
  {
    wallNE: "#b0aca6",
    wallNW: "#8b8781",
    cap: "#c4c0ba",
    base: "#d6d2cb",
    floorA: "#94897a",
    floorB: "#7d746a"
  },
  {
    wallNE: "#d0c7ae",
    wallNW: "#a69d86",
    cap: "#e4dbc4",
    base: "#eee5cf",
    floorA: "#b58551",
    floorB: "#9c7245"
  },
  {
    wallNE: "#efe6d8",
    wallNW: "#cbc2b3",
    cap: "#faf3e8",
    base: "#f4ecdb",
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
 *   (cols-3,rows-3) you   (cols-2..cols-1,rows-2) desk   (cols-1,rows-1) plant
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

/** Vertical seam on a right-hand face — wardrobe and cupboard doors. */
function doorSeam(
  ctx: CanvasRenderingContext2D,
  v: View,
  i: number,
  j: number,
  w: number,
  d: number,
  along: number,
  from: number,
  to: number,
  colour: string
): void {
  for (let up = from; up < to; up++) {
    faceDotSE(ctx, v, i, j, w, d, along, up, colour, 1);
  }
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
    const [bx, by] = wallPointNE(v, 1.4, v.wallH - 6);
    rect(ctx, bx, by - 12, 1, 12, "#332f2a");
    rect(ctx, bx - 2, by, 5, 4, night ? "#ffe9a8" : "#c9c2ac");
  } else {
    const win = night ? WINDOW_NIGHT : WINDOW_DAY;
    const at = v.cols - 2.8;
    hangNE(ctx, v, CURTAIN, at - 0.45, v.wallH - 13);
    hangNE(ctx, v, win, at, v.wallH - 14);
    hangNE(ctx, v, CURTAIN, at + 1.5, v.wallH - 13);
  }

  if (tier >= 1) hangNW(ctx, v, DOOR, v.rows - 1.7, spriteHeight(DOOR));
  if (owned.poster) hangNW(ctx, v, POSTER, 0.9, v.wallH - 18);
  if (owned.art) hangNW(ctx, v, ART, v.rows - 2.8, v.wallH - 16);
  if (owned.tv) hangNE(ctx, v, TV_WALL, 0.5, v.wallH - 20);

  // ---- rug
  if (owned.rug) {
    for (let j = 1; j < v.rows - 1; j++) {
      for (let i = 1; i < v.cols - 1; i++) {
        tile(ctx, v, i, j, (i + j) % 2 === 0 ? "#63768c" : "#54647a");
      }
    }
  }

  // ---- furniture against the back walls, far to near
  if (owned.shelf) {
    const [i, j] = L.shelf;
    box(ctx, v, i, j, 1, 1, 32, {
      top: "#8a5a34",
      left: "#5a3a20",
      right: "#754a2b",
      edge: EDGE
    });
    // shelf edges, then books on the two upper ones
    for (const up of [11, 21, 31]) {
      faceLineSE(ctx, v, i, j, 1, 1, up, "#b07a48");
      faceLineSW(ctx, v, i, j, 1, 1, up, "#4a2f19");
    }
    drawOnTile(ctx, v, BOOKS, i, j, 0, -32);
    drawOnTile(ctx, v, BOOKS, i, j, 0, -22);
  }

  if (owned.sofa) {
    const [i, j] = L.sofa;
    // backrest first, then the seat in front of it
    box(ctx, v, i, j, 2, 1, 23, {
      top: "#4a8c80",
      left: "#255049",
      right: "#2f6058",
      edge: EDGE
    });
    box(ctx, v, i, j, 2, 1, 12, {
      top: "#3f7d72",
      left: "#255049",
      right: "#2f6058",
      edge: EDGE
    });
    drawOnTile(ctx, v, CUSHION, i, j, -8, -12);
    drawOnTile(ctx, v, CUSHION, i + 1, j, 8, -12);
  }

  if (tier >= 2) {
    const [i, j] = L.wardrobe;
    box(ctx, v, i, j, 1, 1, 44, {
      top: "#a4693a",
      left: "#67401f",
      right: "#87532a",
      edge: EDGE
    });
    doorSeam(ctx, v, i, j, 1, 1, 8, 3, 42, "#5c3a1c");
    faceLineSE(ctx, v, i, j, 1, 1, 42, "#c08a52");
    faceDotSE(ctx, v, i, j, 1, 1, 6, 22, "#e0c58a", 2);
    faceDotSE(ctx, v, i, j, 1, 1, 10, 22, "#e0c58a", 2);
  }

  // bed, or a mattress on the floor while you're at the bottom
  if (tier >= 2) {
    const [i, j] = L.bed;
    box(ctx, v, i, j, 1, 2, 6, {
      top: "#6b4a2c",
      left: "#4a3119",
      right: "#5b3d23",
      edge: EDGE
    });
    box(ctx, v, i, j, 1, 2, 11, {
      top: "#e6e2d8",
      left: "#b8b3a6",
      right: "#cdc8bb",
      edge: EDGE
    });
    // Resting on the mattress top (11px up), centred mid-tile.
    drawOnTile(ctx, v, PILLOW, i, j, 0, -19);
    drawOnTile(ctx, v, BLANKET, i, j + 1, 0, -19);
  } else {
    const [i, j] = L.bed;
    box(ctx, v, i, j, 1, 2, 4, {
      top: "#8d8577",
      left: "#5d574c",
      right: "#6e685b",
      edge: EDGE
    });
    drawOnTile(ctx, v, BLANKET, i, j + 1, 0, -12);
  }

  if (owned.aquarium) {
    const [i, j] = L.aquarium;
    box(ctx, v, i, j, 1, 1, 14, {
      top: "#5a3a20",
      left: "#442c17",
      right: "#4f331c",
      edge: EDGE
    });
    box(ctx, v, i, j, 1, 1, 28, {
      top: "#7ec8e8",
      left: "#2f7ba8",
      right: "#4fa8d8",
      edge: EDGE
    });
    // water line and a couple of fish, so it reads as a tank not a blue cube
    faceLineSE(ctx, v, i, j, 1, 1, 24, "#b6e4f5");
    faceLineSW(ctx, v, i, j, 1, 1, 24, "#8fd0ea");
    faceDotSE(ctx, v, i, j, 1, 1, 5, 18, "#e8913f", 2);
    faceDotSE(ctx, v, i, j, 1, 1, 11, 12, "#e8d24f", 2);
    faceDotSW(ctx, v, i, j, 1, 9, 15, "#e06a5f", 2);
  }

  if (owned.server) drawOnTile(ctx, v, SERVER, L.server[0], L.server[1]);
  if (owned.plant) drawOnTile(ctx, v, PLANT, L.plant[0], L.plant[1]);

  // ---- chair, character, then the desk in front of them
  if (owned.chair) drawOnTile(ctx, v, CHAIR_BACK, L.char[0], L.char[1], 0, -6);

  const outfit = OUTFITS[Math.max(0, Math.min(OUTFITS.length - 1, tier))];
  const bodySprite = recolour(CHAR, `fit${tier}`, outfit);
  const bob = still ? 0 : Math.floor(frame / 8) % 2;
  // Sits so the desk edge crosses the hips — legs hidden, torso and head clear.
  const charDY = -6 + bob + (tired ? 2 : 0);
  drawOnTile(ctx, v, bodySprite, L.char[0], L.char[1], 0, charDY);

  // Eyes sit on row 9 of the sprite; drop the lids over them.
  if (!still && frame % 200 < 6) {
    drawOnTile(ctx, v, CHAR_BLINK, L.char[0], L.char[1], 1, charDY - spriteHeight(CHAR) + 10);
  }

  // Headphones sit over the top of the head (sprite row 1 down).
  if (owned.headphones) {
    const dy = charDY - spriteHeight(CHAR) + 1 + spriteHeight(HEADPHONES_ON);
    drawOnTile(ctx, v, HEADPHONES_ON, L.char[0], L.char[1], 0, dy);
  }

  // ---- desk, with a drawer front and two handles
  const deskH = owned.standingdesk ? DESK_H_STANDING : DESK_H;
  {
    const [i, j] = L.desk;
    box(ctx, v, i, j, L.deskW, 1, deskH, {
      top: tier >= 2 ? "#a5743f" : "#8a5a34",
      left: owned.standingdesk ? "#33363d" : "#4e3117",
      right: owned.standingdesk ? "#43464e" : "#68432a",
      edge: EDGE
    });
    faceLineSW(ctx, v, i, j, L.deskW, 1, deskH - 3, owned.standingdesk ? "#22252b" : "#3f2712");
    if (!owned.standingdesk) {
      // `along` counts 2px steps and the face is deskW * 8 steps long.
      faceDotSW(ctx, v, i, j, 1, 5, deskH - 7, "#d9b477", 2);
      faceDotSW(ctx, v, i, j, 1, 11, deskH - 7, "#d9b477", 2);
    }
  }

  // ---- on the desk. `-DESK_H - 8` lands things mid-tile on the desk top
  // instead of hanging off its front edge.
  const midI = L.desk[0];
  const sideI = L.desk[0] + 1;
  const deskJ = L.desk[1];
  const onDesk = -deskH - 8;

  if (owned.ultrawide || owned.monitor2) {
    drawOnTile(ctx, v, MONITOR_BACK, midI, deskJ, 0, onDesk);
    if (owned.monitor2 && !owned.ultrawide) {
      drawOnTile(ctx, v, MONITOR_BACK_SMALL, sideI, deskJ, 8, onDesk + 2);
    }
  } else {
    drawOnTile(ctx, v, MONITOR_BACK_SMALL, midI, deskJ, 0, onDesk);
  }

  if (owned.laptop) drawOnTile(ctx, v, LAPTOP_ISO, sideI, deskJ, 4, onDesk + 4);

  // keyboard lies flat in front of the screen
  drawOnTile(ctx, v, owned.keyboard ? KEYBOARD_MECH : KEYBOARD_ISO, midI, deskJ, 0, -deskH - 1);

  drawOnTile(ctx, v, MUG, sideI, deskJ, 8, onDesk + 8);
  if (owned.lamp) drawOnTile(ctx, v, LAMP, sideI, deskJ, -2, onDesk);

  // ---- light
  const sx = isoX(v, midI, deskJ);
  const sy = isoY(v, midI, deskJ) - deskH - 6;
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
