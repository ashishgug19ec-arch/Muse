import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resourceType = searchParams.get("resourceType");
  const resourceId = searchParams.get("resourceId");
  if (!resourceType || !resourceId) return NextResponse.json({ error: "resourceType and resourceId required" }, { status: 400 });
  const result = await db.select().from(comments).where(and(eq(comments.resourceType, resourceType), eq(comments.resourceId, resourceId))).orderBy(desc(comments.createdAt));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    if (!body.resourceType || !body.resourceId || !body.body) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    const comment = { id: randomUUID(), userId, resourceType: body.resourceType, resourceId: body.resourceId, body: body.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await db.insert(comments).values(comment);
    return NextResponse.json(comment, { status: 201 });
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
