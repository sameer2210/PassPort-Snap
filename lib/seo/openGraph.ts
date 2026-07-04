import type { Metadata } from "next";
import { getCanonicalUrl } from "./canonical";
import {
  SEO_BRAND_NAME,
  SEO_DEFAULT_DESCRIPTION,
  SEO_DEFAULT_OG_IMAGE,
  SEO_DEFAULT_TITLE,
} from "./constants";

interface OpenGraphParams {
  title?: string;
  description?: string;
  path?: string;
  imageUrl?: string;
  imageAlt?: string;
  type?: "website" | "article";
}

export function buildOpenGraph(params: OpenGraphParams = {}): Metadata["openGraph"] {
  const {
    title = SEO_DEFAULT_TITLE,
    description = SEO_DEFAULT_DESCRIPTION,
    path = "/",
    imageUrl = SEO_DEFAULT_OG_IMAGE.url,
    imageAlt = SEO_DEFAULT_OG_IMAGE.alt,
    type = "website",
  } = params;

  return {
    title,
    description,
    url: getCanonicalUrl(path),
    siteName: SEO_BRAND_NAME,
    locale: "en_US",
    type,
    images: [
      {
        url: imageUrl.startsWith("http") ? imageUrl : getCanonicalUrl(imageUrl),
        width: SEO_DEFAULT_OG_IMAGE.width,
        height: SEO_DEFAULT_OG_IMAGE.height,
        alt: imageAlt,
      },
    ],
  };
}
