import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { collections } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const userId = await getUserId();
    const result = await db.select().from(collections).where(eq(collections.userId, userId)).orderBy(desc(collections.createdAt));
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
    if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const col = { id: randomUUID(), userId, name: body.name, description: body.description ?? null, season: body.season ?? null, coverImageUrl: body.coverImageUrl ?? null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await db.insert(collections).values(col);
    return NextResponse.json(col, { status: 201 });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
