"use client";

import React from "react";
import { netWorth, ownedValue, resetAllData, useGame } from "@/lib/store";
import {
  HOUSING,
  MILLION_GOAL,
  RENT_GRACE_DAYS,
  RENT_PERIOD_DAYS,
  formatMoney,
  formatMoneyShort,
  housing
} from "@/lib/constants";
import { dateKey, daysBetween, formatDayShort } from "@/lib/date";
import { Bar, Btn, Chip, EmptyState, Panel, Sheet } from "./ui";

export default function HomeScreen({ onClose }: { onClose: () => void }) {
  const money = useGame((s) => s.money);
  const tier = useGame((s) => s.housingTier);
  const rentDue = useGame((s) => s.rentDue);
  const lateDays = useGame((s) => s.lateDays);
  const owned = useGame((s) => s.owned);
  const ledger = useGame((s) => s.ledger);
  const totalEarned = useGame((s) => s.totalEarned);
  const millionaire = useGame((s) => s.millionaire);
  const payRentNow = useGame((s) => s.payRentNow);
  const moveHouse = useGame((s) => s.moveHouse);

  const worth = useGame((s) => netWorth(s));
  const current = housing(tier);
  const next = HOUSING[tier + 1];
  const rentIn = daysBetween(dateKey(), rentDue);

  return (
    <Sheet title="Bydlení a majetek" subtitle={formatMoneyShort(worth)} onClose={onClose}>
      {/* ---- net worth ---- */}
      <Panel className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] text-dim">Čistý majetek</span>
          {millionaire && <Chip tone="gold">milionář</Chip>}
        </div>
        <p className="font-display text-2xl leading-tight text-gold">{formatMoney(worth)}</p>
        <div className="mt-2">
          <Bar value={worth} max={MILLION_GOAL} colour="#e0a53c" height={7} />
          <p className="mt-1 text-[11px] text-dim">
            {millionaire
              ? "Cíl milionu splněn. Zbývá vila u moře."
              : `${Math.floor((worth / MILLION_GOAL) * 100)} % k prvnímu milionu`}
          </p>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
          <Stat label="Hotovost" value={formatMoneyShort(money)} />
          <Stat label="Věci" value={formatMoneyShort(ownedValue(owned))} />
          <Stat label="Vyděláno" value={formatMoneyShort(totalEarned)} />
        </div>
      </Panel>

      {/* ---- rent ---- */}
      <Panel className={`mb-3 ${lateDays > 0 ? "border-danger/50" : ""}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text">{current.name}</span>
          {lateDays > 0 && <Chip tone="danger">po splatnosti</Chip>}
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-dim">{current.desc}</p>

        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-dim">
            Nájem <span className="text-text">{formatMoney(current.rent)}</span> každých{" "}
            {RENT_PERIOD_DAYS} dní
          </span>
          <span className={lateDays > 0 ? "text-danger" : rentIn <= 1 ? "text-warn" : "text-dim"}>
            {lateDays > 0
              ? `${lateDays}/${RENT_GRACE_DAYS} dní odkladu`
              : `splatný ${formatDayShort(rentDue)}`}
          </span>
        </div>

        <Btn
          variant={lateDays > 0 || rentIn <= 1 ? "primary" : "default"}
          onClick={payRentNow}
          disabled={money < current.rent}
          className="mt-2 w-full"
        >
          Zaplatit nájem {formatMoneyShort(current.rent)}
        </Btn>

        {lateDays > 0 && (
          <p className="mt-2 text-[11px] leading-snug text-danger">
            Zaplať do {RENT_GRACE_DAYS - lateDays + 1} dní, jinak tě vystěhují o úroveň níž a
            přijdeš o věci, které se do menšího nevejdou.
          </p>
        )}
      </Panel>

      {/* ---- moving up ---- */}
      <h3 className="mb-2 mt-4 font-display text-sm text-dim">Lepší bydlení</h3>
      {next ? (
        <Panel>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text">{next.name}</span>
            <Chip tone="dim">nájem {formatMoneyShort(next.rent)}</Chip>
          </div>
          <p className="mt-0.5 text-[11px] leading-snug text-dim">{next.desc}</p>
          <div className="mt-2">
            <Bar value={money} max={next.price} colour="#6fb1d9" height={6} />
            <p className="mt-1 text-[11px] text-dim">
              {money >= next.price
                ? "Máš na to."
                : `Chybí ${formatMoney(next.price - money)}`}
            </p>
          </div>
          <Btn
            variant="primary"
            onClick={moveHouse}
            disabled={money < next.price}
            className="mt-2 w-full"
          >
            Přestěhovat se za {formatMoneyShort(next.price)}
          </Btn>
        </Panel>
      ) : (
        <EmptyState>Bydlíš na maximu. Vila u moře je tvoje.</EmptyState>
      )}

      {/* ---- all tiers ---- */}
      <div className="mt-3 space-y-1">
        {HOUSING.map((h, i) => (
          <div
            key={h.id}
            className={`flex items-center gap-2 rounded border px-2 py-1.5 text-[11px] ${
              i === tier
                ? "border-gold/50 bg-panel2 text-text"
                : i < tier
                  ? "border-line text-dim"
                  : "border-line/50 text-dim/60"
            }`}
          >
            <span className="w-4 text-center">{i < tier ? "✓" : i === tier ? "▸" : ""}</span>
            <span className="min-w-0 flex-1 truncate">{h.name}</span>
            <span>{h.price === 0 ? "—" : formatMoneyShort(h.price)}</span>
          </div>
        ))}
      </div>

      {/* ---- ledger ---- */}
      <h3 className="mb-2 mt-6 font-display text-sm text-dim">Poslední pohyby</h3>
      {ledger.length === 0 ? (
        <EmptyState>Zatím žádné pohyby.</EmptyState>
      ) : (
        <div className="space-y-1">
          {ledger.slice(0, 20).map((e, i) => (
            <div
              key={`${e.ts}-${i}`}
              className="flex items-center gap-2 rounded border border-line/60 px-2 py-1.5 text-[11px]"
            >
              <span className="min-w-0 flex-1 truncate text-dim">{e.reason}</span>
              <span className={e.delta >= 0 ? "text-green" : "text-danger"}>
                {e.delta >= 0 ? "+" : "−"}
                {formatMoneyShort(Math.abs(e.delta))}
              </span>
            </div>
          ))}
        </div>
      )}

      <Btn
        variant="ghost"
        onClick={() => {
          if (confirm("Smazat veškerý postup a začít znovu od nuly?")) resetAllData();
        }}
        className="mt-6 w-full !text-[11px]"
      >
        Začít znovu od nuly
      </Btn>
    </Sheet>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line/60 px-2 py-1.5">
      <div className="text-dim">{label}</div>
      <div className="text-text">{value}</div>
    </div>
  );
}
