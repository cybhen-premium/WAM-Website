import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import defaultSections from "@/data/siteSections.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "CDN-Cache-Control": "no-store",
  };

  try {
    const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, "site_sections_data"));
    if (row?.value) {
      const parsed = JSON.parse(row.value);
      const merged = { ...defaultSections, ...parsed };
      return NextResponse.json(merged, { headers });
    }
  } catch (error) {
    // Database fallback
  }

  try {
    const filePath = path.join(process.cwd(), "src", "data", "siteSections.json");
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content), { headers });
  } catch {
    return NextResponse.json(defaultSections, { headers });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const jsonString = JSON.stringify(body, null, 2);

    // Save to disk for instant persistent fallback
    try {
      const filePath = path.join(process.cwd(), "src", "data", "siteSections.json");
      await fs.writeFile(filePath, jsonString, "utf-8");
    } catch (diskErr) {
      console.warn("Could not save siteSections.json to disk:", diskErr);
    }

    // Save to database
    try {
      const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.key, "site_sections_data"));
      if (existing) {
        await db.update(siteSettings)
          .set({ value: jsonString, updatedAt: new Date() })
          .where(eq(siteSettings.key, "site_sections_data"));
      } else {
        await db.insert(siteSettings).values({
          key: "site_sections_data",
          value: jsonString,
          type: "json",
        });
      }
    } catch (dbErr) {
      console.warn("Database save failed for site_sections_data:", dbErr);
    }

    return NextResponse.json(
      { success: true, sections: body },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Failed to update sections:", error);
    return NextResponse.json({ error: "Failed to update sections" }, { status: 500 });
  }
}
