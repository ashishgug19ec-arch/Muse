import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fanfics, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const result = await db
    .select({ fanfic: fanfics, author: { displayName: users.displayName, username: users.username, avatarUrl: users.avatarUrl } })
    .from(fanfics)
    .leftJoin(users, eq(fanfics.userId, users.id))
    .where(eq(fanfics.visibility, "public"))
    .orderBy(desc(fanfics.readCount))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(result);
}
