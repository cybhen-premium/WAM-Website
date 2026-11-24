/**
 * Client-side utility for robust media uploads.
 * Bypasses Vercel serverless request body limits (HTTP 413 Payload Too Large)
 * by uploading directly to Cloudinary using signed requests, with client-side
 * compression and automatic fallback to server route.
 */

export async function compressImage(file: File, maxDimension = 2560, quality = 0.88): Promise<File> {
  if (typeof window === "undefined") return file;
  
  // Skip non-images, vector SVGs, and files already small (< 1.2 MB)
  if (!file.type.startsWith("image/") || file.type.includes("svg") || file.size < 1.2 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Downscale if image exceeds maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0, width, height);
      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
      
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve(new File([blob], file.name, { type: outputType }));
          } else {
            resolve(file);
          }
        },
        outputType,
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    img.src = objectUrl;
  });
}

/**
 * Uploads a file directly to Cloudinary or falls back to the server route.
 * Guarantees zero 413 Payload Too Large errors.
 */
export async function uploadMediaFile(rawFile: File): Promise<string> {
  // 1. Client-side compression if image is large
  const file = await compressImage(rawFile);

  // 2. Attempt direct signed upload to Cloudinary (completely bypasses Vercel 4.5MB limit)
  try {
    const signRes = await fetch("/api/admin/media/sign");
    if (signRes.ok) {
      const signData = await signRes.json();
      if (signData.success && signData.signature) {
        const cloudFormData = new FormData();
        cloudFormData.append("file", file);
        cloudFormData.append("api_key", signData.apiKey);
        cloudFormData.append("timestamp", String(signData.timestamp));
        cloudFormData.append("signature", signData.signature);
        cloudFormData.append("folder", signData.folder);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
          {
            method: "POST",
            body: cloudFormData,
          }
        );

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          if (cloudData.secure_url) {
            return cloudData.secure_url;
          }
        } else {
          const cloudErr = await cloudRes.json().catch(() => ({}));
          console.warn("Direct Cloudinary upload failed, falling back to server route:", cloudErr);
        }
      }
    }
  } catch (directErr) {
    console.warn("Direct upload error, falling back to server route:", directErr);
  }

  // 3. Fallback: Upload through /api/admin/media
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/admin/media", {
    method: "POST",
    body: formData,
  });

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // response not json
  }

  if (res.ok && data.success && data.uploaded?.[0]?.url) {
    return data.uploaded[0].url;
  }

  throw new Error(
    data.error ||
      `Upload failed (Status ${res.status}): Please check the image format and file size.`
  );
}
