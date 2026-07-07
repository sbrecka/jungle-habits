"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useJungle } from "@/lib/store";
import { SHOP_ITEMS, CATEGORY_UNLOCKS, shopItem } from "@/lib/constants";
import { SpritePreview } from "./art/Decorations";
import { BananaIcon } from "./ui";

/* ---------- Edit-mode inventory tray ---------- */

export function EditTray({
  selectedItemId, selectedVariant, onSelect, onDone
}: {
  selectedItemId: string | null;
  selectedVariant: number;
  onSelect: (itemId: string | null, variant: number) => void;
  onDone: () => void;
}) {
  const inventory = useJungle((s) => s.inventory);
  const owned = SHOP_ITEMS.filter((i) => (inventory[i.id] || 0) > 0);
  const sel = selectedItemId ? shopItem(selectedItemId) : null;

  return (
    <motion.div
      initial={{ y: 160 }}
      animate={{ y: 0 }}
      exit={{ y: 160 }}
      className="absolute bottom-0 inset-x-0 z-40 bg-navy/95 backdrop-blur rounded-t-3xl p-4 text-white"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-xl">Rearrange island</div>
          <div className="text-xs text-white/55">
            {selectedItemId
              ? "Tap a highlighted tile to place. Tap a decoration to store it."
              : "Pick an item below, or tap a decoration to store it."}
          </div>
        </div>
        <button
          onClick={onDone}
          className="rounded-full px-5 py-2 text-sm font-extrabold bg-leaf text-white border-2 border-ink/60 shadow-pill"
        >
          Done
        </button>
      </div>

      <div className="flex gap-2 mt-3 overflow-x-auto thin-scroll pb-1">
        {owned.length === 0 && (
          <div className="text-sm text-white/55 py-3">
            Nothing in storage — buy decorations in the shop (cart button).
          </div>
        )}
        {owned.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              onSelect(selectedItemId === item.id ? null : item.id, 0)
            }
            className={`shrink-0 rounded-2xl p-1.5 bg-white/5 border-2 ${
              selectedItemId === item.id ? "border-banana bg-white/15" : "border-white/10"
            }`}
          >
            <SpritePreview itemId={item.id} variant={selectedItemId === item.id ? selectedVariant : 0} size={54} />
            <div className="text-[10px] font-extrabold text-white/80">×{inventory[item.id]}</div>
          </button>
        ))}
      </div>

      {sel && sel.variants > 1 && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs font-bold text-white/60">Style:</span>
          {Array.from({ length: sel.variants }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSelect(sel.id, i)}
              className={`w-6 h-6 rounded-full text-[11px] font-extrabold border-2 ${
                selectedVariant === i ? "bg-banana text-ink border-banana" : "bg-white/10 text-white/70 border-white/20"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ---------- Toast ---------- */

export function Toast() {
  const toast = useJungle((s) => s.toast);
  const setToast = useJungle((s) => s.setToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast, setToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="absolute bottom-28 inset-x-0 z-[60] flex justify-center px-6 pointer-events-none"
        >
          <div className="bg-ink text-white text-sm font-bold rounded-full px-5 py-2.5 shadow-card max-w-sm text-center">
            {toast}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Level-up celebration ---------- */

export function Celebration() {
  const celebrationLevel = useJungle((s) => s.celebrationLevel);
  const dismissCelebration = useJungle((s) => s.dismissCelebration);

  const unlocked = celebrationLevel
    ? CATEGORY_UNLOCKS.find((c) => c.unlock === celebrationLevel)
    : null;

  return (
    <AnimatePresence>
      {celebrationLevel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[70] bg-ink/55 flex items-center justify-center px-6"
          onClick={dismissCelebration}
        >
          {/* banana confetti */}
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${6 + (i * 89) % 90}%` }}
              initial={{ y: "-12vh", rotate: 0, opacity: 1 }}
              animate={{ y: "110vh", rotate: 340 + i * 25 }}
              transition={{ duration: 2.4 + (i % 5) * 0.35, ease: "easeIn", repeat: Infinity, delay: (i % 7) * 0.22 }}
            >
              <BananaIcon size={i % 3 === 0 ? 30 : 20} />
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0.6, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 14, stiffness: 220 }}
            className="bg-[#F6F2E7] rounded-3xl shadow-card p-6 text-center max-w-xs w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-display text-5xl text-ink">Level {celebrationLevel}!</div>
            <p className="text-sm text-ink/65 mt-2">
              Your island grew — more tiles to decorate.
            </p>
            {unlocked && (
              <div className="mt-3 bg-banana/30 border-2 border-banana rounded-2xl px-3 py-2 text-sm font-extrabold text-ink">
                🎁 New shop category unlocked: {unlocked.name}
              </div>
            )}
            <button
              onClick={dismissCelebration}
              className="mt-4 w-full rounded-full py-2.5 font-display text-xl bg-coral text-ink border-2 border-ink/80 shadow-pill"
            >
              WOOHOO!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
