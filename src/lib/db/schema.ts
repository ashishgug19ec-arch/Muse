import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),
  pronouns: text("pronouns"),
  location: text("location"),
  whyYouWrite: text("why_you_write"),
  plan: text("plan").notNull().default("free"),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});

export const poems = sqliteTable("poems", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type"),
  mood: text("mood"),
  season: text("season"),
  visibility: text("visibility").notNull().default("private"),
  slug: text("slug").unique(),
  coverImageUrl: text("cover_image_url"),
  authorNote: text("author_note"),
  collectionId: text("collection_id"),
  readCount: integer("read_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
  shareCount: integer("share_count").notNull().default(0),
  isEditorsPick: integer("is_editors_pick").notNull().default(0),
  importSource: text("import_source"),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});

export const fanfics = sqliteTable("fanfics", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  blurb: text("blurb"),
  fandom: text("fandom"),
  genres: text("genres"),
  coverImageUrl: text("cover_image_url"),
  visibility: text("visibility").notNull().default("private"),
  slug: text("slug").unique(),
  status: text("status").notNull().default("ongoing"),
  contentRating: text("content_rating").notNull().default("all_ages"),
  readCount: integer("read_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
  shareCount: integer("share_count").notNull().default(0),
  chapterCount: integer("chapter_count").notNull().default(0),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});

export const chapters = sqliteTable("chapters", {
  id: text("id").primaryKey(),
  fanficId: text("fanfic_id").notNull().references(() => fanfics.id),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  chapterNumber: integer("chapter_number").notNull(),
  readCount: integer("read_count").notNull().default(0),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});

export const collections = sqliteTable("collections", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  season: text("season"),
  coverImageUrl: text("cover_image_url"),
  poemCount: integer("poem_count").notNull().default(0),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});

export const scraps = sqliteTable("scraps", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  mood: text("mood"),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

export const userStats = sqliteTable("user_stats", {
  userId: text("user_id").primaryKey().references(() => users.id),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastWrittenAt: text("last_written_at"),
  totalPoems: integer("total_poems").notNull().default(0),
  totalFanfics: integer("total_fanfics").notNull().default(0),
  totalReaders: integer("total_readers").notNull().default(0),
  monthlyGoal: integer("monthly_goal").notNull().default(10),
  monthlyCount: integer("monthly_count").notNull().default(0),
  monthlyResetAt: text("monthly_reset_at"),
  inkDropCount: integer("ink_drop_count").notNull().default(0),
  parchmentCount: integer("parchment_count").notNull().default(0),
  editorsPicks: integer("editors_picks").notNull().default(0),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

export const ikigaiJournal = sqliteTable("ikigai_journal", {
  userId: text("user_id").primaryKey().references(() => users.id),
  whatYouLove: text("what_you_love"),
  goodAt: text("good_at"),
  worldNeeds: text("world_needs"),
  canOffer: text("can_offer"),
  statement: text("statement"),
  score: integer("score").notNull().default(0),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});

export const ikigaiEntries = sqliteTable("ikigai_entries", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  promptText: text("prompt_text").notNull(),
  response: text("response").notNull(),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

export const badges = sqliteTable("badges", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  badgeId: text("badge_id").notNull(),
  earnedAt: text("earned_at").default(sql`(current_timestamp)`),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  isRead: integer("is_read").notNull().default(0),
  actorId: text("actor_id"),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

export const follows = sqliteTable("follows", {
  id: text("id").primaryKey(),
  followerId: text("follower_id").notNull().references(() => users.id),
  followingId: text("following_id").notNull().references(() => users.id),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

export const likes = sqliteTable("likes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  body: text("body").notNull(),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});
