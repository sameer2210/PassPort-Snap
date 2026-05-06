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

#### 1. Frontend Framework

* Next.js (App Router)
* TypeScript

#### 2. Image Processing

* fabric.js → canvas editing (drag, resize, layout)
* react-easy-crop → cropping UI
* pica → high-quality resize if free

#### 3. AI Face Detection & Auto Adjustment if free then only use

* MediaPipe Face Detection
* Algorithm:

  1. Detect face bounding box
  2. Calculate head height ratio
  3. Align face center to template
  4. Auto crop to passport size

#### 4. Layout Engine (Critical)

Convert mm → pixels using:

px = (mm / 25.4) * DPI

Use 300 DPI for print quality.

Algorithm:

* Input: photo size (e.g., 35x45 mm)
* Calculate pixel size
* Tile images into A4 (210x297 mm)
* Maintain spacing

#### 5. PDF Generation

* jsPDF
* Render canvas → image → PDF

#### 6. Offline Storage

* IndexedDB

Schema:

Project:

* id
* images (blob)
* layout config (JSON)
* template type
* created_at

#### 7. Offline Support (PWA)

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