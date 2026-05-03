import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { scraps, userStats } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const text = body.text ?? body.url ?? "";
    if (!text) return NextResponse.json({ error: "No content" }, { status: 400 });

    const scrap = { id: randomUUID(), userId, body: text, mood: null, createdAt: new Date().toISOString() };
    await db.insert(scraps).values(scrap);
    await db.update(userStats).set({ inkDropCount: sql`${userStats.inkDropCount} + 1` }).where(eq(userStats.userId, userId));

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/sanctuary?draft=${scrap.id}`);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
