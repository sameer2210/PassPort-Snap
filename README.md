This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# SPEC-1-Passport-Photo-Dashboard

## Background

Users (non-technical) need a simple tool to create passport-size photos with correct dimensions, layout multiple copies on paper, and print or export as PDF. The system must work offline after initial load and support AI-assisted automatic adjustments (face alignment, crop, background normalization).

---

## Requirements

### Must Have (M)

* Upload one or multiple images
* Crop, resize, rotate images
* Auto-detect face and align to passport standards
* Generate multiple copies on A4 with spacing
* Export to PDF and print
* Work offline after first load (PWA)
* Save and reopen projects offline

### Should Have (S)

* 5 Multiple country templates (India, US, etc.)that most use
* Background normalization (white/blue)
* Image enhancement (brightness, contrast, sharpness)

### Could Have (C)

* Filters and borders
* Drag-drop layout editing

### Won’t Have (W)

* Login system
* Cloud storage

---

## Method

### Architecture

```plantuml
@startuml
actor User
User -> Browser : Upload Image
Browser -> Canvas Engine : Edit (crop/resize)
Canvas Engine -> AI Module : Detect Face
Canvas Engine -> Layout Engine : Arrange on A4 or another sheet
Layout Engine -> PDF Generator : Generate PDF
PDF Generator -> User : Download/Print
Browser -> IndexedDB : Save Project
@enduml
```

---

### Key Components & Tech Choices

## Frontend Framework

* Next.js (App Router)
* TypeScript

## Image Processing

* fabric.js → canvas editing (drag, resize, layout)
* react-easy-crop → cropping UI
* pica → high-quality resize if free

## AI Face Detection & Auto Adjustment if free then only use

* MediaPipe Face Detection
* Algorithm:

  1. Detect face bounding box
  2. Calculate head height ratio
  3. Align face center to template
  4. Auto crop to passport size

## Layout Engine (Critical)

Convert mm → pixels using:

px = (mm / 25.4) * DPI

Use 300 DPI for print quality.

Algorithm:

* Input: photo size (e.g., 35x45 mm)
* Calculate pixel size
* Tile images into A4 (210x297 mm)
* Maintain spacing

## PDF Generation

* jsPDF
* Render canvas → image → PDF

## Offline Storage

* IndexedDB

Schema:

Project:

* id
* images (blob)
* layout config (JSON)
* template type
* created_at

## Offline Support (PWA)

* next-pwa
* Service Worker caching

---

## Implementation

### Step 1: Setup

* Create Next.js + TypeScript app
* Configure PWA (next-pwa)

### Step 2: Image Upload

* Use input file API
* Convert to object URL

### Step 3: Canvas Editor

* Integrate fabric.js
* Add drag/resize controls

### Step 4: Crop Feature

* Integrate react-easy-crop

### Step 5: AI Integration

* Load MediaPipe
* Implement face detection
* Auto-adjust crop

### Step 6: Layout Engine

* Implement mm → px conversion
* Generate grid layout

### Step 7: PDF Export

* Use jsPDF
* Export canvas

### Step 8: IndexedDB Storage

* Save/load project state

### Step 9: Print Support

* Use window.print()

---

## Milestones

1. Basic UI + image upload
2. Crop + resize working
3. Layout engine complete
4. PDF export working
5. AI auto-crop integration
6. Offline + IndexedDB support

---

## Gathering Results

* Validate passport size accuracy (mm precision)
* Test print DPI (300 DPI output)
* Measure load time offline
* Validate AI face alignment accuracy


Core Libraries (ALL FREE)
fabric.js → layout + editing
react-easy-crop → crop UI
Pica → high-quality resize
jsPDF → export
Storage
IndexedDB (browser built-in)


With this setup:

Auto face alignment (AI)
Passport-compliant sizing
Multi-photo layout on A4
Offline usage
Smart background normalization (FREE + offline)
Save/reopen projects


Output formats:

 multiple (A4, 4x6 inch, etc.)

 Background make a opton for user:

(A) Keep original
(B) Full removal (AI heavy)
(C) Smart replace (recommended MVP)

if user want strict passport compliance rules like:
Exact head height ratio (e.g., 70–80%)
Eye position alignment


Real-world analogy

Your app becomes like:

Photoshop (but in browser)
No upload, no server, no storage


## old settings sould be save user not have to set again and again


AI helps auto-detect face + align to passport standards
Target users = non-technical (photo studios / individuals)
Web-based app (not mobile-first native)


Correct Product Design (important)

User flow should be:

Select country/template
Upload photo
AI auto-adjust based on rules
Print
user Choose template manually



ADVANCED FEATURES
- Background removal (optional toggle)
- Lighting correction (auto enhance face visibility)
- Multiple photo variations (different backgrounds/sizes)
- History panel (undo/redo edits)
- Save presets (user preferences)


CORE FEATURES
- Upload single or multiple images (drag-drop + file picker)
- Auto face detection (chin, crown, eye line)
- Auto crop based on passport standards (no manual guesswork)
- Smart face positioning (center + correct head height ratio)
- Automatic background normalization (white/light gray/blue options)
- Real-time preview (instant updates on any adjustment)
- Manual fine-tune controls (zoom, pan, rotate, brightness, contrast)
- Multi-photo batch processing

PASSPORT STANDARD ENGINE
- Country-based preset system (India, US, UK, etc.)
- Config-driven dimensions (mm + pixel conversion)
- Face ratio validation (min/max % of image height)
- DPI-aware output (300 DPI standard for print)
- Warning system if image violates rules

PRINT & EXPORT
- Generate print-ready layouts (4x6, A4, custom grid)
- Auto arrange multiple copies on one sheet
- Download as high-quality PNG/JPEG
- Export print PDF with correct DPI and margins
- Individual photo download option

OFFLINE-FIRST (PWA)
- Service Worker caching (app works without internet after first load)
- Cache all assets and core logic
- IndexedDB storage for user images and sessions
- Resume previous work after reload/offline
- Installable as app (Add to Home Screen)

PERFORMANCE
- All processing happens in browser (no server upload)
- Fast image processing using Canvas/WebGL
- Lazy loading + optimized bundle
- Handles large images without freezing

---

## PRODUCTION-LEVEL AUDIT & TECHNICAL DOCUMENTATION

This section contains a comprehensive, production-level technical audit of PassportSnap.

### 1. Current Architecture
PassportSnap is designed as a client-side only, offline-first React/Next.js application. All data storage, face detection, background removal, cropping, and PDF layout calculations occur entirely in the user's browser, satisfying strict privacy constraints and eliminating server costs.

#### Data Flow & Processing Pipeline:
1. **Upload Phase**: The user uploads an image via `react-dropzone` (Step 2). The application generates an in-memory high-resolution Blob URL (`highResPhotoUrl`) for print rendering, and scales the image down to a maximum dimension of 2000px on a temporary canvas, exporting it as a compressed base64 JPEG Data URL (`previewPhotoUrl`) to save space in IndexedDB.
2. **Auto-Alignment (AI) & Crop Phase**: MediaPipe FaceDetector runs on the image. It loads the `blaze_face_short_range.tflite` model (Step 3). If a face is found, the app shifts the crop box offset and adjusts the zoom level so the face is centered and occupies ~60% of the photo height. The user can manually adjust zoom, rotation, brightness, and contrast.
3. **Background Processing**: If background replacement is requested (Step 4), `@imgly/background-removal` runs ONNX/Wasm models locally. It isolates the subject, renders the cutout on a canvas with a filled color (White or Light Blue), and exports the resulting base64 Data URL to `finalPhotoUrl`.
4. **Print Sheet Layout & PDF Generation**: In Step 5, the layout engine calculates dimensions (converting mm to px at 300 DPI) and tiles the photo slots onto A4, 4x6, or 5x7 sheets with borders/cutlines. `jsPDF` draws the images onto a PDF page using mm coordinates and triggers a client-side download.

---

### 2. Folder Structure
The workspace follows a flat next.js app-router directory layout:
* **`app/`**: Application shell and routing.
  * [globals.css](file:///c:/Users/Sam/Desktop/passport-snap/app/globals.css): Tailwind CSS v4 directives and theme variables.
  * [layout.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/layout.tsx): Root layout with metadata and PWA manifest reference.
  * [page.tsx](file:///c:/Users/Sam/Desktop/passport-snap/app/page.tsx): Renders the main `Wizard` component.
* **`components/`**: React UI components.
  * `ui/`: Shared base UI inputs.
    * [button.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/ui/button.tsx): Forward-ref tailwind styled button.
    * [card.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/ui/card.tsx): Card components.
    * [slider.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/ui/slider.tsx): Standard input range slider.
  * `wizard/`: Renders step-by-step editor stages.
    * [Wizard.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Wizard.tsx): Navigation coordinator.
    * [Step1PhotoType.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step1PhotoType.tsx): Template select or custom size entry.
    * [Step2Upload.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step2Upload.tsx): React-dropzone handler and image pre-scaling.
    * [Step3Adjust.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step3Adjust.tsx): react-easy-crop, sliders, and MediaPipe auto-adjustment.
    * [Step4Background.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step4Background.tsx): imgly background removal.
    * [Step5PrintSheet.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step5PrintSheet.tsx): Interactive print preview sheet, grid layout slots, and jsPDF downloader.
* **`lib/`**: Business logic modules.
  * [bgRemoval.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/bgRemoval.ts): Wrapper for `@imgly/background-removal` overlaying cutouts on canvas.
  * [config.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/config.ts): Pre-defined passport country templates and sheet dimensions.
  * [cropImage.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/cropImage.ts): Custom canvas crop, rotation, and filter rendering.
  * [env.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/env.ts): Standardized client-side environment variable loader.
  * [faceDetection.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/faceDetection.ts): MediaPipe task-vision face detector loader.
  * [storage.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/storage.ts): IndexedDB session pruning and garbage collection strategy.
  * [store.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/store.ts): Zustand state store with idbStorage persistence.
  * [types.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/types.ts): Shared TypeScript types.
  * [utils.ts](file:///c:/Users/Sam/Desktop/passport-snap/lib/utils.ts): Tailwind CSS classes merging helper.
* **`public/`**: Public assets folder.
  * `assets/models/imgly/`: Local assets for in-browser background removal.
  * `assets/models/mediapipe/`: BlazeFace model files.
  * `manifest.json`: PWA metadata manifest.
* **`types/`**: Custom typescript definitions.
  * [next-pwa.d.ts](file:///c:/Users/Sam/Desktop/passport-snap/types/next-pwa.d.ts): Module declaration override for next-pwa.

---

### 3. Feature Detection Checklist

| Feature | Status | Implementation Details / Code References |
| :--- | :--- | :--- |
| **Upload** | ✅ Complete | Uses `react-dropzone` in `Step2Upload.tsx` with size limit 20MB. Image is auto-scaled to max 2000px and converted to a base64 JPEG Data URL for storage. |
| **Cropping** | ✅ Complete | Implemented via `react-easy-crop` in `Step3Adjust.tsx`, with output handled by `getCroppedImg` in `lib/cropImage.ts`. |
| **Zoom** | ✅ Complete | Uses `react-easy-crop`'s zoom property linked to a slider in `Step3Adjust.tsx`. |
| **Rotate** | ✅ Complete | Implemented with a `Rotate` button in `Step3Adjust.tsx` rotating the canvas in 90-degree increments. |
| **Brightness** | ✅ Complete | Uses CSS filter on cropper preview, and canvas 2D `ctx.filter` during cropping in `lib/cropImage.ts`. |
| **Contrast** | ✅ Complete | Same as brightness, utilizes CSS and canvas `ctx.filter`. |
| **Sharpness** | ❌ Missing | No sharpness or edge-detection enhancement logic in code. |
| **Background Removal** | ✅ Complete | Done in `Step4Background.tsx` and `lib/bgRemoval.ts` using `@imgly/background-removal`. |
| **MediaPipe** | ✅ Complete | MediaPipe's vision tasks and model are loaded from local public directories. |
| **Face Detection** | ✅ Complete | Initialized in `lib/faceDetection.ts` using `blaze_face_short_range.tflite` model. |
| **Auto Crop** | 🟡 Partial | Basic centering calculation based on detected face bounding box, but lacks validation warnings or fallback indicators if face detection fails. |
| **Template System** | ✅ Complete | Contains config-driven definitions for 7 templates and sheet sizes in `lib/config.ts`. Supports custom input size. |
| **Print Layout** | ✅ Complete | Tiling grid slots calculations based on sheet dimensions in `Step5PrintSheet.tsx`. Supports manual photo toggling and custom borders/cutlines. |
| **PDF Export** | ✅ Complete | Done client-side via `jsPDF` using actual mm grid coordinates to preserve 300 DPI sizing. |
| **PNG/JPG Sheet Export** | ❌ Missing | No feature to export the finished tiled sheet as a single PNG/JPG image. |
| **Individual photo download** | ✅ Complete | Individual final photos can be downloaded as JPG from the list in `Step5PrintSheet.tsx`. |
| **Offline Mode & PWA** | 🟡 Partial | Service worker is configured using `next-pwa` in `next.config.ts`, but the required manifest icons do not exist in the codebase. |
| **IndexedDB** | ✅ Complete | App state and preview photos are persisted using `idb-keyval` in `lib/store.ts`. |
| **Undo / Redo** | ❌ Missing | No edit history stack or undo/redo mechanisms. |
| **Drag & Drop Layout** | ❌ Missing | Layout grid is interactive via clicking slots, but drag-and-drop slot swapping is not supported. |
| **Accessibility** | 🟡 Partial | Standard inputs are accessible, but custom sliders and interactive canvas/grid elements lack screen reader and keyboard accessibility support. |
| **Responsive Design** | ✅ Complete | Interfaces scale down using responsive flexbox/grid layout and Tailwind styles. |
| **Performance Opt.** | 🟡 Partial | Handles large images by scaling on upload, but IndexedDB session pruning triggers synchronous deserialization of large image payloads on every state change. |
| **Lazy loading / Workers** | 🟡 Partial | Models are fetched dynamically, but no web workers are used, causing minor browser thread block during face detection/background removal. |
| **Analytics** | ❌ Missing | No analytics scripts are present (ensures user privacy). |

---

### 4. Bugs and Issues Found

1. **Missing PWA Icon Assets**:
   The PWA `public/manifest.json` file points to `/icon-192x192.png` and `/icon-512x512.png`. These files are completely missing from the `public` directory, which causes PWA installation validations to fail.
2. **State-Clearing Bug on PDF Download**:
   In [Step5PrintSheet.tsx:L217-221](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step5PrintSheet.tsx#L217-L221), `handleDownloadPdf` sets `highResPhotoUrl` and `highResFinalUrl` to `null` in the Zustand store after the PDF downloads. Since these are in-memory Blob URLs, clearing them prevents the user from updating layout parameters and re-downloading the PDF without starting the entire upload process over.
3. **IndexedDB Session Cleaning Performance Bottleneck**:
   In [storage.ts:L59](file:///c:/Users/Sam/Desktop/passport-snap/lib/storage.ts#L59), `cleanupSessions` reads *all* key-value entries from IndexedDB on every Zustand store update (triggered by `setItem` in `idbStorage`). It parses each entry's JSON payload (which includes megabyte-scale base64 image data). If multiple sessions exist, this blocks the main browser thread, causing noticeable lag.
4. **Canvas Clipping on Image Rotation**:
   In [cropImage.ts:L29-30](file:///c:/Users/Sam/Desktop/passport-snap/lib/cropImage.ts#L29-L30), the canvas width and height are set to the *original* image dimensions before translation and rotation. If an image is rotated 90 or 270 degrees, its dimensions swap. Drawing it onto the original aspect ratio clips the left/right or top/bottom edges of the rotated image.
5. **No Background Removal Preview**:
   In [Step4Background.tsx](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step4Background.tsx), the three preview cards for "Original", "White", and "Light Blue" all display the original cropped image `person.croppedPhotoUrl` directly. Since this image contains its original solid background, it covers the card container's background color. The cards appear identical, and the user cannot preview the background removal output.
6. **Dead Code and Redundant Statements in `bgRemoval.ts`**:
   In [bgRemoval.ts:L7](file:///c:/Users/Sam/Desktop/passport-snap/lib/bgRemoval.ts#L7), the function returns early if `backgroundColor === 'transparent'`. Yet at line 37, it checks `const isTransparent = backgroundColor === 'transparent'`, which can never be true.
7. **Confusing Auto-Redirect on Page Load**:
   In [Step1PhotoType.tsx:L12-18](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step1PhotoType.tsx#L12-L18), the `useEffect` block reads the previously saved template from `localStorage` and automatically jumps the user to Step 2. Users returning to the page are locked out of Step 1 unless they find the "Change Size Template" button in Step 2.
8. **ESLint Errors Block Build Validation**:
   The ESLint command fails because of `any` types in `Step5PrintSheet.tsx` (lines 193 and 210) where `(doc as any).setLineDash(...)` is used. This prevents `npm run build` from succeeding.
9. **Fixed Scale Factor in Preview Sheet**:
   In [Step5PrintSheet.tsx:L383](file:///c:/Users/Sam/Desktop/passport-snap/components/wizard/Step5PrintSheet.tsx#L383), the preview container has a hardcoded CSS `transform: scale(2.5)`. On small mobile screens, the preview overflows the viewport, and on small paper sizes (like 4x6), the sheet appears very small with large grey borders.

---

### 5. Technical Debt and Code Smells
* **Zustand Storage Pollution**: Because the state is saved as a single object, IndexedDB contains multiple copies of the state serialized. The session key uses `passport_session_${sessionId}` but copies the entire Zustand storage value including helper fields.
* **Unused Packages**: `fabric` and `@types/fabric` are in `package.json` but are completely unused.
* **Inline Any Types**: Typescript casts `(doc as any)` are used in `Step5PrintSheet.tsx` to call undocumented functions on `jsPDF`.
* **Component Size**: `Step5PrintSheet.tsx` is 476 lines long and is overloaded with layout state, PDF generation logic, rendering loops, and UI controls. It violates the single-responsibility principle.
* **Keyboard Inaccessible Canvas UI**: `react-easy-crop` does not support keyboard inputs for cropping, and custom sliders lack standard keyboard accessibility properties.

---

### 6. Dependencies Audit

| Dependency | Purpose | Status |
| :--- | :--- | :--- |
| `@imgly/background-removal` | Client-side background removal | **Used** |
| `@mediapipe/tasks-vision` | Face detection model inference | **Used** |
| `@types/fabric` | Typings for fabric.js | ❌ **Unused** (Safe to remove) |
| `clsx` | Utility for CSS class composition | **Used** |
| `fabric` | Canvas object manipulation | ❌ **Unused** (Safe to remove) |
| `idb-keyval` | IndexedDB abstraction | **Used** |
| `jspdf` | PDF generation | **Used** |
| `lucide-react` | Icons library | **Used** |
| `next` | React framework | **Used** |
| `next-pwa` | PWA service worker wrapper | **Used** |
| `react` / `react-dom` | Web engine libraries | **Used** |
| `react-dropzone` | Drag & drop file upload UI | **Used** |
| `react-easy-crop` | Touch/mouse crop utility | **Used** |
| `tailwind-merge` | Margins & padding utility merging | **Used** |
| `zustand` | State management | **Used** |

---

### 7. Implementation Roadmap

#### 🔴 Critical Priority
1. **Fix ESLint errors in `Step5PrintSheet.tsx`**:
   - **Reason**: The build script fails to run due to `any` type warnings. Fix this by defining standard TS type overrides or using `@ts-expect-error` comments.
   - **Complexity**: Low (1-2 hours)
   - **Dependencies**: None
2. **Add missing PWA icon assets**:
   - **Reason**: Standard PWA validators and browsers will reject installation if the icons declared in `manifest.json` do not exist.
   - **Complexity**: Low (1-2 hours)
   - **Dependencies**: None

#### 🟡 High Priority
3. **Fix the PDF state-clearing bug**:
   - **Reason**: High-resolution image references are cleared after downloading, preventing the user from generating a second sheet or modifying settings.
   - **Complexity**: Low (1-2 hours)
   - **Dependencies**: None
4. **Refactor IndexedDB cleanup performance**:
   - **Reason**: Avoid reading and parsing all session payloads on every Zustand state change. Store a lightweight session index key `passport_sessions_index` containing only metadata.
   - **Complexity**: Medium (1-2 days)
   - **Dependencies**: None
5. **Fix image clipping on rotation**:
   - **Reason**: Canvas dimensions are not adjusted for rotated aspect ratios, clipping image edges when rotated 90/270 degrees.
   - **Complexity**: Medium (1 day)
   - **Dependencies**: None

#### 🟢 Medium Priority
6. **Provide background removal preview in Step 4**:
   - **Reason**: Users currently see three identical preview cards with the original background still showing.
   - **Complexity**: Medium (1-2 days)
   - **Dependencies**: None
7. **Refactor step auto-routing behavior**:
   - **Reason**: Immediately jumping to Step 2 on homepage load locks returning users out of Step 1.
   - **Complexity**: Low (2-3 hours)
   - **Dependencies**: None
8. **Implement Sheet Export (JPG/PNG)**:
   - **Reason**: Let users download the grid sheet directly as an image, rather than just PDF or print.
   - **Complexity**: Medium (1 day)
   - **Dependencies**: None

#### 🔵 Low Priority
9. **Clean up unused dependencies**:
   - **Reason**: Remove `fabric` and `@types/fabric` to clean up the `package.json` manifest.
   - **Complexity**: Low (1 hour)
   - **Dependencies**: None
10. **Improve accessibility (WCAG compliance)**:
    - **Reason**: Ensure buttons, sliders, and canvas coordinates can be navigated using screen readers and keyboard inputs.
    - **Complexity**: High (3-4 days)
    - **Dependencies**: None

---

### 8. Project Health Scores

* **Completion %**: 80%
* **Production Readiness %**: 55%
* **Code Quality %**: 70%
* **Performance %**: 60%
* **Maintainability %**: 75%
* **Accessibility %**: 45%
* **Security %**: 95%
* **Offline Readiness %**: 70%
* **PWA Readiness %**: 50%
* **Print Accuracy %**: 90%
* **AI Feature Completion %**: 85%