// Fetch ALL Documents from the posts collection
// /app/posts/[slug]/page.tsx

import markdownToHtml from "@/lib/markdownToHtml";
import { getDocuments } from "outstatic/server";

export default async function Index() {
  const posts = await getData();
  console.log("posts", posts);

  const postsWithContent = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      content: await markdownToHtml(post?.content || ""),
    }))
  );

  return (
    <div className="flex justify-center items-center py-12">
      {postsWithContent.map((post) => (
        <div key={post.slug as string}>
          <a href={`/posts/${post.slug}`}>
            <h1 className="text-2xl">{post.title}</h1>
          </a>
          <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        </div>
      ))}
    </div>
  );

}

async function getData() {
  const posts = getDocuments("posts", ["title", "content", "slug"]);

  return posts;
}
