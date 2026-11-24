import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dm5bp1efp";
const API_KEY = process.env.CLOUDINARY_API_KEY || "839789914633163";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "3j0kDRQkJ0xBo_hCCXvBNRZow1o";

// Configure Cloudinary with environment variables or fallback credentials
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Checks whether Cloudinary credentials are set in environment variables or defaults
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    (CLOUD_NAME && API_KEY && API_SECRET) ||
      process.env.CLOUDINARY_URL
  );
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
  created_at: string;
  resource_type: string;
}

/**
 * Uploads a file buffer directly to Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options?: {
    folder?: string;
    filename?: string;
    public_id?: string;
  }
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options?.folder || "world-ark-missions",
        public_id: options?.public_id,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed with empty response"));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes,
          format: result.format,
          created_at: result.created_at,
          resource_type: result.resource_type,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Extracts public_id from a Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;
    let sub = url.substring(uploadIndex + 8);
    // Strip version prefix if present (v1234567890/)
    if (/^v\d+\//.test(sub)) {
      sub = sub.substring(sub.indexOf("/") + 1);
    }
    // Strip file extension
    const dotIndex = sub.lastIndexOf(".");
    if (dotIndex !== -1) {
      sub = sub.substring(0, dotIndex);
    }
    return sub;
  } catch {
    return null;
  }
}

/**
 * Deletes an image from Cloudinary by its public ID or full URL
 */
export async function deleteFromCloudinary(publicIdOrUrl: string) {
  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.startsWith("http")) {
    const extracted = extractPublicIdFromUrl(publicIdOrUrl);
    if (extracted) publicId = extracted;
  }
  return await cloudinary.uploader.destroy(publicId);
}

/**
 * Lists images stored in Cloudinary under a given folder
 */
export async function listCloudinaryImages(folder = "world-ark-missions", maxResults = 100) {
  if (!isCloudinaryConfigured()) return [];
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: maxResults,
    });
    return result.resources || [];
  } catch (err) {
    console.error("Cloudinary list resources error:", err);
    return [];
  }
}
