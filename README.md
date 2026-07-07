# 🐒 Jungle Habits

A gamified habit tracker where your good habits grow a cozy monkey island. Inspired by idle-island apps like *Monke* — built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion and Zustand. **No backend, no accounts, no API keys** — everything lives in your browser's localStorage.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Works offline after install (the hand-drawn Google font gracefully falls back to system fonts without internet).

## What's inside

- **Island home** — an isometric SVG island with palm sway, campfire flicker, water shimmer, blinking monkeys, a snoozing hammock monkey, and glowing torches in the night theme (moon button, top right). The island's landmass grows as you level up.
- **CHECK-IN** — the big coral pill. Checking in daily builds your 🔥 streak; streaks of 3+ add bonus bananas. Miss a day and the streak resets (with a toast).
- **Quests & Goals** ("☰ Add tasks") — habit cards with streaks, streak-bonus tags, minimum targets, identity statements, banana rewards, 7-day dot history, To-Dos/Done/Skipped tabs, day-by-day navigation, and a form to add your own quests. Goals tab tracks long-term goals with progress bars (+50 🍌 on completion).
- **Today's progress** (pull-up pill) — habits done, minutes focused, bananas earned today; the **Daily Challenge** card with a live countdown to midnight, reroll ("Change"), dismiss, and an early-bird bonus before 6pm; plus a quick one-off **Tasks** checklist (+2 🍌 each).
- **FOCUS** — pick 5/15/25/45 minutes, and Monke locks in over a darkened island with a big countdown. Finish for 1 🍌/minute + XP; the coral STOP needs a confirming second tap. The timer survives page reloads.
- **Shop** (cart button) — decorations across Trees, Small Decorations, Structures, Boats and Wildlife. Categories unlock as you level up (with a NEW badge); buying deducts bananas and adds the item to storage.
- **Edit mode** (pencil) — pick items from storage, tap highlighted tiles to place them (boats go on water!), tap placed decorations to store them again.
- **XP & levels** — habits, tasks, challenges and focus all grant XP. Level-ups trigger a banana-confetti celebration and unlock shop categories.
- **Banana ledger** — tap your banana balance to see where every banana came from (or went).

## Demo data & reset

The app seeds a level-3 island with habits, streak history, goals, tasks and placed decorations so every screen has life immediately. To start fresh: ⚙️ Settings → **Reset all data** (or clear the `jungle-habits-v1` localStorage key).

## Notes

- State schema is versioned under one localStorage key (`jungle-habits-v1`).
- Day rollover happens automatically (checked every 30s): stats reset, a new daily challenge appears, and missed check-ins break the streak.
- All art is hand-authored inline SVG; animations respect `prefers-reduced-motion`.
