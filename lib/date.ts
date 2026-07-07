export function dateKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function addDays(n: number, from: Date = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + n);
  return d;
}

export function keyDaysAgo(n: number): string {
  return dateKey(addDays(-n));
}

export function formatHeader(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
}

export function msToMidnight(now: Date = new Date()): number {
  const m = new Date(now);
  m.setHours(24, 0, 0, 0);
  return m.getTime() - now.getTime();
}

export function fmtCountdown(ms: number): string {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

export function fmtTimer(ms: number): string {
  if (ms < 0) ms = 0;
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/** Streak of consecutive "done" days ending today (or yesterday if today isn't done yet). */
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
