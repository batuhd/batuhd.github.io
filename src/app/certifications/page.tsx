import { fetchHomeData } from "@/lib/data";
import { Metadata } from "next";
import { LanguageProvider } from "@/context/language-context";
import { SiteDataProvider } from "@/context/site-data-context";
import { Certifications } from "@/components/home/profile-sections";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Certifications - Batuhan Dede",
  description: "My certifications and credentials",
};

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
