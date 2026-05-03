import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const allowed = ["displayName", "bio", "pronouns", "location", "whyYouWrite", "avatarUrl", "bannerUrl", "username"] as const;
    const update: Record<string, string | null> & { updatedAt: string } = { updatedAt: new Date().toISOString() };
    for (const key of allowed) if (body[key] !== undefined) update[key] = body[key] as string | null;
    const updated = await db.update(users).set(update).where(eq(users.id, userId)).returning();
    return NextResponse.json(updated[0]);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
