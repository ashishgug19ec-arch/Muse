import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { follows } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { createNotification } from "@/lib/notifications";

type Params = { params: Promise<{ userId: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const currentUserId = await getUserId();
    const { userId: targetId } = await params;
    if (currentUserId === targetId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    await db.insert(follows).values({ id: randomUUID(), followerId: currentUserId, followingId: targetId, createdAt: new Date().toISOString() });
    await createNotification({ userId: targetId, type: "follow", title: "Someone followed you", actorId: currentUserId });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const currentUserId = await getUserId();
    const { userId: targetId } = await params;
    await db.delete(follows).where(and(eq(follows.followerId, currentUserId), eq(follows.followingId, targetId)));
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
