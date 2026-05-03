import { db } from "./db";
import { poems, fanfics } from "./db/schema";
import { eq } from "drizzle-orm";

/**
 * Generates a URL-safe slug from a title with a 4-char random suffix.
 * Checks both poems and fanfics tables for uniqueness before returning.
 */
export async function generateSlug(title: string): Promise<string> {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);

  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const suffix = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");

  const candidate = `${base}-${suffix}`;

  const [poemMatch, fanficMatch] = await Promise.all([
    db.select({ id: poems.id }).from(poems).where(eq(poems.slug, candidate)).get(),
    db.select({ id: fanfics.id }).from(fanfics).where(eq(fanfics.slug, candidate)).get(),
  ]);

  if (poemMatch || fanficMatch) return generateSlug(title);
  return candidate;
}
