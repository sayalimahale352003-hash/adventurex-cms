import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/contentful";

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">

          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Welcome to My Blog
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            Explore articles, tutorials, ideas, and insights powered by
            Contentful and Next.js.
          </p>

          <Link
            href="#articles"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Explore Blog
          </Link>

        </div>
      </section>


      {/* ================= BLOG SECTION ================= */}
      <section
        id="articles"
        className="px-6 py-16"
      >
        <div className="mx-auto max-w-6xl">

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Articles
            </h2>

            <p className="mt-2 text-gray-600">
              Read the latest posts published from our Contentful CMS.
            </p>
          </div>


          {/* ================= NO POSTS ================= */}
          {posts.length === 0 ? (

            <div className="rounded-lg bg-white p-10 text-center shadow">
              <p className="text-gray-600">
                No blog posts found.
              </p>
            </div>

          ) : (

            /* ================= POST GRID ================= */
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {posts.map((post) => {

                const fields = post.fields as any;

                const title =
                  fields.title || "Untitled Post";

                const slug =
                  fields.slug || "";

                const description =
                  fields.excerpt ||
                  fields.description ||
                  "Read this article to learn more.";


                /*
                 * Contentful Image field is configured as:
                 *
                 * Media, many files
                 *
                 * Therefore fields.image is normally an array.
                 */

                let imageUrl: string | null = null;

                if (Array.isArray(fields.image)) {

                  const firstImage = fields.image[0];

                  imageUrl =
                    firstImage?.fields?.file?.url
                      ? `https:${firstImage.fields.file.url}`
                      : null;

                } else if (fields.image) {

                  imageUrl =
                    fields.image?.fields?.file?.url
                      ? `https:${fields.image.fields.file.url}`
                      : null;
                }


                return (

                  <article
                    key={post.sys.id}
                    className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* ================= IMAGE ================= */}

                    {imageUrl ? (

                      <div className="relative h-52 w-full">

                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                      </div>

                    ) : (

                      <div className="flex h-52 items-center justify-center bg-gray-200">
                        <span className="text-gray-500">
                          No Image
                        </span>
                      </div>

                    )}


                    {/* ================= CONTENT ================= */}

                    <div className="p-6">

                      <h3 className="text-xl font-bold text-gray-900">
                        {title}
                      </h3>


                      <p className="mt-3 line-clamp-3 text-gray-600">
                        {description}
                      </p>


                      {/* Publish Date */}

                      {fields.publishDate && (

                        <p className="mt-3 text-sm text-gray-500">
                          {new Date(
                            fields.publishDate
                          ).toLocaleDateString()}
                        </p>

                      )}


                      {/* Read More */}

                      {slug && (

                        <Link
                          href={`/blog/${slug}`}
                          className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-800"
                        >
                          Read More →
                        </Link>

                      )}

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </div>
      </section>


      {/* ================= FOOTER ================= */}

      <footer className="border-t bg-white px-6 py-8">

        <div className="mx-auto max-w-6xl text-center text-sm text-gray-500">

          © {new Date().getFullYear()} My Blog.
          All rights reserved.

        </div>

      </footer>

    </main>
  );
}