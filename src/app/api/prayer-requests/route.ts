import { db } from "@/db";
import { prayerRequests } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.select().from(prayerRequests).orderBy(prayerRequests.createdAt);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch prayer requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(prayerRequests).values({
      name: body.name,
      email: body.email,
      phone: body.phone,
      request: body.request,
      isPrivate: body.isPrivate || false,
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit prayer request" }, { status: 500 });
  }
}
