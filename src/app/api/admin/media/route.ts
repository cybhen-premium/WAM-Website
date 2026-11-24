import { NextResponse } from "next/server";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";
import { 
  isCloudinaryConfigured, 
  uploadToCloudinary, 
  deleteFromCloudinary, 
  listCloudinaryImages 
} from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".jfif", ".avif", ".heic"];

function getExtensionForFile(file: File): string {
  let ext = path.extname(file.name || "").toLowerCase();
  if (ALLOWED_EXTENSIONS.includes(ext)) return ext;

  // Fallback to MIME type detection
  if (file.type) {
    const mime = file.type.toLowerCase();
    if (mime.includes("jpeg") || mime.includes("jpg")) return ".jpg";
    if (mime.includes("png")) return ".png";
    if (mime.includes("webp")) return ".webp";
    if (mime.includes("gif")) return ".gif";
    if (mime.includes("svg")) return ".svg";
    if (mime.includes("avif")) return ".avif";
  }
  return ext;
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const publicDir = path.join(process.cwd(), "public");
    const assetsDir = path.join(publicDir, "assets");
    const uploadsDir = path.join(publicDir, "uploads");

    const items: Array<{
      name: string;
      url: string;
      size: string;
      sizeBytes: number;
      modified: string;
      folder: "assets" | "uploads" | "cloudinary";
      category: string;
    }> = [];

    const cloudinaryActive = isCloudinaryConfigured();

    // 1. If Cloudinary is configured, list images from Cloudinary
    if (cloudinaryActive) {
      try {
        const cloudResources = await listCloudinaryImages("world-ark-missions", 100);
        for (const res of cloudResources) {
          const baseName = (res.public_id || "").split("/").pop() || "image";
          const ext = res.format ? `.${res.format}` : "";
          const fileName = `${baseName}${ext}`;
          items.push({
            name: fileName,
            url: res.secure_url,
            size: formatBytes(res.bytes || 0),
            sizeBytes: res.bytes || 0,
            modified: res.created_at || new Date().toISOString(),
            folder: "cloudinary",
            category: "Cloudinary",
          });
        }
      } catch (cloudErr) {
        console.error("Failed to fetch from Cloudinary:", cloudErr);
      }
    }

    // 2. Scan uploads directory (local custom uploads)
    try {
      await fs.access(uploadsDir);
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

    // 3. Scan public/assets (built-in system assets)
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
      cloudinaryCount: items.filter((i) => i.folder === "cloudinary").length,
      uploadsCount: items.filter((i) => i.folder === "uploads").length,
      assetsCount: items.filter((i) => i.folder === "assets").length,
      isCloudinaryConfigured: cloudinaryActive,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
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

    const cloudinaryActive = isCloudinaryConfigured();
    const uploadedResults: Array<{ name: string; url: string; size: string; storage: string }> = [];

    if (cloudinaryActive) {
      // Cloudinary cloud upload
      for (const file of filesToProcess) {
        const ext = getExtensionForFile(file);
        if (!ALLOWED_EXTENSIONS.includes(ext)) continue;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const rawBase = path.basename(file.name || "image", ext).replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
        const publicId = `${rawBase || "image"}-${Date.now()}`;

        const uploadRes = await uploadToCloudinary(buffer, {
          folder: "world-ark-missions",
          public_id: publicId,
        });

        uploadedResults.push({
          name: `${publicId}.${uploadRes.format || ext.replace(".", "")}`,
          url: uploadRes.secure_url,
          size: formatBytes(uploadRes.bytes),
          storage: "cloudinary",
        });
      }
    } else {
      // If on serverless host (Vercel / AWS Lambda), the local filesystem is read-only
      if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        return NextResponse.json(
          { error: "Cloudinary credentials missing in production environment. Please configure Cloudinary in Vercel settings." },
          { status: 500 }
        );
      }

      // Fallback: Local filesystem uploads (local development only)
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      for (const file of filesToProcess) {
        const ext = getExtensionForFile(file);
        if (!ALLOWED_EXTENSIONS.includes(ext)) continue;

        const rawBase = path.basename(file.name || "image", ext).replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
        const safeName = `${rawBase || "image"}-${Date.now()}${ext}`;
        const destPath = path.join(uploadsDir, safeName);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(destPath, buffer);

        uploadedResults.push({
          name: safeName,
          url: `/uploads/${safeName}`,
          size: formatBytes(file.size),
          storage: "local",
        });
      }
    }

    if (uploadedResults.length === 0) {
      return NextResponse.json({ error: "No valid image files were provided (supported: JPG, PNG, WEBP, GIF, SVG, AVIF)" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedResults,
      count: uploadedResults.length,
      storage: cloudinaryActive ? "cloudinary" : "local",
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Internal upload error";
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
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

    // 1. Delete from Cloudinary if it is a Cloudinary URL
    if (url.includes("res.cloudinary.com")) {
      await deleteFromCloudinary(url);
      return NextResponse.json({ success: true, message: "Deleted from Cloudinary successfully" });
    }

    // 2. Delete from local /uploads/
    if (url.startsWith("/uploads/")) {
      const filename = path.basename(url);
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      await fs.unlink(filePath);
      return NextResponse.json({ success: true, message: `Deleted ${filename}` });
    }

    // 3. Prevent deleting built-in assets
    return NextResponse.json(
      { error: "Cannot delete built-in system assets. Only custom uploads can be removed." },
      { status: 403 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
