"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useJungle } from "@/lib/store";
import { SHOP_ITEMS, CATEGORY_UNLOCKS, categoryUnlockLevel } from "@/lib/constants";
import { ShopCategory } from "@/lib/types";
import { SpritePreview } from "./art/Decorations";
import { BananaIcon, XIcon } from "./ui";

export default function ShopModal({ onClose }: { onClose: () => void }) {
  const { level, bananaBalance, inventory, buyItem } = useJungle();
  const [cat, setCat] = useState<"All" | ShopCategory>("All");
  const [variantPick, setVariantPick] = useState<Record<string, number>>({});

  const items = useMemo(
    () => SHOP_ITEMS.filter((i) => cat === "All" || i.category === cat),
    [cat]
  );

  return (
    <div className="absolute inset-0 z-40 bg-ink/45 flex items-end" onClick={onClose}>
      <motion.div
        initial={{ y: 480 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full bg-[#F6F2E7] rounded-t-3xl max-h-[88%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-2">
          <div className="mx-auto w-10 h-1.5 rounded-full bg-ink/15 mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl text-ink">Island shop</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 text-sm font-extrabold shadow-card">
                <BananaIcon size={15} /> {bananaBalance.toLocaleString()}
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-navy text-white grid place-items-center shadow-card"
                aria-label="Close shop"
              >
                <XIcon />
              </button>
            </div>
          </div>

          {/* category pills */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 thin-scroll">
            <CatPill label="All" active={cat === "All"} onClick={() => setCat("All")} />
            {CATEGORY_UNLOCKS.map((c) => {
              const locked = level < c.unlock;
              const isNew = level === c.unlock;
              return (
                <CatPill
                  key={c.name}
                  label={c.name}
                  active={cat === c.name}
                  locked={locked}
                  lockLevel={c.unlock}
                  isNew={isNew}
                  onClick={() => !locked && setCat(c.name)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll px-5 pb-8">
          <div className="grid grid-cols-2 gap-3 mt-1">
            {items.map((item) => {
              const unlockLv = categoryUnlockLevel(item.category);
              const locked = level < unlockLv;
              const owned = inventory[item.id] || 0;
              const v = variantPick[item.id] || 0;
              const affordable = bananaBalance >= item.price;
              return (
                <div key={item.id} className={`bg-white rounded-2xl shadow-card p-3 relative ${locked ? "opacity-60" : ""}`}>
                  {owned > 0 && (
                    <span className="absolute top-2 right-2 text-[10px] font-extrabold bg-leaf text-white rounded-full px-2 py-0.5">
                      ×{owned} owned
                    </span>
                  )}
                  <div className="flex justify-center">
                    <SpritePreview itemId={item.id} variant={v} size={76} />
                  </div>
                  <div className="font-display text-lg text-ink leading-tight text-center">{item.name}</div>

                  {item.variants > 1 ? (
                    <div className="flex justify-center gap-1 mt-1">
                      {Array.from({ length: item.variants }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setVariantPick((p) => ({ ...p, [item.id]: i }))}
                          className={`w-5 h-5 rounded-full text-[10px] font-extrabold border-2 ${
                            v === i ? "bg-ink text-white border-ink" : "bg-white text-ink/50 border-ink/20"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-5 mt-1 text-center text-[10px] font-bold text-ink/35">1 style</div>
                  )}

                  {locked ? (
                    <div className="mt-2 rounded-full py-1.5 text-center text-xs font-extrabold bg-ink/10 text-ink/50">
                      🔒 Level {unlockLv}
                    </div>
                  ) : (
                    <button
                      onClick={() => buyItem(item.id)}
                      disabled={!affordable}
                      className={`mt-2 w-full rounded-full py-1.5 text-sm font-extrabold border-2 border-ink/70 shadow-pill flex items-center justify-center gap-1 ${
                        affordable ? "bg-banana text-ink hover:brightness-105" : "bg-ink/10 text-ink/40 border-ink/20 shadow-none"
                      }`}
                    >
                      <BananaIcon size={14} /> {item.price}
                    </button>
                  )}
                  {item.water && (
                    <div className="text-[10px] text-center font-bold text-ocean-deep mt-1">Places on water</div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-ink/40 text-center mt-4">
            Decorations are cosmetic — buy them, then tap the pencil on your island to place them.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function CatPill({
  label, active, locked, lockLevel, isNew, onClick
}: {
  label: string;
  active: boolean;
  locked?: boolean;
  lockLevel?: number;
  isNew?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-extrabold border transition-colors ${
        active
          ? "bg-ink text-white border-ink"
          : locked
            ? "bg-white text-ink/35 border-ink/10"
            : "bg-white text-ink/70 border-ink/15 hover:border-ink/40"
      }`}
    >
      {locked ? `🔒 ${label} · Lvl ${lockLevel}` : label}
      {isNew && !locked && (
        <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black bg-coral text-white rounded-full px-1.5 py-0.5">
          NEW
        </span>
      )}
    </button>
  );
}
