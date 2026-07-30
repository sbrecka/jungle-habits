export type DayStatus = "todo" | "done";

export type TaskSize = "small" | "medium" | "large";

export type HabitIcon = "sleep" | "gym" | "read" | "water" | "sun" | "nophone";

/** A real piece of work you owe yourself today. Completing it pays out. */
export interface WorkTask {
  id: string;
  title: string;
  size: TaskSize;
  done: boolean;
  date: string;
}

/** Habits don't pay directly — they restore energy, which multiplies income. */
export interface Habit {
  id: string;
  title: string;
  icon: HabitIcon;
  energy: number;
  history: Record<string, DayStatus>;
}

export interface Contract {
  id: string;
  client: string;
  title: string;
  tier: number;
  payout: number;
  /** Work units required; each completed task delivers 1 (large delivers 3). */
  units: number;
  delivered: number;
  due: string;
  state: "active" | "done" | "failed";
}

export interface ContractOffer {
  id: string;
  client: string;
  title: string;
  tier: number;
  payout: number;
  units: number;
  days: number;
}

export interface LedgerEntry {
  ts: number;
  delta: number;
  reason: string;
}

export type ShopCategory = "food" | "gear" | "furniture" | "vehicle";

export interface ShopItem {
  id: string;
  name: string;
  desc: string;
  category: ShopCategory;
  price: number;
  /** Food only: days of stock added, and energy restored per meal. */
  foodDays?: number;
  energy?: number;
  /** Gear only: multiplies every payout while owned. */
  incomeMult?: number;
  /** Furniture only: raises daily energy recovery. */
  comfort?: number;
  /** Hidden until you live somewhere that fits it. */
  minHousing?: number;
  /** Where it is drawn in the room. Items without a slot are abstract assets. */
  slot?: string;
}

export interface Housing {
  id: string;
  name: string;
  desc: string;
  /** Charged every RENT_PERIOD_DAYS. */
  rent: number;
  /** One-off cost to move in. */
  price: number;
}

export type EventKind =
  | "rent"
  | "food"
  | "evict"
  | "seized"
  | "starve"
  | "contract"
  | "info";

/** Something the world did to you while you were away. */
export interface GameEvent {
  kind: EventKind;
  text: string;
  day: string;
}
