"use client";

import React, { useState } from "react";
import { taskPayout, useGame } from "@/lib/store";
import { TaskSize } from "@/lib/types";
import {
  CONTRACT_TIERS,
  SIZE_COLOR,
  SIZE_LABEL,
  careerMult,
  energyMult,
  formatMoney,
  formatMoneyShort
} from "@/lib/constants";
import { dateKey, daysBetween } from "@/lib/date";
import { Bar, Btn, Check, Chip, EmptyState, Panel, Plus, Sheet, X } from "./ui";

const SIZES: TaskSize[] = ["small", "medium", "large"];

export default function WorkScreen({ onClose }: { onClose: () => void }) {
  const tasks = useGame((s) => s.tasks);
  const level = useGame((s) => s.level);
  const owned = useGame((s) => s.owned);
  const energy = useGame((s) => s.energy);
  const reputation = useGame((s) => s.reputation);
  const contract = useGame((s) => s.contract);
  const offers = useGame((s) => s.offers);

  const addTask = useGame((s) => s.addTask);
  const toggleTask = useGame((s) => s.toggleTask);
  const deleteTask = useGame((s) => s.deleteTask);
  const acceptOffer = useGame((s) => s.acceptOffer);
  const rerollOffers = useGame((s) => s.rerollOffers);
  const abandonContract = useGame((s) => s.abandonContract);

  const [title, setTitle] = useState("");
  const [size, setSize] = useState<TaskSize>("medium");

  const pay = (s: TaskSize) => taskPayout({ level, owned, energy }, s);

  const submit = () => {
    if (!title.trim()) return;
    addTask(title, size);
    setTitle("");
  };

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const earnedToday = done.reduce((sum, t) => sum + pay(t.size), 0);

  return (
    <Sheet
      title="Práce"
      subtitle={`× ${careerMult(level).toFixed(2)} kariéra · × ${energyMult(energy).toFixed(2)} energie`}
      onClose={onClose}
    >
      {/* ---- new task ---- */}
      <Panel className="mb-3">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Co je dnes potřeba udělat?"
            className="min-w-0 flex-1 rounded border border-line bg-bg px-2 py-2 text-sm text-text outline-none placeholder:text-dim focus:border-blue"
          />
          <Btn variant="primary" onClick={submit} className="shrink-0">
            <Plus />
          </Btn>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`rounded border px-2 py-1.5 text-left text-[11px] leading-tight transition ${
                size === s ? "border-gold bg-panel2" : "border-line bg-transparent"
              }`}
            >
              <span className="flex items-center gap-1">
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ background: SIZE_COLOR[s] }}
                />
                {SIZE_LABEL[s]}
              </span>
              <span className="mt-0.5 block text-gold">{formatMoneyShort(pay(s))}</span>
            </button>
          ))}
        </div>
      </Panel>

      {/* ---- active contract ---- */}
      {contract && (
        <Panel className="mb-3 border-gold/40">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Chip tone="gold">Zakázka</Chip>
                <span className="truncate text-[11px] text-dim">{contract.client}</span>
              </div>
              <p className="mt-1 text-sm text-text">{contract.title}</p>
            </div>
            <button
              onClick={abandonContract}
              aria-label="Zrušit zakázku"
              className="shrink-0 text-dim active:scale-95"
            >
              <X />
            </button>
          </div>

          <div className="mt-2">
            <Bar
              value={contract.delivered}
              max={contract.units}
              colour="#e0a53c"
              height={7}
            />
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-dim">
                {contract.delivered}/{contract.units} dílů odvedeno
              </span>
              <DeadlineChip due={contract.due} />
            </div>
          </div>

          <p className="mt-2 text-[11px] text-dim">
            Odměna při dokončení{" "}
            <span className="text-gold">{formatMoney(contract.payout)}</span>. Každý hotový
            úkol počítá 1–3 díly.
          </p>
        </Panel>
      )}

      {/* ---- today's tasks ---- */}
      <h3 className="mb-2 mt-4 font-display text-sm text-dim">
        Úkoly ({open.length} zbývá)
      </h3>

      {open.length === 0 && done.length === 0 && (
        <EmptyState>
          Zapiš si, co dnes reálně musíš udělat. Za každý hotový úkol dostaneš zaplaceno —
          a jen z toho zaplatíš nájem a jídlo.
        </EmptyState>
      )}

      <div className="space-y-2">
        {open.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded border border-line bg-panel p-2">
            <button
              onClick={() => toggleTask(t.id)}
              aria-label="Označit jako hotové"
              className="grid h-7 w-7 shrink-0 place-items-center rounded border border-line text-transparent active:scale-95"
              style={{ borderColor: SIZE_COLOR[t.size] }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-text">{t.title}</p>
              <p className="text-[10px] uppercase tracking-wide text-dim">
                {SIZE_LABEL[t.size]}
              </p>
            </div>
            <span className="shrink-0 text-sm text-gold">+{formatMoneyShort(pay(t.size))}</span>
            <button
              onClick={() => deleteTask(t.id)}
              aria-label="Smazat úkol"
              className="shrink-0 text-dim active:scale-95"
            >
              <X />
            </button>
          </div>
        ))}

        {done.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded border border-line bg-panel/50 p-2 opacity-60"
          >
            <button
              onClick={() => toggleTask(t.id)}
              aria-label="Vrátit zpět"
              className="grid h-7 w-7 shrink-0 place-items-center rounded border border-green text-green active:scale-95"
            >
              <Check />
            </button>
            <p className="min-w-0 flex-1 truncate text-sm text-dim line-through">{t.title}</p>
            <span className="shrink-0 text-sm text-dim">{formatMoneyShort(pay(t.size))}</span>
          </div>
        ))}
      </div>

      {earnedToday > 0 && (
        <p className="mt-3 text-center text-[11px] text-dim">
          Dnes vyděláno <span className="text-gold">{formatMoney(earnedToday)}</span>
        </p>
      )}

      {/* ---- contract offers ---- */}
      <div className="mb-2 mt-6 flex items-center gap-2">
        <h3 className="font-display text-sm text-dim">Nabídky zakázek</h3>
        <Chip tone="blue">reputace {reputation}</Chip>
        <Btn variant="ghost" onClick={rerollOffers} className="ml-auto !px-2 !py-1 !text-[11px]">
          Obnovit
        </Btn>
      </div>

      {contract ? (
        <EmptyState>Nejdřív dokonči rozdělanou zakázku.</EmptyState>
      ) : (
        <div className="space-y-2">
          {offers.map((o) => {
            const t = CONTRACT_TIERS.find((x) => x.tier === o.tier);
            return (
              <div key={o.id} className="rounded border border-line bg-panel p-2">
                <div className="flex items-center gap-2">
                  <Chip tone={o.tier >= 3 ? "gold" : "dim"}>{t?.label ?? "Zakázka"}</Chip>
                  <span className="truncate text-[11px] text-dim">{o.client}</span>
                </div>
                <p className="mt-1 text-sm text-text">{o.title}</p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-dim">
                  <span className="text-gold">{formatMoney(o.payout)}</span>
                  <span>{o.units} dílů</span>
                  <span>{o.days} dní</span>
                  <Btn
                    variant="primary"
                    onClick={() => acceptOffer(o.id)}
                    className="ml-auto !px-2 !py-1 !text-[11px]"
                  >
                    Vzít
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NextTierHint reputation={reputation} />
    </Sheet>
  );
}

function DeadlineChip({ due }: { due: string }) {
  const left = daysBetween(dateKey(), due);
  if (left < 0) return <Chip tone="danger">po termínu</Chip>;
  if (left === 0) return <Chip tone="danger">termín dnes</Chip>;
  if (left <= 1) return <Chip tone="warn">zbývá {left} den</Chip>;
  return <Chip tone="dim">zbývá {left} dní</Chip>;
}

function NextTierHint({ reputation }: { reputation: number }) {
  const next = CONTRACT_TIERS.find((t) => t.rep > reputation);
  if (!next) return null;
  return (
    <p className="mt-3 text-center text-[11px] text-dim">
      Při reputaci {next.rep} se odemkne <span className="text-text">{next.label}</span> za{" "}
      {formatMoneyShort(next.payout)}.
    </p>
  );
}
