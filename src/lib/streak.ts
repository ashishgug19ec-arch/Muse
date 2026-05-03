import { db } from "./db";
import { userStats, poems } from "./db/schema";
import { eq, gte, lt, and } from "drizzle-orm";

export interface DayActivity {
  label: string;
  active: boolean;
}

/**
 * Updates writing streak after a new poem is saved.
 * Handles streak increment, reset, monthly goal, and longest streak.
 */
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

  // Check monthly reset
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

/**
 * Returns last 7 days of writing activity as labeled booleans.
 */
export async function getWeekActivity(userId: string): Promise<DayActivity[]> {
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  const result: DayActivity[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStart = date.toISOString().slice(0, 10);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const dayEnd = nextDay.toISOString().slice(0, 10);

    const wrote = await db
      .select({ id: poems.id })
      .from(poems)
      .where(
        and(
          eq(poems.userId, userId),
          gte(poems.createdAt, dayStart),
          lt(poems.createdAt, dayEnd)
        )
      )
      .get();

    result.push({
      label: labels[date.getDay()],
      active: !!wrote,
    });
  }

  return result;
}
