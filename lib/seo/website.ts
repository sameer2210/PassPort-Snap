import { getCanonicalUrl } from "./canonical";
import { SEO_BRAND_NAME } from "./constants";

export function getWebSiteSchema() {
  const url = getCanonicalUrl("/");
  return {
    "@type": "WebSite",
    "@id": getCanonicalUrl("#website"),
    "name": SEO_BRAND_NAME,
    "url": url,
    "publisher": {
      "@id": getCanonicalUrl("#organization"),
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
