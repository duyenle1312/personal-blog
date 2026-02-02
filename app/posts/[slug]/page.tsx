import DateFormatter from "@/components/DateFormatter";
import { Button } from "@/components/ui/button";
import markdownToHtml from "@/lib/markdownToHtml";
import matter from "gray-matter";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getData(slug);
  
  return {
    title: `${post.title} - Duyen Le`,
    description: post.content?.substring(0, 150) || "Welcome to my personal blog",
  };
}

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/duyenle1312/personal-blog/master/outstatic/content/posts";

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getData(slug);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <Link href="/posts" className="w-full md:justify-end md:items-end flex">
        <Button variant="outline" className="cursor-pointer mb-4">
          Back to Posts
        </Button>
      </Link>

      <article className="mb-32">
        <h1 className="font-primary text-2xl font-bold md:text-4xl mb-2">
          {post.title}
        </h1>

        <div className="md:mb-12 text-slate-600">
          Written on <DateFormatter dateString={post.publishedAt || ""} /> by{" "}
          {post.author?.name || ""}.
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
  const url = `${GITHUB_RAW_BASE}/${slug}.mdx`;

  const res = await fetch(url, {
    // required for static generation
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fileContent = await res.text();

  // Parse frontmatter
  const { data, content } = matter(fileContent);

  const htmlContent = await markdownToHtml(content);

  return {
    title: data.title,
    publishedAt: data.publishedAt,
    slug: data.slug,
    author: data.author,
    content: htmlContent,
  };
}
