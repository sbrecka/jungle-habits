import { Habit, Housing, ShopItem, TaskSize } from "./types";

/* ---------- career / XP ---------- */

export function xpToNext(level: number): number {
  return 60 + (level - 1) * 45;
}

/** Everything you earn scales with career level — this is the real progression. */
export function careerMult(level: number): number {
  return 1 + 0.42 * (level - 1);
}

export const XP_PER_TASK: Record<TaskSize, number> = { small: 8, medium: 22, large: 50 };
export const XP_PER_HABIT = 6;

/* ---------- payouts ---------- */

export const BASE_PAYOUT: Record<TaskSize, number> = { small: 120, medium: 340, large: 780 };

/** Work units a task delivers toward an active contract. */
export const TASK_UNITS: Record<TaskSize, number> = { small: 1, medium: 2, large: 3 };

export const SIZE_LABEL: Record<TaskSize, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large"
};

export const SIZE_COLOR: Record<TaskSize, string> = {
  small: "#6FB1D9",
  medium: "#E8A33D",
  large: "#D95F5F"
};

/** Tired people earn less. This is what makes habits matter. */
export function energyMult(energy: number): number {
  if (energy >= 85) return 1.25;
  if (energy >= 65) return 1.05;
  if (energy >= 40) return 0.85;
  if (energy >= 20) return 0.6;
  return 0.35;
}

export function energyLabel(energy: number): string {
  if (energy >= 85) return "On form";
  if (energy >= 65) return "Doing fine";
  if (energy >= 40) return "Tired";
  if (energy >= 20) return "Exhausted";
  return "Running on empty";
}

/**
 * A habit restores less the closer you already are to full, so you cannot rest
 * your way to a permanent 100 — the top band has to be spent and re-earned.
 * Never drops below a fifth of the habit's face value.
 */
export function habitGain(base: number, energy: number): number {
  return Math.max(1, Math.round(base * Math.max(0.2, 1 - energy / 150)));
}

/* ---------- needs / harsh rules ---------- */

export const ENERGY_MAX = 100;
/**
 * Living costs more energy than food and comfort give back, so standing still
 * loses ground. Habits are the only way to stay in the good bands.
 */
export const ENERGY_DAILY_DRAIN = 26;
/** What a day's food gives back on its own. */
export const FOOD_ENERGY_PER_DAY = 6;
/** Energy lost per day with nothing to eat. */
export const STARVE_ENERGY = 26;

export const RENT_PERIOD_DAYS = 7;
/** Days you can be late before you're evicted. */
export const RENT_GRACE_DAYS = 2;
/** Days of starving before you have to sell something. */
export const STARVE_SEIZE_DAYS = 3;

/**
 * Absence is punished, but not infinitely: a long gap can cost you one
 * eviction and a few possessions, never everything you own.
 */
export const MAX_CATCHUP_DAYS = 30;
export const MAX_EVICTIONS_PER_CATCHUP = 1;
export const MAX_SEIZURES_PER_CATCHUP = 3;

export const START_MONEY = 600;
export const START_FOOD = 2;
export const START_ENERGY = 70;

export const MILLION_GOAL = 1_000_000;

/* ---------- housing ---------- */

export const HOUSING: Housing[] = [
  {
    id: "cellar",
    name: "Basement room",
    desc: "Damp, one bare bulb, a mattress on the floor. Everyone starts somewhere.",
    rent: 900,
    price: 0
  },
  {
    id: "panel",
    name: "Studio flat",
    desc: "Small, but it's yours. Hot water and a window that opens.",
    rent: 3200,
    price: 18_000
  },
  {
    id: "flat",
    name: "One-bedroom flat",
    desc: "Finally room for a sofa and a proper place to work.",
    rent: 8000,
    price: 70_000
  },
  {
    id: "loft",
    name: "City loft",
    desc: "High ceilings, tall windows, a view over the rooftops.",
    rent: 19_000,
    price: 260_000
  },
  {
    id: "house",
    name: "Family house",
    desc: "Garden, garage, quiet. Working from home done properly.",
    rent: 32_000,
    price: 700_000
  },
  {
    id: "villa",
    name: "Seaside villa",
    desc: "Coffee on the terrace, water on the horizon. You made it.",
    rent: 55_000,
    price: 1_500_000
  }
];

export function housing(tier: number): Housing {
  return HOUSING[Math.max(0, Math.min(HOUSING.length - 1, tier))];
}

/* ---------- shop ---------- */

export const SHOP_ITEMS: ShopItem[] = [
  // food — consumable, buy it or starve
  {
    id: "noodles",
    name: "Instant noodles",
    desc: "2 days of food. Tastes like cardboard, but you'll live.",
    category: "food",
    price: 180,
    foodDays: 2,
    energy: 8
  },
  {
    id: "delivery",
    name: "Food delivery",
    desc: "1 day of food, but plenty of energy. An expensive luxury early on.",
    category: "food",
    price: 420,
    foodDays: 1,
    energy: 24
  },
  {
    id: "groceries",
    name: "Grocery run",
    desc: "7 days of food. Best price per day.",
    category: "food",
    price: 950,
    foodDays: 7,
    energy: 14
  },
  {
    id: "bigshop",
    name: "Big shop",
    desc: "12 days of food and decent energy. You need a kitchen for this.",
    category: "food",
    price: 2600,
    foodDays: 12,
    energy: 20,
    minHousing: 1
  },

  // gear — permanent income multipliers
  {
    id: "lamp",
    name: "Desk lamp",
    desc: "No more working in the dark. +4% earnings.",
    category: "gear",
    price: 1200,
    incomeMult: 0.04,
    slot: "lamp"
  },
  {
    id: "keyboard",
    name: "Mechanical keyboard",
    desc: "It practically types itself. +6% earnings.",
    category: "gear",
    price: 2600,
    incomeMult: 0.06,
    slot: "keyboard"
  },
  {
    id: "headphones",
    name: "Headphones",
    desc: "Let the neighbour shout. +8% earnings.",
    category: "gear",
    price: 3800,
    incomeMult: 0.08,
    slot: "headphones"
  },
  {
    id: "monitor2",
    name: "Second monitor",
    desc: "Twice the room to work in. +12% earnings.",
    category: "gear",
    price: 6500,
    incomeMult: 0.12,
    slot: "monitor2"
  },
  {
    id: "chair",
    name: "Ergonomic chair",
    desc: "Your back stops hurting. +10% earnings, and comfort.",
    category: "gear",
    price: 9500,
    incomeMult: 0.1,
    comfort: 2,
    slot: "chair"
  },
  {
    id: "standingdesk",
    name: "Sit-stand desk",
    desc: "Work standing when you can't sit any longer. +9% earnings.",
    category: "gear",
    price: 18_000,
    incomeMult: 0.09,
    comfort: 1,
    slot: "desk"
  },
  {
    id: "laptop",
    name: "Fast laptop",
    desc: "No more waiting around for builds. +18% earnings.",
    category: "gear",
    price: 24_000,
    incomeMult: 0.18,
    slot: "laptop"
  },
  {
    id: "ultrawide",
    name: "Ultrawide monitor",
    desc: "The whole project on one screen. +22% earnings.",
    category: "gear",
    price: 42_000,
    incomeMult: 0.22,
    slot: "ultrawide",
    minHousing: 2
  },
  {
    id: "server",
    name: "Render server",
    desc: "It keeps working through the night. +30% earnings.",
    category: "gear",
    price: 120_000,
    incomeMult: 0.3,
    slot: "server",
    minHousing: 3
  },

  // furniture — comfort raises how fast energy comes back
  {
    id: "poster",
    name: "Poster",
    desc: "At least something on that wall. +1 comfort.",
    category: "furniture",
    price: 500,
    comfort: 1,
    slot: "poster"
  },
  {
    id: "plant",
    name: "Houseplant",
    desc: "Something alive in the room. +1 comfort.",
    category: "furniture",
    price: 900,
    comfort: 1,
    slot: "plant"
  },
  {
    id: "rug",
    name: "Rug",
    desc: "Your feet stop landing on bare concrete. +1 comfort.",
    category: "furniture",
    price: 2400,
    comfort: 1,
    slot: "rug"
  },
  {
    id: "shelf",
    name: "Bookshelf",
    desc: "Books on a shelf instead of a pile on the floor. +2 comfort.",
    category: "furniture",
    price: 7000,
    comfort: 2,
    slot: "shelf",
    minHousing: 1
  },
  {
    id: "sofa",
    name: "Sofa",
    desc: "Somewhere you can actually rest. +3 comfort.",
    category: "furniture",
    price: 13_000,
    comfort: 3,
    slot: "sofa",
    minHousing: 1
  },
  {
    id: "tv",
    name: "Television",
    desc: "Evenings that aren't spent scrolling your phone. +2 comfort.",
    category: "furniture",
    price: 21_000,
    comfort: 2,
    slot: "tv",
    minHousing: 1
  },
  {
    id: "aquarium",
    name: "Aquarium",
    desc: "Quiet in the room, and the fish ask for nothing. +3 comfort.",
    category: "furniture",
    price: 38_000,
    comfort: 3,
    slot: "aquarium",
    minHousing: 2
  },
  {
    id: "art",
    name: "Framed art",
    desc: "An original, not a print off the shelf. +2 comfort.",
    category: "furniture",
    price: 95_000,
    comfort: 2,
    slot: "art",
    minHousing: 3
  },

  // vehicles — pure status
  {
    id: "bike",
    name: "Bicycle",
    desc: "Your first set of wheels.",
    category: "vehicle",
    price: 6000,
    slot: "vehicle"
  },
  {
    id: "scooter",
    name: "Scooter",
    desc: "Faster than waiting for the bus.",
    category: "vehicle",
    price: 32_000,
    slot: "vehicle"
  },
  {
    id: "octavia",
    name: "Estate car",
    desc: "A sensible car for a sensible person.",
    category: "vehicle",
    price: 210_000,
    slot: "vehicle",
    minHousing: 2
  },
  {
    id: "bmw",
    name: "Executive saloon",
    desc: "Now the neighbours notice.",
    category: "vehicle",
    price: 780_000,
    slot: "vehicle",
    minHousing: 3
  },
  {
    id: "porsche",
    name: "Sports car",
    desc: "The car you stared at in magazines as a kid.",
    category: "vehicle",
    price: 2_200_000,
    slot: "vehicle",
    minHousing: 4
  }
];

export function shopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

export const CATEGORY_LABEL: Record<string, string> = {
  food: "Food",
  gear: "Work gear",
  furniture: "Furniture",
  vehicle: "Transport"
};

/** Vehicles are exclusive — only the best one you own shows up. */
export const VEHICLE_ORDER = ["bike", "scooter", "octavia", "bmw", "porsche"];

/* ---------- contracts ---------- */

export interface ContractTier {
  tier: number;
  rep: number;
  payout: number;
  units: number;
  days: number;
  label: string;
}

export const CONTRACT_TIERS: ContractTier[] = [
  { tier: 0, rep: 0, payout: 2200, units: 3, days: 3, label: "Small job" },
  { tier: 1, rep: 10, payout: 11_000, units: 5, days: 4, label: "Solid job" },
  { tier: 2, rep: 26, payout: 45_000, units: 8, days: 5, label: "Big job" },
  { tier: 3, rep: 50, payout: 160_000, units: 12, days: 7, label: "Company project" },
  { tier: 4, rep: 90, payout: 520_000, units: 18, days: 10, label: "Corporate contract" }
];

export const REP_ON_DELIVER = 4;
export const REP_ON_FAIL = 6;

export const CLIENT_NAMES = [
  "The Goat Café",
  "Novak Motors",
  "Reload Fitness",
  "Iva's Flowers",
  "Studio Wave",
  "Grain Bakery",
  "Simek Legal",
  "Perch Online",
  "Broz Builders",
  "Vitalis Clinic",
  "Nexora Ltd",
  "Datacore Group",
  "Helios Bank",
  "Aurora Motors"
];

export const CONTRACT_TITLES = [
  "Custom website",
  "Online shop redesign",
  "Campaign landing page",
  "Invoicing automation",
  "Mobile app",
  "Rebrand and new logo",
  "Set of ad creatives",
  "Internal dashboard",
  "Migration to a new system",
  "Social media video"
];

/* ---------- seeds ---------- */

export function seedHabits(): Habit[] {
  return [
    { id: "habit-sleep", title: "Sleep 7+ hours", icon: "sleep", energy: 16, history: {} },
    { id: "habit-gym", title: "Exercise or move", icon: "gym", energy: 10, history: {} },
    { id: "habit-sun", title: "10 minutes outside in the morning", icon: "sun", energy: 7, history: {} },
    { id: "habit-nophone", title: "No phone before 10:00", icon: "nophone", energy: 7, history: {} },
    { id: "habit-water", title: "2 litres of water", icon: "water", energy: 5, history: {} },
    { id: "habit-read", title: "Read 10 pages", icon: "read", energy: 4, history: {} }
  ];
}

/** Seeded habits were worth more before the energy rebalance. */
export const HABIT_ENERGY_V1: Record<string, number> = {
  "habit-sleep": 16,
  "habit-gym": 10,
  "habit-sun": 7,
  "habit-nophone": 7,
  "habit-water": 5,
  "habit-read": 4
};

/* ---------- formatting ---------- */

/** "1 day" / "3 days" — English needs the singular and these counters hit 1. */
export function dayCount(n: number): string {
  return `${n} ${n === 1 ? "day" : "days"}`;
}


/**
 * Amounts stay in Czech koruna: the whole economy is calibrated to Czech
 * prices, and the game's goal is a million — which only means something at
 * this scale.
 */
export function formatMoney(n: number): string {
  const neg = n < 0;
  const s = Math.round(Math.abs(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${neg ? "−" : ""}${s} Kč`;
}

/** Compact form for tight spots: 1.2 M / 340 k. */
export function formatMoneyShort(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)} M`;
  if (abs >= 10_000) return `${sign}${Math.round(abs / 1000)} k`;
  return `${sign}${Math.round(abs)}`;
}
