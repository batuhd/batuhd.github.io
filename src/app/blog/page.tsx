import { Suspense } from "react";
import { fetchBlogData } from "@/lib/data";
import { Metadata } from "next";
import { BlogContent } from "./blog-content";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}): Promise<Metadata> {
  const { post } = await searchParams;
  const ogImage = post
    ? `/api/og/blog?post=${encodeURIComponent(post)}`
    : "/opengraph-image";

  return {
    title: "Blog",
    description: "Thoughts, tutorials, and insights on software development",
    openGraph: {
      title: "Blog",
      description: "Thoughts, tutorials, and insights on software development",
      url: "/blog",
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Blog — Batuhan Dede",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog",
      description: "Thoughts, tutorials, and insights on software development",
      images: [ogImage],
    },
  };
}

export default async function BlogPage() {
  const { blogs, entityMap } = await fetchBlogData();

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <BlogContent initialBlogs={blogs} entityMap={entityMap} />
    </Suspense>
  );
}
