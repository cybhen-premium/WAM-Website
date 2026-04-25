import { db } from "@/db";
import { liveStreamSettings } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [data] = await db.select().from(liveStreamSettings).where(eq(liveStreamSettings.id, 1));
    return NextResponse.json(data || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    
    // Check if record exists
    const [existing] = await db.select().from(liveStreamSettings).where(eq(liveStreamSettings.id, 1));
    
    if (existing) {
      await db.update(liveStreamSettings)
        .set({
          videoId: body.videoId,
          isLive: body.isLive,
          title: body.title,
          updatedAt: new Date(),
        })
        .where(eq(liveStreamSettings.id, 1));
    } else {
      await db.insert(liveStreamSettings).values({
        id: 1,
        platform: "YouTube",
        videoId: body.videoId,
        isLive: body.isLive,
        title: body.title,
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
