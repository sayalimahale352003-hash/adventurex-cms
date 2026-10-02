import { createClient } from "contentful";

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

/**
 * Get all Blog Post entries from Contentful
 */
export async function getBlogPosts() {
  const response = await client.getEntries({
    content_type: "blogPost",
    include: 2,
    order: ["-fields.publishDate"],
  });

  return response.items;
}

/**
 * Get one Blog Post using its slug
 */
export async function getBlogPostBySlug(slug: string) {
  const response = await client.getEntries({
    content_type: "blogPost",
    include: 2,
    "fields.slug": slug,
    limit: 1,
  });

  return response.items[0] || null;
}