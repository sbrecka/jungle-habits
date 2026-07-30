"use client";

import React, { useState } from "react";
import { gearMult, useGame } from "@/lib/store";
import { ShopCategory } from "@/lib/types";
import {
  CATEGORY_LABEL,
  SHOP_ITEMS,
  formatMoney,
  formatMoneyShort,
  housing
} from "@/lib/constants";
import { Btn, Chip, Coin, Food, Panel, Sheet } from "./ui";

const CATS: ShopCategory[] = ["food", "gear", "furniture", "vehicle"];

export default function ShopScreen({ onClose }: { onClose: () => void }) {
  const money = useGame((s) => s.money);
  const food = useGame((s) => s.food);
  const owned = useGame((s) => s.owned);
  const tier = useGame((s) => s.housingTier);
  const buy = useGame((s) => s.buy);

  const [cat, setCat] = useState<ShopCategory>(food <= 1 ? "food" : "gear");

  const items = SHOP_ITEMS.filter((i) => i.category === cat);

  return (
    <Sheet title="Shop" subtitle={formatMoney(money)} onClose={onClose}>
      {/* stock + multiplier summary */}
      <div className="mb-3 flex gap-2">
        <Panel className="flex-1 !p-2">
          <div className="flex items-center gap-1.5 text-[11px] text-dim">
            <Food />
            Food in stock
          </div>
          <p
            className={`mt-0.5 font-display text-lg leading-none ${
              food <= 0 ? "text-danger" : food <= 2 ? "text-warn" : "text-text"
            }`}
          >
            {food} days
          </p>
        </Panel>
        <Panel className="flex-1 !p-2">
          <div className="text-[11px] text-dim">Gear bonus</div>
          <p className="mt-0.5 font-display text-lg leading-none text-gold">
            × {gearMult(owned).toFixed(2)}
          </p>
        </Panel>
      </div>

      {/* categories */}
      <div className="mb-3 grid grid-cols-4 gap-1">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded border px-1 py-1.5 text-[11px] transition ${
              cat === c ? "border-gold bg-panel2 text-text" : "border-line text-dim"
            }`}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const isOwned = item.category !== "food" && !!owned[item.id];
          const locked = (item.minHousing ?? 0) > tier;
          const tooPoor = money < item.price;

          return (
            <div
              key={item.id}
              className={`rounded border p-2 ${
                isOwned ? "border-green/30 bg-panel/50" : "border-line bg-panel"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm text-text">{item.name}</span>
                    {isOwned && <Chip tone="green">owned</Chip>}
                    {locked && (
                      <Chip tone="danger">
                        needs: {housing(item.minHousing ?? 0).name}
                      </Chip>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-dim">{item.desc}</p>
                  {item.foodDays && (
                    <p className="mt-0.5 text-[10px] text-dim">
                      {Math.round(item.price / item.foodDays)} Kč / day
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-1 text-sm text-gold">
                    <Coin size={12} />
                    {formatMoneyShort(item.price)}
                  </div>
                  <Btn
                    variant={isOwned || locked || tooPoor ? "ghost" : "primary"}
                    disabled={isOwned || locked || tooPoor}
                    onClick={() => buy(item.id)}
                    className="mt-1 !px-2 !py-1 !text-[11px]"
                  >
                    {isOwned ? "owned" : locked ? "locked" : tooPoor ? "can't afford" : "Buy"}
                  </Btn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cat === "vehicle" && (
        <p className="mt-3 text-center text-[11px] text-dim">
          Transport counts toward your net worth. A garage to show it off is still to come.
        </p>
      )}
    </Sheet>
  );
}
