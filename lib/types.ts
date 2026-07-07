export type DayStatus = "todo" | "done" | "skipped";

export type MonkeyIcon = "checkin" | "gym" | "read" | "drink" | "sleep" | "generic";

export interface Habit {
  id: string;
  title: string;
  minTarget: string;
  identity: string;
  bananaReward: number;
  color: string;
  icon: MonkeyIcon;
  isCheckIn?: boolean;
  history: Record<string, DayStatus>;
}

export interface Goal {
  id: string;
  title: string;
  note: string;
  progress: number; // 0-100
  color: string;
}

export interface Task {
  id: string;
  title: string;
  color: string;
  done: boolean;
}

export interface Challenge {
  key: string;
  title: string;
  description: string;
  reward: number;
  state: "pending" | "completed" | "skipped";
  date: string;
}

export interface PlacedItem {
  id: string;
  itemId: string;
  variant: number;
  x: number;
  y: number;
}

export interface LedgerEntry {
  ts: number;
  delta: number;
  reason: string;
}

export interface FocusSession {
  endsAt: number;
  minutes: number;
}

export type ShopCategory =
  | "Trees"
  | "Small Decorations"
  | "Structures"
  | "Boats"
  | "Wildlife";

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  variants: number;
  water?: boolean;
}
