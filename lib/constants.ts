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
  small: "Malý",
  medium: "Střední",
  large: "Velký"
};

export const SIZE_COLOR: Record<TaskSize, string> = {
  small: "#6FB1D9",
  medium: "#E8A33D",
  large: "#D95F5F"
};

/** Tired people earn less. This is what makes habits matter. */
export function energyMult(energy: number): number {
  if (energy >= 80) return 1.2;
  if (energy >= 55) return 1.05;
  if (energy >= 30) return 0.85;
  if (energy >= 10) return 0.6;
  return 0.35;
}

export function energyLabel(energy: number): string {
  if (energy >= 80) return "Ve formě";
  if (energy >= 55) return "V pohodě";
  if (energy >= 30) return "Únava";
  if (energy >= 10) return "Vyčerpání";
  return "Na dně";
}

/* ---------- needs / harsh rules ---------- */

export const ENERGY_MAX = 100;
export const ENERGY_DAILY_DRAIN = 18;
/** Energy lost per day with nothing to eat. */
export const STARVE_ENERGY = 26;

export const RENT_PERIOD_DAYS = 7;
/** Days you can be late before you're evicted. */
export const RENT_GRACE_DAYS = 2;
/** Days of starving before creditors take something. */
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
    name: "Sklepní kutloch",
    desc: "Vlhko, jedna žárovka, matrace na zemi. Někde začít musíš.",
    rent: 900,
    price: 0
  },
  {
    id: "panel",
    name: "Panelák 1+kk",
    desc: "Malé, ale svoje. Teplá voda a okno, které jde otevřít.",
    rent: 3200,
    price: 18_000
  },
  {
    id: "flat",
    name: "Byt 2+kk",
    desc: "Konečně místo na gauč a pořádný pracovní kout.",
    rent: 8000,
    price: 70_000
  },
  {
    id: "loft",
    name: "Loft v centru",
    desc: "Vysoké stropy, velká okna, výhled na město.",
    rent: 19_000,
    price: 260_000
  },
  {
    id: "house",
    name: "Rodinný dům",
    desc: "Zahrada, garáž, ticho. Práce z domu jak má být.",
    rent: 32_000,
    price: 700_000
  },
  {
    id: "villa",
    name: "Vila u moře",
    desc: "Ráno káva na terase, výhled na vodu. Dokázal jsi to.",
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
    name: "Instantní nudle",
    desc: "2 dny jídla. Chutná to jak lepenka, ale přežiješ.",
    category: "food",
    price: 180,
    foodDays: 2,
    energy: 8
  },
  {
    id: "delivery",
    name: "Rozvoz jídla",
    desc: "1 den jídla, ale hodně energie. Drahý luxus na začátku.",
    category: "food",
    price: 420,
    foodDays: 1,
    energy: 24
  },
  {
    id: "groceries",
    name: "Nákup v Lidlu",
    desc: "7 dní jídla. Nejlepší cena za den.",
    category: "food",
    price: 950,
    foodDays: 7,
    energy: 14
  },
  {
    id: "bigshop",
    name: "Velký nákup",
    desc: "12 dní jídla a slušná energie. Potřebuješ kuchyň.",
    category: "food",
    price: 2600,
    foodDays: 12,
    energy: 20,
    minHousing: 1
  },

  // gear — permanent income multipliers
  {
    id: "lamp",
    name: "Stolní lampa",
    desc: "Konec práce po tmě. +4 % k výdělku.",
    category: "gear",
    price: 1200,
    incomeMult: 0.04,
    slot: "lamp"
  },
  {
    id: "keyboard",
    name: "Mechanická klávesnice",
    desc: "Píše se to samo. +6 % k výdělku.",
    category: "gear",
    price: 2600,
    incomeMult: 0.06,
    slot: "keyboard"
  },
  {
    id: "headphones",
    name: "Sluchátka",
    desc: "Soused může řvát. +8 % k výdělku.",
    category: "gear",
    price: 3800,
    incomeMult: 0.08,
    slot: "headphones"
  },
  {
    id: "monitor2",
    name: "Druhý monitor",
    desc: "Dvakrát tolik místa na práci. +12 % k výdělku.",
    category: "gear",
    price: 6500,
    incomeMult: 0.12,
    slot: "monitor2"
  },
  {
    id: "chair",
    name: "Ergonomická židle",
    desc: "Záda přestanou bolet. +10 % k výdělku, +komfort.",
    category: "gear",
    price: 9500,
    incomeMult: 0.1,
    comfort: 2,
    slot: "chair"
  },
  {
    id: "standingdesk",
    name: "Polohovací stůl",
    desc: "Práce ve stoje, když už nemůžeš sedět. +9 % k výdělku.",
    category: "gear",
    price: 18_000,
    incomeMult: 0.09,
    comfort: 1,
    slot: "desk"
  },
  {
    id: "laptop",
    name: "Rychlý notebook",
    desc: "Žádné čekání na build. +18 % k výdělku.",
    category: "gear",
    price: 24_000,
    incomeMult: 0.18,
    slot: "laptop"
  },
  {
    id: "ultrawide",
    name: "Ultrawide monitor",
    desc: "Celý projekt na jedné obrazovce. +22 % k výdělku.",
    category: "gear",
    price: 42_000,
    incomeMult: 0.22,
    slot: "ultrawide",
    minHousing: 2
  },
  {
    id: "server",
    name: "Renderovací server",
    desc: "Počítá za tebe i v noci. +30 % k výdělku.",
    category: "gear",
    price: 120_000,
    incomeMult: 0.3,
    slot: "server",
    minHousing: 3
  },

  // furniture — comfort raises how fast energy comes back
  {
    id: "poster",
    name: "Plakát",
    desc: "Aspoň něco na té zdi. +1 komfort.",
    category: "furniture",
    price: 500,
    comfort: 1,
    slot: "poster"
  },
  {
    id: "plant",
    name: "Rostlina",
    desc: "Živý tvor v pokoji. +1 komfort.",
    category: "furniture",
    price: 900,
    comfort: 1,
    slot: "plant"
  },
  {
    id: "rug",
    name: "Koberec",
    desc: "Nohy už nesahají na beton. +1 komfort.",
    category: "furniture",
    price: 2400,
    comfort: 1,
    slot: "rug"
  },
  {
    id: "shelf",
    name: "Knihovna",
    desc: "Knihy, ne hromada na zemi. +2 komfort.",
    category: "furniture",
    price: 7000,
    comfort: 2,
    slot: "shelf",
    minHousing: 1
  },
  {
    id: "sofa",
    name: "Gauč",
    desc: "Kde se dá skutečně odpočívat. +3 komfort.",
    category: "furniture",
    price: 13_000,
    comfort: 3,
    slot: "sofa",
    minHousing: 1
  },
  {
    id: "tv",
    name: "Televize",
    desc: "Večer bez scrollování v telefonu. +2 komfort.",
    category: "furniture",
    price: 21_000,
    comfort: 2,
    slot: "tv",
    minHousing: 1
  },
  {
    id: "aquarium",
    name: "Akvárium",
    desc: "Klid v pokoji, rybky nic nechtějí. +3 komfort.",
    category: "furniture",
    price: 38_000,
    comfort: 3,
    slot: "aquarium",
    minHousing: 2
  },
  {
    id: "art",
    name: "Obraz na zeď",
    desc: "Originál, ne plakát z IKEA. +2 komfort.",
    category: "furniture",
    price: 95_000,
    comfort: 2,
    slot: "art",
    minHousing: 3
  },

  // vehicles — pure status, visible out the window
  {
    id: "bike",
    name: "Kolo",
    desc: "První vlastní doprava.",
    category: "vehicle",
    price: 6000,
    slot: "vehicle"
  },
  {
    id: "scooter",
    name: "Skútr",
    desc: "Rychleji než MHD.",
    category: "vehicle",
    price: 32_000,
    slot: "vehicle"
  },
  {
    id: "octavia",
    name: "Octavia",
    desc: "Rozumné auto rozumného člověka.",
    category: "vehicle",
    price: 210_000,
    slot: "vehicle",
    minHousing: 2
  },
  {
    id: "bmw",
    name: "BMW",
    desc: "Teď už to sousedi vidí.",
    category: "vehicle",
    price: 780_000,
    slot: "vehicle",
    minHousing: 3
  },
  {
    id: "porsche",
    name: "Porsche",
    desc: "Auto, na které jsi jako dítě koukal v časopise.",
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
  food: "Jídlo",
  gear: "Vybavení k práci",
  furniture: "Nábytek",
  vehicle: "Doprava"
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
  { tier: 0, rep: 0, payout: 2200, units: 3, days: 3, label: "Drobná zakázka" },
  { tier: 1, rep: 10, payout: 11_000, units: 5, days: 4, label: "Solidní zakázka" },
  { tier: 2, rep: 26, payout: 45_000, units: 8, days: 5, label: "Velká zakázka" },
  { tier: 3, rep: 50, payout: 160_000, units: 12, days: 7, label: "Firemní projekt" },
  { tier: 4, rep: 90, payout: 520_000, units: 18, days: 10, label: "Korporátní kontrakt" }
];

export const REP_ON_DELIVER = 4;
export const REP_ON_FAIL = 6;

export const CLIENT_NAMES = [
  "Kavárna U Kozla",
  "Autoservis Novák",
  "Fitness Reload",
  "Květinářství Iva",
  "Studio Vlna",
  "Pekárna Zrno",
  "Advokátní kancelář Šimek",
  "E-shop Bidýlko",
  "Stavby Brož",
  "Klinika Vitalis",
  "Nexora s.r.o.",
  "Datacore Group",
  "Helios Bank",
  "Aurora Motors"
];

export const CONTRACT_TITLES = [
  "Nový web na míru",
  "Redesign e-shopu",
  "Landing page ke kampani",
  "Automatizace fakturace",
  "Mobilní aplikace",
  "Rebranding a logo",
  "Sada reklamních kreativ",
  "Interní dashboard",
  "Migrace na nový systém",
  "Video na sociální sítě"
];

/* ---------- seeds ---------- */

export function seedHabits(): Habit[] {
  return [
    { id: "habit-sleep", title: "Spát 7+ hodin", icon: "sleep", energy: 22, history: {} },
    { id: "habit-gym", title: "Cvičení nebo pohyb", icon: "gym", energy: 14, history: {} },
    { id: "habit-sun", title: "Ráno 10 minut venku", icon: "sun", energy: 10, history: {} },
    { id: "habit-nophone", title: "Žádný telefon do 10:00", icon: "nophone", energy: 10, history: {} },
    { id: "habit-water", title: "2 litry vody", icon: "water", energy: 8, history: {} },
    { id: "habit-read", title: "Číst 10 stran", icon: "read", energy: 6, history: {} }
  ];
}

/* ---------- formatting ---------- */

export function formatMoney(n: number): string {
  const neg = n < 0;
  const s = Math.round(Math.abs(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${neg ? "−" : ""}${s} Kč`;
}

/** Compact form for tight spots: 1,2 M / 340 k. */
export function formatMoneyShort(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1).replace(".", ",")} M`;
  if (abs >= 10_000) return `${sign}${Math.round(abs / 1000)} k`;
  return `${sign}${Math.round(abs)}`;
}
