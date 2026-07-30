"use client";

import React from "react";
import { useGame, netWorth } from "@/lib/store";
import {
  ENERGY_MAX,
  RENT_GRACE_DAYS,
  energyLabel,
  formatMoney,
  formatMoneyShort,
  housing,
  xpToNext
} from "@/lib/constants";
import { dateKey, daysBetween } from "@/lib/date";
import { Bar, Bolt, Coin, Food, MoonSun } from "./ui";

export default function TopBar() {
  const money = useGame((s) => s.money);
  const level = useGame((s) => s.level);
  const xp = useGame((s) => s.xp);
  const energy = useGame((s) => s.energy);
  const food = useGame((s) => s.food);
  const tier = useGame((s) => s.housingTier);
  const rentDue = useGame((s) => s.rentDue);
  const lateDays = useGame((s) => s.lateDays);
  const night = useGame((s) => s.night);
  const setNight = useGame((s) => s.setNight);
  const worth = useGame((s) => netWorth(s));

  const rentIn = daysBetween(dateKey(), rentDue);
  const rent = housing(tier).rent;

  const rentTone =
    lateDays > 0 ? "text-danger" : rentIn <= 1 ? "text-warn" : "text-dim";
  const rentText =
    lateDays > 0
      ? `OVERDUE ${lateDays}/${RENT_GRACE_DAYS}`
      : rentIn <= 0
        ? "rent due today"
        : `rent in ${rentIn}d`;

  return (
    <div className="border-b border-line bg-panel px-3 py-2">
      <div className="flex items-center gap-2">
        <Coin size={16} />
        <span className="font-display text-xl leading-none text-gold">{formatMoney(money)}</span>

        <button
          onClick={() => setNight(!night)}
          aria-label={night ? "Switch to day" : "Switch to night"}
          className="ml-auto grid h-7 w-7 place-items-center rounded border border-line text-dim active:scale-95"
        >
          <MoonSun night={night} />
        </button>
      </div>

      <div className="mt-1 flex items-center gap-2 text-[11px] text-dim">
        <span>
          Net worth <span className="text-text">{formatMoneyShort(worth)}</span>
        </span>
        <span className="text-line">•</span>
        <span className="truncate">{housing(tier).name}</span>
        <span className={`ml-auto shrink-0 font-medium ${rentTone}`}>
          {rentText} · {formatMoneyShort(rent)}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-3">
        {/* career level */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="shrink-0 rounded border border-blue/40 px-1 py-0.5 text-[10px] text-blue">
            LVL {level}
          </span>
          <div className="min-w-0 flex-1">
            <Bar value={xp} max={xpToNext(level)} colour="#6fb1d9" height={5} />
          </div>
        </div>

        {/* energy */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <Bolt />
          <div className="min-w-0 flex-1">
            <Bar
              value={energy}
              max={ENERGY_MAX}
              colour={energy >= 55 ? "#6aa84f" : energy >= 30 ? "#d9822b" : "#c8524f"}
              height={5}
            />
          </div>
        </div>

        {/* food stock */}
        <div
          className={`flex shrink-0 items-center gap-1 text-[11px] ${
            food <= 0 ? "text-danger" : food <= 2 ? "text-warn" : "text-dim"
          }`}
          title="Days of food left"
        >
          <Food />
          {food}d
        </div>
      </div>

      <div className="mt-1 text-[10px] uppercase tracking-wide text-dim">
        {energyLabel(energy)}
      </div>
    </div>
  );
}
