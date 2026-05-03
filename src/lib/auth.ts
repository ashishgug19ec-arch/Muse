import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "./db";
import { users, userStats, ikigaiJournal } from "./db/schema";
import { eq } from "drizzle-orm";

/**
 * Gets the authenticated userId from Clerk session.
 * Also ensures the user row exists in our DB (handles Google OAuth
 * sign-ups where the webhook hasn't fired yet in local dev).
 * Throws a 401 response if not authenticated.
 */
export async function getUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserInDb(userId);
  return userId;
}

async function ensureUserInDb(userId: string): Promise<void> {
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).get();
  if (existing) return;

  // First time this user hits the API — seed their row from Clerk
  const clerkUser = await currentUser();
  if (!clerkUser) return;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const username =
    clerkUser.username ??
    email.split("@")[0].replace(/[^a-z0-9_]/gi, "").slice(0, 20) + "_" + userId.slice(-4);

  await db.insert(users).values({
    id: userId,
    email,
    username,
    displayName:
      `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || username,
    avatarUrl: clerkUser.imageUrl ?? null,
    plan: "free",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await db.insert(userStats).values({
    userId,
    createdAt: new Date().toISOString(),
  });

  await db.insert(ikigaiJournal).values({
    userId,
    updatedAt: new Date().toISOString(),
  });
}
