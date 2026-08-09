import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// DATABASE_URL must be the POOLED Neon endpoint (the host contains
// "-pooler"). Vercel serverless opens one connection per invocation;
// a classroom of 30 students will exhaust a direct connection limit.
function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return drizzle(neon(url), { schema });
}

// Lazy singleton so importing this module never crashes a build
// that has no database configured yet.
let _db: ReturnType<typeof getDb> | undefined;

export function db() {
  _db ??= getDb();
  return _db;
}
