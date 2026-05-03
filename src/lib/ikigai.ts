import { db } from "./db";
import { ikigaiJournal, userStats } from "./db/schema";
import { eq } from "drizzle-orm";

interface IkigaiInput {
  whatYouLove?: string | null;
  goodAt?: string | null;
  worldNeeds?: string | null;
  canOffer?: string | null;
  statement?: string | null;
  streak?: number;
  totalPoems?: number;
  monthlyCount?: number;
  monthlyGoal?: number;
}

/**
 * Calculates ikigai score out of 100 based on journal completeness + activity.
 */
export function calculateIkigaiScore(input: IkigaiInput): number {
  let score = 0;

  if ((input.whatYouLove?.length ?? 0) > 20) score += 10;
  if ((input.goodAt?.length ?? 0) > 0) score += 10;
  if ((input.worldNeeds?.length ?? 0) > 0) score += 10;
  if ((input.canOffer?.length ?? 0) > 0) score += 10;
  if ((input.statement?.length ?? 0) > 30) score += 10;

  score += Math.min((input.streak ?? 0) * 0.5, 15);
  score += Math.min((input.totalPoems ?? 0) * 0.15, 15);

  const goal = input.monthlyGoal ?? 10;
  const count = input.monthlyCount ?? 0;
  score += Math.min((count / goal) * 20, 20);

  return Math.round(score);
}

/**
 * Fetches journal + stats, recalculates score, and saves it.
 */
export async function updateIkigaiScore(userId: string): Promise<number> {
  const [journal, stats] = await Promise.all([
    db.select().from(ikigaiJournal).where(eq(ikigaiJournal.userId, userId)).get(),
    db.select().from(userStats).where(eq(userStats.userId, userId)).get(),
  ]);

  const score = calculateIkigaiScore({
    whatYouLove: journal?.whatYouLove,
    goodAt: journal?.goodAt,
    worldNeeds: journal?.worldNeeds,
    canOffer: journal?.canOffer,
    statement: journal?.statement,
    streak: stats?.currentStreak,
    totalPoems: stats?.totalPoems,
    monthlyCount: stats?.monthlyCount,
    monthlyGoal: stats?.monthlyGoal,
  });

  await db
    .update(ikigaiJournal)
    .set({ score, updatedAt: new Date().toISOString() })
    .where(eq(ikigaiJournal.userId, userId));

  return score;
}
