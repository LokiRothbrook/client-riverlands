import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function getCloudinaryUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string; quality?: string }
): string {
  const { width, height, crop = "fill", quality = "auto" } = options ?? {};
  return cloudinary.url(publicId, {
    secure: true,
    width,
    height,
    crop,
    quality,
    fetch_format: "auto",
  });
}

export async function uploadImage(
  file: Buffer | string,
  options?: { folder?: string; publicId?: string }
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  const folder = options?.folder ?? "riverlands";

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
  }>((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: "image" as const,
    };
    if (options?.publicId) {
      uploadOptions.public_id = options.publicId;
    }

    if (typeof file === "string") {
      cloudinary.uploader.upload(file, uploadOptions, (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      });
    } else {
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );
      stream.end(file);
    }
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
