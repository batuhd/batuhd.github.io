import { fetchHomeData, getLocalized } from "@/lib/data";
import { sanitizeUrl } from "@/lib/utils";
import { Metadata } from "next";
import { LanguageProvider } from "@/context/language-context";
import { SiteDataProvider } from "@/context/site-data-context";
import { Certifications } from "@/components/home/profile-sections";
import { siteConfig } from "@/config/site";
import { JsonLd, educationalCredentialJsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import type { Project, Blog } from "@/types";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cert?: string }>;
}): Promise<Metadata> {
  const { cert } = await searchParams;
  const data = await fetchHomeData();
  const selectedCert = cert
    ? data.certifications.find((c) => c.id === cert)
    : null;

  const title = selectedCert
    ? getLocalized(selectedCert, "name", "en")
    : "Certifications";
  const description = selectedCert
    ? `Certification issued by ${getLocalized(selectedCert, "issuer", "en")}`
    : "My certifications and credentials";
  const ogImage = cert
    ? `/api/og/certifications?cert=${encodeURIComponent(cert)}`
    : "/opengraph-image";

  const canonical = selectedCert
    ? `${siteConfig.url}/certifications?cert=${selectedCert.id}`
    : `${siteConfig.url}/certifications`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: selectedCert
        ? `/certifications?cert=${selectedCert.id}`
        : "/certifications",
      siteName: siteConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: selectedCert ? title : "Certifications — Batuhan Dede",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CertificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ cert?: string }>;
}) {
  const { cert } = await searchParams;
  const data = await fetchHomeData();

  const selectedCert = cert
    ? data.certifications.find((c) => c.id === cert)
    : null;

  const safeCertLinkUrl = selectedCert?.link_url
    ? sanitizeUrl(selectedCert.link_url)
    : null;
  const safeCertIconUrl = selectedCert?.icon_url
    ? sanitizeUrl(selectedCert.icon_url)
    : null;

  const credentialSchema = selectedCert
    ? educationalCredentialJsonLd({
        name: getLocalized(selectedCert, "name", "en"),
        description: `Certification issued by ${getLocalized(selectedCert, "issuer", "en")}`,
        url: safeCertLinkUrl
          ? safeCertLinkUrl.startsWith("/")
            ? `${siteConfig.url}${safeCertLinkUrl}`
            : safeCertLinkUrl
          : `${siteConfig.url}/certifications?cert=${selectedCert.id}`,
        image: safeCertIconUrl
          ? safeCertIconUrl.startsWith("/")
            ? `${siteConfig.url}${safeCertIconUrl}`
            : safeCertIconUrl
          : undefined,
        organization: getLocalized(selectedCert, "issuer", "en"),
      })
    : null;

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Sertifikalar", url: `${siteConfig.url}/certifications` },
    ...(selectedCert
      ? [
          {
            name: getLocalized(selectedCert, "name", "en"),
            url: `${siteConfig.url}/certifications?cert=${selectedCert.id}`,
          },
        ]
      : []),
  ]);

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
    projects: (data.projects || []) as Project[],
    blogs: (data.blogs || []) as Blog[],
    loaded: true,
    isMaintenance: data.sectionOrder.some(
      (s) => s.section_id === "maintenance_mode",
    ),
  };

  return (
    <LanguageProvider>
      <SiteDataProvider initialData={siteData}>
        <JsonLd data={breadcrumbSchema} />
        {credentialSchema && <JsonLd data={credentialSchema} />}
        <div className="max-w-2xl mx-auto w-full pb-24">
          <Certifications />
        </div>
      </SiteDataProvider>
    </LanguageProvider>
  );
}
