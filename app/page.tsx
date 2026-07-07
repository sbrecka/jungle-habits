"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useJungle } from "@/lib/store";
import Island from "@/components/Island";
import TopBar from "@/components/TopBar";
import ActionBar from "@/components/ActionBar";
import QuestsScreen from "@/components/QuestsScreen";
import ProgressSheet from "@/components/ProgressSheet";
import ShopModal from "@/components/ShopModal";
import { FocusSetup, FocusOverlay } from "@/components/FocusMode";
import { EditTray, Toast, Celebration } from "@/components/Overlays";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="h-dvh grid place-items-center bg-navy-deep">
        <div className="font-display text-2xl text-white/70">Loading your island…</div>
      </main>
    );
  }
  return <App />;
}

function App() {
  const rollover = useJungle((s) => s.rollover);
  const setToast = useJungle((s) => s.setToast);
  const placeItem = useJungle((s) => s.placeItem);
  const removePlaced = useJungle((s) => s.removePlaced);
  const inventory = useJungle((s) => s.inventory);
  const focus = useJungle((s) => s.focus);

  const [questsOpen, setQuestsOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [focusSetup, setFocusSetup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);

  // day rollover on mount + periodically
  useEffect(() => {
    rollover();
    const t = setInterval(rollover, 30000);
    return () => clearInterval(t);
  }, [rollover]);

  const handlePlace = (x: number, y: number) => {
    if (!selectedItemId) return;
    const ok = placeItem(selectedItemId, selectedVariant, x, y);
    if (!ok) setToast("Can't place that there.");
    else if ((inventory[selectedItemId] || 0) <= 1) setSelectedItemId(null);
  };

  return (
    <main className="h-dvh bg-navy-deep flex justify-center">
      <div className="relative w-full max-w-md h-full overflow-hidden bg-ocean">
        {/* island */}
        <div className="absolute inset-0">
          <Island
            editMode={editMode}
            selectedItemId={selectedItemId}
            selectedVariant={selectedVariant}
            onPlace={handlePlace}
            onRemove={removePlaced}
          />
        </div>

        <TopBar onOpenQuests={() => setQuestsOpen(true)} />

        {!editMode && (
          <ActionBar
            editMode={editMode}
            onFocus={() => setFocusSetup(true)}
            onEdit={() => setEditMode(true)}
            onShop={() => setShopOpen(true)}
            onProgress={() => setProgressOpen(true)}
          />
        )}

        <AnimatePresence>
          {editMode && (
            <EditTray
              key="edit-tray"
              selectedItemId={selectedItemId}
              selectedVariant={selectedVariant}
              onSelect={(id, v) => {
                setSelectedItemId(id);
                setSelectedVariant(v);
              }}
              onDone={() => {
                setEditMode(false);
                setSelectedItemId(null);
              }}
            />
          )}
        </AnimatePresence>

        {questsOpen && <QuestsScreen onClose={() => setQuestsOpen(false)} />}
        {progressOpen && <ProgressSheet onClose={() => setProgressOpen(false)} />}
        {shopOpen && <ShopModal onClose={() => setShopOpen(false)} />}
        {focusSetup && !focus && <FocusSetup onClose={() => setFocusSetup(false)} />}
        <FocusOverlay />

        <Toast />
        <Celebration />
      </div>
    </main>
  );
}
