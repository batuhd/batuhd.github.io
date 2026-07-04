import { Suspense } from "react";
import { fetchWorksData } from "@/lib/data";
import { Metadata } from "next";
import { WorksContent } from "./works-content";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}): Promise<Metadata> {
  const { project } = await searchParams;
  const ogImage = project
    ? `/api/og/works?project=${encodeURIComponent(project)}`
    : "/opengraph-image";

  return {
    title: "Works",
    description: "A collection of my projects and works",
    openGraph: {
      title: "Works",
      description: "A collection of my projects and works",
      url: "/works",
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Works — Batuhan Dede",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Works",
      description: "A collection of my projects and works",
      images: [ogImage],
    },
  };
}

export default async function WorksPage() {
  const { projects, entityMap, relatedBlogs } = await fetchWorksData();

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <WorksContent
        initialProjects={projects}
        entityMap={entityMap}
        relatedBlogs={relatedBlogs}
      />
    </Suspense>
  );
}
