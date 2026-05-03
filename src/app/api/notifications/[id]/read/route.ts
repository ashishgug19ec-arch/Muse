import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function PUT(_req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const n = await db.select().from(notifications).where(and(eq(notifications.id, id), eq(notifications.userId, userId))).get();
    if (!n) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await db.update(notifications).set({ isRead: 1 }).where(eq(notifications.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
