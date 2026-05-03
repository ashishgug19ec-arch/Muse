import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, userStats, ikigaiJournal } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const { type, data } = payload;

  if (type === "user.created") {
    const username = data.username ?? data.email_addresses[0]?.email_address.split("@")[0];
    await db.insert(users).values({
      id: data.id,
      email: data.email_addresses[0]?.email_address,
      username,
      displayName: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || username,
      avatarUrl: data.image_url ?? null,
      plan: "free",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await db.insert(userStats).values({ userId: data.id, createdAt: new Date().toISOString() });
    await db.insert(ikigaiJournal).values({ userId: data.id, updatedAt: new Date().toISOString() });
  }

  if (type === "user.updated") {
    await db.update(users).set({
      email: data.email_addresses[0]?.email_address,
      avatarUrl: data.image_url ?? null,
      updatedAt: new Date().toISOString(),
    }).where(eq(users.id, data.id));
  }

  if (type === "user.deleted") {
    await db.delete(users).where(eq(users.id, data.id));
  }

  return NextResponse.json({ received: true });
}
