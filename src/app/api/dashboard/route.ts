import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { poems, userStats, ikigaiJournal, badges } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getWeekActivity } from "@/lib/streak";
import { getDailyPrompt } from "@/lib/prompts";
import { getEarnedBadges } from "@/lib/badges";

export async function GET() {
  try {
    const userId = await getUserId();

    const [stats, journal, recentPoems, earnedBadgeRows, weekActivity] = await Promise.all([
      db.select().from(userStats).where(eq(userStats.userId, userId)).get(),
      db.select().from(ikigaiJournal).where(eq(ikigaiJournal.userId, userId)).get(),
      db.select().from(poems).where(eq(poems.userId, userId)).orderBy(desc(poems.createdAt)).limit(6),
      db.select().from(badges).where(eq(badges.userId, userId)),
      getWeekActivity(userId),
    ]);

    return NextResponse.json({
      stats,
      weekActivity,
      ikigaiScore: journal?.score ?? 0,
      recentPoems,
      dailyPrompt: getDailyPrompt(),
      earnedBadges: earnedBadgeRows.map((r) => r.badgeId),
    });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
