import { NextResponse } from "next/server";
import { db } from "@/db";
import { waitlist } from "@/db/schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Waitlist sink. NOTE: without DATABASE_URL (local dev) it accepts and
// drops the email so the UI flow can be exercised; production must have
// the pooled Neon URL configured or signups are lost.
export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (process.env.DATABASE_URL) {
    try {
      await db()
        .insert(waitlist)
        .values({ email: email.trim().toLowerCase() })
        .onConflictDoNothing();
    } catch {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
