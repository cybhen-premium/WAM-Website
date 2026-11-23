import { db } from "@/db";
import { sermons, newsletterSubscribers, events } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const fallbackActivities = [
  {
    type: "sermon",
    title: "New Sermon Published",
    desc: '"Living with Divine Purpose" by Rev. Benjamin Eturu Adom',
    time: "2 hours ago",
    color: "#3b82f6"
  },
  {
    type: "prayer",
    title: "Prayer Request Received",
    desc: "Intercession for family health & divine breakthrough",
    time: "4 hours ago",
    color: "#f59e0b"
  },
  {
    type: "subscriber",
    title: "New Newsletter Subscriber",
    desc: "grace.adom@example.com joined the church mailing list",
    time: "Yesterday",
    color: "#10b981"
  },
  {
    type: "event",
    title: "Annual Summit Created",
    desc: "World Missions & Apostolic Summit scheduled for Afienya",
    time: "2 days ago",
    color: "#8b5cf6"
  }
];

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const latestSermons = await db.select().from(sermons).orderBy(desc(sermons.createdAt)).limit(3);
    const latestSubscribers = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt)).limit(3);
    
    if (latestSermons.length === 0 && latestSubscribers.length === 0) {
      return NextResponse.json(fallbackActivities);
    }

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
    return NextResponse.json(fallbackActivities);
  }
}
