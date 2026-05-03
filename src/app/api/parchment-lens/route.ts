import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { extractHandwriting } from "@/lib/parchment-lens";
import { db } from "@/lib/db";
import { userStats } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const { imageBase64 } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: "imageBase64 required" }, { status: 400 });

    const extractedText = await extractHandwriting(imageBase64);
    await db.update(userStats).set({ parchmentCount: sql`${userStats.parchmentCount} + 1` }).where(eq(userStats.userId, userId));

    return NextResponse.json({ extractedText });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
