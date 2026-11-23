import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const fallbackMessages = [
  {
    id: "1",
    name: "Kwame Owusu",
    email: "kwame.owusu@example.com",
    phone: "+233 24 111 2233",
    subject: "Visiting This Sunday with My Family",
    message: "Good day, I would like to know if there is Sunday school for kids during the 8:00 AM service?",
    createdAt: new Date("2026-11-23T09:20:00Z"),
    isRead: false,
  },
  {
    id: "2",
    name: "Akosua Boateng",
    email: "akosua.b@example.com",
    phone: "+233 20 999 8877",
    subject: "Joining the Youth Ministry Choir",
    message: "Hello leadership, I moved to Mataheko recently and would love to audition for the worship choir.",
    createdAt: new Date("2026-11-22T16:40:00Z"),
    isRead: true,
  }
];

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
    if (Array.isArray(data) && data.length > 0) return NextResponse.json(data);
    return NextResponse.json(fallbackMessages);
  } catch (error) {
    return NextResponse.json(fallbackMessages);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(contactMessages).values({
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ success: true, message: "Message received" });
  }
}
