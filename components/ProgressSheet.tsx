"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useJungle } from "@/lib/store";
import { dateKey, msToMidnight, fmtCountdown } from "@/lib/date";
import { TASK_COLORS } from "@/lib/constants";
import { BananaIcon, ClockIcon, XIcon } from "./ui";

export default function ProgressSheet({ onClose }: { onClose: () => void }) {
  const {
    habits, tasks, challenge, focusMinutesToday, bananasToday,
    completeChallenge, rerollChallenge, skipChallenge,
    addTask, toggleTask, deleteTask
  } = useJungle();

  const today = dateKey();
  const doneHabits = habits.filter((h) => h.history[today] === "done").length;

  const [countdown, setCountdown] = useState(msToMidnight());
  useEffect(() => {
    const t = setInterval(() => setCountdown(msToMidnight()), 1000);
    return () => clearInterval(t);
  }, []);

  const [newTask, setNewTask] = useState("");
  const [newColor, setNewColor] = useState(TASK_COLORS[0]);

  return (
    <div className="absolute inset-0 z-40 bg-ink/40 flex items-end" onClick={onClose}>
      <motion.div
        initial={{ y: 420 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full bg-[#F6F2E7] rounded-t-3xl max-h-[88%] overflow-y-auto thin-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#F6F2E7] px-5 pt-4 pb-2 z-10">
          <div className="mx-auto w-10 h-1.5 rounded-full bg-ink/15 mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl text-ink">Today&apos;s progress</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-navy text-white grid place-items-center shadow-card"
              aria-label="Close"
            >
              <XIcon />
            </button>
          </div>
        </div>

        <div className="px-5 pb-8">
          {/* summary row */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-white rounded-2xl shadow-card p-3 text-center">
              <div className="text-2xl font-extrabold text-ink">
                {doneHabits}<span className="text-ink/40 text-base">/{habits.length}</span>
              </div>
              <div className="text-[11px] font-bold text-ink/55 mt-0.5">habits done</div>
            </div>
            <div className="bg-white rounded-2xl shadow-card p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-ink">
                <ClockIcon size={18} className="text-ink/70" />
                {focusMinutesToday}
              </div>
              <div className="text-[11px] font-bold text-ink/55 mt-0.5">min focused</div>
            </div>
            <div className="bg-white rounded-2xl shadow-card p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-ink">
                <BananaIcon size={18} />
                {bananasToday}
              </div>
              <div className="text-[11px] font-bold text-ink/55 mt-0.5">bananas today</div>
            </div>
          </div>

          {/* daily challenge */}
          <div className="mt-4 bg-navy rounded-3xl shadow-card p-4 text-white relative">
            {challenge.state === "pending" && (
              <button
                onClick={skipChallenge}
                className="absolute top-3 right-3 text-white/50 hover:text-white"
                aria-label="Dismiss challenge"
              >
                <XIcon size={15} />
              </button>
            )}
            <div className="flex items-center justify-between pr-7">
              <span className="text-xs font-extrabold uppercase tracking-wider text-white/55">
                Daily challenge
              </span>
              <span className="text-xs font-bold text-white/70 tabular-nums">
                {fmtCountdown(countdown)} left
              </span>
            </div>
            <h3 className="font-display text-xl leading-snug mt-2">{challenge.title}</h3>
            <p className="text-sm text-white/65 mt-1">{challenge.description}</p>
            <div className="flex items-center gap-1.5 mt-2 text-sm font-extrabold">
              <BananaIcon size={15} /> +{challenge.reward} reward
            </div>

            {challenge.state === "pending" ? (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={rerollChallenge}
                  className="rounded-full px-4 py-2 text-sm font-extrabold bg-white/10 hover:bg-white/20"
                >
                  Change
                </button>
                <button
                  onClick={completeChallenge}
                  className="flex-1 rounded-full py-2 text-sm font-extrabold bg-leaf text-white border-2 border-ink/60 shadow-pill hover:brightness-110"
                >
                  Mark Complete
                </button>
              </div>
            ) : (
              <div className="mt-3 rounded-full py-2 text-center text-sm font-extrabold bg-white/10 text-white/70">
                {challenge.state === "completed" ? "Completed! 🎉 New one at midnight." : "Skipped — new one at midnight."}
              </div>
            )}
          </div>

          {/* tasks */}
          <h3 className="font-display text-2xl text-ink mt-5">Tasks</h3>
          <div className="mt-2 space-y-2">
            {tasks.length === 0 && (
              <div className="bg-white rounded-2xl shadow-card p-4 text-sm text-ink/55 text-center">
                No one-off tasks. Add one below.
              </div>
            )}
            {tasks.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.color }} />
                <button
                  onClick={() => toggleTask(t.id)}
                  className={`w-6 h-6 rounded-md border-2 shrink-0 grid place-items-center text-white text-sm font-black ${
                    t.done ? "bg-leaf border-leaf" : "border-ink/25 bg-white"
                  }`}
                  aria-label={t.done ? "Mark not done" : "Mark done"}
                >
                  {t.done ? "✓" : ""}
                </button>
                <span className={`flex-1 text-sm font-bold ${t.done ? "line-through text-ink/35" : "text-ink"}`}>
                  {t.title}
                </span>
                <button onClick={() => deleteTask(t.id)} className="text-ink/30 hover:text-coral" aria-label="Delete task">
                  <XIcon size={14} />
                </button>
              </div>
            ))}

            {/* add task */}
            <div className="bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1 shrink-0">
                {TASK_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`w-4 h-4 rounded-full border-2 ${newColor === c ? "border-ink" : "border-transparent"}`}
                    style={{ background: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTask.trim()) {
                    addTask(newTask, newColor);
                    setNewTask("");
                  }
                }}
                placeholder="+ Add task"
                className="flex-1 text-sm font-bold outline-none bg-transparent placeholder:text-ink/35"
              />
              <button
                disabled={!newTask.trim()}
                onClick={() => {
                  addTask(newTask, newColor);
                  setNewTask("");
                }}
                className="rounded-full px-3.5 py-1 text-xs font-extrabold bg-ink text-white disabled:opacity-30"
              >
                Add
              </button>
            </div>
          </div>

          <p className="text-xs text-ink/40 text-center mt-4">
            Finishing tasks earns 2 bananas each. Challenges finished before 6pm get a bonus.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
