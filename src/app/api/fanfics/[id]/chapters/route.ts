import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { chapters, fanfics } from "@/lib/db/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const fic = await db.select().from(fanfics).where(and(eq(fanfics.id, id), eq(fanfics.userId, userId))).get();
    if (!fic) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const result = await db.select().from(chapters).where(eq(chapters.fanficId, id)).orderBy(asc(chapters.chapterNumber));
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const fic = await db.select().from(fanfics).where(and(eq(fanfics.id, id), eq(fanfics.userId, userId))).get();
    if (!fic) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await req.json();
    if (!body.title || !body.body) return NextResponse.json({ error: "Title and body required" }, { status: 400 });
    const chapter = { id: randomUUID(), fanficId: id, userId, title: body.title, body: body.body, chapterNumber: (fic.chapterCount ?? 0) + 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await db.insert(chapters).values(chapter);
    await db.update(fanfics).set({ chapterCount: sql`${fanfics.chapterCount} + 1`, updatedAt: new Date().toISOString() }).where(eq(fanfics.id, id));
    return NextResponse.json(chapter, { status: 201 });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
