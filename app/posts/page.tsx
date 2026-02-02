import DateFormatter from "@/components/DateFormatter";
import { Button } from "@/components/ui/button";
import markdownToHtml from "@/lib/markdownToHtml";
import { Metadata } from "next";
import Link from "next/link";
import { getDocuments } from "outstatic/server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Duyen Le | Micro Blog",
    description: "Welcome to my personal blog",
  };
}

export default async function Posts() {
  const posts = await getData();
  console.log("posts", posts);

  const postsWithContent = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      content: await markdownToHtml(post?.content || ""),
    })),
  );

  return (
    <div className="flex flex-col p-12">
      <h1 className="mb-8 text-4xl font-bold">All Posts</h1>
      {postsWithContent.map((post) => (
        <a key={post.slug} className="mb-5 block" href={`/posts/${post.slug}`}>
          <h3>{post.title}</h3>
          <div className="mb-2  text-slate-600">
            <DateFormatter dateString={post.publishedAt || ""} />{" "}
          </div>{" "}
          <div
            dangerouslySetInnerHTML={{
              __html: post.content?.substring(0, 800) + "..." || "",
            }}
          />
        </a>
      ))}
      <Link href="/" className="w-full md:justify-end md:items-end flex">
        <Button variant="outline" className="cursor-pointer mt-12">
          Home
        </Button>
      </Link>
    </div>
  );
}

async function getData() {
  const posts = getDocuments("posts", ["title", "content", "slug"]);

  return posts;
}
