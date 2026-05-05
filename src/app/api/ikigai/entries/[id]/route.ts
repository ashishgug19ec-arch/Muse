import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ikigaiEntries } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const entry = await db.select().from(ikigaiEntries).where(and(eq(ikigaiEntries.id, id), eq(ikigaiEntries.userId, userId))).get();
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await db.delete(ikigaiEntries).where(eq(ikigaiEntries.id, id));
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
