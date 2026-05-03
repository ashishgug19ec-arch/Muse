import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { likes, poems } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { createNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const { resourceType, resourceId } = await req.json();
    if (!resourceType || !resourceId) return NextResponse.json({ error: "resourceType and resourceId required" }, { status: 400 });

    const existing = await db.select().from(likes).where(and(eq(likes.userId, userId), eq(likes.resourceType, resourceType), eq(likes.resourceId, resourceId))).get();
    if (existing) return NextResponse.json({ error: "Already liked" }, { status: 409 });

    await db.insert(likes).values({ id: randomUUID(), userId, resourceType, resourceId, createdAt: new Date().toISOString() });

    if (resourceType === "poem") {
      const updated = await db.update(poems)
        .set({ likeCount: sql`${poems.likeCount} + 1` })
        .where(eq(poems.id, resourceId))
        .returning()
        .get();
      if (updated && updated.userId !== userId) {
        await createNotification({ userId: updated.userId, type: "like", title: "Someone liked your poem", actorId: userId, resourceType: "poem", resourceId });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserId();
    const { resourceType, resourceId } = await req.json();

    await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.resourceType, resourceType), eq(likes.resourceId, resourceId)));

    if (resourceType === "poem") {
      await db.update(poems)
        .set({ likeCount: sql`CASE WHEN ${poems.likeCount} > 0 THEN ${poems.likeCount} - 1 ELSE 0 END` })
        .where(eq(poems.id, resourceId));
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
