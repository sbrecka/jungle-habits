"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Habit, Goal, Task, Challenge, PlacedItem, LedgerEntry, FocusSession, DayStatus
} from "./types";
import {
  xpToNext, CHALLENGE_POOL, CHECKIN_REWARD, STREAK_BONUS_MIN, STREAK_BONUS_BANANAS,
  TASK_REWARD, CHALLENGE_EARLY_BONUS, shopItem, isLand, categoryUnlockLevel
} from "./constants";
import { dateKey, keyDaysAgo, addDays, habitStreak } from "./date";

let idCounter = 0;
function uid(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

function randomChallenge(excludeKey?: string): Challenge {
  const pool = CHALLENGE_POOL.filter((c) => c.key !== excludeKey);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { ...pick, state: "pending", date: dateKey() };
}

/* ---------- Seed data ---------- */

function seedHistory(doneDaysAgo: number[], skippedDaysAgo: number[] = []): Record<string, DayStatus> {
  const h: Record<string, DayStatus> = {};
  doneDaysAgo.forEach((n) => (h[keyDaysAgo(n)] = "done"));
  skippedDaysAgo.forEach((n) => (h[keyDaysAgo(n)] = "skipped"));
  return h;
}

function seedHabits(): Habit[] {
  return [
    {
      id: "habit-checkin",
      title: "Daily Check-in",
      minTarget: "Open the app and check in",
      identity: "I show up every day",
      bananaReward: CHECKIN_REWARD,
      color: "#F4877F",
      icon: "checkin",
      isCheckIn: true,
      history: seedHistory([1, 2, 3])
    },
    {
      id: "habit-gym",
      title: "Gym session",
      minTarget: "10 minutes of movement",
      identity: "I'm an athlete",
      bananaReward: 15,
      color: "#79AC48",
      icon: "gym",
      history: seedHistory([1, 3, 4], [2])
    },
    {
      id: "habit-flashcards",
      title: "Review flashcards",
      minTarget: "Review 10 cards",
      identity: "I have an excellent memory",
      bananaReward: 10,
      color: "#5FA8D3",
      icon: "read",
      history: seedHistory([1, 2])
    },
    {
      id: "habit-water",
      title: "Drink water",
      minTarget: "6 glasses",
      identity: "I take care of my body",
      bananaReward: 5,
      color: "#F5CE45",
      icon: "drink",
      history: seedHistory([1, 2, 3, 4, 5])
    }
  ];
}

function seedGoals(): Goal[] {
  return [
    { id: "goal-1", title: "Read 12 books this year", note: "One per month keeps the brain fresh", progress: 40, color: "#B48CD9" },
    { id: "goal-2", title: "Run a 10k", note: "Training three times a week", progress: 25, color: "#F4877F" }
  ];
}

function seedTasks(): Task[] {
  return [
    { id: "task-1", title: "Call Mum", color: "#F4877F", done: false },
    { id: "task-2", title: "Water the plants", color: "#79AC48", done: false },
    { id: "task-3", title: "Do my laundry", color: "#F5CE45", done: false }
  ];
}

function seedPlaced(): PlacedItem[] {
  return [
    { id: "pl-campfire", itemId: "campfire", variant: 0, x: 0, y: 0 },
    { id: "pl-palm1", itemId: "palm", variant: 0, x: 2, y: -2 },
    { id: "pl-palm2", itemId: "palm", variant: 1, x: -3, y: 1 },
    { id: "pl-banana1", itemId: "banana-tree", variant: 0, x: 1, y: 2 },
    { id: "pl-hut", itemId: "hut", variant: 0, x: -1, y: -3 },
    { id: "pl-grass1", itemId: "grass", variant: 0, x: 3, y: 0 },
    { id: "pl-grass2", itemId: "grass", variant: 2, x: -2, y: -1 },
    { id: "pl-torch", itemId: "torch", variant: 0, x: 1, y: -1 },
    { id: "pl-hammock", itemId: "hammock", variant: 0, x: -1, y: 3 }
  ];
}

function seedLedger(): LedgerEntry[] {
  const now = Date.now();
  return [
    { ts: now - 86400000 * 2, delta: 15, reason: "Gym session" },
    { ts: now - 86400000, delta: 5, reason: "Daily check-in" },
    { ts: now - 86400000, delta: 20, reason: "Daily challenge" },
    { ts: now - 3600000 * 5, delta: -30, reason: "Shop: Grass Tuft" }
  ];
}

/* ---------- Store ---------- */

export interface JungleState {
  // profile
  level: number;
  currentXP: number;
  bananaBalance: number;
  streak: number;
  lastCheckInDate: string;
  bananasToday: number;
  focusMinutesToday: number;
  activeDate: string;

  // content
  habits: Habit[];
  goals: Goal[];
  tasks: Task[];
  challenge: Challenge;
  inventory: Record<string, number>;
  placed: PlacedItem[];
  ledger: LedgerEntry[];

  // session / prefs
  focus: FocusSession | null;
  sound: boolean;
  night: boolean;
  toast: string | null;
  celebrationLevel: number | null;

  // actions
  rollover: () => void;
  checkIn: () => void;
  setHabitStatus: (habitId: string, dk: string, status: DayStatus) => void;
  addHabit: (h: Omit<Habit, "id" | "history">) => void;
  deleteHabit: (id: string) => void;
  addGoal: (title: string, note: string, color: string) => void;
  bumpGoal: (id: string, delta: number) => void;
  deleteGoal: (id: string) => void;
  addTask: (title: string, color: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  completeChallenge: () => void;
  rerollChallenge: () => void;
  skipChallenge: () => void;
  startFocus: (minutes: number) => void;
  finishFocus: (completed: boolean) => void;
  buyItem: (itemId: string) => void;
  placeItem: (itemId: string, variant: number, x: number, y: number) => boolean;
  removePlaced: (placedId: string) => void;
  setSound: (v: boolean) => void;
  setNight: (v: boolean) => void;
  setToast: (msg: string | null) => void;
  dismissCelebration: () => void;
  addBananas: (delta: number, reason: string) => void;
  addXP: (amount: number) => void;
}

export const useJungle = create<JungleState>()(
  persist(
    (set, get) => ({
      level: 3,
      currentXP: 40,
      bananaBalance: 320,
      streak: 3,
      lastCheckInDate: keyDaysAgo(1),
      bananasToday: 0,
      focusMinutesToday: 0,
      activeDate: dateKey(),

      habits: seedHabits(),
      goals: seedGoals(),
      tasks: seedTasks(),
      challenge: { ...CHALLENGE_POOL[0], state: "pending", date: dateKey() },
      inventory: { grass: 1 },
      placed: seedPlaced(),
      ledger: seedLedger(),

      focus: null,
      sound: true,
      night: false,
      toast: null,
      celebrationLevel: null,

      addBananas: (delta, reason) => {
        set((s) => ({
          bananaBalance: Math.max(0, s.bananaBalance + delta),
          bananasToday: delta > 0 ? s.bananasToday + delta : s.bananasToday,
          ledger: [{ ts: Date.now(), delta, reason }, ...s.ledger].slice(0, 30)
        }));
      },

      addXP: (amount) => {
        let { level, currentXP } = get();
        let leveled = false;
        currentXP += amount;
        if (amount < 0) currentXP = Math.max(0, currentXP);
        while (currentXP >= xpToNext(level)) {
          currentXP -= xpToNext(level);
          level += 1;
          leveled = true;
        }
        set({ level, currentXP, celebrationLevel: leveled ? level : get().celebrationLevel });
      },

      rollover: () => {
        const s = get();
        const today = dateKey();
        if (s.activeDate === today && s.challenge.date === today) return;
        const yesterday = keyDaysAgo(1);
        const lostStreak =
          s.streak > 0 && s.lastCheckInDate !== today && s.lastCheckInDate !== yesterday;
        set({
          activeDate: today,
          bananasToday: 0,
          focusMinutesToday: 0,
          challenge: randomChallenge(),
          streak: lostStreak ? 0 : s.streak,
          toast: lostStreak
            ? "Streak lost! Check in today to start a new one."
            : s.toast
        });
      },

      checkIn: () => {
        const s = get();
        const today = dateKey();
        if (s.lastCheckInDate === today) {
          set({ toast: "Already checked in today. See you tomorrow!" });
          return;
        }
        const newStreak = s.lastCheckInDate === keyDaysAgo(1) ? s.streak + 1 : 1;
        const bonus = newStreak >= STREAK_BONUS_MIN ? STREAK_BONUS_BANANAS : 0;
        set({
          streak: newStreak,
          lastCheckInDate: today,
          habits: s.habits.map((h) =>
            h.isCheckIn ? { ...h, history: { ...h.history, [today]: "done" } } : h
          )
        });
        get().addBananas(CHECKIN_REWARD + bonus, bonus ? "Daily check-in + streak bonus" : "Daily check-in");
        get().addXP(10);
        set({ toast: `Checked in! ${newStreak} day streak 🔥` });
      },

      setHabitStatus: (habitId, dk, status) => {
        const s = get();
        const habit = s.habits.find((h) => h.id === habitId);
        if (!habit || habit.isCheckIn) return;
        const prev: DayStatus = habit.history[dk] || "todo";
        if (prev === status) return;

        // Reward only when marking today's habit done (and revoke on undo).
        const isToday = dk === dateKey();
        if (isToday && status === "done" && prev !== "done") {
          const streakBefore = habitStreak(habit.history, addDays(-1));
          const bonus = streakBefore + 1 >= STREAK_BONUS_MIN ? STREAK_BONUS_BANANAS : 0;
          get().addBananas(habit.bananaReward + bonus, bonus ? `${habit.title} + streak bonus` : habit.title);
          get().addXP(habit.bananaReward * 2);
        } else if (isToday && prev === "done" && status !== "done") {
          get().addBananas(-habit.bananaReward, `${habit.title} (undone)`);
          get().addXP(-habit.bananaReward * 2);
        }

        set((st) => ({
          habits: st.habits.map((h) => {
            if (h.id !== habitId) return h;
            const history = { ...h.history };
            if (status === "todo") delete history[dk];
            else history[dk] = status;
            return { ...h, history };
          })
        }));
      },

      addHabit: (h) => {
        set((s) => ({ habits: [...s.habits, { ...h, id: uid("habit"), history: {} }] }));
        set({ toast: "New quest added!" });
      },

      deleteHabit: (id) => {
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id || h.isCheckIn) }));
      },

      addGoal: (title, note, color) => {
        set((s) => ({ goals: [...s.goals, { id: uid("goal"), title, note, progress: 0, color }] }));
      },
      bumpGoal: (id, delta) => {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, progress: Math.min(100, Math.max(0, g.progress + delta)) } : g
          )
        }));
        const g = get().goals.find((x) => x.id === id);
        if (g && g.progress >= 100) {
          get().addBananas(50, `Goal reached: ${g.title}`);
          set({ toast: `Goal reached: ${g.title}! +50 bananas` });
        }
      },
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      addTask: (title, color) => {
        if (!title.trim()) return;
        set((s) => ({ tasks: [...s.tasks, { id: uid("task"), title: title.trim(), color, done: false }] }));
      },
      toggleTask: (id) => {
        const t = get().tasks.find((x) => x.id === id);
        if (!t) return;
        set((s) => ({ tasks: s.tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x)) }));
        if (!t.done) get().addBananas(TASK_REWARD, `Task: ${t.title}`);
        else get().addBananas(-TASK_REWARD, `Task undone: ${t.title}`);
      },
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      completeChallenge: () => {
        const s = get();
        if (s.challenge.state !== "pending") return;
        const early = new Date().getHours() < 18 ? CHALLENGE_EARLY_BONUS : 0;
        set({ challenge: { ...s.challenge, state: "completed" } });
        get().addBananas(
          s.challenge.reward + early,
          early ? "Daily challenge (early bird!)" : "Daily challenge"
        );
        get().addXP(15);
        set({ toast: early ? "Challenge done early — bonus bananas!" : "Challenge complete!" });
      },
      rerollChallenge: () => {
        const s = get();
        if (s.challenge.state !== "pending") return;
        set({ challenge: randomChallenge(s.challenge.key) });
      },
      skipChallenge: () => {
        set((s) => ({ challenge: { ...s.challenge, state: "skipped" } }));
      },

      startFocus: (minutes) => {
        set({ focus: { endsAt: Date.now() + minutes * 60000, minutes } });
      },
      finishFocus: (completed) => {
        const s = get();
        if (!s.focus) return;
        const { minutes, endsAt } = s.focus;
        const elapsedMin = Math.max(
          0,
          Math.min(minutes, Math.round((minutes * 60000 - (endsAt - Date.now())) / 60000))
        );
        set({ focus: null });
        if (completed) {
          set({ focusMinutesToday: s.focusMinutesToday + minutes });
          get().addBananas(minutes, `Focus session (${minutes}m)`);
          get().addXP(minutes * 2);
          set({ toast: `Focus complete! +${minutes} bananas` });
        } else {
          set({
            focusMinutesToday: s.focusMinutesToday + elapsedMin,
            toast: "Focus ended early. Monke understands."
          });
        }
      },

      buyItem: (itemId) => {
        const item = shopItem(itemId);
        const s = get();
        if (!item) return;
        if (s.level < categoryUnlockLevel(item.category)) {
          set({ toast: `Reach level ${categoryUnlockLevel(item.category)} to unlock ${item.category}.` });
          return;
        }
        if (s.bananaBalance < item.price) {
          set({ toast: "Not enough bananas! Complete some habits first." });
          return;
        }
        get().addBananas(-item.price, `Shop: ${item.name}`);
        set((st) => ({
          inventory: { ...st.inventory, [itemId]: (st.inventory[itemId] || 0) + 1 },
          toast: `${item.name} bought! Tap the pencil to place it.`
        }));
      },

      placeItem: (itemId, variant, x, y) => {
        const s = get();
        const item = shopItem(itemId);
        if (!item || (s.inventory[itemId] || 0) <= 0) return false;
        const land = isLand(x, y, s.level);
        if (item.water ? land : !land) return false;
        if (s.placed.some((p) => p.x === x && p.y === y)) return false;
        set((st) => ({
          inventory: { ...st.inventory, [itemId]: (st.inventory[itemId] || 0) - 1 },
          placed: [...st.placed, { id: uid("pl"), itemId, variant, x, y }]
        }));
        return true;
      },

      removePlaced: (placedId) => {
        const p = get().placed.find((x) => x.id === placedId);
        if (!p) return;
        set((s) => ({
          placed: s.placed.filter((x) => x.id !== placedId),
          inventory: { ...s.inventory, [p.itemId]: (s.inventory[p.itemId] || 0) + 1 }
        }));
      },

      setSound: (v) => set({ sound: v }),
      setNight: (v) => set({ night: v }),
      setToast: (msg) => set({ toast: msg }),
      dismissCelebration: () => set({ celebrationLevel: null })
    }),
    {
      name: "jungle-habits-v1",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export function resetAllData() {
  try {
    localStorage.removeItem("jungle-habits-v1");
  } catch {}
  window.location.reload();
}
