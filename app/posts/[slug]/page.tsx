import DateFormatter from "@/components/DateFormatter";
import markdownToHtml from "@/lib/markdownToHtml";
import { getDocumentBySlug, getDocuments } from "outstatic/server";

// ✅ IMPORTANT: force static generation
export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = getDocuments("posts");

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const post = await getData(slug);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <article className="mb-32">
        <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
          {post.title}
        </h1>

        <div className="hidden md:block md:mb-12 text-slate-600">
          Written on <DateFormatter dateString={post?.publishedAt || ""} /> by{" "}
          {post?.author?.name || ""}.
        </div>

        <hr className="border-neutral-200 mt-10 mb-10" />

        <div className="max-w-2xl mx-auto">
          <div
            className="prose lg:prose-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
}

async function getData(slug: string) {
  const post = getDocumentBySlug("posts", slug, [
    "title",
    "publishedAt",
    "slug",
    "author",
    "content",
    "coverImage",
  ]);

  const content = await markdownToHtml(post?.content || "");

  return {
    ...post,
    content,
  };
}
