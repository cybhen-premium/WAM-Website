import { db } from "@/db";
import { sermons, newsletterSubscribers, events } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Fetch latest items from different tables
    const latestSermons = await db.select().from(sermons).orderBy(desc(sermons.createdAt)).limit(3);
    const latestSubscribers = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt)).limit(3);
    
    // Combine and format
    const activities = [
      ...latestSermons.map(s => ({
        type: "sermon",
        title: "New Sermon Uploaded",
        desc: `"${s.title}" was added.`,
        time: s.createdAt,
        color: "#3b82f6"
      })),
      ...latestSubscribers.map(sub => ({
        type: "subscriber",
        title: "New Subscriber Joined",
        desc: `${sub.email} joined the mailing list.`,
        time: sub.subscribedAt,
        color: "#10b981"
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
