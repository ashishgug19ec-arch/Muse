import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { collections } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const col = await db.select().from(collections).where(and(eq(collections.id, id), eq(collections.userId, userId))).get();
    if (!col) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const allowed = ["name", "description", "season", "coverImageUrl"] as const;
    const update: Partial<Record<typeof allowed[number], string | null>> & { updatedAt: string } = { updatedAt: new Date().toISOString() };
    for (const key of allowed) if (body[key] !== undefined) update[key] = body[key] as string | null;

    const updated = await db.update(collections).set(update).where(eq(collections.id, id)).returning();
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
    const col = await db.select().from(collections).where(and(eq(collections.id, id), eq(collections.userId, userId))).get();
    if (!col) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await db.delete(collections).where(eq(collections.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
