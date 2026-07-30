"use client";

import { Sprite } from "./pixel";

/**
 * Sprites for the isometric room. Boxes (desk, bed, sofa, wardrobe…) are drawn
 * procedurally by lib/iso.ts — these are the pieces that need real shapes:
 * the character, screens, plants and things hanging on walls.
 */
const BASE: Record<string, string> = {
  o: "#221f29",
  O: "#3a3542",
  s: "#e9b183",
  d: "#c98b60",
  l: "#ffd9ae",
  h: "#3a2b21",
  H: "#56402f",
  c: "#3f6fa8",
  C: "#2f5480",
  p: "#3a4048",
  P: "#2a3037",
  e: "#241d16",
  g: "#7d7f88",
  G: "#4a4c54",
  y: "#b9bcc4",
  q: "#cfd3da",
  n: "#8a5a34",
  N: "#5f3d22",
  m: "#b07a48",
  w: "#f4f4f4",
  k: "#191720",
  b: "#7cc4ee",
  B: "#2e78ad",
  r: "#c8524f",
  R: "#8d3634",
  f: "#6aa84f",
  F: "#3f6b30",
  t: "#4fb3a4",
  u: "#8a6fc0",
  a: "#e0a53c",
  i: "#fff4d6"
};

function S(key: string, rows: string[], extra: Record<string, string> = {}): Sprite {
  return { key, rows, pal: { ...BASE, ...extra } };
}

/* ============================================================
   CHARACTER — front view from a high angle, seated at the desk.
   Head is deliberately large (chunky pixel proportions).
   ============================================================ */

export const CHAR = S("char", [
  ".......oooooooo",
  ".....oohhhhhhhhoo",
  "....ohhhhhhhhhhhho",
  "...ohhhhhhhhhhhhhho",
  "...ohhhhhhhhhhhhhho",
  "...ohhhhhhhhhhhhhho",
  "...ohhhssssssssshho",
  "...ohhsssssssssssho",
  "...ohhsskssssksssho",
  "...ohhssssssssssho",
  "...ohhsssssddssssho",
  "....ohhsssssssssho",
  ".....ohhsssssssho",
  "......oooooooooo",
  "........occcco",
  "......oocccccccoo",
  "....ooccCcccccCccoo",
  "...occcCCcccccCCccco",
  "...occcCCcccccCCccco",
  "...occcCCcccccCCccco",
  "...ossoCCcccccCCosso",
  "...ossoCCcccccCCosso",
  "...ooooCCCCCCCCCoooo",
  ".......oCCCCCCCo",
  ".......ooooooooo",
  "........oppoppo",
  "........oppoppo",
  "........oppoppo",
  "........oeeoeeo",
  "........ooooooo"
]);

/** Closed eyes, drawn over the face during a blink. */
export const CHAR_BLINK = S("char-blink", ["oo..oo"], { o: "#c07f57" });

/* ============================================================
   SCREENS
   ============================================================ */

/** Monitor seen from behind — it faces the character, away from us. */
export const MONITOR_BACK = S("monitor-back", [
  "oooooooooooooooooooooooooo",
  "oGGGGGGGGGGGGGGGGGGGGGGGGo",
  "oGyyyyyyyyyyyyyyyyyyyyyyGo",
  "oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "oGyyyyyyyyyyyyyyyyyyyyyyGo",
  "oGGGGGGGGGGGGGGGGGGGGGGGGo",
  "oooooooooooooooooooooooooo",
  ".........oGGGGGGo",
  ".........oGGGGGGo",
  "......ooooGGGGGGoooo",
  "......oGGGGGGGGGGGGo",
  "......oooooooooooooo"
]);

export const MONITOR_BACK_SMALL = S("monitor-back-small", [
  "oooooooooooooooooo",
  "oGGGGGGGGGGGGGGGo",
  "oGyyyyyyyyyyyyyGo",
  "oGyGGGGGGGGGGGyGo",
  "oGyGGGGGGGGGGGyGo",
  "oGyGGGGGGGGGGGyGo",
  "oGyGGGGGGGGGGGyGo",
  "oGyyyyyyyyyyyyyGo",
  "oGGGGGGGGGGGGGGGo",
  "oooooooooooooooooo",
  "......oGGGGo",
  "......oGGGGo",
  "...ooooGGGGoooo",
  "...oGGGGGGGGGGo",
  "...oooooooooooo"
]);

export const LAPTOP_ISO = S("laptop-iso", [
  ".oooooooooooooooooo",
  ".oGGGGGGGGGGGGGGGo",
  ".oGyyyyyyyyyyyyyGo",
  ".oGyGGGGGGGGGGGyGo",
  ".oGyGGGGGGGGGGGyGo",
  ".oGyGGGGGGGGGGGyGo",
  ".oGyyyyyyyyyyyyyGo",
  ".oGGGGGGGGGGGGGGGo",
  ".oooooooooooooooooo",
  "oqqqqqqqqqqqqqqqqqqo",
  "oooooooooooooooooooo"
]);

/** Wall-mounted TV. */
export const TV_WALL = S("tv-wall", [
  "oooooooooooooooooooooooo",
  "okkkkkkkkkkkkkkkkkkkkkko",
  "okbbbbbbbbbbbbbbbbbbbbko",
  "okbBBBBBBBBBBBBBBBBBBbko",
  "okbBBBBBBBBBBBBBBBBBBbko",
  "okbBBBBBBBBBBBBBBBBBBbko",
  "okbBBBBBBBBBBBBBBBBBBbko",
  "okbbbbbbbbbbbbbbbbbbbbko",
  "okkkkkkkkkkkkkkkkkkkkkko",
  "oooooooooooooooooooooooo"
]);

/* ============================================================
   WALL THINGS
   ============================================================ */

export const WINDOW_DAY = S("window-day", [
  "oooooooooooooooooooooo",
  "oNNNNNNNNNNNNNNNNNNNNo",
  "oNbbbbbbbbNbbbbbbbbbNo",
  "oNbbbbbbbbNbbbbbbbbbNo",
  "oNbbbbbbbbNbbbbbbbbbNo",
  "oNbbbbbbbbNbbbbbbbbbNo",
  "oNNNNNNNNNNNNNNNNNNNNo",
  "oNbbbbbbbbNbbbbbbbbbNo",
  "oNbfffffffNfffffffffNo",
  "oNbfffffffNfffffffffNo",
  "oNNNNNNNNNNNNNNNNNNNNo",
  "oooooooooooooooooooooo"
], { b: "#8fc3dd", f: "#8a9a7f", N: "#6b5a45" });

export const WINDOW_NIGHT = S("window-night", [
  "oooooooooooooooooooooo",
  "oNNNNNNNNNNNNNNNNNNNNo",
  "oNbbbbbbbbNbbbbbbbbbNo",
  "oNbbbabbbbNbbbbbabbbNo",
  "oNbbbbbbbbNbbbabbbbbNo",
  "oNbbbbbbbbNbbbbbbbbbNo",
  "oNNNNNNNNNNNNNNNNNNNNo",
  "oNbbbabbbbNbbbbbbbbbNo",
  "oNbbbbbbbbNbbbabbbbbNo",
  "oNbbbbbbbbNbbbbbbbbbNo",
  "oNNNNNNNNNNNNNNNNNNNNo",
  "oooooooooooooooooooooo"
], { b: "#1e2740", a: "#ffe9a8", N: "#4a4033" });

export const DOOR = S("door", [
  "oooooooooooooo",
  "onnnnnnnnnnnno",
  "onmmmmmmmmmmno",
  "onmoooooooomno",
  "onmoNNNNNNomno",
  "onmoNNNNNNomno",
  "onmoooooooomno",
  "onmmmmmmmmmmno",
  "onmmmmmmqmmmno",
  "onmmmmmmmmmmno",
  "onmoooooooomno",
  "onmoNNNNNNomno",
  "onmoNNNNNNomno",
  "onmoooooooomno",
  "onmmmmmmmmmmno",
  "onnnnnnnnnnnno",
  "oooooooooooooo"
]);

export const POSTER = S("poster", [
  "oooooooooo",
  "obbbbbbbbo",
  "obbbwwbbbo",
  "obbwwwwbbo",
  "obwwwwwwbo",
  "obbwwwwbbo",
  "obbbwwbbbo",
  "obaaaaaabo",
  "oooooooooo"
]);

export const ART = S("art", [
  "oooooooooooooooo",
  "oaoooooooooooaoo",
  "oaotttttttttoaoo",
  "oaottuuuuuttoaoo",
  "oaotuuwwwwuutoao",
  "oaottuuwwuuttoao",
  "oaotttuuuutttoao",
  "oaottttttttttoao",
  "oaoooooooooooaoo",
  "oooooooooooooooo"
]);

/* ============================================================
   FLOOR OBJECTS (sprites drawn standing on a tile)
   ============================================================ */

export const PLANT = S("plant", [
  "......f",
  ".....fFf...f",
  "...ffFffFffF",
  "..fFfffFfffFf",
  ".fFffFfffFffF",
  "..ffFfffFfffF",
  "...fFfffFffF",
  "....offFffo",
  ".....offo",
  ".....ooo",
  "....onnno",
  "....onmno",
  "....onnno",
  "....oNNNo",
  "....ooooo"
]);

export const LAMP = S("lamp", [
  "...oooooo",
  "..oiiiiiio",
  "..oaaaaaao",
  "...oooooo",
  "....oGo",
  "....oGo",
  "....oGo",
  "....oGo",
  "..oooGooo",
  "..oGGGGGo",
  "..ooooooo"
]);

export const MUG = S("mug", [
  "ooooo",
  "owwwoo",
  "owwwo.o",
  "owwwoo",
  ".ooo"
], { w: "#e6e9ef" });

export const CHAIR_BACK = S("chair-back", [
  "oooooooooo",
  "oGkkkkkkGo",
  "oGkkkkkkGo",
  "oGkkkkkkGo",
  "oGkkkkkkGo",
  "oGkkkkkkGo",
  "oGkkkkkkGo",
  "oGkkkkkkGo",
  "oooooooooo"
]);

export const SERVER = S("server", [
  "oooooooooooo",
  "oGGGGGGGGGGo",
  "oGyyyyyyfGGo",
  "oGGGGGGGGGGo",
  "oGyyyyyyfGGo",
  "oGGGGGGGGGGo",
  "oGyyyyyyrGGo",
  "oGGGGGGGGGGo",
  "oGyyyyyyfGGo",
  "oGGGGGGGGGGo",
  "oGyyyyyyfGGo",
  "oGGGGGGGGGGo",
  "oooooooooooo"
]);

/** Books standing on a shelf — bright spines against the wood. */
export const BOOKS = S("books", [
  "rbfurbfaurbf",
  "rbfurbfaurbf",
  "rbfurbfaurbf",
  "rbfurbfaurbf"
]);

export const PILLOW = S("pillow", [
  ".oooooooo",
  "owwwwwwwwo",
  "owwwwwwwwo",
  ".oooooooo"
], { w: "#dfe3ea" });

export const BLANKET = S("blanket", [
  ".tttttttttt",
  "tttttttttttt",
  "TTTTTTTTTTTT"
], { t: "#4a7fb5", T: "#35608c" });

/* ============================================================
   Outfits — you dress better as you climb.
   ============================================================ */

export const OUTFITS: { c: string; C: string; p: string; P: string }[] = [
  { c: "#6b6f78", C: "#4e525a", p: "#3a4048", P: "#2a3037" }, // worn grey hoodie
  { c: "#3f6fa8", C: "#2f5480", p: "#3a4048", P: "#2a3037" }, // blue hoodie
  { c: "#3f7d72", C: "#2d5b53", p: "#333a44", P: "#252b33" }, // teal sweater
  { c: "#e8e8ec", C: "#c2c4cc", p: "#2f3440", P: "#232733" }, // white shirt
  { c: "#2e3340", C: "#20242e", p: "#20242e", P: "#171a22" }, // dark suit
  { c: "#1d1f26", C: "#14161c", p: "#14161c", P: "#0e1014" } // black tailored
];
