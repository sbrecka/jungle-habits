"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useJungle } from "@/lib/store";
import { fmtTimer } from "@/lib/date";
import { LockedInMonkey } from "./art/Monkeys";
import { BananaIcon, XIcon } from "./ui";

const DURATIONS = [5, 15, 25, 45];

export function FocusSetup({ onClose }: { onClose: () => void }) {
  const startFocus = useJungle((s) => s.startFocus);
  const [minutes, setMinutes] = useState(15);

  return (
    <div className="absolute inset-0 z-40 bg-ink/45 flex items-end" onClick={onClose}>
      <motion.div
        initial={{ y: 260 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="w-full bg-[#F6F2E7] rounded-t-3xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-ink">Focus session</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-navy text-white grid place-items-center" aria-label="Close">
            <XIcon />
          </button>
        </div>
        <p className="text-sm text-ink/60 mt-1">
          Lock in with Monke. Finish the whole session to earn <b>1 banana per minute</b>.
        </p>
        <div className="flex gap-2 mt-4">
          {DURATIONS.map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              className={`flex-1 rounded-2xl py-3 font-display text-xl border-2 ${
                minutes === m ? "bg-sky-pill border-ink text-ink" : "bg-white border-ink/15 text-ink/60"
              }`}
            >
              {m}m
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            startFocus(minutes);
            onClose();
          }}
          className="mt-5 w-full rounded-full py-3 font-display text-2xl bg-sky-pill text-ink border-2 border-ink/80 shadow-pill hover:brightness-105"
        >
          START FOCUS
        </button>
      </motion.div>
    </div>
  );
}

export function FocusOverlay() {
  const focus = useJungle((s) => s.focus);
  const finishFocus = useJungle((s) => s.finishFocus);
  const [remaining, setRemaining] = useState(() => (focus ? focus.endsAt - Date.now() : 0));
  const [confirming, setConfirming] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    if (!focus) return;
    finished.current = false;
    const t = setInterval(() => {
      const ms = focus.endsAt - Date.now();
      setRemaining(ms);
      if (ms <= 0 && !finished.current) {
        finished.current = true;
        finishFocus(true);
      }
    }, 250);
    return () => clearInterval(t);
  }, [focus, finishFocus]);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 2500);
    return () => clearTimeout(t);
  }, [confirming]);

  if (!focus) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 bg-navy-deep/95 flex flex-col items-center justify-center px-6 text-center"
    >
      <LockedInMonkey />
      <h2 className="font-display text-3xl text-white mt-2">Monke is locked in.</h2>
      <p className="text-sm text-white/55 mt-1">
        Stay here until the timer ends to earn your bananas.
      </p>

      <div className="font-display text-7xl text-white tabular-nums mt-6 tracking-wider">
        {fmtTimer(remaining)}
      </div>
      <div className="flex items-center gap-1.5 text-white/70 text-sm font-bold mt-2">
        <BananaIcon size={15} /> +{focus.minutes} on completion
      </div>

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          if (!confirming) setConfirming(true);
          else finishFocus(false);
        }}
        className={`mt-10 rounded-full px-10 py-3 font-display text-2xl border-2 border-ink/80 shadow-pill ${
          confirming ? "bg-coral-dark text-white" : "bg-coral text-ink"
        }`}
      >
        {confirming ? "TAP AGAIN TO GIVE UP" : "STOP"}
      </motion.button>
      {confirming && (
        <p className="text-xs text-white/50 mt-2">Ending early forfeits the banana reward.</p>
      )}
    </motion.div>
  );
}
