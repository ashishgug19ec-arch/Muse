import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { userStats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getUserId();
    const stats = await db.select().from(userStats).where(eq(userStats.userId, userId)).get();
    return NextResponse.json(stats);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
