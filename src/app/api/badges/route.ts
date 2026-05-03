import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { badges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getUserId();
    const result = await db.select().from(badges).where(eq(badges.userId, userId));
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
