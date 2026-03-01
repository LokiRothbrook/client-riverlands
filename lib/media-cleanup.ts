import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { extractPublicId, deleteImages } from "@/lib/cloudinary";

/**
 * Delete Cloudinary images and remove their media table rows.
 * Fire-and-forget — errors are logged but not thrown.
 */
export async function cleanupImages(
  supabase: SupabaseClient<Database>,
  urls: string[]
): Promise<void> {
  if (urls.length === 0) return;

  try {
    const publicIds = urls
      .map((url) => extractPublicId(url))
      .filter((id): id is string => id !== null);

    if (publicIds.length > 0) {
      // Delete from Cloudinary
      await deleteImages(publicIds);

      // Delete from media table
      await supabase.from("media").delete().in("public_id", publicIds);
    }
  } catch (err) {
    console.error("Image cleanup failed:", err);
  }
}

/**
 * Clean up a replaced featured image (old URL removed, new URL set).
 * Only deletes the old image if it's different from the new one.
 */
export async function cleanupReplacedImage(
  supabase: SupabaseClient<Database>,
  oldUrl: string | null | undefined,
  newUrl: string | null | undefined
): Promise<void> {
  if (!oldUrl || oldUrl === newUrl) return;
  await cleanupImages(supabase, [oldUrl]);
}
