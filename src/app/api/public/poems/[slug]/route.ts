import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { poems, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const poem = await db.select().from(poems).where(and(eq(poems.slug, slug), eq(poems.visibility, "public"))).get();
  if (!poem) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.update(poems).set({ readCount: sql`${poems.readCount} + 1` }).where(eq(poems.id, poem.id));

  const author = await db.select({ displayName: users.displayName, username: users.username, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, poem.userId)).get();

  return NextResponse.json({ ...poem, author });
}
