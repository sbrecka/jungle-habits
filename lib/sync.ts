"use client";

import { exportSave, importSave } from "./backup";

/**
 * Optional cloud sync. The sync code is both the address of your save and the
 * only thing protecting it, so it is generated from crypto randomness rather
 * than anything guessable, and it never leaves this device except as the key of
 * a request.
 *
 * Sync is deliberately manual: with no accounts there is no way to merge two
 * devices, so an automatic push could silently overwrite newer progress.
 */

const CODE_KEY = "grind-sync-code";

/** Crockford base32 — no I, L, O or U, so codes can be read aloud. */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export const CODE_RE = /^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}(-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}){2}$/;

/** 12 characters of base32 ≈ 60 bits — not worth guessing at. */
export function newCode(): string {
  const bytes = new Uint32Array(12);
  crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]);
  return [chars.slice(0, 4), chars.slice(4, 8), chars.slice(8, 12)]
    .map((g) => g.join(""))
    .join("-");
}

/** Accepts what a person actually types: lower case, spaces, missing dashes. */
export function normaliseCode(raw: string): string {
  const clean = raw
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .slice(0, 12);
  return clean.replace(/(.{4})(?=.)/g, "$1-");
}

export function getCode(): string | null {
  try {
    const c = localStorage.getItem(CODE_KEY);
    return c && CODE_RE.test(c) ? c : null;
  } catch {
    return null;
  }
}

export function storeCode(code: string): boolean {
  if (!CODE_RE.test(code)) return false;
  try {
    localStorage.setItem(CODE_KEY, code);
    return true;
  } catch {
    return false;
  }
}

export function getOrCreateCode(): string {
  const existing = getCode();
  if (existing) return existing;
  const fresh = newCode();
  storeCode(fresh);
  return fresh;
}

export interface SyncResult {
  ok: boolean;
  error?: string;
  /** When the copy in the cloud was last written. */
  updatedAt?: number;
}

async function call(path: string, init?: RequestInit): Promise<{ status: number; body: any }> {
  const res = await fetch(path, { cache: "no-store", ...init });
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { status: res.status, body };
}

/** Reads the cloud copy's timestamp without touching local progress. */
export async function peek(code: string): Promise<SyncResult> {
  if (!CODE_RE.test(code)) return { ok: false, error: "That code doesn't look right." };
  try {
    const { status, body } = await call(`/api/sync?code=${encodeURIComponent(code)}&meta=1`);
    if (status === 404) return { ok: false, error: "No save stored under that code yet." };
    if (status === 503) return { ok: false, error: body?.error ?? "Cloud sync isn't set up." };
    if (status !== 200) return { ok: false, error: body?.error ?? "The server refused that." };
    return { ok: true, updatedAt: body?.updatedAt };
  } catch {
    return { ok: false, error: "Couldn't reach the server." };
  }
}

export async function pushSave(code: string): Promise<SyncResult> {
  if (!CODE_RE.test(code)) return { ok: false, error: "That code doesn't look right." };
  const save = exportSave();
  if (!save) return { ok: false, error: "There's no progress to upload yet." };

  try {
    const { status, body } = await call("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, save })
    });
    if (status === 503) return { ok: false, error: body?.error ?? "Cloud sync isn't set up." };
    if (status !== 200) return { ok: false, error: body?.error ?? "Upload failed." };
    return { ok: true, updatedAt: body?.updatedAt };
  } catch {
    return { ok: false, error: "Couldn't reach the server." };
  }
}

/**
 * Overwrites local progress with the cloud copy. Validated by importSave, so a
 * damaged payload leaves what you already have alone.
 */
export async function pullSave(code: string): Promise<SyncResult> {
  if (!CODE_RE.test(code)) return { ok: false, error: "That code doesn't look right." };
  try {
    const { status, body } = await call(`/api/sync?code=${encodeURIComponent(code)}`);
    if (status === 404) return { ok: false, error: "No save stored under that code yet." };
    if (status === 503) return { ok: false, error: body?.error ?? "Cloud sync isn't set up." };
    if (status !== 200) return { ok: false, error: body?.error ?? "Download failed." };

    const res = importSave(String(body?.save ?? ""));
    if (!res.ok) return { ok: false, error: res.error ?? "The stored save is damaged." };
    return { ok: true, updatedAt: body?.updatedAt };
  } catch {
    return { ok: false, error: "Couldn't reach the server." };
  }
}

export function formatWhen(ts?: number): string {
  if (!ts) return "never";
  const d = new Date(ts);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}
