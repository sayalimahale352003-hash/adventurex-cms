import { createClient } from "contentful";

// Check that Contentful environment variables exist
const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  throw new Error(
    "Missing Contentful environment variables: CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN"
  );
}

// Contentful client
export const client = createClient({
  space,
  accessToken,
});

/**
 * Get all Blog Post entries from Contentful
 */
export async function getBlogPosts() {
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      include: 2,
      order: ["-fields.publishDate"],
    });

    return response.items;
  } catch (error) {
    console.error("Error fetching blog posts from Contentful:", error);
    return [];
  }
}

/**
 * Get one Blog Post using its slug
 */
export async function getBlogPostBySlug(slug: string) {
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      include: 2,
      "fields.slug": slug,
      limit: 1,
    });

    return response.items[0] || null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}
