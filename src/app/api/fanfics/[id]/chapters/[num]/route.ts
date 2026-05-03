import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { chapters, fanfics } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type Params = { params: Promise<{ id: string; num: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id, num } = await params;
    const fic = await db.select().from(fanfics).where(and(eq(fanfics.id, id), eq(fanfics.userId, userId))).get();
    if (!fic) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const update: { title?: string; body?: string; updatedAt: string } = { updatedAt: new Date().toISOString() };
    if (body.title) update.title = body.title as string;
    if (body.body)  update.body  = body.body  as string;

    const updated = await db.update(chapters)
      .set(update)
      .where(and(eq(chapters.fanficId, id), eq(chapters.chapterNumber, parseInt(num))))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
