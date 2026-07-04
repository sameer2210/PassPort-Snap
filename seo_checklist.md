# Technical SEO Verification Checklist - PassportSnap

This document verifies the implementation status and validation results for each of the 20 technical SEO audit categories.

---

- [x] **1. Centralized Metadata Architecture**
  - **Status:** Verified.
  - **Details:** Reusable SEO architecture built under `lib/seo/`. Fully parameterized via constants and builder helpers.
  
- [x] **2. Global & Dynamic Metadata**
  - **Status:** Verified.
  - **Details:** Imported `buildMetadata` in `layout.tsx` to populate all requested fields (`metadataBase`, description, creator, keywords, alternates, robots, etc.).

- [x] **3. Structured Data (JSON-LD)**
  - **Status:** Verified.
  - **Details:** Structured linked graph schema (`Organization`, `WebSite`, `WebPage`, `SoftwareApplication`, `SearchAction`, `BreadcrumbList`, `FAQPage`, `HowTo`, `ImageObject`) stringified and injected via script block in `app/page.tsx`.

- [x] **4. Sitemap**
  - **Status:** Verified.
  - **Details:** Created [app/sitemap.ts](file:///c:/Users/Sam/Desktop/passport-snap/app/sitemap.ts) using Next.js `MetadataRoute.Sitemap` producing valid sitemap outputs on compile.

- [x] **5. Robots.txt**
  - **Status:** Verified.
  - **Details:** Created [app/robots.ts](file:///c:/Users/Sam/Desktop/passport-snap/app/robots.ts) using Next.js `MetadataRoute.Robots` blocking `/api`, `/private`, and `/error`.

- [x] **6. Canonical URLs**
  - **Status:** Verified.
  - **Details:** Integrated single canonical URL logic resolving dynamically via the custom `getCanonicalUrl` helper.

- [x] **7. Heading Structure**
  - **Status:** Verified.
  - **Details:** Restructured page headers to change logo `h1` to a styled `span`. Visual copy sections at the bottom of `app/page.tsx` now cascade correctly from `<h1>` (hero title) to `<h2>` and `<h3>` tags.

- [x] **8. Image Optimization**
  - **Status:** Verified.
  - **Details:** Configured `decoding="async"`, `loading="eager"` for canvas previews above-the-fold, and `loading="lazy"` for selectors and lists. Alt text values are descriptive.

- [x] **9. Accessibility (A11y)**
  - **Status:** Verified.
  - **Details:** Modified custom cards in `Step1PhotoType.tsx` to include `role="button"`, `tabIndex={0}`, and `onKeyDown` triggers. Integrated focus indicators and `aria-current="step"`.

- [x] **10. Internal Linking**
  - **Status:** Verified.
  - **Details:** Added navigation links, schema scroll targets, and footer links referencing site maps and manifests.

- [x] **11. URL Structure**
  - **Status:** Verified.
  - **Details:** Crawler indexing targets `/sitemap.xml` and `/robots.txt` are lowercase, hyphenated, and standard.

- [x] **12. Performance Optimization**
  - **Status:** Verified.
  - **Details:** Integrated Google Font optimization (`next/font/google`) inside layouts. Implemented code splitting and lazy loading on all heavy Wizard step components.

- [x] **13. PWA Manifest**
  - **Status:** Verified.
  - **Details:** Upgraded `manifest.json` adding shortcuts, screenshots, window-control overrides, classifications, and `"purpose": "any maskable"` properties on icons.

- [x] **14. Security Headers**
  - **Status:** Verified.
  - **Details:** Injected strict transport policies (HSTS), frame blockages, XSS prevention, COOP/CORP policies, and a strict content security policy (CSP) inside `next.config.ts`.

- [x] **15. Indexing**
  - **Status:** Verified.
  - **Details:** Confirmed no index conflicts or accidental noindexes inside layouts or page directives.

- [x] **16. Social Sharing Preview**
  - **Status:** Verified.
  - **Details:** Programmed metadata cards for OpenGraph and Twitter including 1200x630 graphics mapping.

- [x] **17. Google Search Console Readiness**
  - **Status:** Verified.
  - **Details:** Verification token placeholders mapped inside layout verification objects.

- [x] **18. Homepage Content**
  - **Status:** Verified.
  - **Details:** Added copy content sections explaining standards, templates, WASM security, and accordions containing key FAQs.

- [x] **19. Code Validation**
  - **Status:** Verified.
  - **Details:** Successfully ran build (`npm run build`), lint checks (`npm run lint`), and typecheck checks (`npm run typecheck`) without errors or warnings.
