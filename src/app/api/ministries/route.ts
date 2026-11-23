import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import defaultMinistries from "@/data/ministries.json";

export async function GET() {
  try {
    const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, "ministries_data"));
    if (row?.value) {
      const parsed = JSON.parse(row.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return NextResponse.json(parsed);
      }
    }
  } catch (error) {
    // Database query failed, use disk/memory fallback
  }

  try {
    const filePath = path.join(process.cwd(), "src", "data", "ministries.json");
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json(defaultMinistries);
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    let updatedList = [];

    // If body is an array, save entire list
    if (Array.isArray(body)) {
      updatedList = body;
    } else {
      // If single item, update or insert into existing list
      let currentList = defaultMinistries;
      try {
        const filePath = path.join(process.cwd(), "src", "data", "ministries.json");
        const content = await fs.readFile(filePath, "utf-8");
        currentList = JSON.parse(content);
      } catch {}

      const index = currentList.findIndex((m: any) => m.slug === body.slug);
      if (index >= 0) {
        currentList[index] = { ...currentList[index], ...body };
      } else {
        currentList.push({
          slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: body.title,
          shortDescription: body.shortDescription || "",
          longDescription: body.longDescription || "",
          image: body.image || "/assets/11.jpg",
          gallery: body.gallery || ["/assets/11.jpg"],
          iconName: body.iconName || "Users"
        });
      }
      updatedList = currentList;
    }

    const jsonString = JSON.stringify(updatedList, null, 2);

    // Save to disk
    try {
      const filePath = path.join(process.cwd(), "src", "data", "ministries.json");
      await fs.writeFile(filePath, jsonString, "utf-8");
    } catch (diskErr) {
      console.warn("Could not save ministries.json:", diskErr);
    }

    // Save to database
    try {
      const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.key, "ministries_data"));
      if (existing) {
        await db.update(siteSettings)
          .set({ value: jsonString, updatedAt: new Date() })
          .where(eq(siteSettings.key, "ministries_data"));
      } else {
        await db.insert(siteSettings).values({
          key: "ministries_data",
          value: jsonString,
        });
      }
    } catch (dbErr) {
      console.warn("Database save failed for ministries_data:", dbErr);
    }

    return NextResponse.json({ success: true, ministries: updatedList });
  } catch (error) {
    console.error("Failed to save ministry:", error);
    return NextResponse.json({ error: "Failed to save ministry" }, { status: 500 });
  }
}
