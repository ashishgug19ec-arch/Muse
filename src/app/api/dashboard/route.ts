import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { poems, fanfics, collections, userStats } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getWeekActivity } from "@/lib/streak";
import { getDailyPrompt } from "@/lib/prompts";

export async function GET() {
  try {
    const userId = await getUserId();

    const [allPoems, allFanfics, allCollections, stats, recentPoems, weekActivity] = await Promise.all([
      db.select({ id: poems.id }).from(poems).where(eq(poems.userId, userId)).all(),
      db.select({ id: fanfics.id }).from(fanfics).where(eq(fanfics.userId, userId)).all(),
      db.select({ id: collections.id }).from(collections).where(eq(collections.userId, userId)).all(),
      db.select().from(userStats).where(eq(userStats.userId, userId)).get(),
      db.select({ id: poems.id, title: poems.title, createdAt: poems.createdAt })
        .from(poems).where(eq(poems.userId, userId)).orderBy(desc(poems.createdAt)).limit(5).all(),
      getWeekActivity(userId),
    ]);

    return NextResponse.json({
      totalPoems: allPoems.length,
      totalFanfics: allFanfics.length,
      totalCollections: allCollections.length,
      currentStreak: stats?.currentStreak ?? 0,
      recentPoems,
      weekActivity,
      dailyPrompt: getDailyPrompt(),
    });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
