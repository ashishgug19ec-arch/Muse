import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { poems } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateSlug } from "@/lib/slug";
import { sql } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const poem = await db.select().from(poems).where(and(eq(poems.id, id), eq(poems.userId, userId))).get();
    if (!poem) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const slug = poem.slug ?? await generateSlug(poem.title);
    await db.update(poems).set({
      visibility: "public",
      slug,
      shareCount: sql`${poems.shareCount} + 1`,
      updatedAt: new Date().toISOString(),
    }).where(eq(poems.id, id));

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.json({
      shareUrl: `${appUrl}/p/${slug}`,
      imageUrl: `${appUrl}/api/public/poems/${slug}/image`,
    });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
