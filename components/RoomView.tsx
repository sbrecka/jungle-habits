"use client";

import React, { useEffect, useRef } from "react";
import { useGame } from "@/lib/store";
import { canvasSizeFor, drawScene } from "@/lib/isoScene";

/** ~20fps is plenty for an idle room and much kinder to the battery. */
const FRAME_MS = 50;

export default function RoomView() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const tier = useGame((s) => s.housingTier);
  const owned = useGame((s) => s.owned);
  const night = useGame((s) => s.night);
  const energy = useGame((s) => s.energy);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let frame = 0;
    let last = 0;
    let cancelled = false;

    const loop = (t: number) => {
      if (cancelled) return;
      if (t - last >= FRAME_MS) {
        last = t;
        frame += 1;
        if (!document.hidden) {
          drawScene(ctx, { tier, owned, night, energy, frame, still: reduce });
        }
      }
      raf = requestAnimationFrame(loop);
    };

    drawScene(ctx, { tier, owned, night, energy, frame: 0, still: reduce });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [tier, owned, night, energy]);

  const size = canvasSizeFor(tier);

  return (
    <canvas
      ref={canvasRef}
      width={size.w}
      height={size.h}
      aria-label="Your room"
      className="block w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
