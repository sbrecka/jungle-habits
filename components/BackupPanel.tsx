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
      setStatus({ tone: "err", text: res.error ?? "Zálohu se nepodařilo načíst." });
      return;
    }
    setStatus({ tone: "ok", text: "Obnoveno. Načítám…" });
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <Panel className="mt-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-text">Záloha postupu</span>
        <Btn
          variant="ghost"
          onClick={() => setOpen(!open)}
          className="ml-auto !px-2 !py-1 !text-[11px]"
        >
          {open ? "Skrýt" : "Otevřít"}
        </Btn>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-dim">
        Postup je uložený jen v tomhle prohlížeči. Když smažeš data prohlížeče nebo přejdeš
        na jiné zařízení, je pryč. Stáhni si zálohu a na telefonu ji načti.
      </p>

      {open && (
        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            <Btn
              onClick={() => {
                const ok = downloadSave();
                setStatus(
                  ok
                    ? { tone: "ok", text: "Soubor stažen." }
                    : { tone: "err", text: "Není co zálohovat." }
                );
              }}
              className="flex-1 !text-[11px]"
            >
              Stáhnout soubor
            </Btn>
            <Btn
              onClick={async () => {
                const ok = await copySave();
                setStatus(
                  ok
                    ? { tone: "ok", text: "Zkopírováno do schránky." }
                    : { tone: "err", text: "Schránka není dostupná — použij stažení." }
                );
              }}
              className="flex-1 !text-[11px]"
            >
              Kopírovat
            </Btn>
          </div>

          <div className="border-t border-line pt-2">
            <p className="mb-1 text-[11px] text-dim">Obnovit ze zálohy:</p>

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
                  setStatus({ tone: "err", text: "Soubor se nepodařilo přečíst." });
                }
                e.target.value = "";
              }}
            />
            <Btn onClick={() => fileRef.current?.click()} className="w-full !text-[11px]">
              Vybrat soubor se zálohou
            </Btn>

            <textarea
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder="…nebo sem vlož zkopírovanou zálohu"
              rows={3}
              className="thin-scroll mt-2 w-full rounded border border-line bg-bg px-2 py-2 text-[11px] text-text outline-none placeholder:text-dim focus:border-blue"
            />
            <Btn
              variant="primary"
              onClick={() => restore(paste)}
              disabled={!paste.trim()}
              className="mt-1 w-full !text-[11px]"
            >
              Obnovit z vloženého textu
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
            Obnovení přepíše současný postup. Appka běží i v telefonu na stejné adrese —
            stáhni zálohu tady, otevři adresu na mobilu a soubor tam načti.
          </p>
        </div>
      )}
    </Panel>
  );
}
