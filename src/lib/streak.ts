import { db } from "./db";
import { userStats, poems, chapters } from "./db/schema";
import { eq, gte, lt, and } from "drizzle-orm";

export interface DayActivity {
  label: string;
  poemCount: number;
  chapterCount: number;
  future: boolean;
}

// Use local calendar date to avoid UTC-offset bucket mismatches
function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function updateStreak(userId: string): Promise<void> {
  const stats = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .get();

  if (!stats) return;

  const now = new Date();
  const today = localDateStr(now);
  const yesterday = localDateStr(new Date(now.getTime() - 86400000));
  const lastWritten = stats.lastWrittenAt ? localDateStr(new Date(stats.lastWrittenAt)) : null;

  let currentStreak = stats.currentStreak;

  if (lastWritten === today) {
    // Already wrote today — no streak change
  } else if (lastWritten === yesterday) {
    currentStreak += 1;
  } else {
    currentStreak = 1;
  }

  const longestStreak = Math.max(stats.longestStreak, currentStreak);

  const resetAt = stats.monthlyResetAt ? new Date(stats.monthlyResetAt) : null;
  const needsReset = !resetAt || resetAt.getMonth() !== now.getMonth() || resetAt.getFullYear() !== now.getFullYear();

  await db
    .update(userStats)
    .set({
      currentStreak,
      longestStreak,
      lastWrittenAt: now.toISOString(),
      totalPoems: stats.totalPoems + 1,
      monthlyCount: needsReset ? 1 : stats.monthlyCount + 1,
      monthlyResetAt: needsReset ? now.toISOString() : stats.monthlyResetAt,
    })
    .where(eq(userStats.userId, userId));
}

// Returns Sun–Sat of the current calendar week using local dates.
// Future days have counts 0 and future=true.
export async function getWeekActivity(userId: string): Promise<DayActivity[]> {
  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sunday of this week (local)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const result: DayActivity[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);

    const isFuture = date > today;
    const label = DAY_LABELS[date.getDay()];

    if (isFuture) {
      result.push({ label, poemCount: 0, chapterCount: 0, future: true });
      continue;
    }

    // Local date boundaries — avoids UTC-offset bucket mismatches
    const dayStart = localDateStr(date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const dayEnd = localDateStr(nextDay);

    const [poemRows, chapterRows] = await Promise.all([
      db.select({ id: poems.id }).from(poems).where(
        and(eq(poems.userId, userId), gte(poems.createdAt, dayStart), lt(poems.createdAt, dayEnd))
      ).all(),
      db.select({ id: chapters.id }).from(chapters).where(
        and(eq(chapters.userId, userId), gte(chapters.createdAt, dayStart), lt(chapters.createdAt, dayEnd))
      ).all(),
    ]);

    result.push({ label, poemCount: poemRows.length, chapterCount: chapterRows.length, future: false });
  }

  return result;
}

// Count distinct local writing days from a given date onward.
export async function countWritingDays(userId: string, fromDate: string): Promise<number> {
  const [poemRows, chapterRows] = await Promise.all([
    db.select({ createdAt: poems.createdAt }).from(poems).where(
      and(eq(poems.userId, userId), gte(poems.createdAt, fromDate))
    ).all(),
    db.select({ createdAt: chapters.createdAt }).from(chapters).where(
      and(eq(chapters.userId, userId), gte(chapters.createdAt, fromDate))
    ).all(),
  ]);

  const days = new Set([
    ...poemRows.map(r => r.createdAt?.slice(0, 10) ?? ''),
    ...chapterRows.map(r => r.createdAt?.slice(0, 10) ?? ''),
  ]);
  days.delete('');
  return days.size;
}
