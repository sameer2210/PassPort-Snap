# Technical SEO and Accessibility Changes Summary - PassportSnap

This document outlines the files created or modified to complete the technical SEO audit and implementation for the PassportSnap project.

---

## 1. Summary of Changes

| File Path | Status | Action | SEO / Accessibility Impact |
| :--- | :---: | :---: | :--- |
| [lib/seo/constants.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/seo/constants.ts) | `[NEW]` | Created | Centralized single-source-of-truth for SEO configurations, keywords, and verification. |
| [lib/seo/canonical.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/seo/canonical.ts) | `[NEW]` | Created | Resolves consistent canonical URL matching base domains. |
| [lib/seo/metadata.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/seo/metadata.ts) | `[NEW]` | Created | Assembles production-grade Next.js Metadata objects. |
| [lib/seo/openGraph.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/seo/openGraph.ts) | `[NEW]` | Created | Generates compliant OpenGraph assets for search and messaging previews. |
| [lib/seo/twitter.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/seo/twitter.ts) | `[NEW]` | Created | Generates compliant Twitter cards and creator records. |
| [lib/seo/schema.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/seo/schema.ts) | `[NEW]` | Created | Linked schema graphs combining Organization, Software, WebPage, FAQs, and HowTo instructions. |
| [lib/seo/structured-data.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/seo/structured-data.ts) | `[NEW]` | Created | Stringifies graphs for script tags injection in layouts/pages. |
| [lib/seo/organization.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/seo/organization.ts) | `[NEW]` | Created | Schema representation of Organization (logo, URLs). |
| [lib/seo/website.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/seo/website.ts) | `[NEW]` | Created | Schema representation of WebSite and SearchAction. |
| [app/layout.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/layout.tsx) | `[MODIFY]` | Updated | Added google font optimizers (`next/font/google`), preloading Inter to reduce CLS, and injected dynamic metadata. |
| [app/page.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/page.tsx) | `[MODIFY]` | Updated | Restructured logo hierarchy (changed logo `h1` to a styled `span`), injected JSON-LD script, built a descriptive landing copy section, and added a semantic footer. |
| [app/sitemap.ts](file:///c:/Users/Sam/Desktop/passport-snap/app/sitemap.ts) | `[NEW]` | Created | Dynamically registers sitemap pages with update frequencies and priorities. |
| [app/robots.ts](file:///c:/Users/Sam/Desktop/passport-snap/app/robots.ts) | `[NEW]` | Created | Controls crawler indexing, disallowing API folders, and referencing sitemap paths. |
| [components/wizard/Wizard.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Wizard.tsx) | `[MODIFY]` | Updated | Dynamic lazy loading of wizard steps via Suspense/next/dynamic, drastically reducing home page load time and improving TTFB. |
| [components/wizard/Step1PhotoType.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step1PhotoType.tsx) | `[MODIFY]` | Updated | Interactive card wraps converted to accessible buttons (role=&quot;button&quot;, tabIndex={0}, and KeyDown space/enter handlers). |
| [components/wizard/WizardNavigation.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/WizardNavigation.tsx) | `[MODIFY]` | Updated | Integrated `aria-current=&quot;step&quot;` to indicate active navigation path. |
| [components/wizard/Step3Adjust.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step3Adjust.tsx) | `[MODIFY]` | Updated | Optimized hidden preview image elements (added async decoding and eager priorities). |
| [components/wizard/Step4Background.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step4Background.tsx) | `[MODIFY]` | Updated | Optimized preview output image elements (added async decoding, eager loading, and descriptive alt text). |
| [components/print/PrintPreviewCanvas.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/print/PrintPreviewCanvas.tsx) | `[MODIFY]` | Updated | Optimized single photo export preview image element (alt values, eager loading, async decoding). |
| [components/print/PrintPreviewSlot.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/print/PrintPreviewSlot.tsx) | `[MODIFY]` | Updated | Optimized layout grid slots (alt values, eager loading, async decoding). |
| [components/print/PrintPhotoSelector.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/print/PrintPhotoSelector.tsx) | `[MODIFY]` | Updated | Optimized list image items (alt values, lazy loading, async decoding). |
| [public/manifest.json](file:///c:/Users/Sam/Desktop/passport-snap/public/manifest.json) | `[MODIFY]` | Updated | Upgraded PWA manifest to support maskable launcher icons, shortcuts, screenshots, display overrides, and classifications. |
| [next.config.ts](file:///c:/Users/Sam/Desktop/passport-snap/next.config.ts) | `[MODIFY]` | Updated | Enhanced security profile with Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), COOP, CORP, and XSS headers. |

---

## 2. Rationale & Technical SEO Impact

### Centralized SEO Architecture
* **Why:** Implementing a centralized architecture keeps pages simple and ensures all metadata and structured schemas share a single source of truth (`lib/seo/constants.ts`). Adding future pages requires writing minimal metadata blocks, which inherit global alternates and verification tags.
* **SEO Impact:** Guaranteed metadata accuracy and unified brand representation.

### Production-Grade Metadata & Canonicals
* **Why:** Injected `metadataBase`, alternates, verified search indicators, categories, and browser/app capabilities.
* **SEO Impact:** Prevents duplicate indexing issues, allows registration with global consoles, and optimizes visual cards on shares.

### Linked Graph Structured Data (JSON-LD)
* **Why:** Embedded linked entity schemas using `@id` references. Organization is linked to WebSite, which is linked to the WebPage, SoftwareApplication, FAQPage, HowTo steps, and Breadcrumb list.
* **SEO Impact:** Crawlers can resolve relations perfectly, enabling Google to display Rich Snippets, How-To steps, and FAQ expandable answers on SERPs.

### Homepage Semantic Structure & Heading Restoration
* **Why:** Rescued the logo tag from being the primary `<h1>`, replacing it with a visually descriptive header title on `/` page content. Built rich copywriting grids covering:
  1. *Hero:* Target keywords used naturally.
  2. *Features:* AI tools and templates.
  3. *Supported standards:* Clear physical size lists.
  4. *Offline privacy details:* WASM and local inference description.
  5. *FAQ details:* HTML details/summary elements are fully accessible.
* **SEO Impact:** Significant improvement in keyword relevance, topical authority, and crawler comprehension.

### Image Optimization
* **Why:** Set `decoding="async"`, `loading="eager"` on core previews (above-the-fold), and `loading="lazy"` on list items. Alternate descriptions are unique and meaningful.
* **SEO Impact:** Faster page rendering and improved accessibility score.

### Dynamic Lazy Loading (Performance)
* **Why:** Large modules like cropper engines, jsPDF sheets, and neural isolation models are imported dynamically using Next.js Suspense. They only load when the user navigates to Step 3, 4, or 5.
* **SEO Impact:** Improved Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS), improving Core Web Vitals rankings.
