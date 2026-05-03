import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ikigaiEntries } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const userId = await getUserId();
    const entries = await db.select().from(ikigaiEntries).where(eq(ikigaiEntries.userId, userId)).orderBy(desc(ikigaiEntries.createdAt));
    return NextResponse.json(entries);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    if (!body.promptText || !body.response) return NextResponse.json({ error: "promptText and response required" }, { status: 400 });
    const entry = { id: randomUUID(), userId, promptText: body.promptText, response: body.response, createdAt: new Date().toISOString() };
    await db.insert(ikigaiEntries).values(entry);
    return NextResponse.json(entry, { status: 201 });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
