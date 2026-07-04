export type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function personJsonLd({
  name,
  jobTitle,
  url,
  sameAs,
  image,
  description,
}: {
  name: string;
  jobTitle: string;
  url: string;
  sameAs: string[];
  image: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    url,
    sameAs: sameAs.filter(Boolean),
    image,
    description,
  };
}

export function articleJsonLd({
  title,
  description,
  url,
  author,
  image,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  author: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    author: {
      "@type": "Person",
      name: author,
      url,
    },
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    publisher: {
      "@type": "Person",
      name: author,
      url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function softwareApplicationJsonLd({
  name,
  description,
  url,
  author,
  image,
  applicationCategory = "DeveloperApplication",
}: {
  name: string;
  description: string;
  url: string;
  author: string;
  image?: string;
  applicationCategory?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    author: {
      "@type": "Person",
      name: author,
    },
    image: image ? [image] : undefined,
    applicationCategory,
    operatingSystem: "Any",
  };
}

export function educationalCredentialJsonLd({
  name,
  description,
  url,
  image,
  organization,
  credentialId,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  organization?: string;
  credentialId?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name,
    description,
    url,
    image: image ? [image] : undefined,
    recognizedBy: organization
      ? {
          "@type": "Organization",
          name: organization,
        }
      : undefined,
    credentialId,
  };
}

export function websiteJsonLd({
  name,
  url,
  searchUrl,
}: {
  name: string;
  url: string;
  searchUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchUrl,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
