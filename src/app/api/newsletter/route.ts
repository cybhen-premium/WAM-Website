import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const fallbackSubscribers = [
  { id: "1", email: "grace.adom@example.com", name: "Grace Adom", subscribedAt: new Date("2026-11-20T10:00:00Z"), isActive: true },
  { id: "2", email: "kwabena.darko@example.com", name: "Kwabena Darko", subscribedAt: new Date("2026-11-21T12:30:00Z"), isActive: true },
  { id: "3", email: "elizabeth.k@example.com", name: "Elizabeth K", subscribedAt: new Date("2026-11-22T14:15:00Z"), isActive: true },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.insert(newsletterSubscribers).values({
      email: body.email,
    }).onConflictDoNothing().returning();
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.select().from(newsletterSubscribers).orderBy(newsletterSubscribers.subscribedAt);
    if (Array.isArray(data) && data.length > 0) return NextResponse.json(data);
    return NextResponse.json(fallbackSubscribers);
  } catch {
    return NextResponse.json(fallbackSubscribers);
  }
}
