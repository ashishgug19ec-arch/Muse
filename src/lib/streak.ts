import { db } from "./db";
import { userStats, poems, chapters } from "./db/schema";
import { eq, gte, lt, and } from "drizzle-orm";

export interface DayActivity {
  label: string;
  count: number;
}

export async function updateStreak(userId: string): Promise<void> {
  const stats = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .get();

  if (!stats) return;

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
  const lastWritten = stats.lastWrittenAt?.slice(0, 10);

  let currentStreak = stats.currentStreak;

  if (lastWritten === today) {
    // Already wrote today — no streak change, just bump total
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

export async function getWeekActivity(userId: string): Promise<DayActivity[]> {
  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const result: DayActivity[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStart = date.toISOString().slice(0, 10);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const dayEnd = nextDay.toISOString().slice(0, 10);

    const [poemRows, chapterRows] = await Promise.all([
      db.select({ id: poems.id }).from(poems).where(
        and(eq(poems.userId, userId), gte(poems.createdAt, dayStart), lt(poems.createdAt, dayEnd))
      ).all(),
      db.select({ id: chapters.id }).from(chapters).where(
        and(eq(chapters.userId, userId), gte(chapters.createdAt, dayStart), lt(chapters.createdAt, dayEnd))
      ).all(),
    ]);

    result.push({
      label: DAY_LABELS[date.getDay()],
      count: poemRows.length + chapterRows.length,
    });
  }

  return result;
}
