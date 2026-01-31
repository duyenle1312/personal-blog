// import Layout from '@/components/Layout'
import { getSingletonBySlug, load } from "outstatic/server";
import ContentGrid from "@/components/ContentGrid";
import markdownToHtml from "@/lib/markdownToHtml";

export async function generateMetadata() {
  // const home = getSingletonBySlug('home', [
  //   'title',
  //   'content',
  //   'description'
  // ])

  return {
    title: "Duyen Le - Micro Blog",
    description: "Welcome to my personal blog",
  };
}

export default async function Index() {
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
        {allPosts.length > 0 && (
          <ContentGrid
            title="Posts"
            items={allPosts}
            collection="posts"
            priority
          />
        )}
      </div>
    </>
  );
}

async function getData() {
  const db = await load();

  const home = getSingletonBySlug("home", ["title", "content", "description"]);

  const content = await markdownToHtml(home?.content || "");
  console.log("home", home);
  console.log("content", content);
  
  const allPosts = await db
    .find({ collection: "posts" }, [
      "title",
      "publishedAt",
      "slug",
      // 'coverImage',
      // 'description',
      // 'tags'
    ])
    .sort({ publishedAt: -1 })
    .toArray();

  return {
    content,
    allPosts,
  };
}

// import markdownToHtml from '@/lib/markdownToHtml'
// import { getSingletonBySlug } from 'outstatic/server'

// export default async function HomePage() {
//   const home = await getData()
//   return (
//     <main>
//       <h1 className='text-black'>{home?.title}</h1>
//       <div dangerouslySetInnerHTML={{ __html: home?.content || '' }} />
//     </main>
//   )
// }

// async function getData() {
//   const home = getSingletonBySlug('home', [
//     'title',
//     'content',
//     'description'
//   ])

//   const content = await markdownToHtml(home?.content || '')

//   console.log('home', home)

//   return { ...home, content }
// }
