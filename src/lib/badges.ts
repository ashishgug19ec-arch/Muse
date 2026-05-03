import { db } from "./db";
import { badges as badgesTable } from "./db/schema";
import { createNotification } from "./notifications";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface Badge {
  id: string;
  label: string;
  description: string;
  emoji: string;
}

export interface Stats {
  totalPoems: number;
  longestStreak: number;
  editorsPicks: number;
  inkDropCount: number;
  parchmentCount: number;
  ikigaiScore?: number;
}

const BADGE_CONFIG: Array<Badge & { check: (s: Stats) => boolean }> = [
  { id: "first_poem",    label: "First Word",        description: "Published your first poem",            emoji: "🌱", check: (s) => s.totalPoems >= 1 },
  { id: "streak_7",      label: "Week of Words",     description: "7-day writing streak",                 emoji: "🔥", check: (s) => s.longestStreak >= 7 },
  { id: "streak_30",     label: "Moon Writer",       description: "30-day writing streak",                emoji: "🌙", check: (s) => s.longestStreak >= 30 },
  { id: "poems_10",      label: "Ink Vessel",        description: "Wrote 10 poems",                       emoji: "🖋️", check: (s) => s.totalPoems >= 10 },
  { id: "poems_50",      label: "Muse's Chosen",     description: "Wrote 50 poems",                       emoji: "✨", check: (s) => s.totalPoems >= 50 },
  { id: "editors_pick",  label: "Editor's Muse",     description: "Featured by the editors",              emoji: "🌸", check: (s) => s.editorsPicks >= 1 },
  { id: "ikigai_90",     label: "Ikigai Found",      description: "Ikigai score reached 90",              emoji: "🌀", check: (s) => (s.ikigaiScore ?? 0) >= 90 },
  { id: "ink_drop",      label: "Ink Drop",          description: "Used Ink Drop to capture an idea",     emoji: "💧", check: (s) => s.inkDropCount >= 1 },
  { id: "parchment",     label: "Parchment Keeper",  description: "Used Parchment Lens to scan handwriting", emoji: "📜", check: (s) => s.parchmentCount >= 1 },
];

/** Converts raw DB userStats row into the Stats shape (handles null → 0). */
export function toStats(row: {
  totalPoems: number | null;
  longestStreak: number | null;
  editorsPicks: number | null;
  inkDropCount: number | null;
  parchmentCount: number | null;
}): Stats {
  return {
    totalPoems:    row.totalPoems    ?? 0,
    longestStreak: row.longestStreak ?? 0,
    editorsPicks:  row.editorsPicks  ?? 0,
    inkDropCount:  row.inkDropCount  ?? 0,
    parchmentCount: row.parchmentCount ?? 0,
  };
}

/** Returns badges the user has earned based on their stats. */
export function getEarnedBadges(stats: Stats): Badge[] {
  return BADGE_CONFIG.filter((b) => b.check(stats)).map(({ check: _, ...b }) => b);
}

/** Returns badges earned after a stats update that weren't earned before. */
export function getNewlyEarnedBadges(before: Stats, after: Stats): Badge[] {
  const prev = new Set(getEarnedBadges(before).map((b) => b.id));
  return getEarnedBadges(after).filter((b) => !prev.has(b.id));
}

/** Saves a badge to DB and creates a notification for the user. */
export async function awardBadge(userId: string, badge: Badge): Promise<void> {
  const existing = await db
    .select()
    .from(badgesTable)
    .where(and(eq(badgesTable.userId, userId), eq(badgesTable.badgeId, badge.id)))
    .get();

  if (existing) return;

  await db.insert(badgesTable).values({
    id: randomUUID(),
    userId,
    badgeId: badge.id,
    earnedAt: new Date().toISOString(),
  });

  await createNotification({
    userId,
    type: "badge",
    title: `You earned: ${badge.emoji} ${badge.label}`,
    body: badge.description,
    resourceType: "badge",
    resourceId: badge.id,
  });
}
