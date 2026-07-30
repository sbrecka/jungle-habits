export function dateKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Parses a key as a *local* date — avoids the UTC shift of new Date("2026-07-30"). */
export function parseKey(k: string): Date {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(n: number, from: Date = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + n);
  return d;
}

export function keyPlusDays(k: string, n: number): string {
  return dateKey(addDays(n, parseKey(k)));
}

export function keyDaysAgo(n: number): string {
  return dateKey(addDays(-n));
}

/** Whole days from key `a` to key `b` (negative when b is earlier). */
export function daysBetween(a: string, b: string): number {
  const ms = parseKey(b).getTime() - parseKey(a).getTime();
  return Math.round(ms / 86_400_000);
}

export function formatDay(k: string): string {
  return parseKey(k).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

export function formatDayShort(k: string): string {
  return parseKey(k).toLocaleDateString("en-GB", { day: "numeric", month: "numeric" });
}

export function msToMidnight(now: Date = new Date()): number {
  const m = new Date(now);
  m.setHours(24, 0, 0, 0);
  return m.getTime() - now.getTime();
}

/** Consecutive "done" days ending today (or yesterday, if today isn't done yet). */
export function habitStreak(history: Record<string, string>, today = new Date()): number {
  let start = 0;
  if (history[dateKey(today)] !== "done") start = 1;
  let streak = 0;
  for (let i = start; i < 400; i++) {
    if (history[dateKey(addDays(-i, today))] === "done") streak++;
    else break;
  }
  return streak;
}
