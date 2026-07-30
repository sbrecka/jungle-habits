import { NextResponse } from "next/server";

/**
 * Cloud sync backed by Upstash Redis over its REST API — no SDK, just fetch.
 *
 * Vercel's Upstash integration injects UPSTASH_REDIS_REST_*; the older Vercel KV
 * naming is KV_REST_API_*. Both are accepted so the project works whichever way
 * the store was added. With neither set, every route replies 503 and the UI
 * hides sync rather than breaking.
 */

export const dynamic = "force-dynamic";

const CODE_RE = /^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}(-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}){2}$/;
/** Saves are a few kB; this is a generous ceiling that still stops abuse. */
const MAX_SAVE_BYTES = 256 * 1024;
/** Long enough to survive a forgotten phone, short enough not to hoard data. */
const TTL_SECONDS = 60 * 60 * 24 * 180;

function credentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

const NOT_CONFIGURED = NextResponse.json(
  { error: "Cloud sync isn't set up on this deployment." },
  { status: 503 }
);

async function redis(command: (string | number)[]): Promise<unknown> {
  const creds = credentials();
  if (!creds) throw new Error("not-configured");

  const res = await fetch(creds.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!res.ok) throw new Error(`redis-${res.status}`);
  const json = (await res.json()) as { result?: unknown };
  return json.result ?? null;
}

const key = (code: string) => `grind:save:${code}`;

export async function GET(request: Request) {
  if (!credentials()) return NOT_CONFIGURED;

  const params = new URL(request.url).searchParams;
  const code = params.get("code") ?? "";
  if (!CODE_RE.test(code)) {
    return NextResponse.json({ error: "Malformed sync code." }, { status: 400 });
  }

  try {
    const raw = await redis(["GET", key(code)]);
    if (typeof raw !== "string") {
      return NextResponse.json({ error: "No save stored under that code." }, { status: 404 });
    }

    const stored = JSON.parse(raw) as { save?: string; updatedAt?: number };
    // `meta=1` checks the timestamp without shipping the whole save back.
    if (params.get("meta") === "1") {
      return NextResponse.json({ updatedAt: stored.updatedAt ?? null });
    }
    return NextResponse.json({ save: stored.save ?? "", updatedAt: stored.updatedAt ?? null });
  } catch {
    // Never echo the upstream error — it can carry the token in a URL.
    return NextResponse.json({ error: "Storage is unavailable right now." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (!credentials()) return NOT_CONFIGURED;

  let body: { code?: unknown; save?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code : "";
  const save = typeof body.save === "string" ? body.save : "";

  if (!CODE_RE.test(code)) {
    return NextResponse.json({ error: "Malformed sync code." }, { status: 400 });
  }
  if (!save) {
    return NextResponse.json({ error: "Nothing to store." }, { status: 400 });
  }
  if (save.length > MAX_SAVE_BYTES) {
    return NextResponse.json({ error: "That save is too large." }, { status: 413 });
  }
  // Store only what parses as a save, so the key can't be used as free storage.
  try {
    const parsed = JSON.parse(save) as { state?: unknown };
    if (!parsed || typeof parsed !== "object" || !parsed.state) {
      return NextResponse.json({ error: "That isn't a game save." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "That isn't a game save." }, { status: 400 });
  }

  const updatedAt = Date.now();
  try {
    await redis(["SET", key(code), JSON.stringify({ save, updatedAt }), "EX", TTL_SECONDS]);
    return NextResponse.json({ ok: true, updatedAt });
  } catch {
    return NextResponse.json({ error: "Storage is unavailable right now." }, { status: 502 });
  }
}
