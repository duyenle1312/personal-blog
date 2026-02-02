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
  // console.log("posts", posts);

  const postsWithContent = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      content: await markdownToHtml(post?.content || ""),
    })),
  );

  return (
    <div className="flex flex-col md:p-12 px-5 py-12">
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
  const posts = getDocuments("imageposts", ["title", "content", "slug"]);

  return posts;
}


// // import Gallery from "@/components/Gallery";
// import { Metadata } from "next";
// import { getDocuments } from "outstatic/server";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: "Duyen Le | Gallery",
//     description: "Welcome to my personal blog",
//   };
// }

// // interface GitHubFile {
// //   name: string;
// // }

// const OWNER = "duyenle1312";
// const REPO = "personal-blog";
// // const IMAGES_PATH = "public/images";

// // const CONTENTS_API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${IMAGES_PATH}`;
// // const COMMITS_API = `https://api.github.com/repos/${OWNER}/${REPO}/commits`;
// // const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/master/${IMAGES_PATH}`;

// // async function getLastCommitDate(filePath: string) {
// //   const res = await fetch(`${COMMITS_API}?path=${filePath}&per_page=1`);

// //   if (!res.ok) return null;

// //   const commits = await res.json();
// //   return commits[0]?.commit?.committer?.date ?? null;
// // }

// // async function getGallerySections() {
// //   const res = await fetch(CONTENTS_API, {
// //     next: { revalidate: 3600 },
// //   });

// //   if (!res.ok) {
// //     throw new Error("Failed to fetch images");
// //   }

// //   const files = await res.json();

// //   const imageFiles = files.filter((file: GitHubFile) =>
// //     /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name),
// //   );

// //   const imagesWithDates = await Promise.all(
// //     imageFiles.map(async (file: GitHubFile) => {
// //       const commitDate = await getLastCommitDate(`${IMAGES_PATH}/${file.name}`);

// //       return {
// //         src: `${RAW_BASE_URL}/${file.name}`,
// //         alt: file.name.replace(/[-_]/g, " ").replace(/\.[^/.]+$/, ""),
// //         date: commitDate,
// //       };
// //     }),
// //   );

// //   // 🔥 Sort newest → oldest
// //   imagesWithDates.sort((a, b) => {
// //     if (!a.date || !b.date) return 0;
// //     return new Date(b.date).getTime() - new Date(a.date).getTime();
// //   });

// //   return [
// //     {
// //       type: "grid",
// //       images: imagesWithDates,
// //     },
// //   ];
// // }

// const GalleryPage = async () => {
//   // const gallerySections = await getGallerySections();
//   const imagePosts = await getData();

//   return (
//     <section className="py-8 sm:py-16 lg:py-24">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
//           <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
//             <span className="relative z-1">
//               Explore
//               <span
//                 className="bg-primary absolute bottom-1 left-0 -z-1 h-px w-full"
//                 aria-hidden="true"
//               ></span>
//             </span>{" "}
//             Gallery
//           </h2>
//           <p className="text-muted-foreground text-xl">
//             This is where I store everyday memories and moments.{" "}
//           </p>
//         </div>

//         <div className="grid gap-6 md:grid-cols-2">
//           <div className="md:grid md:grid-cols-2 gap-6 grid">
//             {imagePosts.map((post, imageIndex) => (
//               <div key={imageIndex}>
//                 <Image
//                   key={imageIndex}
//                   src={`` + post.image}
//                   alt={post.title}
//                   width={500}
//                   height={500}
//                   className="rounded-lg object-cover"
//                 />
//                 <p className="mt-2 text-center text-base">{post.title}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <Link href="/" className="w-full md:justify-end md:items-end flex">
//           <Button variant="outline" className="cursor-pointer mt-12">
//             Home
//           </Button>
//         </Link>
//         {/* <Gallery sections={gallerySections} /> */}
//       </div>
//     </section>
//   );
// };

// // interface ImagePost {
// //   title: string;
// //   image: string;
// //   slug: string;
// //   publishedAt?: string;
// //   status?: string;
// // }

// async function getData() {
//   const posts = getDocuments("imagePosts", ["title", "image", "slug"]);
//   console.log("posts", posts);
//   return posts;
// }

// export default GalleryPage;
