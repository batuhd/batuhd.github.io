import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      // Googlebot: explicitly allowed to crawl and cache everything public
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      // Block Wayback Machine / Internet Archive crawlers
      {
        userAgent: "ia_archiver",
        disallow: "/",
      },
      {
        userAgent: "archive.org_bot",
        disallow: "/",
      },
      {
        userAgent: "Wayback",
        disallow: "/",
      },
      {
        userAgent: "web.archive.org",
        disallow: "/",
      },
      // Block common archival / scraping bots that feed public archives
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
