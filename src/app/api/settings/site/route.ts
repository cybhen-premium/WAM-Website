import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(siteSettings);
    // Convert array of key-value pairs to a single object
    const settings = data.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as any);
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    
    // We assume body is an object like { announcement: "...", contactEmail: "..." }
    for (const [key, value] of Object.entries(body)) {
      const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
      
      if (existing) {
        await db.update(siteSettings)
          .set({ value: value as string, updatedAt: new Date() })
          .where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings).values({
          key,
          value: value as string,
        });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
