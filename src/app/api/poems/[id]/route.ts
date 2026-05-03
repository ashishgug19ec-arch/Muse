import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { poems, userStats } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { generateSlug } from "@/lib/slug";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const poem = await db.select().from(poems).where(and(eq(poems.id, id), eq(poems.userId, userId))).get();
    if (!poem) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(poem);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const poem = await db.select().from(poems).where(and(eq(poems.id, id), eq(poems.userId, userId))).get();
    if (!poem) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const slug = body.visibility === "public" && !poem.slug ? await generateSlug(body.title ?? poem.title) : poem.slug;

    const updated = await db.update(poems).set({
      title:        body.title        ?? poem.title,
      body:         body.body         ?? poem.body,
      type:         body.type         ?? poem.type,
      mood:         body.mood         ?? poem.mood,
      season:       body.season       ?? poem.season,
      visibility:   body.visibility   ?? poem.visibility,
      slug,
      coverImageUrl: body.coverImageUrl ?? poem.coverImageUrl,
      authorNote:    body.authorNote   ?? poem.authorNote,
      collectionId:  body.collectionId ?? poem.collectionId,
      updatedAt: new Date().toISOString(),
    }).where(eq(poems.id, id)).returning();

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
    const poem = await db.select().from(poems).where(and(eq(poems.id, id), eq(poems.userId, userId))).get();
    if (!poem) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.delete(poems).where(eq(poems.id, id));
    // Safely decrement — never goes below 0
    await db.update(userStats)
      .set({ totalPoems: sql`CASE WHEN ${userStats.totalPoems} > 0 THEN ${userStats.totalPoems} - 1 ELSE 0 END` })
      .where(eq(userStats.userId, userId));

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
