import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Content (module text, screens) lives in MDX files in the repo, never here.
// The database stores only users, progress, submissions, and events.
// The competition table is deferred: competition/leaderboard work is on hold.

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  googleId: text("google_id").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const progress = pgTable(
  "progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moduleSlug: text("module_slug").notNull(),
    screenIndex: integer("screen_index").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    // One progress row per user per module; screen_index advances in place.
    uniqueIndex("progress_user_module_idx").on(table.userId, table.moduleSlug),
  ],
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moduleSlug: text("module_slug").notNull(),
    artifact: jsonb("artifact").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("submissions_user_idx").on(table.userId)],
);

// Analytics from day one: module_started, screen_advanced,
// module_completed, project_submitted. user_id is nullable because
// module 01 is playable without an account.
export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    payload: jsonb("payload"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("events_name_created_idx").on(table.name, table.createdAt)],
);
