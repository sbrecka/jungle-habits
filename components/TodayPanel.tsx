"use client";

import React from "react";
import { taskPayout, useGame } from "@/lib/store";
import { SIZE_COLOR, SIZE_LABEL, formatMoneyShort } from "@/lib/constants";
import { Btn, Check, Plus } from "./ui";

/**
 * Fills the space under the room with the one thing you actually do every day:
 * tick off work. Keeps the core loop one tap away from the room view.
 */
export default function TodayPanel({ onOpenWork }: { onOpenWork: () => void }) {
  const tasks = useGame((s) => s.tasks);
  const level = useGame((s) => s.level);
  const owned = useGame((s) => s.owned);
  const energy = useGame((s) => s.energy);
  const toggleTask = useGame((s) => s.toggleTask);

  const open = tasks.filter((t) => !t.done);
  const doneCount = tasks.length - open.length;
  const shown = open.slice(0, 3);

  if (tasks.length === 0) {
    return (
      <div className="px-3 py-2">
        <button
          onClick={onOpenWork}
          className="flex w-full items-center gap-2 rounded border border-dashed border-line bg-panel/60 px-3 py-3 text-left active:scale-[0.99]"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded border border-line text-dim">
            <Plus />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-text">Zapiš si dnešní práci</span>
            <span className="block text-[11px] text-dim">
              Za hotové úkoly se platí — jinak nebude na nájem
            </span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 px-3 py-2">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-xs uppercase tracking-wide text-dim">Dnes</span>
        <span className="text-[11px] text-dim">
          {doneCount} hotovo · {open.length} zbývá
        </span>
        <button onClick={onOpenWork} className="ml-auto text-[11px] text-blue active:scale-95">
          Vše
        </button>
      </div>

      {shown.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 rounded border border-line bg-panel px-2 py-1.5"
        >
          <button
            onClick={() => toggleTask(t.id)}
            aria-label={`Hotovo: ${t.title}`}
            className="grid h-6 w-6 shrink-0 place-items-center rounded border text-transparent active:scale-95"
            style={{ borderColor: SIZE_COLOR[t.size] }}
          >
            <Check size={12} />
          </button>
          <span className="min-w-0 flex-1 truncate text-[13px] text-text">{t.title}</span>
          <span className="shrink-0 text-[10px] uppercase text-dim">{SIZE_LABEL[t.size]}</span>
          <span className="shrink-0 text-[13px] text-gold">
            +{formatMoneyShort(taskPayout({ level, owned, energy }, t.size))}
          </span>
        </div>
      ))}

      {open.length > shown.length && (
        <Btn variant="ghost" onClick={onOpenWork} className="w-full !py-1.5 !text-[11px]">
          + {open.length - shown.length} dalších
        </Btn>
      )}
    </div>
  );
}
