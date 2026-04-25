import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(newsletterSubscribers).values({
      email: body.email,
    }).onConflictDoNothing().returning();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

export async function GET() {
  // Only for admins
  const { auth } = require("@/auth");
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.select().from(newsletterSubscribers).orderBy(newsletterSubscribers.subscribedAt);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
