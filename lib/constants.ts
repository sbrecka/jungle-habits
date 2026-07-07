import { ShopItem, ShopCategory } from "./types";

/* ---------- XP / leveling ---------- */

export function xpToNext(level: number): number {
  return 40 + (level - 1) * 25;
}

export const STREAK_BONUS_MIN = 3; // days needed before bonus kicks in
export const STREAK_BONUS_BANANAS = 2;
export const CHECKIN_REWARD = 5;
export const TASK_REWARD = 2;
export const CHALLENGE_EARLY_BONUS = 5; // finished before 18:00

/* ---------- Daily challenge pool ---------- */

export const CHALLENGE_POOL = [
  {
    key: "small-win",
    title: "Get one small win today, to build momentum for the week.",
    description:
      "Could be a workout, a focused study session, cooking a nice meal, hitting a screen time target etc…",
    reward: 20
  },
  {
    key: "focus-15",
    title: "Complete a 15 minute focus session.",
    description: "Phone face-down, one task, fifteen minutes. Monke believes in you.",
    reward: 25
  },
  {
    key: "cook",
    title: "Cook one meal from scratch.",
    description: "No delivery apps today. Bananas taste better when you've earned them.",
    reward: 25
  },
  {
    key: "walk",
    title: "Take a 20 minute walk outside.",
    description: "Touch grass. Literally. Your island monkeys walk everywhere.",
    reward: 20
  },
  {
    key: "screen",
    title: "Stay under your screen-time goal.",
    description: "Less doomscroll, more island. Check tonight and be honest.",
    reward: 30
  },
  {
    key: "tidy",
    title: "Tidy one corner of your space.",
    description: "A desk, a drawer, a shelf. Small jungle, big vibes.",
    reward: 15
  },
  {
    key: "water",
    title: "Drink 6 glasses of water.",
    description: "Hydrated monke is happy monke.",
    reward: 15
  }
];

/* ---------- Shop catalog ---------- */

export const CATEGORY_UNLOCKS: { name: ShopCategory; unlock: number }[] = [
  { name: "Trees", unlock: 1 },
  { name: "Small Decorations", unlock: 2 },
  { name: "Structures", unlock: 3 },
  { name: "Boats", unlock: 4 },
  { name: "Wildlife", unlock: 5 }
];

export function categoryUnlockLevel(cat: ShopCategory): number {
  return CATEGORY_UNLOCKS.find((c) => c.name === cat)?.unlock ?? 1;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "palm", name: "Palm Tree", category: "Trees", price: 80, variants: 3 },
  { id: "banana-tree", name: "Banana Tree", category: "Trees", price: 110, variants: 2 },
  { id: "broadleaf", name: "Broadleaf Tree", category: "Trees", price: 90, variants: 2 },
  { id: "grass", name: "Grass Tuft", category: "Small Decorations", price: 30, variants: 3 },
  { id: "rock", name: "Rock", category: "Small Decorations", price: 25, variants: 2 },
  { id: "flowers", name: "Flowers", category: "Small Decorations", price: 35, variants: 2 },
  { id: "torch", name: "Torch", category: "Small Decorations", price: 45, variants: 1 },
  { id: "campfire", name: "Campfire", category: "Structures", price: 150, variants: 1 },
  { id: "hut", name: "Hut", category: "Structures", price: 250, variants: 2 },
  { id: "hammock", name: "Hammock", category: "Structures", price: 220, variants: 1 },
  { id: "treehouse", name: "Treehouse", category: "Structures", price: 320, variants: 1 },
  { id: "pond", name: "Pond", category: "Structures", price: 300, variants: 1 },
  { id: "canoe", name: "Canoe", category: "Boats", price: 200, variants: 1, water: true },
  { id: "sailboat", name: "Sailboat", category: "Boats", price: 350, variants: 1, water: true },
  { id: "monkey", name: "Monkey Friend", category: "Wildlife", price: 400, variants: 2 }
];

export function shopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

/* ---------- Island grid ---------- */

export const TILE_W = 68; // full diamond width
export const TILE_H = 34; // full diamond height

export function isoX(x: number, y: number): number {
  return (x - y) * (TILE_W / 2);
}
export function isoY(x: number, y: number): number {
  return (x + y) * (TILE_H / 2);
}

/** Deterministic pseudo-random in [0,1) for organic island edges. */
export function tileHash(x: number, y: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

export function landRadius(level: number): number {
  return Math.min(3 + level, 10);
}

export function isLand(x: number, y: number, level: number): boolean {
  const r = landRadius(level);
  const d = Math.abs(x) + Math.abs(y);
  if (d <= r - 1) return true;
  if (d === r) return tileHash(x, y) > 0.3;
  if (d === r + 1) return tileHash(x, y) > 0.85;
  return false;
}

export function isGrass(x: number, y: number, level: number): boolean {
  const r = landRadius(level);
  const d = Math.abs(x) + Math.abs(y);
  if (d <= r - 3) return true;
  if (d === r - 2) return tileHash(x + 7, y - 3) > 0.4;
  return false;
}

/** Visual growth stage of the island: 1 = sprout, 2 = growing, 3 = lush. */
export function growthStage(level: number): 1 | 2 | 3 {
  if (level >= 6) return 3;
  if (level >= 3) return 2;
  return 1;
}

export const TASK_COLORS = ["#F4877F", "#F5CE45", "#79AC48", "#5FA8D3", "#B48CD9"];
