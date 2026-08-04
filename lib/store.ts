"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Contract,
  ContractOffer,
  GameEvent,
  Habit,
  LedgerEntry,
  ShopItem,
  TaskSize,
  WorkTask
} from "./types";
import {
  BASE_PAYOUT,
  CLIENT_NAMES,
  CONTRACT_TIERS,
  CONTRACT_TITLES,
  ENERGY_DAILY_DRAIN,
  ENERGY_MAX,
  FOOD_ENERGY_PER_DAY,
  HABIT_ENERGY_V1,
  HOUSING,
  MAX_CATCHUP_DAYS,
  MAX_EVICTIONS_PER_CATCHUP,
  MAX_SEIZURES_PER_CATCHUP,
  MILLION_GOAL,
  REP_ON_DELIVER,
  REP_ON_FAIL,
  RENT_GRACE_DAYS,
  RENT_PERIOD_DAYS,
  START_ENERGY,
  START_FOOD,
  START_MONEY,
  STARVE_ENERGY,
  STARVE_SEIZE_DAYS,
  TASK_UNITS,
  VEHICLE_ORDER,
  XP_PER_HABIT,
  XP_PER_TASK,
  careerMult,
  dayCount,
  energyMult,
  formatMoney,
  habitGain,
  housing,
  seedHabits,
  shopItem,
  xpToNext
} from "./constants";
import { dateKey, daysBetween, keyPlusDays } from "./date";
import { SAVE_KEY } from "./backup";

let idCounter = 0;
function uid(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------- derived values (pure, reusable in components) ---------- */

export type Owned = Record<string, boolean>;

/** Product of every gear bonus you own. */
export function gearMult(owned: Owned): number {
  let m = 1;
  for (const id of Object.keys(owned)) {
    if (!owned[id]) continue;
    const it = shopItem(id);
    if (it?.incomeMult) m += it.incomeMult;
  }
  return m;
}

export function comfortTotal(owned: Owned): number {
  let c = 0;
  for (const id of Object.keys(owned)) {
    if (!owned[id]) continue;
    const it = shopItem(id);
    if (it?.comfort) c += it.comfort;
  }
  return c;
}

/**
 * Comfort speeds recovery but is capped well below the daily drain, so a fully
 * furnished flat still cannot carry you without habits.
 */
export function comfortRecovery(owned: Owned): number {
  return Math.min(8, comfortTotal(owned));
}

export function ownedValue(owned: Owned): number {
  let v = 0;
  for (const id of Object.keys(owned)) {
    if (!owned[id]) continue;
    const it = shopItem(id);
    if (it) v += it.price * 0.7;
  }
  return v;
}

export function bestVehicle(owned: Owned): ShopItem | undefined {
  for (let i = VEHICLE_ORDER.length - 1; i >= 0; i--) {
    if (owned[VEHICLE_ORDER[i]]) return shopItem(VEHICLE_ORDER[i]);
  }
  return undefined;
}

/** The single number that says how far you've come. */
export function netWorth(s: Pick<GameState, "money" | "owned" | "housingTier">): number {
  return Math.round(s.money + ownedValue(s.owned) + housing(s.housingTier).price * 0.9);
}

export function taskPayout(
  s: Pick<GameState, "level" | "owned" | "energy">,
  size: TaskSize
): number {
  return Math.round(
    BASE_PAYOUT[size] * careerMult(s.level) * gearMult(s.owned) * energyMult(s.energy)
  );
}

function cheapestOwned(owned: Owned): ShopItem | undefined {
  let best: ShopItem | undefined;
  for (const id of Object.keys(owned)) {
    if (!owned[id]) continue;
    const it = shopItem(id);
    if (!it) continue;
    if (!best || it.price < best.price) best = it;
  }
  return best;
}

function makeOffers(reputation: number): ContractOffer[] {
  const unlocked = CONTRACT_TIERS.filter((t) => reputation >= t.rep);
  // Keep offers relevant: draw from the top two tiers you've unlocked.
  const relevant = unlocked.slice(-2);
  const out: ContractOffer[] = [];
  for (let i = 0; i < 3; i++) {
    const t = pick(relevant);
    const variance = 0.85 + Math.random() * 0.3;
    out.push({
      id: uid("offer"),
      client: pick(CLIENT_NAMES),
      title: pick(CONTRACT_TITLES),
      tier: t.tier,
      payout: Math.round((t.payout * variance) / 100) * 100,
      units: t.units,
      days: t.days
    });
  }
  return out;
}

/* ---------- store ---------- */

export interface GameState {
  // money & needs
  money: number;
  energy: number;
  /** Days of food in stock. */
  food: number;
  starveDays: number;

  // career
  level: number;
  xp: number;
  reputation: number;
  totalEarned: number;

  // property
  housingTier: number;
  owned: Owned;

  // rent
  rentDue: string;
  lateDays: number;

  // content
  tasks: WorkTask[];
  habits: Habit[];
  contract: Contract | null;
  offers: ContractOffer[];
  ledger: LedgerEntry[];

  /** Energy actually granted per habit per day, keyed `habitId:date`.
   *  Needed because the amount depends on how tired you were at the time. */
  habitGrants: Record<string, number>;

  // bookkeeping
  lastDay: string;
  report: GameEvent[] | null;
  toast: string | null;
  celebrationLevel: number | null;
  millionaire: boolean;
  showMillionaire: boolean;
  night: boolean;

  // actions
  processDays: () => void;
  addTask: (title: string, size: TaskSize) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleHabit: (id: string) => void;
  addHabit: (title: string, energy: number) => void;
  deleteHabit: (id: string) => void;
  acceptOffer: (id: string) => void;
  rerollOffers: () => void;
  abandonContract: () => void;
  buy: (itemId: string) => void;
  moveHouse: () => void;
  payRentNow: () => void;
  eat: () => void;
  setToast: (msg: string | null) => void;
  setNight: (v: boolean) => void;
  dismissReport: () => void;
  dismissCelebration: () => void;
  dismissMillionaire: () => void;

  // internal — called by the actions above
  addXPInternal: (amount: number) => void;
  checkMillionaire: () => void;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      money: START_MONEY,
      energy: START_ENERGY,
      food: START_FOOD,
      starveDays: 0,

      level: 1,
      xp: 0,
      reputation: 0,
      totalEarned: 0,

      housingTier: 0,
      owned: {},

      rentDue: keyPlusDays(dateKey(), RENT_PERIOD_DAYS),
      lateDays: 0,

      tasks: [],
      habits: seedHabits(),
      contract: null,
      offers: makeOffers(0),
      ledger: [],

      habitGrants: {},

      lastDay: dateKey(),
      report: null,
      toast: null,
      celebrationLevel: null,
      millionaire: false,
      showMillionaire: false,
      night: false,

      /* ----- earning / spending ----- */

      addTask: (title, size) => {
        const t = title.trim();
        if (!t) return;
        set((s) => ({
          tasks: [
            ...s.tasks,
            { id: uid("task"), title: t, size, done: false, date: dateKey() }
          ]
        }));
      },

      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      toggleTask: (id) => {
        const s = get();
        const task = s.tasks.find((t) => t.id === id);
        if (!task) return;

        const units = TASK_UNITS[task.size];

        if (!task.done) {
          const pay = taskPayout(s, task.size);
          const xpGain = XP_PER_TASK[task.size];

          let contract = s.contract;
          let money = s.money + pay;
          let reputation = s.reputation;
          const ledger: LedgerEntry[] = [
            { ts: Date.now(), delta: pay, reason: task.title },
            ...s.ledger
          ];
          let extraToast = "";

          if (contract && contract.state === "active") {
            const delivered = contract.delivered + units;
            if (delivered >= contract.units) {
              money += contract.payout;
              reputation += REP_ON_DELIVER + contract.tier;
              ledger.unshift({
                ts: Date.now(),
                delta: contract.payout,
                reason: `Job: ${contract.title}`
              });
              extraToast = ` Job complete! +${formatMoney(contract.payout)}`;
              contract = null;
            } else {
              contract = { ...contract, delivered };
            }
          }

          set({
            money,
            contract,
            reputation,
            ledger: ledger.slice(0, 40),
            totalEarned: s.totalEarned + pay,
            tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: true } : t)),
            toast: `+${formatMoney(pay)}${extraToast}`
          });
          get().addXPInternal(xpGain);
          get().checkMillionaire();
        } else {
          // Undo — take the money back. A finished contract stays finished.
          const pay = taskPayout(s, task.size);
          set({
            money: Math.max(0, s.money - pay),
            totalEarned: Math.max(0, s.totalEarned - pay),
            tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: false } : t)),
            contract:
              s.contract && s.contract.state === "active"
                ? { ...s.contract, delivered: Math.max(0, s.contract.delivered - units) }
                : s.contract,
            ledger: [
              { ts: Date.now(), delta: -pay, reason: `Reverted: ${task.title}` },
              ...s.ledger
            ].slice(0, 40)
          });
        }
      },

      toggleHabit: (id) => {
        const s = get();
        const today = dateKey();
        const habit = s.habits.find((h) => h.id === id);
        if (!habit) return;
        const wasDone = habit.history[today] === "done";

        // The gain depends on how tired you were when you ticked it, so the
        // exact amount is recorded and given back verbatim on undo.
        const grantKey = `${id}:${today}`;
        const grants = { ...s.habitGrants };
        let delta: number;
        if (wasDone) {
          delta = -(grants[grantKey] ?? habit.energy);
          delete grants[grantKey];
        } else {
          delta = habitGain(habit.energy, s.energy);
          grants[grantKey] = delta;
        }

        set({
          habits: s.habits.map((h) => {
            if (h.id !== id) return h;
            const history = { ...h.history };
            if (wasDone) delete history[today];
            else history[today] = "done";
            return { ...h, history };
          }),
          habitGrants: grants,
          energy: Math.max(0, Math.min(ENERGY_MAX, s.energy + delta))
        });
        get().addXPInternal(wasDone ? -XP_PER_HABIT : XP_PER_HABIT);
        if (!wasDone) set({ toast: `${habit.title} ✓  +${delta} energy` });
      },

      addHabit: (title, energy) => {
        const t = title.trim();
        if (!t) return;
        set((s) => ({
          habits: [
            ...s.habits,
            { id: uid("habit"), title: t, icon: "sun", energy, history: {} }
          ]
        }));
      },

      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

      /* ----- contracts ----- */

      acceptOffer: (id) => {
        const s = get();
        if (s.contract && s.contract.state === "active") {
          set({ toast: "Finish the job you're already on first." });
          return;
        }
        const offer = s.offers.find((o) => o.id === id);
        if (!offer) return;
        set({
          contract: {
            id: uid("contract"),
            client: offer.client,
            title: offer.title,
            tier: offer.tier,
            payout: offer.payout,
            units: offer.units,
            delivered: 0,
            due: keyPlusDays(dateKey(), offer.days),
            state: "active"
          },
          offers: s.offers.filter((o) => o.id !== id),
          toast: `Job accepted: ${offer.title}`
        });
      },

      rerollOffers: () => set((s) => ({ offers: makeOffers(s.reputation) })),

      abandonContract: () => {
        const s = get();
        if (!s.contract) return;
        set({
          contract: null,
          reputation: Math.max(0, s.reputation - REP_ON_FAIL),
          toast: `Job dropped. Reputation −${REP_ON_FAIL}.`
        });
      },

      /* ----- shopping ----- */

      buy: (itemId) => {
        const s = get();
        const item = shopItem(itemId);
        if (!item) return;

        if ((item.minHousing ?? 0) > s.housingTier) {
          set({ toast: `This won't fit in here — you need a better place.` });
          return;
        }
        if (item.category !== "food" && s.owned[itemId]) {
          set({ toast: "You already own that." });
          return;
        }
        if (s.money < item.price) {
          set({ toast: "You can't afford that. Go get some work done." });
          return;
        }

        const ledger: LedgerEntry[] = [
          { ts: Date.now(), delta: -item.price, reason: item.name },
          ...s.ledger
        ];

        if (item.category === "food") {
          set({
            money: s.money - item.price,
            food: s.food + (item.foodDays ?? 0),
            energy: Math.min(ENERGY_MAX, s.energy + (item.energy ?? 0)),
            starveDays: 0,
            ledger: ledger.slice(0, 40),
            toast: `${item.name} — ${dayCount(s.food + (item.foodDays ?? 0))} of food in`
          });
        } else {
          set({
            money: s.money - item.price,
            owned: { ...s.owned, [itemId]: true },
            ledger: ledger.slice(0, 40),
            toast: `${item.name} bought!`
          });
        }
        get().checkMillionaire();
      },

      moveHouse: () => {
        const s = get();
        const next = s.housingTier + 1;
        if (next >= HOUSING.length) {
          set({ toast: "You're already at the top. Congratulations." });
          return;
        }
        const target = HOUSING[next];
        if (s.money < target.price) {
          // Housing names aren't declined, so the wording avoids needing a case.
          set({ toast: `${target.name} costs ${formatMoney(target.price)}.` });
          return;
        }
        set({
          money: s.money - target.price,
          housingTier: next,
          rentDue: keyPlusDays(dateKey(), RENT_PERIOD_DAYS),
          lateDays: 0,
          ledger: [
            { ts: Date.now(), delta: -target.price, reason: `Moved in: ${target.name}` },
            ...s.ledger
          ].slice(0, 40),
          toast: `You're moving! New place: ${target.name}`
        });
        get().checkMillionaire();
      },

      payRentNow: () => {
        const s = get();
        const rent = housing(s.housingTier).rent;
        if (s.money < rent) {
          set({ toast: `Rent is ${formatMoney(rent)} and you have ${formatMoney(s.money)}.` });
          return;
        }
        const today = dateKey();
        const base = daysBetween(today, s.rentDue) > 0 ? s.rentDue : today;
        set({
          money: s.money - rent,
          rentDue: keyPlusDays(base, RENT_PERIOD_DAYS),
          lateDays: 0,
          ledger: [
            { ts: Date.now(), delta: -rent, reason: "Rent" },
            ...s.ledger
          ].slice(0, 40),
          toast: `Rent paid — you're clear for ${RENT_PERIOD_DAYS} days.`
        });
      },

      eat: () => {
        const s = get();
        if (s.food <= 0) {
          set({ toast: "You have no food at all. Buy some in the shop." });
          return;
        }
        set({
          food: s.food - 1,
          energy: Math.min(ENERGY_MAX, s.energy + FOOD_ENERGY_PER_DAY),
          starveDays: 0,
          toast: `You ate. +${FOOD_ENERGY_PER_DAY} energy`
        });
      },

      /* ----- the world moves on without you ----- */

      processDays: () => {
        const s = get();
        const today = dateKey();
        if (s.lastDay === today) return;

        const gap = daysBetween(s.lastDay, today);
        if (gap <= 0) {
          // Clock moved backwards (timezone or manual change) — just resync.
          set({ lastDay: today });
          return;
        }
        const simulate = Math.min(gap, MAX_CATCHUP_DAYS);

        let money = s.money;
        let energy = s.energy;
        let food = s.food;
        let starveDays = s.starveDays;
        let lateDays = s.lateDays;
        let rentDue = s.rentDue;
        let housingTier = s.housingTier;
        let reputation = s.reputation;
        let contract = s.contract;
        const owned: Owned = { ...s.owned };

        const events: GameEvent[] = [];
        let evictions = 0;
        let seizures = 0;
        let day = s.lastDay;

        for (let i = 0; i < simulate; i++) {
          day = keyPlusDays(day, 1);

          // energy: drain, comfort, food
          energy -= ENERGY_DAILY_DRAIN;
          energy += comfortRecovery(owned);

          if (food > 0) {
            food -= 1;
            energy += FOOD_ENERGY_PER_DAY;
            starveDays = 0;
          } else {
            starveDays += 1;
            energy -= STARVE_ENERGY;
            events.push({ kind: "starve", day, text: "A whole day with nothing to eat." });
          }
          energy = Math.max(0, Math.min(ENERGY_MAX, Math.round(energy)));

          // starving too long — something has to go
          if (starveDays >= STARVE_SEIZE_DAYS && seizures < MAX_SEIZURES_PER_CATCHUP) {
            const sell = cheapestOwned(owned);
            if (sell) {
              delete owned[sell.id];
              const got = Math.round(sell.price * 0.6);
              money += got;
              food += 2;
              starveDays = 0;
              seizures += 1;
              events.push({
                kind: "seized",
                day,
                text: `You sold your ${sell.name} for ${formatMoney(got)} just to eat.`
              });
            }
          }

          // rent
          if (daysBetween(rentDue, day) >= 0) {
            const rent = housing(housingTier).rent;
            if (money >= rent) {
              money -= rent;
              rentDue = keyPlusDays(day, RENT_PERIOD_DAYS);
              lateDays = 0;
              events.push({ kind: "rent", day, text: `Rent of ${formatMoney(rent)} paid.` });
            } else {
              lateDays += 1;
              if (lateDays <= RENT_GRACE_DAYS) {
                events.push({
                  kind: "rent",
                  day,
                  text: `Rent unpaid — day ${lateDays} of ${RENT_GRACE_DAYS} grace.`
                });
              } else if (evictions < MAX_EVICTIONS_PER_CATCHUP) {
                const from = housing(housingTier).name;
                housingTier = Math.max(0, housingTier - 1);
                const lost: string[] = [];
                for (const id of Object.keys(owned)) {
                  const it = shopItem(id);
                  if (it && (it.minHousing ?? 0) > housingTier) {
                    delete owned[id];
                    lost.push(it.name);
                  }
                }
                evictions += 1;
                lateDays = 0;
                rentDue = keyPlusDays(day, RENT_PERIOD_DAYS);
                // Housing names can't be declined generically in Czech, so the
                // wording avoids needing a case at all.
                events.push({
                  kind: "evict",
                  day,
                  text:
                    `Evicted: ${from} → ${housing(housingTier).name}.` +
                    (lost.length ? ` Left behind: ${lost.join(", ")}.` : "")
                });
              } else {
                // Eviction cap reached. Reset the rent clock too — otherwise
                // lateDays keeps climbing through the whole absence and the
                // next day's catch-up evicts instantly, with no grace period.
                lateDays = 0;
                rentDue = keyPlusDays(day, RENT_PERIOD_DAYS);
              }
            }
          }

          // contract deadline
          if (contract && contract.state === "active" && daysBetween(contract.due, day) > 0) {
            reputation = Math.max(0, reputation - REP_ON_FAIL);
            events.push({
              kind: "contract",
              day,
              text: `Job "${contract.title}" missed its deadline. Reputation −${REP_ON_FAIL}.`
            });
            contract = null;
          }
        }

        if (gap > simulate) {
          // The simulation runs forward from lastDay, so these are the first
          // `simulate` days of the absence, not the most recent ones. The days
          // we skipped are genuinely forgiven — including any rent that fell in
          // them, otherwise rentDue stays in the past and you come back already
          // in arrears with no chance to act.
          rentDue = keyPlusDays(today, RENT_PERIOD_DAYS);
          lateDays = 0;
          events.unshift({
            kind: "info",
            day: today,
            text: `You were away ${gap} days. The game counted ${simulate} of them and wrote off the rest.`
          });
        }

        // Unfinished work carries over; finished work is cleared.
        const tasks = s.tasks.filter((t) => !t.done).map((t) => ({ ...t, date: today }));

        set({
          money,
          energy,
          food,
          starveDays,
          lateDays,
          rentDue,
          housingTier,
          reputation,
          contract,
          owned,
          tasks,
          lastDay: today,
          offers: makeOffers(reputation),
          report: events.length ? events : null
        });
      },

      /* ----- internals & UI ----- */

      addXPInternal: (amount: number) => {
        const s = get();
        let level = s.level;
        let xp = s.xp + amount;
        let leveled = false;
        while (xp >= xpToNext(level)) {
          xp -= xpToNext(level);
          level += 1;
          leveled = true;
        }
        if (xp < 0) xp = 0;
        set({ level, xp, celebrationLevel: leveled ? level : s.celebrationLevel });
      },

      checkMillionaire: () => {
        const s = get();
        if (!s.millionaire && netWorth(s) >= MILLION_GOAL) {
          set({ millionaire: true, showMillionaire: true });
        }
      },

      setToast: (msg) => set({ toast: msg }),
      setNight: (v) => set({ night: v }),
      dismissReport: () => set({ report: null }),
      dismissCelebration: () => set({ celebrationLevel: null }),
      dismissMillionaire: () => set({ showMillionaire: false })
    }),
    {
      name: SAVE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Habits are persisted, so a save made before the energy rebalance would
      // keep the old, far more generous values. Bring the seeded ones in line.
      migrate: (persisted, from) => {
        const state = persisted as Partial<GameState>;
        if (from < 1 && Array.isArray(state.habits)) {
          state.habits = state.habits.map((h) =>
            HABIT_ENERGY_V1[h.id] ? { ...h, energy: HABIT_ENERGY_V1[h.id] } : h
          );
        }
        if (!state.habitGrants) state.habitGrants = {};
        return state as GameState;
      }
    }
  )
);

export function resetAllData(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
  window.location.reload();
}
