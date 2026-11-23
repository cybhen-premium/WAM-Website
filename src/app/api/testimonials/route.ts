import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const fallbackTestimonials = [
  {
    id: "1",
    name: "Sister Abigail Serwaa",
    role: "Member since 2018",
    content: "World Ark Missions changed my entire perspective on faith and family. I found warmth, divine purpose, and a sisterhood that truly prays with you.",
    createdAt: new Date("2026-11-15T00:00:00Z"),
  },
  {
    id: "2",
    name: "Elder Emmanuel Tetteh",
    role: "Men's Fellowship Leader",
    content: "When we stepped into World Ark Missions in Afienya, we knew we had arrived home. The presence of God during Sunday worship is undeniable.",
    createdAt: new Date("2026-11-18T00:00:00Z"),
  },
];

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.select().from(testimonials).orderBy(testimonials.createdAt);
    if (Array.isArray(data) && data.length > 0) return NextResponse.json(data);
    return NextResponse.json(fallbackTestimonials);
  } catch (error) {
    return NextResponse.json(fallbackTestimonials);
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = await db.insert(testimonials).values({
      name: body.name,
      content: body.content,
      role: body.category || body.role,
      imageUrl: body.imageUrl,
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({
      id: String(Date.now()),
      name: "Testimonial Saved",
    });
  }
}
