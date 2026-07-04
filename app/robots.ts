import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/seo/canonical";

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = getCanonicalUrl("/sitemap.xml");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/", "/error/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/private/", "/error/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/private/", "/error/"],
      },
    ],
    sitemap: sitemapUrl,
  };
}
