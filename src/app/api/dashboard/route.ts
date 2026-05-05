import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { poems, fanfics, collections, userStats } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getWeekActivity, countWritingDays } from "@/lib/streak";
import { getDailyPrompt } from "@/lib/prompts";

function isoMonthStart() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function isoYearStart() {
  return `${new Date().getFullYear()}-01-01`;
}

export async function GET() {
  try {
    const userId = await getUserId();
    const monthStart = isoMonthStart();
    const yearStart = isoYearStart();

    const [
      allPoems,
      allFanfics,
      allCollections,
      stats,
      recentPoems,
      recentFanfics,
      weekActivity,
      monthDays,
      yearDays,
    ] = await Promise.all([
      db.select({ id: poems.id }).from(poems).where(eq(poems.userId, userId)).all(),
      db.select({ id: fanfics.id }).from(fanfics).where(eq(fanfics.userId, userId)).all(),
      db.select({ id: collections.id }).from(collections).where(eq(collections.userId, userId)).all(),
      db.select().from(userStats).where(eq(userStats.userId, userId)).get(),
      db.select({ id: poems.id, title: poems.title, createdAt: poems.createdAt })
        .from(poems).where(eq(poems.userId, userId)).orderBy(desc(poems.createdAt)).limit(5).all(),
      db.select({ id: fanfics.id, title: fanfics.title, fandom: fanfics.fandom, status: fanfics.status, chapterCount: fanfics.chapterCount, createdAt: fanfics.createdAt })
        .from(fanfics).where(eq(fanfics.userId, userId)).orderBy(desc(fanfics.createdAt)).limit(5).all(),
      getWeekActivity(userId),
      countWritingDays(userId, monthStart),
      countWritingDays(userId, yearStart),
    ]);

    return NextResponse.json({
      totalPoems: allPoems.length,
      totalFanfics: allFanfics.length,
      totalCollections: allCollections.length,
      currentStreak: stats?.currentStreak ?? 0,
      monthDays,
      yearDays,
      recentPoems,
      recentFanfics,
      weekActivity,
      dailyPrompt: getDailyPrompt(),
    });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
