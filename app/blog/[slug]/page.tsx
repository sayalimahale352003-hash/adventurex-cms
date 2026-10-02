import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  getBlogPostBySlug,
  getBlogPosts,
} from "@/lib/contentful";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};


/*
 * Generate static pages for all Contentful blog posts
 */
export async function generateStaticParams() {

  const posts = await getBlogPosts();

  return posts.map((post) => {

    const fields = post.fields as any;

    return {
      slug: fields.slug,
    };

  });
}


/*
 * Blog Post Detail Page
 */
export default async function BlogPostPage({
  params,
}: Props) {

  const { slug } = await params;

  const post = await getBlogPostBySlug(slug);


  /*
   * If the slug doesn't exist
   */
  if (!post) {
    notFound();
  }


  const fields = post.fields as any;


  /*
   * Contentful Image field is:
   * Media, many files
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

    <main className="min-h-screen bg-gray-50 px-6 py-12">

      <article className="mx-auto max-w-4xl">

        {/* ================= BACK BUTTON ================= */}

        <Link
          href="/"
          className="mb-8 inline-block font-semibold text-blue-600 hover:text-blue-800"
        >
          ← Back to Blog
        </Link>


        {/* ================= BLOG CARD ================= */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">


          {/* ================= IMAGE ================= */}

          {imageUrl && (

            <div className="relative h-[300px] w-full md:h-[500px]">

              <Image
                src={imageUrl}
                alt={fields.title || "Blog image"}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
              />

            </div>

          )}


          {/* ================= CONTENT ================= */}

          <div className="p-6 md:p-10">


            {/* TITLE */}

            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-5xl">
              {fields.title}
            </h1>


            {/* DATE */}

            {fields.publishDate && (

              <p className="mt-4 text-sm text-gray-500">

                Published on{" "}

                {new Date(
                  fields.publishDate
                ).toLocaleDateString()}

              </p>

            )}


            {/* EXCERPT */}

            {fields.excerpt && (

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {fields.excerpt}
              </p>

            )}


            {/* ================= BODY ================= */}

            {fields.body && (

              <div className="prose prose-lg mt-8 max-w-none text-gray-800">

                {documentToReactComponents(fields.body)}

              </div>

            )}

          </div>

        </div>

      </article>

    </main>
  );
}