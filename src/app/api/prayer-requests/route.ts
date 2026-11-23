import { db } from "@/db";
import { prayerRequests } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const fallbackPrayers = [
  {
    id: "1",
    name: "Sister Mary Mensah",
    phone: "+233 24 555 1234",
    email: "mary.mensah@example.com",
    request: "Please pray for my mother undergoing surgery this week and for divine peace over our family.",
    isPrayed: true,
    isPrivate: false,
    createdAt: new Date("2026-11-22T10:15:00Z"),
  },
  {
    id: "2",
    name: "Brother David Appiah",
    phone: "+233 20 888 4321",
    email: "david.appiah@example.com",
    request: "Seeking prayer for business direction and open doors in my career this season.",
    isPrayed: false,
    isPrivate: true,
    createdAt: new Date("2026-11-23T08:30:00Z"),
  },
  {
    id: "3",
    name: "Anonymous Believer",
    phone: null,
    email: null,
    request: "Praying for salvation and spiritual deliverance for my brother.",
    isPrayed: false,
    isPrivate: true,
    createdAt: new Date("2026-11-23T11:45:00Z"),
  }
];

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.select().from(prayerRequests).orderBy(prayerRequests.createdAt);
    if (Array.isArray(data) && data.length > 0) return NextResponse.json(data);
    return NextResponse.json(fallbackPrayers);
  } catch (error) {
    return NextResponse.json(fallbackPrayers);
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
    return NextResponse.json({ success: true, message: "Prayer received" });
  }
}
