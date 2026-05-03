import { db } from "./db";
import { notifications } from "./db/schema";
import { randomUUID } from "crypto";

interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  body?: string;
  actorId?: string;
  resourceType?: string;
  resourceId?: string;
}

/** Creates a notification for a user. Never called from client — server only. */
export async function createNotification(input: CreateNotificationInput): Promise<void> {
  await db.insert(notifications).values({
    id: randomUUID(),
    userId: input.userId,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    actorId: input.actorId ?? null,
    resourceType: input.resourceType ?? null,
    resourceId: input.resourceId ?? null,
    isRead: 0,
    createdAt: new Date().toISOString(),
  });
}
