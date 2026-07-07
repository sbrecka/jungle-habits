"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useJungle } from "@/lib/store";
import { Habit, DayStatus, MonkeyIcon } from "@/lib/types";
import { dateKey, addDays, formatHeader, keyDaysAgo, habitStreak } from "@/lib/date";
import { STREAK_BONUS_MIN, STREAK_BONUS_BANANAS, TASK_COLORS, xpToNext } from "@/lib/constants";
import { BananaIcon, FlameIcon, ChevronIcon, XIcon, PencilIcon } from "./ui";
import { HabitMonkey, MonkeyFace } from "./art/Monkeys";

type Tab = "quests" | "goals";
type SubTab = "todo" | "done" | "skipped";

export default function QuestsScreen({ onClose }: { onClose: () => void }) {
  const { habits, goals, level, currentXP, streak, bananaBalance, setHabitStatus, deleteHabit,
    addHabit, addGoal, bumpGoal, deleteGoal } = useJungle();

  const [dayOffset, setDayOffset] = useState(0);
  const [tab, setTab] = useState<Tab>("quests");
  const [subTab, setSubTab] = useState<SubTab>("todo");
  const [editing, setEditing] = useState(false);
  const [groupOpen, setGroupOpen] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const date = addDays(dayOffset);
  const dk = dateKey(date);
  const isFuture = dayOffset > 0;

  const filtered = useMemo(() => {
    return habits.filter((h) => {
      const st: DayStatus = h.history[dk] || "todo";
      if (subTab === "todo") return st === "todo";
      if (subTab === "done") return st === "done";
      return st === "skipped";
    });
  }, [habits, dk, subTab]);

  const counts = useMemo(() => {
    let todo = 0, done = 0, skipped = 0;
    habits.forEach((h) => {
      const st = h.history[dk] || "todo";
      if (st === "todo") todo++;
      else if (st === "done") done++;
      else skipped++;
    });
    return { todo, done, skipped };
  }, [habits, dk]);

  return (
    <div className="absolute inset-0 z-40 bg-[#F6F2E7] flex flex-col">
      {/* header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-ink">{formatHeader(date)}</h1>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDayOffset((d) => d - 1)}
              className="w-9 h-9 rounded-xl bg-white shadow-card grid place-items-center"
              aria-label="Previous day"
            >
              <ChevronIcon dir="left" size={16} />
            </button>
            <button
              onClick={() => setDayOffset((d) => Math.min(0, d + 1))}
              disabled={dayOffset >= 0}
              className="w-9 h-9 rounded-xl bg-white shadow-card grid place-items-center disabled:opacity-40"
              aria-label="Next day"
            >
              <ChevronIcon dir="right" size={16} />
            </button>
            <button
              onClick={onClose}
              className="ml-1 w-9 h-9 rounded-xl bg-navy text-white shadow-card grid place-items-center"
              aria-label="Back to island"
            >
              <XIcon />
            </button>
          </div>
        </div>

        {/* mini stat bar */}
        <div className="mt-2 inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-card text-sm font-extrabold text-ink">
          <MonkeyFace size={18} />
          <span>Lvl {level}</span>
          <span className="text-ink/40 text-xs">({currentXP}/{xpToNext(level)} xp)</span>
          <span className="text-ink/25">|</span>
          <FlameIcon size={15} lit={streak > 0} /> {streak}
          <span className="text-ink/25">|</span>
          <BananaIcon size={15} /> {bananaBalance.toLocaleString()}
        </div>

        {/* Quests / Goals tabs */}
        <div className="mt-3 grid grid-cols-2 bg-white rounded-full p-1 shadow-card">
          {(["quests", "goals"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full py-1.5 text-sm font-extrabold capitalize transition-colors ${
                tab === t ? "bg-ink text-white" : "text-ink/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "quests" && (
          <div className="mt-2 flex items-center gap-1.5">
            {(
              [
                ["todo", `To-Dos`],
                ["done", `Done`],
                ["skipped", `Skipped`]
              ] as [SubTab, string][]
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setSubTab(k)}
                className={`rounded-full px-3.5 py-1 text-xs font-extrabold border ${
                  subTab === k ? "bg-ink text-white border-ink" : "bg-white text-ink/70 border-ink/15"
                }`}
              >
                {label} ({counts[k === "todo" ? "todo" : k]})
              </button>
            ))}
            <button
              onClick={() => setEditing((v) => !v)}
              className={`ml-auto w-8 h-8 rounded-full grid place-items-center border ${
                editing ? "bg-banana border-ink text-ink" : "bg-white border-ink/15 text-ink/70"
              }`}
              title="Edit quests"
            >
              <PencilIcon size={15} />
            </button>
          </div>
        )}
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 thin-scroll">
        {tab === "quests" ? (
          <>
            <button
              className="flex items-center gap-1.5 text-sm font-extrabold text-ink/70 mt-1 mb-2"
              onClick={() => setGroupOpen((v) => !v)}
            >
              <ChevronIcon dir={groupOpen ? "down" : "right"} size={13} />
              Ungrouped ({filtered.length})
            </button>
            {groupOpen && (
              <div className="space-y-3">
                {filtered.length === 0 && (
                  <div className="bg-white rounded-2xl shadow-card p-5 text-center text-sm text-ink/60">
                    {subTab === "todo"
                      ? "All clear here. Nice work — go admire your island."
                      : subTab === "done"
                        ? "Nothing done for this day yet."
                        : "Nothing skipped. Monke approves."}
                  </div>
                )}
                {filtered.map((h) => (
                  <HabitCard
                    key={h.id}
                    habit={h}
                    dk={dk}
                    disabled={isFuture}
                    editing={editing}
                    onSet={(status) => setHabitStatus(h.id, dk, status)}
                    onDelete={() => deleteHabit(h.id)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <GoalsList goals={goals} onBump={bumpGoal} onDelete={deleteGoal} onAdd={addGoal} />
        )}
      </div>

      {/* add habit FAB */}
      {tab === "quests" && (
        <button
          onClick={() => setShowAdd(true)}
          className="absolute bottom-6 right-5 w-14 h-14 rounded-full bg-[#3B82F6] text-white text-3xl leading-none shadow-card grid place-items-center hover:brightness-110"
          aria-label="Add quest"
        >
          +
        </button>
      )}

      {showAdd && <AddHabitSheet onClose={() => setShowAdd(false)} onAdd={addHabit} />}
    </div>
  );
}

/* ---------- Habit card ---------- */

function HabitCard({
  habit, dk, disabled, editing, onSet, onDelete
}: {
  habit: Habit;
  dk: string;
  disabled: boolean;
  editing: boolean;
  onSet: (s: DayStatus) => void;
  onDelete: () => void;
}) {
  const status: DayStatus = habit.history[dk] || "todo";
  const streak = habitStreak(habit.history);
  const hasBonus = streak + (status === "done" ? 0 : 1) >= STREAK_BONUS_MIN && streak >= STREAK_BONUS_MIN - 1;

  // last 7 day dots, oldest → newest ending at dk's date
  const dots: DayStatus[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(dk + "T12:00:00");
    d.setDate(d.getDate() - i);
    dots.push((habit.history[dateKey(d)] as DayStatus) || "todo");
  }

  return (
    <motion.div layout className="bg-white rounded-2xl shadow-card p-4 relative">
      {editing && !habit.isCheckIn && (
        <button
          onClick={onDelete}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-coral text-white grid place-items-center shadow-card"
          aria-label={`Delete ${habit.title}`}
        >
          <XIcon size={13} />
        </button>
      )}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-extrabold text-ink/80">
            <FlameIcon size={15} lit={streak > 0} /> {streak}
            {hasBonus && (
              <span className="text-[11px] font-extrabold text-leaf-dark bg-leaf-light/25 rounded-full px-2 py-0.5">
                +{STREAK_BONUS_BANANAS} streak bonus
              </span>
            )}
          </div>
          <h3 className="font-display text-2xl leading-tight text-ink mt-0.5">{habit.title}</h3>
          <p className="text-sm text-ink/70">
            <span className="font-bold">Min:</span> {habit.minTarget}
          </p>
          <p className="text-sm italic text-ink/45">{habit.identity}</p>

          <div className="flex items-center gap-1.5 mt-2.5">
            {dots.map((d, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  d === "done" ? "bg-leaf" : d === "skipped" ? "bg-banana" : "bg-ink/15"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <HabitMonkey icon={habit.icon} size={54} />
          <div className="flex items-center gap-1 text-sm font-extrabold text-ink">
            <BananaIcon size={14} /> {habit.bananaReward}x
          </div>
        </div>
      </div>

      {/* actions */}
      {!habit.isCheckIn ? (
        <div className="mt-3 flex items-center gap-2">
          <button
            disabled={disabled}
            onClick={() => onSet(status === "done" ? "todo" : "done")}
            className={`flex-1 rounded-full py-1.5 text-sm font-extrabold border-2 border-ink/70 shadow-pill disabled:opacity-40 ${
              status === "done" ? "bg-leaf text-white" : "bg-white text-ink hover:bg-leaf-light/20"
            }`}
          >
            {status === "done" ? "Done ✓" : "Mark done"}
          </button>
          <button
            disabled={disabled}
            onClick={() => onSet(status === "skipped" ? "todo" : "skipped")}
            className={`rounded-full px-4 py-1.5 text-sm font-bold border disabled:opacity-40 ${
              status === "skipped"
                ? "bg-ink/70 text-white border-ink/70"
                : "bg-white text-ink/50 border-ink/15 hover:bg-ink/5"
            }`}
          >
            {status === "skipped" ? "Skipped" : "Skip"}
          </button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-ink/45 font-bold">
          Complete with the CHECK-IN button on your island.
        </p>
      )}
    </motion.div>
  );
}

/* ---------- Goals ---------- */

function GoalsList({
  goals, onBump, onDelete, onAdd
}: {
  goals: { id: string; title: string; note: string; progress: number; color: string }[];
  onBump: (id: string, d: number) => void;
  onDelete: (id: string) => void;
  onAdd: (title: string, note: string, color: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="space-y-3 mt-1">
      {goals.map((g) => (
        <div key={g.id} className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-2xl text-ink leading-tight">{g.title}</h3>
              <p className="text-sm text-ink/55 italic">{g.note}</p>
            </div>
            <button onClick={() => onDelete(g.id)} className="text-ink/35 hover:text-coral" aria-label="Delete goal">
              <XIcon size={15} />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full bg-ink/10 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${g.progress}%`, background: g.color }} />
            </div>
            <span className="text-sm font-extrabold text-ink w-10 text-right">{g.progress}%</span>
            <button
              onClick={() => onBump(g.id, 10)}
              className="rounded-full px-3 py-1 text-xs font-extrabold bg-leaf text-white border-2 border-ink/60 shadow-pill"
            >
              +10%
            </button>
          </div>
        </div>
      ))}

      <div className="bg-white rounded-2xl shadow-card p-4">
        <h3 className="font-display text-xl text-ink">New goal</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Goal title"
          className="mt-2 w-full rounded-xl border border-ink/15 px-3 py-2 text-sm bg-[#FBF9F2] outline-none focus:border-ink/40"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Why it matters (optional)"
          className="mt-2 w-full rounded-xl border border-ink/15 px-3 py-2 text-sm bg-[#FBF9F2] outline-none focus:border-ink/40"
        />
        <button
          disabled={!title.trim()}
          onClick={() => {
            onAdd(title.trim(), note.trim() || "Long-term goal", TASK_COLORS[Math.floor(Math.random() * TASK_COLORS.length)]);
            setTitle("");
            setNote("");
          }}
          className="mt-3 rounded-full px-5 py-1.5 text-sm font-extrabold bg-ink text-white disabled:opacity-40"
        >
          Add goal
        </button>
      </div>
    </div>
  );
}

/* ---------- Add habit sheet ---------- */

const ICON_OPTIONS: { icon: MonkeyIcon; label: string }[] = [
  { icon: "gym", label: "Fitness" },
  { icon: "read", label: "Learning" },
  { icon: "drink", label: "Health" },
  { icon: "generic", label: "Other" }
];

function AddHabitSheet({
  onClose, onAdd
}: {
  onClose: () => void;
  onAdd: (h: Omit<Habit, "id" | "history">) => void;
}) {
  const [title, setTitle] = useState("");
  const [minTarget, setMinTarget] = useState("");
  const [identity, setIdentity] = useState("");
  const [reward, setReward] = useState(10);
  const [icon, setIcon] = useState<MonkeyIcon>("generic");
  const [color, setColor] = useState(TASK_COLORS[0]);

  return (
    <div className="absolute inset-0 z-50 bg-ink/40 flex items-end" onClick={onClose}>
      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="w-full bg-white rounded-t-3xl p-5 max-h-[85%] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl text-ink">New quest</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title — e.g. Morning stretch"
          className="mt-3 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-sm bg-[#FBF9F2] outline-none focus:border-ink/40"
        />
        <input
          value={minTarget}
          onChange={(e) => setMinTarget(e.target.value)}
          placeholder="Minimum target — e.g. 10 minutes"
          className="mt-2 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-sm bg-[#FBF9F2] outline-none focus:border-ink/40"
        />
        <input
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          placeholder="Identity — e.g. I'm an athlete"
          className="mt-2 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-sm bg-[#FBF9F2] outline-none focus:border-ink/40"
        />

        <div className="mt-3 text-sm font-extrabold text-ink/70">Banana reward: {reward}</div>
        <input
          type="range" min={5} max={25} step={5} value={reward}
          onChange={(e) => setReward(Number(e.target.value))}
          className="w-full accent-coral"
        />

        <div className="mt-2 text-sm font-extrabold text-ink/70">Illustration</div>
        <div className="flex gap-2 mt-1">
          {ICON_OPTIONS.map((o) => (
            <button
              key={o.icon}
              onClick={() => setIcon(o.icon)}
              className={`rounded-2xl p-1.5 border-2 ${icon === o.icon ? "border-ink bg-banana/30" : "border-ink/10 bg-white"}`}
              title={o.label}
            >
              <HabitMonkey icon={o.icon} size={44} />
            </button>
          ))}
        </div>

        <div className="mt-3 text-sm font-extrabold text-ink/70">Category color</div>
        <div className="flex gap-2 mt-1">
          {TASK_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 ${color === c ? "border-ink" : "border-transparent"}`}
              style={{ background: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-full py-2.5 text-sm font-extrabold bg-ink/10 text-ink/70">
            Cancel
          </button>
          <button
            disabled={!title.trim()}
            onClick={() => {
              onAdd({
                title: title.trim(),
                minTarget: minTarget.trim() || "Just show up",
                identity: identity.trim() || "I keep my promises to myself",
                bananaReward: reward,
                color,
                icon
              });
              onClose();
            }}
            className="flex-1 rounded-full py-2.5 text-sm font-extrabold bg-coral text-ink border-2 border-ink/70 shadow-pill disabled:opacity-40"
          >
            Add quest
          </button>
        </div>
      </motion.div>
    </div>
  );
}
