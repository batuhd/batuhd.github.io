import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Credits",
  description: "Tech stack, assets, and acknowledgements",
  alternates: {
    canonical: `${siteConfig.url}/credits`,
  },
  openGraph: {
    title: "Credits",
    description: "Tech stack, assets, and acknowledgements",
    url: "/credits",
    siteName: siteConfig.name,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Credits — Batuhan Dede",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Credits",
    description: "Tech stack, assets, and acknowledgements",
    images: ["/opengraph-image"],
  },
};

export default function CreditsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
