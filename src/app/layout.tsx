import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { SiteDataProvider } from "@/context/site-data-context";
import { ReactQueryProvider } from "@/components/react-query-provider";
import { MaintenanceGuard } from "@/components/maintenance-guard";
import { Dock } from "@/components/navigation/dock";
import { Intro } from "@/components/home/intro";
import { EasterEgg } from "@/components/easter-egg";
import { HtmlLangUpdater } from "@/components/html-lang-updater";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  icons: {
    icon: "/media/yuvarlaklogobeyaz.png",
    apple: "/media/yuvarlaklogobeyaz.png",
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  other: {
    darkreader: "disable",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body
        className="min-h-screen bg-background antialiased"
        suppressHydrationWarning
      >
        <Intro />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <HtmlLangUpdater />
              <SiteDataProvider>
                <MaintenanceGuard>
                  <Link
                    href="/"
                    aria-label="Ana sayfaya dön"
                    className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 transition-transform hover:scale-105 duration-300"
                  >
                    <Image
                      src="/media/logobeyaz.png"
                      alt="Logo"
                      width={44}
                      height={44}
                      className="hidden dark:block drop-shadow-lg sm:w-14 sm:h-14 md:w-20 md:h-20"
                      priority
                    />
                    <Image
                      src="/media/yuvarlaklogo.png"
                      alt="Logo"
                      width={44}
                      height={44}
                      className="dark:hidden drop-shadow-lg sm:w-14 sm:h-14 md:w-20 md:h-20"
                      priority
                    />
                  </Link>
                  <main className="relative mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 pb-28 sm:pb-32">
                    {children}
                  </main>
                  <EasterEgg />
                  <Dock />
                </MaintenanceGuard>
              </SiteDataProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
