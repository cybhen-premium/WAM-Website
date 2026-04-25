import { db } from "@/db";
import { sermons } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.select().from(sermons).orderBy(sermons.date);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sermons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const slug =
      body.slug ||
      String(body.title || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const result = await db.insert(sermons).values({
      title: body.title,
      slug,
      description: body.description,
      speaker: body.speaker || "Rev. Benjamin Eturu Adom",
      date: new Date(body.date),
      category: body.category,
      coverUrl: body.imageUrl,
      videoUrl: body.videoUrl,
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create sermon" }, { status: 500 });
  }
}
