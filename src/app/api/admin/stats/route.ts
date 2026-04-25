import { db } from "@/db";
import { sermons, contactMessages, prayerRequests, newsletterSubscribers } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { count } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [sermonCount] = await db.select({ value: count() }).from(sermons);
    const [messageCount] = await db.select({ value: count() }).from(contactMessages);
    const [prayerCount] = await db.select({ value: count() }).from(prayerRequests);
    const [subscriberCount] = await db.select({ value: count() }).from(newsletterSubscribers);

    return NextResponse.json({
      sermons: sermonCount.value,
      messages: messageCount.value,
      prayers: prayerCount.value,
      subscribers: subscriberCount.value,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
