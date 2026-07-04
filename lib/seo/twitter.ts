import type { Metadata } from "next";
import { getCanonicalUrl } from "./canonical";
import {
  SEO_DEFAULT_DESCRIPTION,
  SEO_DEFAULT_OG_IMAGE,
  SEO_DEFAULT_TITLE,
} from "./constants";

interface TwitterParams {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function buildTwitter(params: TwitterParams = {}): Metadata["twitter"] {
  const {
    title = SEO_DEFAULT_TITLE,
    description = SEO_DEFAULT_DESCRIPTION,
    imageUrl = SEO_DEFAULT_OG_IMAGE.url,
    imageAlt = SEO_DEFAULT_OG_IMAGE.alt,
  } = params;

  return {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: imageUrl.startsWith("http") ? imageUrl : getCanonicalUrl(imageUrl),
        alt: imageAlt,
      },
    ],
    creator: "@AntigravityDevs",
  };
}
