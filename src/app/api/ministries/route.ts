import { db } from "@/db";
import { ministries } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await db.select().from(ministries).orderBy(ministries.order);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ministries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = await db.insert(ministries).values({
      name: body.name,
      description: body.description,
      leadName: body.leadName,
      leadEmail: body.leadEmail,
      imageUrl: body.imageUrl,
      icon: body.icon,
      order: body.order || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ministry" }, { status: 500 });
  }
}
