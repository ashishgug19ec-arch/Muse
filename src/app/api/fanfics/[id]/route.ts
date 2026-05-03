import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { fanfics } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const fic = await db.select().from(fanfics).where(and(eq(fanfics.id, id), eq(fanfics.userId, userId))).get();
    if (!fic) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(fic);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const fic = await db.select().from(fanfics).where(and(eq(fanfics.id, id), eq(fanfics.userId, userId))).get();
    if (!fic) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const allowed = ["title", "blurb", "fandom", "genres", "status", "contentRating", "visibility", "coverImageUrl"] as const;
    const update: Record<string, string | null> & { updatedAt: string } = { updatedAt: new Date().toISOString() };
    for (const key of allowed) if (body[key] !== undefined) update[key] = body[key] as string | null;

    const updated = await db.update(fanfics).set(update).where(eq(fanfics.id, id)).returning();
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
    const fic = await db.select().from(fanfics).where(and(eq(fanfics.id, id), eq(fanfics.userId, userId))).get();
    if (!fic) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await db.delete(fanfics).where(eq(fanfics.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
