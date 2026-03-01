const cloudinaryUrlPattern =
  /https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/[^\s"'<>]+/g;

/**
 * Extract all Cloudinary image URLs from an HTML string.
 */
export function extractCloudinaryUrls(html: string): string[] {
  if (!html) return [];
  const matches = html.match(cloudinaryUrlPattern);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Collect all Cloudinary image URLs associated with a post
 * (featured image + content-embedded images).
 */
export function collectPostImages(post: {
  featured_image?: string | null;
  content?: string | null;
}): string[] {
  const urls: string[] = [];

  if (post.featured_image && cloudinaryUrlPattern.test(post.featured_image)) {
    urls.push(post.featured_image);
    // Reset regex lastIndex since we used .test()
    cloudinaryUrlPattern.lastIndex = 0;
  }

  if (post.content) {
    urls.push(...extractCloudinaryUrls(post.content));
  }

  return [...new Set(urls)];
}
