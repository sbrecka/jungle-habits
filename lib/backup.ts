"use client";

/**
 * The whole game lives in localStorage, which is tied to one browser on one
 * device. A player aiming at a million is investing months, so there has to be
 * a way to get the save out and back in — both as a safety net and to move it
 * to a phone.
 */

export const SAVE_KEY = "grind-v1";

export function exportSave(): string {
  try {
    return localStorage.getItem(SAVE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function backupFilename(): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
  return `grind-zaloha-${stamp}.json`;
}

export interface ImportResult {
  ok: boolean;
  /** Set whenever `ok` is false. */
  error?: string;
}

/**
 * Validates before overwriting: a malformed paste must not be able to wipe a
 * working save.
 */
export function importSave(raw: string): ImportResult {
  const text = raw.trim();
  if (!text) return { ok: false, error: "You have not pasted anything." };

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "This is not a valid backup — it cannot be read as JSON." };
  }

  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "This is not a valid backup." };
  }
  const state = (parsed as { state?: unknown }).state;
  if (!state || typeof state !== "object") {
    return { ok: false, error: "The backup contains no game state." };
  }

  const s = state as Record<string, unknown>;
  if (typeof s.money !== "number" || typeof s.housingTier !== "number") {
    return { ok: false, error: "The backup is damaged — money or housing is missing." };
  }

  try {
    localStorage.setItem(SAVE_KEY, text);
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not save — is the browser storage full?" };
  }
}

/** Offers the save as a file — the practical way to get it onto a phone. */
export function downloadSave(): boolean {
  const data = exportSave();
  if (!data) return false;
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = backupFilename();
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return true;
}

export async function copySave(): Promise<boolean> {
  const data = exportSave();
  if (!data) return false;
  try {
    await navigator.clipboard.writeText(data);
    return true;
  } catch {
    return false;
  }
}

export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(new Error("The file could not be read."));
    r.readAsText(file);
  });
}
