import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { poems, userStats } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { generateSlug } from "@/lib/slug";
import { updateStreak } from "@/lib/streak";
import { getNewlyEarnedBadges, awardBadge, toStats } from "@/lib/badges";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(req.url);

    const filters = [eq(poems.userId, userId)];
    if (searchParams.get("type"))         filters.push(eq(poems.type, searchParams.get("type")!));
    if (searchParams.get("mood"))         filters.push(eq(poems.mood, searchParams.get("mood")!));
    if (searchParams.get("season"))       filters.push(eq(poems.season, searchParams.get("season")!));
    if (searchParams.get("visibility"))   filters.push(eq(poems.visibility, searchParams.get("visibility")!));
    if (searchParams.get("collectionId")) filters.push(eq(poems.collectionId, searchParams.get("collectionId")!));

    const result = await db.select().from(poems).where(and(...filters)).orderBy(desc(poems.createdAt));
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

    if (!body.title || !body.body) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
    }

    const statsBefore = await db.select().from(userStats).where(eq(userStats.userId, userId)).get();

    const id = randomUUID();
    const slug = body.visibility === "public" ? await generateSlug(body.title) : null;

    const poem = {
      id,
      userId,
      title: body.title as string,
      body: body.body as string,
      type: (body.type as string | null) ?? null,
      mood: (body.mood as string | null) ?? null,
      season: (body.season as string | null) ?? null,
      visibility: (body.visibility as string) ?? "private",
      slug,
      coverImageUrl: (body.coverImageUrl as string | null) ?? null,
      authorNote: (body.authorNote as string | null) ?? null,
      collectionId: (body.collectionId as string | null) ?? null,
      importSource: (body.importSource as string | null) ?? "manual",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(poems).values(poem);
    await updateStreak(userId);

    const statsAfter = await db.select().from(userStats).where(eq(userStats.userId, userId)).get();
    if (statsBefore && statsAfter) {
      const newBadges = getNewlyEarnedBadges(toStats(statsBefore), toStats(statsAfter));
      await Promise.all(newBadges.map((b) => awardBadge(userId, b)));
    }

    return NextResponse.json(poem, { status: 201 });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
