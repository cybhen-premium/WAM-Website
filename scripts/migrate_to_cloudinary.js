const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

// 1. Read .env
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    throw new Error(".env file not found");
  }
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

loadEnv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log("Using Cloudinary Account:", process.env.CLOUDINARY_CLOUD_NAME);

const ALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

async function uploadFile(filePath, fileName) {
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const publicId = `world-ark-missions/${baseName}`;

  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: "world-ark-missions",
      public_id: baseName,
      resource_type: "image",
      overwrite: true,
      use_filename: true,
    });
    console.log(`[OK] Uploaded: ${fileName} -> ${res.secure_url}`);
    return { fileName, secure_url: res.secure_url };
  } catch (err) {
    console.error(`[FAIL] Error uploading ${fileName}:`, err.message);
    return null;
  }
}

async function run() {
  const assetsDir = path.join(process.cwd(), "public", "assets");
  const files = fs.readdirSync(assetsDir).filter((f) => {
    return ALLOWED_EXTS.includes(path.extname(f).toLowerCase());
  });

  console.log(`Found ${files.length} images to migrate from public/assets/...`);

  const mapping = {};
  // Upload with concurrency of 4
  const CONCURRENCY = 4;
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const chunk = files.slice(i, i + CONCURRENCY);
    const promises = chunk.map((f) => uploadFile(path.join(assetsDir, f), f));
    const results = await Promise.all(promises);
    for (const r of results) {
      if (r) {
        mapping[`/assets/${r.fileName}`] = r.secure_url;
        // Also handle URL-encoded variants e.g. spaces or special characters
        mapping[`/assets/${encodeURI(r.fileName)}`] = r.secure_url;
      }
    }
    console.log(`Progress: ${Math.min(i + CONCURRENCY, files.length)} / ${files.length} images processed`);
  }

  // Save mapping
  const mapPath = path.join(process.cwd(), "scripts", "cloudinary_mapping.json");
  fs.writeFileSync(mapPath, JSON.stringify(mapping, null, 2), "utf-8");
  console.log(`Saved mapping of ${Object.keys(mapping).length} URLs to scripts/cloudinary_mapping.json`);

  // Now replace occurrences across src/
  const targetFiles = [
    "src/data/siteSections.json",
    "src/data/ministries.json",
    "src/data/ministriesData.ts",
    "src/components/Hero.tsx",
    "src/components/StartHere.tsx",
    "src/components/Services.tsx",
    "src/components/Founder.tsx",
    "src/components/MissionBanner.tsx",
    "src/components/Events.tsx",
    "src/components/Sermons.tsx",
    "src/components/Testimonials.tsx",
    "src/components/Navbar.tsx",
    "src/components/Sidebar.tsx",
    "src/app/about/page.tsx",
    "src/app/giving/page.tsx",
    "src/app/contact/page.tsx",
    "src/app/admin/login/page.tsx",
    "src/app/layout.tsx",
  ];

  let totalReplacements = 0;

  for (const relPath of targetFiles) {
    const fullPath = path.join(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, "utf-8");
    let changed = false;

    for (const [localUrl, cloudUrl] of Object.entries(mapping)) {
      if (content.includes(localUrl)) {
        content = content.replaceAll(localUrl, cloudUrl);
        changed = true;
        totalReplacements++;
      }
    }

    if (changed) {
      fs.writeFileSync(fullPath, content, "utf-8");
      console.log(`Updated references in: ${relPath}`);
    }
  }

  console.log(`\nMigration Complete! Made ${totalReplacements} image URL replacements across codebase.`);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
