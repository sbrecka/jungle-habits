"use client";

import React, { useEffect } from "react";
import { useGame } from "@/lib/store";
import { GameEvent } from "@/lib/types";
import { formatMoney, housing } from "@/lib/constants";
import { formatDayShort } from "@/lib/date";
import { Btn, Panel } from "./ui";

/*
 * All entrance animation here is CSS. The visible state is the base style, so a
 * throttled or disabled animation can never leave an invisible overlay sitting
 * on top of the UI swallowing taps.
 */

export function Toast() {
  const toast = useGame((s) => s.toast);
  const setToast = useGame((s) => s.setToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast, setToast]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none absolute bottom-24 left-1/2 z-50 w-[86%] -translate-x-1/2">
      <div className="fade-in rounded border border-line bg-panel2/95 px-3 py-2 text-center text-sm text-text shadow-lg">
        {toast}
      </div>
    </div>
  );
}

export function LevelUp() {
  const level = useGame((s) => s.celebrationLevel);
  const dismiss = useGame((s) => s.dismissCelebration);

  if (level === null) return null;

  return (
    <button
      onClick={dismiss}
      className="fade-in absolute inset-0 z-50 grid place-items-center bg-black/70 p-6"
    >
      <div className="pop-in w-full max-w-xs rounded border border-gold/60 bg-panel p-5 text-center">
        <p className="text-[11px] uppercase tracking-widest text-dim">Postup v kariéře</p>
        <p className="mt-1 font-display text-4xl leading-none text-gold">LVL {level}</p>
        <p className="mt-3 text-sm leading-relaxed text-text">
          Každý úkol teď platí víc. Zkušenost se vyplácí.
        </p>
        <Btn variant="primary" className="mt-4 w-full">
          Zpátky do práce
        </Btn>
      </div>
    </button>
  );
}

export function Millionaire() {
  const show = useGame((s) => s.showMillionaire);
  const dismiss = useGame((s) => s.dismissMillionaire);

  if (!show) return null;

  return (
    <button
      onClick={dismiss}
      className="fade-in absolute inset-0 z-50 grid place-items-center bg-black/80 p-6"
    >
      <div className="pop-in w-full max-w-xs rounded border border-gold bg-panel p-5 text-center">
        <p className="font-display text-3xl leading-tight text-gold">Milion.</p>
        <p className="mt-3 text-sm leading-relaxed text-text">
          Začínal jsi ve sklepě s {formatMoney(600)} a nudlemi. Teď máš čistý majetek přes
          milion korun. Každá koruna přišla z práce, kterou jsi reálně odvedl.
        </p>
        <Btn variant="primary" className="mt-4 w-full">
          Pokračovat
        </Btn>
      </div>
    </button>
  );
}

/* ---------- what happened while you were gone ---------- */

const KIND_STYLE: Record<string, { colour: string; label: string }> = {
  rent: { colour: "text-warn", label: "Nájem" },
  food: { colour: "text-dim", label: "Jídlo" },
  starve: { colour: "text-danger", label: "Hlad" },
  seized: { colour: "text-danger", label: "Prodáno" },
  evict: { colour: "text-danger", label: "Vystěhování" },
  contract: { colour: "text-danger", label: "Zakázka" },
  info: { colour: "text-dim", label: "Info" }
};

export function DayReport() {
  const report = useGame((s) => s.report);
  const dismiss = useGame((s) => s.dismissReport);
  const tier = useGame((s) => s.housingTier);

  if (!report || report.length === 0) return null;

  const bad = report.some((e) => e.kind === "evict" || e.kind === "seized");

  return (
    <div className="fade-in absolute inset-0 z-50 flex flex-col bg-black/80 p-4">
      <div className="m-auto flex max-h-full w-full max-w-sm flex-col rounded border border-line bg-panel">
        <div className="border-b border-line p-4">
          <h2 className="font-display text-lg leading-tight text-text">
            {bad ? "Zatímco jsi nepracoval…" : "Co se stalo mezitím"}
          </h2>
          <p className="mt-1 text-[11px] text-dim">
            Svět běžel dál. Teď bydlíš v {housing(tier).name}.
          </p>
        </div>

        <div className="thin-scroll flex-1 space-y-1.5 overflow-y-auto p-3">
          {report.map((e: GameEvent, i) => {
            const st = KIND_STYLE[e.kind] ?? KIND_STYLE.info;
            return (
              <div key={i} className="rounded border border-line/60 px-2 py-1.5">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide">
                  <span className={st.colour}>{st.label}</span>
                  <span className="ml-auto text-dim">{formatDayShort(e.day)}</span>
                </div>
                <p className="mt-0.5 text-[12px] leading-snug text-text">{e.text}</p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-line p-3">
          <Btn variant="primary" onClick={dismiss} className="w-full">
            Rozumím
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- persistent warnings under the room ---------- */

export function WarningStrip() {
  const food = useGame((s) => s.food);
  const lateDays = useGame((s) => s.lateDays);
  const energy = useGame((s) => s.energy);

  const warnings: { text: string; tone: string }[] = [];
  if (food <= 0)
    warnings.push({ text: "Nemáš co jíst — každý den bez jídla bere energii.", tone: "danger" });
  else if (food <= 2) warnings.push({ text: `Jídlo jen na ${food} dny.`, tone: "warn" });
  if (lateDays > 0)
    warnings.push({ text: "Nájem po splatnosti. Hrozí vystěhování.", tone: "danger" });
  if (energy < 30 && food > 0)
    warnings.push({ text: "Jsi vyčerpaný, práce vynáší málo. Odškrtni návyky.", tone: "warn" });

  if (warnings.length === 0) return null;

  return (
    <div className="space-y-1 px-3 py-2">
      {warnings.map((w, i) => (
        <Panel
          key={i}
          className={`!py-1.5 ${
            w.tone === "danger" ? "border-danger/50 bg-danger/10" : "border-warn/40 bg-warn/10"
          }`}
        >
          <p className={`text-[11px] ${w.tone === "danger" ? "text-danger" : "text-warn"}`}>
            {w.text}
          </p>
        </Panel>
      ))}
    </div>
  );
}
