import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/seo/canonical";

export default function sitemap(): MetadataRoute.Sitemap {
  const rootUrl = getCanonicalUrl("/");

  return [
    {
      url: rootUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
