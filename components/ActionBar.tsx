"use client";

import React from "react";
import { motion } from "framer-motion";
import { useJungle } from "@/lib/store";
import { dateKey } from "@/lib/date";
import { PencilIcon, CartIcon, ChevronIcon } from "./ui";
import { MonkeyFace } from "./art/Monkeys";

interface Props {
  onFocus: () => void;
  onEdit: () => void;
  onShop: () => void;
  onProgress: () => void;
  editMode: boolean;
}

export default function ActionBar({ onFocus, onEdit, onShop, onProgress, editMode }: Props) {
  const checkIn = useJungle((s) => s.checkIn);
  const lastCheckInDate = useJungle((s) => s.lastCheckInDate);
  const checkedIn = lastCheckInDate === dateKey();

  return (
    <div className="absolute bottom-0 inset-x-0 z-30 p-4 pb-5 pointer-events-none">
      {/* pull-up handle for Today's Progress */}
      <div className="flex justify-center mb-2">
        <button
          onClick={onProgress}
          className="pointer-events-auto flex items-center gap-1 bg-navy/85 text-white/90 text-xs font-bold rounded-full px-4 py-1.5 shadow-card hover:bg-navy"
        >
          <ChevronIcon dir="up" size={13} /> Today&apos;s progress
        </button>
      </div>

      <div className="flex items-end justify-between gap-3 max-w-md mx-auto">
        <button
          onClick={onEdit}
          className={`pointer-events-auto w-12 h-12 rounded-full grid place-items-center shadow-card border-2 border-ink/70 transition-colors ${
            editMode ? "bg-banana text-ink" : "bg-white/95 text-ink hover:bg-white"
          }`}
          title="Rearrange decorations"
        >
          <PencilIcon />
        </button>

        <div className="flex flex-col items-center gap-2 flex-1">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={checkIn}
            className={`pointer-events-auto w-full max-w-[220px] rounded-full py-2.5 px-6 font-display text-xl tracking-wide border-2 border-ink/80 shadow-pill flex items-center justify-center gap-2 ${
              checkedIn
                ? "bg-coral/50 text-ink/60"
                : "bg-coral text-ink hover:bg-coral-dark"
            }`}
          >
            <MonkeyFace size={22} />
            {checkedIn ? "CHECKED-IN ✓" : "CHECK-IN"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onFocus}
            className="pointer-events-auto w-full max-w-[160px] rounded-full py-1.5 px-6 font-display text-lg bg-sky-pill text-ink border-2 border-ink/80 shadow-pill hover:brightness-105"
          >
            FOCUS
          </motion.button>
        </div>

        <button
          onClick={onShop}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/95 text-ink grid place-items-center shadow-card border-2 border-ink/70 hover:bg-white"
          title="Open shop"
        >
          <CartIcon />
        </button>
      </div>
    </div>
  );
}
