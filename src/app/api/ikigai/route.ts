import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ikigaiJournal } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateIkigaiScore } from "@/lib/ikigai";

export async function GET() {
  try {
    const userId = await getUserId();
    const journal = await db.select().from(ikigaiJournal).where(eq(ikigaiJournal.userId, userId)).get();
    return NextResponse.json(journal);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();

    // Whitelist — prevents client from overwriting score directly
    const allowed = ["whatYouLove", "goodAt", "worldNeeds", "canOffer", "statement"] as const;
    const update: Record<string, string | null> & { updatedAt: string } = { updatedAt: new Date().toISOString() };
    for (const key of allowed) if (body[key] !== undefined) update[key] = body[key] as string | null;

    await db.update(ikigaiJournal).set(update).where(eq(ikigaiJournal.userId, userId));
    const score = await updateIkigaiScore(userId);
    const journal = await db.select().from(ikigaiJournal).where(eq(ikigaiJournal.userId, userId)).get();
    return NextResponse.json({ ...journal, score });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
