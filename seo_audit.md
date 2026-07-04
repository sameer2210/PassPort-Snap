# Technical SEO Audit - PassportSnap

This document presents a comprehensive technical SEO and accessibility audit of **PassportSnap**, an offline-first passport photo maker.

---

## 1. Summary of Findings

| Category | Status | Issues Found | Max Severity |
| :--- | :---: | :---: | :---: |
| **1. Metadata** | ⚠️ Needs Work | Missing critical tags (keywords, robots, etc.) | High |
| **2. Dynamic Metadata** | ⚠️ Needs Work | Route is single-page, but metadata lacks dynamic scope | Medium |
| **3. Structured Data** | ❌ Missing | No JSON-LD structured data implemented | High |
| **4. Sitemap** | ❌ Missing | No dynamic or static sitemap | High |
| **5. Robots.txt** | ❌ Missing | No robots.txt file | High |
| **6. Canonicals** | ❌ Missing | No canonical links configured | High |
| **7. Heading Structure** | ⚠️ Needs Work | logo `h1` in header only; no primary topic `h1` in content | High |
| **8. Images** | ⚠️ Needs Work | Missing lazy loading/decoding properties; generic alt text | Medium |
| **9. Accessibility** | ⚠️ Needs Work | Select-none interactive cards lack keyboard focus/ARIE roles | High |
| **10. Internal Linking** | ❌ Missing | No header navigation controls or semantic footer links | Medium |
| **11. URL Structure** | ⚡ OK | Dynamic sitemap and robots are clean and standard | Low |
| **12. Performance** | ⚠️ Needs Work | Inter font family variable is declared but not loaded | Medium |
| **13. PWA** | ⚠️ Needs Work | Missing maskable icon purpose, screenshots, and shortcuts | Medium |
| **14. Security Headers** | ⚠️ Needs Work | Missing HSTS and legacy XSS headers | Medium |
| **15. Indexing** | ⚡ OK | No accidental noindex tags found | Low |
| **16. Social Sharing** | ⚠️ Needs Work | No customized OpenGraph or Twitter card graphics | Medium |
| **17. Google Search Console** | ❌ Missing | No verification placeholders or indexing controls | Medium |
| **18. Homepage Content** | ❌ Missing | Missing copy, descriptions, and FAQs containing targeted terms | High |

---

## 2. Detailed Audit Results

### Category 1 & 2: Metadata & Dynamic Metadata
* **Issue:** Missing standard and advanced meta tags for SEO and dynamic routing.
* **Severity:** **High**
* **Affected Files:**
  * [app/layout.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/layout.tsx)
* **Explanation:** The current layout defines a minimal `Metadata` object. It lacks dynamic context, alternates (canonical), robots controls, keywords, creator/publisher tags, application category, and detailed OpenGraph or Twitter configurations.
* **Recommended Fix:** Expand the metadata in [app/layout.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/layout.tsx) and [app/page.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/page.tsx) using the standard Next.js Metadata API. Set keywords, robots, creators, viewport, and theme colors correctly.

---

### Category 3: Structured Data
* **Issue:** No JSON-LD structured data implemented.
* **Severity:** **High**
* **Affected Files:**
  * [app/page.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/page.tsx)
* **Explanation:** Search engines rely on structured data to index features and build Rich Snippets (such as software application features, reviews, how-tos, and FAQs) directly on search result pages.
* **Recommended Fix:** Implement JSON-LD scripts inside the root page. Include:
  * **Organization**: Brand name, url, logo.
  * **WebSite**: Query action search placeholder.
  * **WebPage**: Root page target and description.
  * **SoftwareApplication**: Category (Multimedia/Utility), operating system, price (free).
  * **HowTo**: Steps outlining image upload, cropping, background removal, and print sheet layout.
  * **FAQPage**: Dynamic FAQs addressing privacy, offline processing, custom dimensions, and printer sheet setup.
  * **BreadcrumbList**: Root breadcrumb references.
  * **ImageObject**: Visual guides and screenshots.

---

### Category 4: Sitemap
* **Issue:** No sitemap.xml exists.
* **Severity:** **High**
* **Affected Files:**
  * `[NEW] app/sitemap.ts`
* **Explanation:** Crawlers use the sitemap to index the site efficiently. Even for single-page applications, a valid sitemap.xml is required for Google Search Console registration.
* **Recommended Fix:** Create [app/sitemap.ts](file:///c:/Users/Sam/Desktop/passport-snap/app/sitemap.ts) utilizing Next.js `MetadataRoute.Sitemap` to dynamically yield root URLs with `lastModified`, `changeFrequency: "weekly"`, and `priority: 1.0`.

---

### Category 5: Robots.txt
* **Issue:** No robots.txt file exists.
* **Severity:** **High**
* **Affected Files:**
  * `[NEW] app/robots.ts`
* **Explanation:** Crawlers rely on robots.txt to determine paths that should not be indexed and to find the sitemap.
* **Recommended Fix:** Create [app/robots.ts](file:///c:/Users/Sam/Desktop/passport-snap/app/robots.ts) using Next.js `MetadataRoute.Robots` to allow all crawling on the root page and disallow private pathways (e.g., `/api`, `/private`). Specify the sitemap location.

---

### Category 6: Canonicals
* **Issue:** Missing canonical URL specification.
* **Severity:** **High**
* **Affected Files:**
  * [app/layout.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/layout.tsx)
* **Explanation:** A missing canonical link leaves the site vulnerable to duplicate content indexing (e.g. tracking parameters, HTTP vs HTTPS, or alternate domains).
* **Recommended Fix:** Add `alternates: { canonical: '/' }` in the Next.js `Metadata` configuration resolved using the public app URL.

---

### Category 7: Heading Structure
* **Issue:** Missing primary topic `<h1>` and weak heading hierarchy.
* **Severity:** **High**
* **Affected Files:**
  * [app/page.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/page.tsx)
  * [components/wizard/Step1PhotoType.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step1PhotoType.tsx)
* **Explanation:** The only `<h1>` element is the logo text in the header, which is not a descriptive heading. The application interface consists solely of a wizard wrapper that changes step views. The lack of a descriptive primary `<h1>` and structured subheadings degrades indexing potential.
* **Recommended Fix:**
  1. Change the header logo markup from an `<h1>` to a styled `span` or `div` to free up the `<h1>` tag for semantic content.
  2. Add a hidden or beautifully styled descriptive `<h1>` title at the top of the main layout, or build a premium content section at the bottom of the page that begins with a clean, keyword-rich `<h1>` (e.g., "Free AI Passport Photo Maker Online").
  3. Structure the bottom content section with `<h2>` and `<h3>` tags detailing templates (US 2x2, India 35x45mm), AI features, offline privacy, and print-ready sheets.

---

### Category 8: Images
* **Issue:** Preview and selector images lack optimization attributes (decoding, loading, priority) and descriptive alt text.
* **Severity:** **Medium**
* **Affected Files:**
  * [components/wizard/Step3Adjust.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step3Adjust.tsx)
  * [components/wizard/Step4Background.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step4Background.tsx)
  * [components/print/PrintPreviewCanvas.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/print/PrintPreviewCanvas.tsx)
  * [components/print/PrintPreviewSlot.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/print/PrintPreviewSlot.tsx)
  * [components/print/PrintPhotoSelector.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/print/PrintPhotoSelector.tsx)
* **Explanation:** While using standard `<img>` is necessary for client-side Object URLs (blobs) instead of Next.js server-side `Image` components, standard images should still set `decoding="async"`, `loading="lazy"` or `loading="eager"` (for priority above-the-fold canvas elements), and have meaningful descriptive alt texts instead of generic names like "Single Place" or "Slot 1".
* **Recommended Fix:**
  * Add `decoding="async"` to all images.
  * For primary previews (Step 3 cropper source, Step 4 composite output, Step 5 print canvas), use `loading="eager"`.
  * For list items (Step 5 photo selector items), use `loading="lazy"`.
  * Replace generic `alt` attributes with descriptive strings (e.g. `alt="Studio passport photo layout sheet"`, `alt="Adjusted passport photo preview"`).

---

### Category 9: Accessibility
* **Issue:** Custom components and layout step elements lack keyboard navigation, focus indicators, and ARIA roles.
* **Severity:** **High**
* **Affected Files:**
  * [components/wizard/Step1PhotoType.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step1PhotoType.tsx)
  * [components/wizard/Step2Upload.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step2Upload.tsx)
  * [components/wizard/WizardNavigation.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/WizardNavigation.tsx)
* **Explanation:**
  * In `Step1PhotoType.tsx`, the card wrappers for templates and custom sizes are `div` elements with `onClick` handlers but no `role="button"`, `tabIndex`, or keyboard support. Screen reader users cannot interact with or focus on these options.
  * In `Step2Upload.tsx`, the drag-and-drop zone is a `div` element with an `onClick` that launches the file dialog but does not indicate keyboard focus.
  * In `WizardNavigation.tsx`, step items are rendered as buttons, but the active state does not output `aria-current="step"`.
* **Recommended Fix:**
  * Add `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler (supporting Enter and Space keys) to the custom size card wrapper and the template select wrapper cards.
  * In `WizardNavigation.tsx`, append `aria-current={isActive ? "step" : undefined}` to step buttons.
  * Ensure focus rings are cleanly applied on key navigation.

---

### Category 10: Internal Linking
* **Issue:** The application lacks a standard header/footer layout structure, isolating the single page view.
* **Severity:** **Medium**
* **Affected Files:**
  * [app/page.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/page.tsx)
* **Explanation:** Standard SEO templates require a semantic footer and internal linking anchors (such as referencing terms of use, privacy policies, sitemaps, and manifest assets) to build a robust site map hierarchy.
* **Recommended Fix:** Build a modern, semantic footer at the bottom of [app/page.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/page.tsx) that renders copyrights, offline indicators, and anchors referencing the sitemap and manifest.

---

### Category 12: Performance (Fonts)
* **Issue:** CSS variables for "Inter" are defined, but the font family files are not imported, causing system fallbacks and Cumulative Layout Shift (CLS).
* **Severity:** **Medium**
* **Affected Files:**
  * [app/layout.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/layout.tsx)
* **Explanation:** `app/layout.tsx` hardcodes `const inter = { variable: "--font-inter" }` without importing `next/font/google`. Thus, next.js does not fetch or cache the Google Font during build, relying completely on browser default fonts. This leads to font loading jumps and layout shifts.
* **Recommended Fix:** Update [app/layout.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/layout.tsx) to import `Inter` from `next/font/google` and configure it:
  ```typescript
  import { Inter } from "next/font/google";
  const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
  });
  ```
  Since `next.config.ts` has a fetch interceptor, this will compile safely offline by falling back gracefully, and online it will prefetch and optimize the font assets correctly!

---

### Category 13: PWA Manifest
* **Issue:** Manifest configuration lacks maskable icon purpose, shortcuts, and screenshots.
* **Severity:** **Medium**
* **Affected Files:**
  * [public/manifest.json](file:///c:/Users/Sam/Desktop/passport-snap/public/manifest.json)
* **Explanation:** Modern PWAs require `"purpose": "any maskable"` defined for launch icons to adapt cleanly to circle/squircle designs on modern mobile systems (Android/iOS). Screenshots and app shortcuts provide richer app details during prompt installs.
* **Recommended Fix:** Add `"purpose": "any maskable"` to the manifest icons array. Add placeholder application shortcuts and standard screenshot arrays to satisfy Google's premium PWA index criteria.

---

### Category 14: Security Headers
* **Issue:** Missing standard production security headers.
* **Severity:** **Medium**
* **Affected Files:**
  * [next.config.ts](file:///c:/Users/Sam/Desktop/passport-snap/next.config.ts)
* **Explanation:** Current headers include standard options, but lack `Strict-Transport-Security` (HSTS), legacy `X-XSS-Protection`, and cross-origin embedder configurations.
* **Recommended Fix:** Add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` and `X-XSS-Protection: 1; mode=block` inside `next.config.ts` headers.

---

### Category 17: Google Search Console Readiness
* **Issue:** Missing metadata verification and explicit crawler instructions.
* **Severity:** **Medium**
* **Affected Files:**
  * [app/layout.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/layout.tsx)
* **Explanation:** Search Console verification tokens are required to register and monitor indexing.
* **Recommended Fix:** Add verification metadata placeholder to standard layout.

---

### Category 18: Homepage Content
* **Issue:** Complete absence of copy, descriptions, keywords, and FAQs on the home page.
* **Severity:** **High**
* **Affected Files:**
  * [app/page.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/page.tsx)
* **Explanation:** Crawlers cannot index the application effectively if there is no text copy. Currently, the page only displays the Wizard workspace. Adding rich, semantic, keyword-optimized content below the Wizard workspace will provide crawlable content containing targeted primary and secondary terms.
* **Recommended Fix:** Create a beautiful copy section under `<Wizard />` containing:
  * Primary H1/H2 header titles using target terms ("Passport Photo Maker Online", "AI Passport Photo Editor").
  * Explanations for US passport photos (2x2 inch), India sizes (35x45mm), and general visa dimensions.
  * A section highlighting privacy (offline local WASM compilation).
  * An interactive FAQ section covering key questions matching search intent (with JSON-LD structure mapping).
  * Styled footer showing supported standards.
