"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useJungle, resetAllData } from "@/lib/store";
import { xpToNext } from "@/lib/constants";
import { BananaIcon, FlameIcon, GearIcon, SoundIcon, MoonSunIcon, ChevronIcon } from "./ui";
import { MonkeyFace } from "./art/Monkeys";

export default function TopBar({ onOpenQuests }: { onOpenQuests: () => void }) {
  const { level, currentXP, streak, bananaBalance, ledger, sound, night, setSound, setNight } =
    useJungle();
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pct = Math.min(100, Math.round((currentXP / xpToNext(level)) * 100));

  return (
    <div className="absolute top-0 inset-x-0 z-30 p-3 pointer-events-none">
      <div className="flex items-start justify-between gap-2">
        {/* stat cluster */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-navy/90 backdrop-blur rounded-2xl px-3 py-2 text-white shadow-card">
          <div className="flex items-center gap-1.5 pr-2 border-r border-white/15">
            <MonkeyFace size={20} />
            <div>
              <div className="text-xs font-extrabold leading-none">Lvl {level}</div>
              <div className="mt-1 h-1.5 w-12 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-leaf-light transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 border-r border-white/15">
            <FlameIcon size={16} lit={streak > 0} />
            <span className="text-sm font-extrabold">{streak}</span>
          </div>
          <button
            className="flex items-center gap-1 pl-1 pr-0.5 hover:opacity-80"
            onClick={() => setLedgerOpen((v) => !v)}
            aria-expanded={ledgerOpen}
          >
            <BananaIcon size={16} />
            <span className="text-sm font-extrabold tabular-nums">
              {bananaBalance.toLocaleString()}
            </span>
            <ChevronIcon dir={ledgerOpen ? "up" : "down"} size={13} />
          </button>
        </div>

        {/* right controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-full bg-navy/90 text-white grid place-items-center shadow-card hover:bg-navy"
            onClick={() => setNight(!night)}
            title="Toggle day / night"
          >
            <MoonSunIcon night={night} />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-navy/90 text-white grid place-items-center shadow-card hover:bg-navy"
            onClick={() => setSound(!sound)}
            title={sound ? "Mute" : "Unmute"}
          >
            <SoundIcon on={sound} />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-navy/90 text-white grid place-items-center shadow-card hover:bg-navy"
            onClick={() => setSettingsOpen((v) => !v)}
            title="Settings"
          >
            <GearIcon />
          </button>
        </div>
      </div>

      {/* Add tasks pill */}
      <div className="flex justify-center mt-2">
        <button
          onClick={onOpenQuests}
          className="pointer-events-auto bg-navy/90 text-white text-sm font-bold rounded-full px-4 py-1.5 shadow-card hover:bg-navy flex items-center gap-1.5"
        >
          <span className="text-base leading-none">☰</span> Add tasks
        </button>
      </div>

      {/* banana ledger dropdown */}
      <AnimatePresence>
        {ledgerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="pointer-events-auto absolute left-3 top-16 w-64 bg-navy text-white rounded-2xl shadow-card p-3 z-40"
          >
            <div className="text-xs font-extrabold uppercase tracking-wide text-white/60 mb-2">
              Banana ledger
            </div>
            <div className="max-h-52 overflow-y-auto thin-scroll space-y-1.5">
              {ledger.length === 0 && (
                <div className="text-sm text-white/60">Complete a habit to earn your first bananas.</div>
              )}
              {ledger.map((e, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="truncate pr-2 text-white/85">{e.reason}</span>
                  <span
                    className={`font-extrabold tabular-nums ${e.delta >= 0 ? "text-leaf-light" : "text-coral"}`}
                  >
                    {e.delta >= 0 ? "+" : ""}
                    {e.delta}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* settings popover */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="pointer-events-auto absolute right-3 top-16 w-60 bg-navy text-white rounded-2xl shadow-card p-3 z-40"
          >
            <div className="text-xs font-extrabold uppercase tracking-wide text-white/60 mb-2">
              Settings
            </div>
            <label className="flex items-center justify-between py-1.5 text-sm">
              Sound effects
              <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} className="accent-coral w-4 h-4" />
            </label>
            <label className="flex items-center justify-between py-1.5 text-sm">
              Night theme
              <input type="checkbox" checked={night} onChange={(e) => setNight(e.target.checked)} className="accent-coral w-4 h-4" />
            </label>
            <button
              onClick={() => {
                if (confirm("Reset all progress and restore the demo data?")) resetAllData();
              }}
              className="mt-2 w-full text-sm font-bold text-coral bg-white/5 hover:bg-white/10 rounded-xl py-2"
            >
              Reset all data
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
