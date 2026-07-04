import type { Metadata } from "next";
import { getCanonicalUrl } from "./canonical";
import {
  SEO_AUTHOR_NAME,
  SEO_BRAND_NAME,
  SEO_CATEGORY,
  SEO_CLASSIFICATION,
  SEO_DEFAULT_DESCRIPTION,
  SEO_DEFAULT_TITLE,
  SEO_KEYWORDS,
  SEO_VERIFICATION_TOKENS,
} from "./constants";
import { buildOpenGraph } from "./openGraph";
import { buildTwitter } from "./twitter";
import { publicEnv } from "../env";

interface MetadataBuilderParams {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  imageUrl?: string;
  imageAlt?: string;
  noIndex?: boolean;
}

export function buildMetadata(params: MetadataBuilderParams = {}): Metadata {
  const {
    title = SEO_DEFAULT_TITLE,
    description = SEO_DEFAULT_DESCRIPTION,
    path = "/",
    keywords = SEO_KEYWORDS,
    imageUrl,
    imageAlt,
    noIndex = false,
  } = params;

  const canonicalUrl = getCanonicalUrl(path);

  const baseMetadata: Metadata = {
    metadataBase: new URL(publicEnv.NEXT_PUBLIC_APP_URL),
    title: {
      default: title,
      template: `%s | ${SEO_BRAND_NAME}`,
    },
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: SEO_AUTHOR_NAME }],
    creator: SEO_AUTHOR_NAME,
    publisher: SEO_BRAND_NAME,
    applicationName: SEO_BRAND_NAME,
    generator: "Next.js",
    category: SEO_CATEGORY,
    classification: SEO_CLASSIFICATION,
    referrer: "strict-origin-when-cross-origin",
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: SEO_VERIFICATION_TOKENS,
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "192x192" },
      ],
      shortcut: ["/favicon.ico"],
      apple: [
        { url: "/logo.png", sizes: "512x512", type: "image/png" },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: SEO_BRAND_NAME,
    },
    formatDetection: {
      telephone: false,
      date: false,
      address: false,
      email: false,
    },
    openGraph: buildOpenGraph({ title, description, path, imageUrl, imageAlt }),
    twitter: buildTwitter({ title, description, imageUrl, imageAlt }),
  };

  return baseMetadata;
}
