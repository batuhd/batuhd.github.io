import { fetchHomeData } from "@/lib/data";
import { Metadata } from "next";
import { LanguageProvider } from "@/context/language-context";
import { SiteDataProvider } from "@/context/site-data-context";
import { Certifications } from "@/components/home/profile-sections";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cert?: string }>;
}): Promise<Metadata> {
  const { cert } = await searchParams;
  const ogImage = cert
    ? `/api/og/certifications?cert=${encodeURIComponent(cert)}`
    : "/opengraph-image";

  return {
    title: "Certifications",
    description: "My certifications and credentials",
    openGraph: {
      title: "Certifications",
      description: "My certifications and credentials",
      url: "/certifications",
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Certifications — Batuhan Dede",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Certifications",
      description: "My certifications and credentials",
      images: [ogImage],
    },
  };
}

export default async function CertificationsPage() {
  const data = await fetchHomeData();

  const siteData = {
    aboutMe: data.aboutMe,
    skillCategories: data.skillCategories,
    experiences: data.experiences,
    educations: data.educations,
    languages: data.languages,
    activities: data.activities,
    certifications: data.certifications,
    certificationSkills: data.certificationSkills,
    sectionOrder: data.sectionOrder,
    projects: data.projects || [],
    blogs: data.blogs || [],
    loaded: true,
    isMaintenance: data.sectionOrder.some(
      (s) => s.section_id === "maintenance_mode",
    ),
  };

  return (
    <LanguageProvider>
      <SiteDataProvider initialData={siteData}>
        <div className="max-w-2xl mx-auto w-full pb-24">
          <Certifications />
        </div>
      </SiteDataProvider>
    </LanguageProvider>
  );
}
