import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Default fallback in case DB is unreachable
const fallbackTestimonials = [
  {
    id: "1",
    name: "Sarah Mensah",
    role: "Women of Grace Member",
    content: "World Ark Missions changed my entire perspective on faith and family. I found warmth, divine purpose, and a sisterhood that truly prays with you.",
    imageUrl: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477251/world-ark-missions/portrait-young-smiling-woman-wearing-sportswear-morning-park_93675-133003.jpg",
  },
  {
    id: "2",
    name: "Kwame Asante",
    role: "Youth Leader",
    content: "The teachings by Rev. Benjamin Adom challenged me to lead with biblical integrity and pursue my career with Kingdom conviction.",
    imageUrl: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477256/world-ark-missions/smiling-african-american-man-looking_74855-5149.jpg",
  },
  {
    id: "3",
    name: "Eunice & David Baah",
    role: "Church Family",
    content: "When we stepped into World Ark Missions in Afienya, we knew we had arrived home. The presence of God during Sunday worship is undeniable.",
    imageUrl: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477236/world-ark-missions/female-male-patients-applauding_23-2148398348.jpg",
  },
];

// Public GET: Returns active testimonials for both public website & admin
export async function GET() {
  try {
    const data = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));

    if (Array.isArray(data) && data.length > 0) {
      // Map properties so both camelCase and snake_case work smoothly
      const formatted = data.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role || "",
        content: t.content,
        imageUrl: t.imageUrl || "",
        image: t.imageUrl || "",
        isApproved: t.isApproved,
        isFeatured: t.isFeatured,
        createdAt: t.createdAt,
      }));
      return NextResponse.json(formatted);
    }

    return NextResponse.json(fallbackTestimonials);
  } catch (error) {
    console.error("Failed to read testimonials from DB:", error);
    return NextResponse.json(fallbackTestimonials);
  }
}

// Protected POST: Create new testimonial
export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.name || !body.content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    const inserted = await db
      .insert(testimonials)
      .values({
        name: body.name,
        role: body.role || body.category || "",
        content: body.content,
        imageUrl: body.imageUrl || body.image || "",
        isApproved: body.isApproved ?? true,
        isFeatured: body.isFeatured ?? true,
      })
      .returning();

    return NextResponse.json({ success: true, testimonial: inserted[0] });
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

// Protected DELETE: Remove a testimonial
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Testimonial ID required" }, { status: 400 });
    }

    await db.delete(testimonials).where(eq(testimonials.id, id));
    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
