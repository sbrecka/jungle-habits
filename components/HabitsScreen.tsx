"use client";

import React, { useState } from "react";
import { useGame } from "@/lib/store";
import { ENERGY_MAX, energyLabel, energyMult } from "@/lib/constants";
import { dateKey, habitStreak, keyDaysAgo } from "@/lib/date";
import { Bar, Bolt, Btn, Check, Chip, EmptyState, Panel, Plus, Sheet, X } from "./ui";

export default function HabitsScreen({ onClose }: { onClose: () => void }) {
  const habits = useGame((s) => s.habits);
  const energy = useGame((s) => s.energy);
  const toggleHabit = useGame((s) => s.toggleHabit);
  const addHabit = useGame((s) => s.addHabit);
  const deleteHabit = useGame((s) => s.deleteHabit);
  const food = useGame((s) => s.food);
  const eat = useGame((s) => s.eat);

  const [title, setTitle] = useState("");
  const today = dateKey();
  const doneCount = habits.filter((h) => h.history[today] === "done").length;

  const submit = () => {
    if (!title.trim()) return;
    addHabit(title, 10);
    setTitle("");
  };

  return (
    <Sheet
      title="Habits"
      subtitle={`${doneCount}/${habits.length} today`}
      onClose={onClose}
    >
      <Panel className="mb-3">
        <div className="flex items-center gap-2">
          <Bolt size={16} />
          <span className="font-display text-lg leading-none text-text">
            {energy}/{ENERGY_MAX}
          </span>
          <span className="text-[11px] text-dim">{energyLabel(energy)}</span>
          <span className="ml-auto text-[11px] text-dim">
            earnings × <span className="text-gold">{energyMult(energy).toFixed(2)}</span>
          </span>
        </div>
        <div className="mt-2">
          <Bar
            value={energy}
            max={ENERGY_MAX}
            colour={energy >= 55 ? "#6aa84f" : energy >= 30 ? "#d9822b" : "#c8524f"}
            height={8}
          />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-dim">
          Habits pay no money directly — they restore energy, and energy multiplies
          every payout. Exhausted, you earn a fraction of what you would rested.
        </p>
        {food > 0 && (
          <Btn onClick={eat} className="mt-2 w-full !text-[11px]">
            Eat (+10 energy, −1 day of food)
          </Btn>
        )}
      </Panel>

      <div className="space-y-2">
        {habits.map((h) => {
          const isDone = h.history[today] === "done";
          const streak = habitStreak(h.history);
          return (
            <div
              key={h.id}
              className={`rounded border p-2 ${
                isDone ? "border-green/40 bg-panel/60" : "border-line bg-panel"
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHabit(h.id)}
                  aria-label={isDone ? "Undo" : "Mark as done"}
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded border active:scale-95 ${
                    isDone ? "border-green text-green" : "border-line text-transparent"
                  }`}
                >
                  <Check />
                </button>

                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm ${isDone ? "text-dim" : "text-text"}`}>
                    {h.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-[10px] text-green">+{h.energy} energy</span>
                    {streak > 0 && <Chip tone="warn">{streak} day streak</Chip>}
                  </div>
                </div>

                <button
                  onClick={() => deleteHabit(h.id)}
                  aria-label="Delete habit"
                  className="shrink-0 text-dim active:scale-95"
                >
                  <X />
                </button>
              </div>

              <WeekDots history={h.history} />
            </div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <EmptyState>No habits yet. Add something that genuinely lifts your output.</EmptyState>
      )}

      <Panel className="mt-3">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="New habit…"
            className="min-w-0 flex-1 rounded border border-line bg-bg px-2 py-2 text-sm text-text outline-none placeholder:text-dim focus:border-blue"
          />
          <Btn onClick={submit} className="shrink-0">
            <Plus />
          </Btn>
        </div>
      </Panel>
    </Sheet>
  );
}

/** Last seven days, oldest first. */
function WeekDots({ history }: { history: Record<string, string> }) {
  const days = Array.from({ length: 7 }, (_, i) => keyDaysAgo(6 - i));
  return (
    <div className="mt-2 flex gap-1">
      {days.map((d) => (
        <span
          key={d}
          title={d}
          className={`h-1.5 flex-1 rounded-sm ${
            history[d] === "done" ? "bg-green" : "bg-black/40"
          }`}
        />
      ))}
    </div>
  );
}
