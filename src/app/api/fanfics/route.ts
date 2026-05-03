import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { fanfics, userStats } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { generateSlug } from "@/lib/slug";

export async function GET() {
  try {
    const userId = await getUserId();
    const result = await db.select().from(fanfics).where(eq(fanfics.userId, userId)).orderBy(desc(fanfics.createdAt));
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    if (!body.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    const slug = body.visibility === "public" ? await generateSlug(body.title) : null;
    const fic = { id: randomUUID(), userId, title: body.title, blurb: body.blurb ?? null, fandom: body.fandom ?? null, genres: body.genres ? JSON.stringify(body.genres) : null, coverImageUrl: body.coverImageUrl ?? null, visibility: body.visibility ?? "private", slug, status: body.status ?? "ongoing", contentRating: body.contentRating ?? "all_ages", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await db.insert(fanfics).values(fic);
    await db.update(userStats).set({ totalFanfics: sql`${userStats.totalFanfics} + 1` }).where(eq(userStats.userId, userId));
    return NextResponse.json(fic, { status: 201 });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
