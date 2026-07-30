"use client";

import React, { useRef, useState } from "react";
import {
  copySave,
  downloadSave,
  importSave,
  readFile
} from "@/lib/backup";
import { Btn, Panel } from "./ui";

type Status = { tone: "ok" | "err"; text: string } | null;

export default function BackupPanel() {
  const [open, setOpen] = useState(false);
  const [paste, setPaste] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const restore = (raw: string) => {
    const res = importSave(raw);
    if (!res.ok) {
      setStatus({ tone: "err", text: res.error ?? "The backup could not be loaded." });
      return;
    }
    setStatus({ tone: "ok", text: "Restored. Reloading…" });
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <Panel className="mt-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-text">Back up your progress</span>
        <Btn
          variant="ghost"
          onClick={() => setOpen(!open)}
          className="ml-auto !px-2 !py-1 !text-[11px]"
        >
          {open ? "Hide" : "Open"}
        </Btn>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-dim">
        Your progress lives only in this browser. Clear its data or move to another device
        and it is gone. Download a backup and load it on your phone.
      </p>

      {open && (
        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            <Btn
              onClick={() => {
                const ok = downloadSave();
                setStatus(
                  ok
                    ? { tone: "ok", text: "File downloaded." }
                    : { tone: "err", text: "Nothing to back up yet." }
                );
              }}
              className="flex-1 !text-[11px]"
            >
              Download file
            </Btn>
            <Btn
              onClick={async () => {
                const ok = await copySave();
                setStatus(
                  ok
                    ? { tone: "ok", text: "Copied to clipboard." }
                    : { tone: "err", text: "Clipboard unavailable — use the download instead." }
                );
              }}
              className="flex-1 !text-[11px]"
            >
              Copy
            </Btn>
          </div>

          <div className="border-t border-line pt-2">
            <p className="mb-1 text-[11px] text-dim">Restore from a backup:</p>

            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  restore(await readFile(f));
                } catch {
                  setStatus({ tone: "err", text: "The file could not be read." });
                }
                e.target.value = "";
              }}
            />
            <Btn onClick={() => fileRef.current?.click()} className="w-full !text-[11px]">
              Choose a backup file
            </Btn>

            <textarea
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder="…or paste a copied backup here"
              rows={3}
              className="thin-scroll mt-2 w-full rounded border border-line bg-bg px-2 py-2 text-[11px] text-text outline-none placeholder:text-dim focus:border-blue"
            />
            <Btn
              variant="primary"
              onClick={() => restore(paste)}
              disabled={!paste.trim()}
              className="mt-1 w-full !text-[11px]"
            >
              Restore from pasted text
            </Btn>
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

          <p className="text-[10px] leading-snug text-dim">
            Restoring overwrites your current progress. The app runs on your phone at the
            same address — download here, open that address on your phone, load the file.
          </p>
        </div>
      )}
    </Panel>
  );
}
