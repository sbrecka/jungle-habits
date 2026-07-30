"use client";

import React from "react";
import { useGame } from "@/lib/store";
import { CartIcon, HabitIcon, HomeIcon, WorkIcon } from "./ui";
import { dateKey } from "@/lib/date";

export type Tab = "work" | "habits" | "shop" | "home";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "work", label: "Práce", icon: <WorkIcon size={16} /> },
  { id: "habits", label: "Návyky", icon: <HabitIcon size={16} /> },
  { id: "shop", label: "Obchod", icon: <CartIcon size={16} /> },
  { id: "home", label: "Bydlení", icon: <HomeIcon size={16} /> }
];

export default function ActionBar({ onOpen }: { onOpen: (t: Tab) => void }) {
  const tasks = useGame((s) => s.tasks);
  const habits = useGame((s) => s.habits);
  const food = useGame((s) => s.food);
  const contract = useGame((s) => s.contract);

  const today = dateKey();
  const openTasks = tasks.filter((t) => !t.done).length;
  const habitsLeft = habits.filter((h) => h.history[today] !== "done").length;

  const badge: Record<Tab, number> = {
    work: openTasks + (contract ? 0 : 0),
    habits: habitsLeft,
    shop: food <= 1 ? 1 : 0,
    home: 0
  };

  return (
    <nav className="grid grid-cols-4 gap-1 border-t border-line bg-panel px-2 py-2">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onOpen(t.id)}
          className="relative flex flex-col items-center gap-1 rounded border border-line bg-panel2 py-2 text-[11px] text-text active:scale-95"
        >
          <span className="text-dim">{t.icon}</span>
          {t.label}
          {badge[t.id] > 0 && (
            <span
              className={`absolute right-1 top-1 min-w-[15px] rounded-sm px-1 text-[9px] font-bold leading-[14px] ${
                t.id === "shop" ? "bg-danger text-white" : "bg-gold text-black"
              }`}
            >
              {t.id === "shop" ? "!" : badge[t.id]}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
