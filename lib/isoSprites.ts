"use client";

import { Sprite } from "./pixel";

/**
 * Sprites for the isometric room. Plain volumes (desk, bed, wardrobe…) are
 * boxes drawn by lib/iso.ts — these are the pieces that need a real shape.
 */
const BASE: Record<string, string> = {
  o: "#221f29",
  O: "#3a3542",
  s: "#e9b183",
  d: "#c98b60",
  l: "#ffd9ae",
  h: "#3f2f23",
  H: "#5c4531",
  c: "#3f6fa8",
  C: "#2f5480",
  w: "#dfe3ea",
  p: "#343a44",
  P: "#252a32",
  e: "#211a13",
  g: "#7d7f88",
  G: "#4a4c54",
  y: "#b9bcc4",
  q: "#cfd3da",
  n: "#8a5a34",
  N: "#5f3d22",
  m: "#b07a48",
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
   18 x 34. Eyes on row 9, hands on rows 24-25, legs from row 28
   (hidden behind the desk).
   ============================================================ */

export const CHAR = S("char", [
  "......oooooooo",
  "....oohhhhhhhhoo",
  "...ohhhhhhhhhhhho",
  "..ohhhhhhhhhhhhhho",
  "..ohhHhhhhhhhhHhho",
  "..ohhhhhhhhhhhhhho",
  "..ohhhsssssssshhho",
  "..ohhsssssssssshho",
  "..ohhsssssssssshho",
  "..ohhsskssssksshho",
  "..ohhsssssssssshho",
  "..ohhssssddsssshho",
  "..ohhsssssssssshho",
  "...ohhsssssssshho",
  "....ohhssssssho",
  "........ossso",
  "....oocccccccoo",
  "..oocccccccccccoo",
  "..oCcccwwwwcccCo",
  "..oCcccwwwwcccCo",
  "..oCcccwwwwcccCo",
  "..oCcccwwwwcccCo",
  "..oCcccwwwwcccCo",
  "..oCcccwwwwcccCo",
  ".osscccwwwwcccsso",
  ".osscccwwwwcccsso",
  "..oCcccwwwwcccCo",
  "..oCCCCCCCCCCCCo",
  "....oppo..oppo",
  "....oppo..oppo",
  "....oppo..oppo",
  "....oppo..oppo",
  "....oeeo..oeeo",
  "....oooo..oooo"
]);

/** Closed eyelids, dropped over the two eye pixels. */
export const CHAR_BLINK = S("char-blink", ["d....d"]);

/** Office chair — wider than the torso so it reads behind the shoulders. */
export const CHAIR_BACK = S("chair-back", [
  "...oooooooooooo",
  "..oGkkkkkkkkkkGo",
  "..oGkkkkkkkkkkGo",
  "..oGkkkkkkkkkkGo",
  ".ooGkkkkkkkkkkGoo",
  ".oGGkkkkkkkkkkGGo",
  ".oGGkkkkkkkkkkGGo",
  ".oGGkkkkkkkkkkGGo",
  ".oGGkkkkkkkkkkGGo",
  ".oGGkkkkkkkkkkGGo",
  ".ooGkkkkkkkkkkGoo",
  "..oGkkkkkkkkkkGo",
  "..oooooooooooooo"
]);

/* ============================================================
   SCREENS — we sit behind them, so we see the back panel plus
   the light spilling around its edges.
   ============================================================ */

export const MONITOR_BACK = S("monitor-back", [
  "..oooooooooooooooooooooooooo",
  "..obbbbbbbbbbbbbbbbbbbbbbbbo",
  "..oGGGGGGGGGGGGGGGGGGGGGGGGo",
  "..oGyyyyyyyyyyyyyyyyyyyyyyGo",
  "..oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "..oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "..oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "..oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "..oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "..oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "..oGyGGGGGGGGGGGGGGGGGGGGyGo",
  "..oGyyyyyyyyyyyyyyyyyyyyyyGo",
  "..oGGGGGGGGGGGGGGGGGGGGGGGGo",
  "..oooooooooooooooooooooooooo",
  "...........oGGGGGGo",
  "...........oGGGGGGo",
  "........oooqGGGGGGqooo",
  "........oqqqqqqqqqqqqo",
  "........oooooooooooooo"
]);

export const MONITOR_BACK_SMALL = S("monitor-back-small", [
  ".oooooooooooooooooo",
  ".obbbbbbbbbbbbbbbbo",
  ".oGGGGGGGGGGGGGGGGo",
  ".oGyyyyyyyyyyyyyyGo",
  ".oGyGGGGGGGGGGGGyGo",
  ".oGyGGGGGGGGGGGGyGo",
  ".oGyGGGGGGGGGGGGyGo",
  ".oGyGGGGGGGGGGGGyGo",
  ".oGyyyyyyyyyyyyyyGo",
  ".oGGGGGGGGGGGGGGGGo",
  ".oooooooooooooooooo",
  ".......oGGGGo",
  ".......oGGGGo",
  "....oooqGGGGqooo",
  "....oqqqqqqqqqqo",
  "....oooooooooooo"
]);

/** Keyboard lying flat on the desk. */
export const KEYBOARD_ISO = S("keyboard-iso", [
  ".....oooooooooo",
  "...oooGGGGGGGGGooo",
  ".ooGGGGGGGGGGGGGGGo",
  "oGGyGyGyGyGyGyGyGGo",
  "oGGGGGGGGGGGGGGGGGo",
  ".ooGGGGGGGGGGGGGoo",
  "...oooGGGGGGGooo",
  ".....oooooooo"
]);

/** Same board, amber keycaps — so the mechanical upgrade is visible. */
export const KEYBOARD_MECH = S(
  "keyboard-mech",
  [
    ".....oooooooooo",
    "...oooGGGGGGGGGooo",
    ".ooGGGGGGGGGGGGGGGo",
    "oGGyGyGyGyGyGyGyGGo",
    "oGGGGGGGGGGGGGGGGGo",
    ".ooGGGGGGGGGGGGGoo",
    "...oooGGGGGGGooo",
    ".....oooooooo"
  ],
  { G: "#2b2e35", y: "#e0a53c" }
);

/** Worn on the head, drawn over the character. */
export const HEADPHONES_ON = S("headphones-on", [
  "....oooooooo",
  "..ooGGGGGGGGoo",
  ".oGGoooooooooGGo",
  "oGGo.........oGGo",
  "oGGo.........oGGo",
  "oGGGo.......oGGGo",
  "oGGGo.......oGGGo",
  "oGGGo.......oGGGo",
  ".oGGo.......oGGo",
  "..oo.........oo"
], { G: "#3a3d45" });

export const LAPTOP_ISO = S("laptop-iso", [
  "..oooooooooooooooo",
  "..obbbbbbbbbbbbbbo",
  "..oGGGGGGGGGGGGGGo",
  "..oGyyyyyyyyyyyyGo",
  "..oGyGGGGGGGGGGyGo",
  "..oGyGGGGGGGGGGyGo",
  "..oGyyyyyyyyyyyyGo",
  "..oGGGGGGGGGGGGGGo",
  "..oooooooooooooooo",
  "oqqqqqqqqqqqqqqqqqqo",
  "oooooooooooooooooooo"
]);

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
  "oooooooooooooooooooooooo",
  ".........okkkko",
  ".........ooooooo"
]);

/* ============================================================
   WALL THINGS
   ============================================================ */

export const WINDOW_DAY = S("window-day", [
  "oooooooooooooooooooooooo",
  "oNNNNNNNNNNNNNNNNNNNNNNo",
  "oNbbbbbbbbbNbbbbbbbbbbNo",
  "oNbbbbbbbbbNbbbbbbbbbbNo",
  "oNbbbwbbbbbNbbbbbbwbbbNo",
  "oNbbbbbbbbbNbbbbbbbbbbNo",
  "oNNNNNNNNNNNNNNNNNNNNNNo",
  "oNbbbbbbbbbNbbbbbbbbbbNo",
  "oNbbbbbbbbbNbbbbbbbbbbNo",
  "oNffFffffffNffffFfffffNo",
  "oNFFFFFFFFFNFFFFFFFFFFNo",
  "oNNNNNNNNNNNNNNNNNNNNNNo",
  "oooooooooooooooooooooooo"
], { b: "#93c8e0", w: "#c9e4f2", f: "#8d9c80", F: "#6f7d64", N: "#6b5a45" });

export const WINDOW_NIGHT = S("window-night", [
  "oooooooooooooooooooooooo",
  "oNNNNNNNNNNNNNNNNNNNNNNo",
  "oNbbbbbbbbbNbbbbbbbbbbNo",
  "oNbbbabbbbbNbbbbbbabbbNo",
  "oNbbbbbbbbbNbbbabbbbbbNo",
  "oNbbbbbbbbbNbbbbbbbbbbNo",
  "oNNNNNNNNNNNNNNNNNNNNNNo",
  "oNbbbabbbbbNbbbbbbbbbbNo",
  "oNbbbbbbbbbNbbbabbbbbbNo",
  "oNbbbbbbabbNbbbbbbbbbbNo",
  "oNbbbbbbbbbNbbbbbbabbbNo",
  "oNNNNNNNNNNNNNNNNNNNNNNo",
  "oooooooooooooooooooooooo"
], { b: "#1d2640", a: "#ffe9a8", N: "#4a4033" });

/** Hangs down either side of the window. */
export const CURTAIN = S("curtain", [
  "oooooo",
  "ouUuUuo",
  "ouUuUuo",
  "ouUuUuo",
  "ouUuUuo",
  "ouUuUuo",
  "ouUuUuo",
  "ouUuUuo",
  "ouUuUuo",
  "ouUuUuo",
  "ouUuUuo",
  "ouUuUuo",
  "ouUuUuo",
  ".oUuUo",
  "..ooo"
], { u: "#3f4d70", U: "#2c3752" });

export const DOOR = S("door", [
  "oooooooooooooo",
  "onnnnnnnnnnnno",
  "onmmmmmmmmmmno",
  "onmoooooooomno",
  "onmoNNNNNNomno",
  "onmoNNNNNNomno",
  "onmoNNNNNNomno",
  "onmoooooooomno",
  "onmmmmmmmmmmno",
  "onmmmmmmmqmmno",
  "onmmmmmmmmmmno",
  "onmoooooooomno",
  "onmoNNNNNNomno",
  "onmoNNNNNNomno",
  "onmoNNNNNNomno",
  "onmoooooooomno",
  "onmmmmmmmmmmno",
  "onnnnnnnnnnnno",
  "oooooooooooooo"
]);

export const POSTER = S("poster", [
  "oooooooooo",
  "oBBBBBBBBo",
  "oBBBwwBBBo",
  "oBBwwwwBBo",
  "oBwwwwwwBo",
  "oBBwwwwBBo",
  "oBBBwwBBBo",
  "oBaaaaaaBo",
  "oooooooooo"
]);

export const ART = S("art", [
  "oooooooooooooooooo",
  "oaoooooooooooooooao",
  "oaotttttttttttttoao",
  "oaottuuuuuuuuttoao",
  "oaotuuuwwwwwuuutoao",
  "oaottuuwwwwwwuttoao",
  "oaotttuuuwwuuutoao",
  "oaottttuuuuutttoao",
  "oaotttttttttttttoao",
  "oaoooooooooooooooao",
  "oooooooooooooooooo"
]);

/* ============================================================
   FLOOR & SURFACE OBJECTS
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

/** Same pot, leaves nudged a pixel — alternating the two makes it sway. */
export const PLANT_SWAY = S("plant-sway", [
  ".......f",
  "......fFf...f",
  "....ffFffFffF",
  "...fFfffFfffFf",
  "..fFffFfffFffF",
  "...ffFfffFfffF",
  "....fFfffFffF",
  ".....offFffo",
  "......offo",
  ".....ooo",
  "....onnno",
  "....onmno",
  "....onnno",
  "....oNNNo",
  "....ooooo"
]);

/** Brighter frame, alternated to make the screen flicker. */
export const TV_WALL_LIT = S("tv-wall-lit", [
  "oooooooooooooooooooooooo",
  "okkkkkkkkkkkkkkkkkkkkkko",
  "okbbbbbbbbbbbbbbbbbbbbko",
  "okbbbbbbbbbbbbbbbbbbbbko",
  "okbBBBBBBBBBBBBBBBBBBbko",
  "okbbbbbbbbbbbbbbbbbbbbko",
  "okbBBBBBBBBBBBBBBBBBBbko",
  "okbbbbbbbbbbbbbbbbbbbbko",
  "okkkkkkkkkkkkkkkkkkkkkko",
  "oooooooooooooooooooooooo",
  ".........okkkko",
  ".........ooooooo"
], { b: "#a8dcf7", B: "#4a95c9" });

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
  "..oqqqqqo",
  "..ooooooo"
]);

export const MUG = S("mug", [
  "ooooo",
  "owwwoo",
  "owwwo.o",
  "owwwoo",
  ".ooo"
], { w: "#e6e9ef" });

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

/** Books standing on a shelf, uneven heights. */
export const BOOKS = S("books", [
  "..o..oo...o.",
  "orobbooafuro",
  "orobbooafuro",
  "orobbooafuro",
  "orobbooafuro",
  "oooooooooooo"
]);

/** Pillow, drawn as a flattened iso quad so it sits on the bed. */
export const PILLOW = S("pillow", [
  "...oooo",
  ".oowwwwoo",
  "owwwwwwwwo",
  ".ooywwyoo",
  "...oooo"
], { w: "#eef1f6", y: "#c8ccd6" });

/** Covers the foot end of the bed, with a folded edge. */
export const BLANKET = S("blanket", [
  "......oooooo",
  "....oottttttoo",
  "..oottttttttttoo",
  "otttttttttttttto",
  "oTTtttttttttttTo",
  "oTTTTTTTTTTTTTTo",
  ".ooTTTTTTTTTToo",
  "...oooooooooo"
], { t: "#4a7fb5", T: "#35608c" });

/** Sofa cushion. */
export const CUSHION = S("cushion", [
  "..oooooo",
  ".otttttto",
  "otttttttto",
  "oTTTTTTTTo",
  ".oTTTTTTo",
  "..oooooo"
], { t: "#59a196", T: "#3f7d72" });

/* ============================================================
   Outfits — hoodie, sweater, shirt, suit. `w` is the shirt showing
   through the open jacket.
   ============================================================ */

export const OUTFITS: { c: string; C: string; w: string; p: string; P: string }[] = [
  { c: "#6b6f78", C: "#4e525a", w: "#7d828c", p: "#343a44", P: "#252a32" }, // worn hoodie
  { c: "#3f6fa8", C: "#2f5480", w: "#5b8cc4", p: "#343a44", P: "#252a32" }, // blue hoodie
  { c: "#3f7d72", C: "#2d5b53", w: "#56988c", p: "#2f3540", P: "#22262f" }, // teal sweater
  { c: "#2e3340", C: "#20242e", w: "#e8e8ec", p: "#2b303b", P: "#1e222a" }, // shirt + jacket
  { c: "#262b36", C: "#191d26", w: "#d8dbe4", p: "#20242e", P: "#161920" }, // dark suit
  { c: "#17181e", C: "#0f1014", w: "#c9ccd6", p: "#14161c", P: "#0d0e12" } // tailored black
];
