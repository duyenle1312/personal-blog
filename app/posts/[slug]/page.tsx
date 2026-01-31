import DateFormatter from "@/components/DateFormatter";
import markdownToHtml from "@/lib/markdownToHtml";
import { getDocumentBySlug } from "outstatic/server";

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getData(slug);
  console.log("post", post);

  return (
    <>
      {" "}
      <div className="max-w-6xl mx-auto px-5">
        <article className="mb-32">
          <div className="relative mb-2 md:mb-4 sm:mx-0 w-full h-52 md:h-96">
            {/* {<Image
              alt={post.title}
              src={post?.coverImage || ''}
              fill
              className="object-cover object-center"
              priority
            />} */}
          </div>

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
    </>
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
