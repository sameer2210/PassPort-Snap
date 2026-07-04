import { getCanonicalUrl } from "./canonical";
import {
  SEO_BRAND_NAME,
  SEO_DEFAULT_DESCRIPTION,
  SEO_DEFAULT_TITLE,
  SEO_CATEGORY,
} from "./constants";
import { getOrganizationSchema } from "./organization";
import { getWebSiteSchema } from "./website";

export function getWebPageSchema() {
  return {
    "@type": "WebPage",
    "@id": getCanonicalUrl("#webpage"),
    "url": getCanonicalUrl("/"),
    "name": SEO_DEFAULT_TITLE,
    "description": SEO_DEFAULT_DESCRIPTION,
    "isPartOf": {
      "@id": getCanonicalUrl("#website"),
    },
    "about": {
      "@id": getCanonicalUrl("#organization"),
    },
    "primaryImageOfPage": {
      "@id": getCanonicalUrl("#logo"),
    },
  };
}

export function getSoftwareApplicationSchema() {
  return {
    "@type": "SoftwareApplication",
    "@id": getCanonicalUrl("#software"),
    "name": SEO_BRAND_NAME,
    "description": SEO_DEFAULT_DESCRIPTION,
    "applicationCategory": SEO_CATEGORY,
    "operatingSystem": "All (Browser-Based, Desktop, Mobile, Tablet)",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "browserRequirements": "Requires HTML5, WebAssembly, IndexedDB",
    "features": "AI background removal, face centering, layout printing, custom size support",
  };
}

export function getFAQPageSchema() {
  return {
    "@type": "FAQPage",
    "@id": getCanonicalUrl("#faq"),
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is PassportSnap really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, PassportSnap is 100% free. All adjustments, cropping, sizing, background removals, and high-quality PDF downloads are provided completely free of charge.",
        },
      },
      {
        "@type": "Question",
        "name": "Is my photo uploaded to any server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, PassportSnap is an offline-first app. Your photo is processed entirely locally inside your browser using WebAssembly. Your face data and portrait uploads are never transmitted to any external server, ensuring absolute privacy.",
        },
      },
      {
        "@type": "Question",
        "name": "What passport and visa photo sizes are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We support multiple standard templates including US Passport & Visa (2x2 inch), India Passport (35x45mm), UK/Europe/Australia (35x45mm), Canada (50x70mm), China (33x48mm), and custom physical millimeter dimensions.",
        },
      },
      {
        "@type": "Question",
        "name": "Can I print the tiled layout sheet at home?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! PassportSnap lets you arrange multiple photo copies onto standard print sheet sizes like A4, A5, 4x6 inch (4R), and 5x7 inch (5R). You can download a print-ready PDF matched to 300 DPI printers and spool it directly from your browser.",
        },
      },
    ],
  };
}

export function getHowToSchema() {
  return {
    "@type": "HowTo",
    "@id": getCanonicalUrl("#howto"),
    "name": "How to Make a Passport Photo Online",
    "description": "Step-by-step guide to generating, adjusting, and printing compliant passport size photos locally in your browser.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Select Size",
        "text": "Choose a preset size template like US (2x2 inch) or India (35x45mm), or input custom width and height in physical millimeters.",
        "url": getCanonicalUrl("#step-1"),
      },
      {
        "@type": "HowToStep",
        "name": "Upload Portrait",
        "text": "Select or drag-and-drop a portrait photo up to 20MB in JPEG, PNG, WEBP, or HEIC format.",
        "url": getCanonicalUrl("#step-2"),
      },
      {
        "@type": "HowToStep",
        "name": "Crop and Adjust",
        "text": "Position your face in the target boundary. Use AI auto-alignment or adjust manually with brightness, contrast, zoom, and rotation controls.",
        "url": getCanonicalUrl("#step-3"),
      },
      {
        "@type": "HowToStep",
        "name": "Normalize Background",
        "text": "The local AI model isolates your portrait. Swap background colors to White, Light Blue, or custom hex codes locally in the browser.",
        "url": getCanonicalUrl("#step-4"),
      },
      {
        "@type": "HowToStep",
        "name": "Export and Print",
        "text": "Select paper sheet layout (A4, 4R, etc.), toggle cutlines, place copies, and download a print-ready PDF or individual portrait images.",
        "url": getCanonicalUrl("#step-5"),
      },
    ],
  };
}

export function getBreadcrumbListSchema() {
  return {
    "@type": "BreadcrumbList",
    "@id": getCanonicalUrl("#breadcrumb"),
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": getCanonicalUrl("/"),
      },
    ],
  };
}

export function getGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      getOrganizationSchema(),
      getWebSiteSchema(),
      getWebPageSchema(),
      getSoftwareApplicationSchema(),
      getFAQPageSchema(),
      getHowToSchema(),
      getBreadcrumbListSchema(),
    ],
  };
}
