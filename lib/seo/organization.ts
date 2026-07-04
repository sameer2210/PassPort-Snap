import { getCanonicalUrl } from "./canonical";
import { SEO_BRAND_NAME } from "./constants";

export function getOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": getCanonicalUrl("#organization"),
    "name": SEO_BRAND_NAME,
    "url": getCanonicalUrl("/"),
    "logo": {
      "@type": "ImageObject",
      "@id": getCanonicalUrl("#logo"),
      "url": getCanonicalUrl("/logo.png"),
      "caption": `${SEO_BRAND_NAME} Logo`,
    },
    "image": {
      "@id": getCanonicalUrl("#logo"),
    },
  };
}
