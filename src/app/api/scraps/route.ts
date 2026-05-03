import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { scraps } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const userId = await getUserId();
    const result = await db.select().from(scraps).where(eq(scraps.userId, userId)).orderBy(desc(scraps.createdAt));
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    if (!body.body) return NextResponse.json({ error: "Body is required" }, { status: 400 });
    const scrap = { id: randomUUID(), userId, body: body.body, mood: body.mood ?? null, createdAt: new Date().toISOString() };
    await db.insert(scraps).values(scrap);
    return NextResponse.json(scrap, { status: 201 });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
