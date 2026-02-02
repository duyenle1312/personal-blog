import { getDocuments, getSingletonBySlug } from "outstatic/server";
import markdownToHtml from "@/lib/markdownToHtml";
import { Metadata } from "next";
import DateFormatter from "@/components/DateFormatter";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Duyen Le - Micro Blog",
    description: "Welcome to my personal blog",
  };
}

export default async function Home() {
  const { content, allPosts } = await getData();

  return (
    <>
      <div className="max-w-6xl mx-auto px-5">
        <section className="mt-16 mb-16 md:mb-12">
          <div
            className="prose lg:prose-2xl home-intro"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>
        {allPosts.length > 0 &&
          allPosts.map((post) => (
            <a
              key={post.slug}
              className="mb-5 block"
              href={`/posts/${post.slug}`}
            >
              <h3>{post.title}</h3>
              <div className="mb-2  text-slate-600">
                <DateFormatter dateString={post.publishedAt || ""} />{" "}
              </div>{" "}
              <p>{post.content?.substring(0, 250)}...</p>
            </a>
          ))}
      </div>
    </>
  );
}

async function getData() {
  const home = getSingletonBySlug("home", ["title", "content", "description"]);

  const content = await markdownToHtml(home?.content || "");

  const allPosts = getDocuments("posts", [
    "title",
    "publishedAt",
    "slug",
    "content",
  ]);

  return {
    content,
    allPosts,
  };
}
