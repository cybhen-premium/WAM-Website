import { NextResponse } from "next/server";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function categorizeImage(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("logo")) return "Branding";
  if (lower.includes("sunday") || lower.includes("kjmc") || lower.includes("rescue") || lower.includes("com.")) return "Services";
  if (lower.includes("rev") || lower.includes("priest") || lower.includes("founder")) return "Leadership";
  if (lower.includes("youth") || lower.includes("wedding") || lower.includes("student")) return "Ministries";
  return "General";
}

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const publicDir = path.join(process.cwd(), "public");
    const assetsDir = path.join(publicDir, "assets");
    const uploadsDir = path.join(publicDir, "uploads");

    // Ensure uploads directory exists
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const items: Array<{
      name: string;
      url: string;
      size: string;
      sizeBytes: number;
      modified: string;
      folder: "assets" | "uploads";
      category: string;
    }> = [];

    // Scan uploads first (most recent / custom user images)
    try {
      const uploadFiles = await fs.readdir(uploadsDir);
      for (const file of uploadFiles) {
        const ext = path.extname(file).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          const stat = await fs.stat(path.join(uploadsDir, file));
          items.push({
            name: file,
            url: `/uploads/${file}`,
            size: formatBytes(stat.size),
            sizeBytes: stat.size,
            modified: stat.mtime.toISOString(),
            folder: "uploads",
            category: "Uploads",
          });
        }
      }
    } catch {
      // ignore
    }

    // Scan public/assets
    try {
      const assetFiles = await fs.readdir(assetsDir);
      for (const file of assetFiles) {
        const ext = path.extname(file).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          const stat = await fs.stat(path.join(assetsDir, file));
          items.push({
            name: file,
            url: `/assets/${file}`,
            size: formatBytes(stat.size),
            sizeBytes: stat.size,
            modified: stat.mtime.toISOString(),
            folder: "assets",
            category: categorizeImage(file),
          });
        }
      }
    } catch {
      // ignore
    }

    // Sort by modified date descending (newest first)
    items.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

    return NextResponse.json({
      images: items,
      total: items.length,
      uploadsCount: items.filter((i) => i.folder === "uploads").length,
      assetsCount: items.filter((i) => i.folder === "assets").length,
    });
  } catch (error) {
    console.error("Failed to read media:", error);
    return NextResponse.json({ error: "Failed to read media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const filesToProcess: File[] = [];
    if (files && files.length > 0) {
      filesToProcess.push(...files);
    } else if (singleFile) {
      filesToProcess.push(singleFile);
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const uploadedResults: Array<{ name: string; url: string; size: string }> = [];

    for (const file of filesToProcess) {
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        continue;
      }

      // Clean filename and add timestamp to avoid collisions
      const rawBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
      const safeName = `${rawBase}-${Date.now()}${ext}`;
      const destPath = path.join(uploadsDir, safeName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(destPath, buffer);

      uploadedResults.push({
        name: safeName,
        url: `/uploads/${safeName}`,
        size: formatBytes(file.size),
      });
    }

    if (uploadedResults.length === 0) {
      return NextResponse.json({ error: "No valid image files were uploaded" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedResults,
      count: uploadedResults.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Image URL required" }, { status: 400 });
    }

    // Safety: Only permit deleting files in /uploads/
    if (!url.startsWith("/uploads/")) {
      return NextResponse.json(
        { error: "Cannot delete built-in system assets. Only custom uploads can be removed." },
        { status: 403 }
      );
    }

    const filename = path.basename(url);
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    await fs.unlink(filePath);
    return NextResponse.json({ success: true, message: `Deleted ${filename}` });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
