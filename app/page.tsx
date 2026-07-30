"use client";

import React, { useEffect, useState } from "react";
import { useGame } from "@/lib/store";
import { formatMoneyShort } from "@/lib/constants";
import RoomView from "@/components/RoomView";
import TopBar from "@/components/TopBar";
import ActionBar, { Tab } from "@/components/ActionBar";
import WorkScreen from "@/components/WorkScreen";
import HabitsScreen from "@/components/HabitsScreen";
import ShopScreen from "@/components/ShopScreen";
import HomeScreen from "@/components/HomeScreen";
import TodayPanel from "@/components/TodayPanel";
import { DayReport, LevelUp, Millionaire, Toast, WarningStrip } from "@/components/Overlays";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="grid h-dvh place-items-center bg-bg">
        <p className="font-display text-lg text-dim">Loading…</p>
      </main>
    );
  }
  return <App />;
}

function App() {
  const processDays = useGame((s) => s.processDays);
  const contract = useGame((s) => s.contract);
  const [tab, setTab] = useState<Tab | null>(null);

  // Catch up on any days that passed while the app was closed.
  useEffect(() => {
    processDays();
    const t = setInterval(processDays, 60_000);
    return () => clearInterval(t);
  }, [processDays]);

  return (
    <main className="flex h-dvh justify-center bg-black">
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-bg">
        <TopBar />

        {/* the room */}
        <div className="thin-scroll flex flex-1 flex-col justify-center overflow-y-auto">
          <RoomView />

          {contract && (
            <div className="mx-3 mt-2 rounded border border-gold/30 bg-panel px-2 py-1.5">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="truncate text-dim">{contract.title}</span>
                <span className="ml-auto shrink-0 text-gold">
                  {contract.delivered}/{contract.units} ·{" "}
                  {formatMoneyShort(contract.payout)}
                </span>
              </div>
            </div>
          )}

          <TodayPanel onOpenWork={() => setTab("work")} />
        </div>

        <WarningStrip />
        <ActionBar onOpen={setTab} />

        {/* screens */}
        {tab === "work" && <WorkScreen onClose={() => setTab(null)} />}
        {tab === "habits" && <HabitsScreen onClose={() => setTab(null)} />}
        {tab === "shop" && <ShopScreen onClose={() => setTab(null)} />}
        {tab === "home" && <HomeScreen onClose={() => setTab(null)} />}

        <Toast />
        <LevelUp />
        <Millionaire />
        <DayReport />
      </div>
    </main>
  );
}
