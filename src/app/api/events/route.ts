import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";

const KNOWN_EVENTS = new Set([
  "module_started",
  "screen_advanced",
  "module_completed",
  "project_submitted",
]);

// Analytics sink. Without a configured database it accepts and drops
// events so the client never sees an error; with one it inserts into
// the events table. userId stays null until auth exists.
export async function POST(request: Request) {
  let name: unknown;
  let payload: unknown;
  try {
    ({ name, payload } = await request.json());
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (typeof name !== "string" || !KNOWN_EVENTS.has(name)) {
    return new NextResponse(null, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await db()
      .insert(events)
      .values({ name, payload: payload ?? null });
  } catch {
    // Never surface analytics failures to the student.
  }
  return new NextResponse(null, { status: 204 });
}
