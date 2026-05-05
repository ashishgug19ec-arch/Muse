export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { poems, fanfics, chapters, collections, userStats } from "@/lib/db/schema";
import { eq, desc, gte, and } from "drizzle-orm";
import { getWeekActivity } from "@/lib/streak";
import { getDailyPrompt } from "@/lib/prompts";

function localMonthStart() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function localYearStart() {
  return `${new Date().getFullYear()}-01-01`;
}

export async function GET() {
  try {
    const userId = await getUserId();
    const monthStart = localMonthStart();
    const yearStart = localYearStart();

    const [
      allPoems,
      allFanfics,
      allCollections,
      stats,
      recentPoems,
      recentFanfics,
      weekActivity,
      monthPoemRows,
      monthFanficRows,
      monthChapterRows,
      yearPoemRows,
      yearFanficRows,
      yearChapterRows,
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
      db.select({ id: poems.id }).from(poems).where(and(eq(poems.userId, userId), gte(poems.createdAt, monthStart))).all(),
      db.select({ id: fanfics.id }).from(fanfics).where(and(eq(fanfics.userId, userId), gte(fanfics.createdAt, monthStart))).all(),
      db.select({ id: chapters.id }).from(chapters).where(and(eq(chapters.userId, userId), gte(chapters.createdAt, monthStart))).all(),
      db.select({ id: poems.id }).from(poems).where(and(eq(poems.userId, userId), gte(poems.createdAt, yearStart))).all(),
      db.select({ id: fanfics.id }).from(fanfics).where(and(eq(fanfics.userId, userId), gte(fanfics.createdAt, yearStart))).all(),
      db.select({ id: chapters.id }).from(chapters).where(and(eq(chapters.userId, userId), gte(chapters.createdAt, yearStart))).all(),
    ]);

    return NextResponse.json({
      totalPoems: allPoems.length,
      totalFanfics: allFanfics.length,
      totalCollections: allCollections.length,
      currentStreak: stats?.currentStreak ?? 0,
      monthPoems: monthPoemRows.length,
      monthFanfics: monthFanficRows.length + monthChapterRows.length,
      yearPoems: yearPoemRows.length,
      yearFanfics: yearFanficRows.length + yearChapterRows.length,
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
