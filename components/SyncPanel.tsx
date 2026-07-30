"use client";

import React, { useEffect, useState } from "react";
import {
  CODE_RE,
  formatWhen,
  getCode,
  getOrCreateCode,
  normaliseCode,
  peek,
  pullSave,
  pushSave,
  storeCode
} from "@/lib/sync";
import { Btn, Panel } from "./ui";

type Status = { tone: "ok" | "err"; text: string } | null;

/**
 * Sync is manual on purpose: with no accounts there is nothing to merge two
 * devices with, so every overwrite has to be a decision you make on purpose.
 */
export default function SyncPanel() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string>("");
  const [entry, setEntry] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [cloudAt, setCloudAt] = useState<number | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setCode(getCode() ?? "");
  }, []);

  // Ask once whether the deployment has storage wired up at all.
  useEffect(() => {
    if (!open || available !== null) return;
    (async () => {
      const res = await peek("AAAA-AAAA-AAAA");
      setAvailable(!(res.error ?? "").includes("isn't set up"));
    })();
  }, [open, available]);

  const refreshCloud = async (c: string) => {
    const res = await peek(c);
    setCloudAt(res.ok ? res.updatedAt : undefined);
  };

  const ensureCode = () => {
    const c = getOrCreateCode();
    setCode(c);
    void refreshCloud(c);
    return c;
  };

  const doPush = async () => {
    const c = code || ensureCode();
    setBusy(true);
    const res = await pushSave(c);
    setBusy(false);
    if (res.ok) {
      setCloudAt(res.updatedAt);
      setStatus({ tone: "ok", text: "Uploaded. Use the same code on your phone." });
    } else {
      setStatus({ tone: "err", text: res.error ?? "Upload failed." });
    }
  };

  const doPull = async () => {
    if (!code) {
      setStatus({ tone: "err", text: "Enter the code from your other device first." });
      return;
    }
    if (
      !confirm(
        "Downloading replaces the progress on this device with the cloud copy. Continue?"
      )
    ) {
      return;
    }
    setBusy(true);
    const res = await pullSave(code);
    setBusy(false);
    if (res.ok) {
      setStatus({ tone: "ok", text: "Downloaded. Reloading…" });
      setTimeout(() => window.location.reload(), 600);
    } else {
      setStatus({ tone: "err", text: res.error ?? "Download failed." });
    }
  };

  const useEnteredCode = () => {
    const c = normaliseCode(entry);
    if (!CODE_RE.test(c)) {
      setStatus({ tone: "err", text: "A code looks like ABCD-1234-EFGH." });
      return;
    }
    storeCode(c);
    setCode(c);
    setEntry("");
    setStatus({ tone: "ok", text: "Code saved." });
    void refreshCloud(c);
  };

  return (
    <Panel className="mt-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-text">Sync between devices</span>
        <Btn
          variant="ghost"
          onClick={() => setOpen(!open)}
          className="ml-auto !px-2 !py-1 !text-[11px]"
        >
          {open ? "Hide" : "Open"}
        </Btn>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-dim">
        Upload your progress under a private code, then enter that code on your phone to
        pull it down. Nothing syncs on its own — you decide when.
      </p>

      {open && (
        <div className="mt-3 space-y-2">
          {available === false && (
            <p className="rounded border border-warn/40 bg-warn/10 px-2 py-1.5 text-[11px] text-warn">
              Cloud storage isn&apos;t connected to this deployment yet. Use the file backup
              above in the meantime.
            </p>
          )}

          {code ? (
            <div className="rounded border border-line bg-bg px-2 py-2">
              <div className="text-[10px] uppercase tracking-wide text-dim">Your sync code</div>
              <div className="font-display text-lg leading-tight text-gold">{code}</div>
              <div className="mt-0.5 text-[10px] text-dim">
                In the cloud: {formatWhen(cloudAt)}
              </div>
              <p className="mt-1 text-[10px] leading-snug text-dim">
                Anyone with this code can read and overwrite your save. Treat it like a
                password.
              </p>
            </div>
          ) : (
            <Btn onClick={ensureCode} className="w-full !text-[11px]">
              Create a sync code
            </Btn>
          )}

          <div className="flex gap-2">
            <Btn
              variant="primary"
              onClick={doPush}
              disabled={busy || available === false}
              className="flex-1 !text-[11px]"
            >
              Upload
            </Btn>
            <Btn
              onClick={doPull}
              disabled={busy || !code || available === false}
              className="flex-1 !text-[11px]"
            >
              Download
            </Btn>
          </div>

          <div className="border-t border-line pt-2">
            <p className="mb-1 text-[11px] text-dim">Have a code from another device?</p>
            <div className="flex gap-2">
              <input
                value={entry}
                onChange={(e) => setEntry(normaliseCode(e.target.value))}
                placeholder="ABCD-1234-EFGH"
                spellCheck={false}
                autoCapitalize="characters"
                className="min-w-0 flex-1 rounded border border-line bg-bg px-2 py-2 font-display text-sm tracking-wide text-text outline-none placeholder:text-dim focus:border-blue"
              />
              <Btn onClick={useEnteredCode} className="shrink-0 !text-[11px]">
                Use
              </Btn>
            </div>
          </div>

          {status && (
            <p
              className={`text-[11px] leading-snug ${
                status.tone === "ok" ? "text-green" : "text-danger"
              }`}
            >
              {status.text}
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}
