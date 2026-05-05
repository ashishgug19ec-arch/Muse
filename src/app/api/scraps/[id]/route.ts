import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { scraps } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const scrap = await db.select().from(scraps).where(and(eq(scraps.id, id), eq(scraps.userId, userId))).get();
    if (!scrap) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await req.json();
    const updated = await db.update(scraps).set({
      body: body.body ?? scrap.body,
      mood: 'mood' in body ? body.mood : scrap.mood,
    }).where(eq(scraps.id, id)).returning();
    return NextResponse.json(updated[0]);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const scrap = await db.select().from(scraps).where(and(eq(scraps.id, id), eq(scraps.userId, userId))).get();
    if (!scrap) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await db.delete(scraps).where(eq(scraps.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
