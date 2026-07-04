# PassportSnap

PassportSnap is an offline-first, client-side web application designed to help users generate, adjust, and tile passport and visa photos onto standard print sheets. It processes all data locally in the browser to maintain absolute privacy and eliminate server costs.

---

## Features

### Image Processing & Adjustments
* **Automatic Face Detection & Centering:** Leverages MediaPipe face detection to center the subject's face and apply standard passport cropping ratios.
* **Fine-Tuning Adjustments:** Sliders for manual adjustments of Brightness, Contrast, and Zoom.
* **Image Sharpening:** A custom 3x3 convolution filter to improve edge clarity before print layout tiling.
* **Rotation:** Rotate images in 90-degree increments.

### Background Normalization
* **AI Background Isolation:** Isolates the portrait subject locally using `@imgly/background-removal` WASM.
* **Color Replacement:** Paint cutouts onto solid backgrounds with pre-configured templates (Original, White, Light Blue) or custom hex color inputs.
* **Caching Pipeline:** Cache intermediate transparent cutouts to allow real-time background color swaps without re-running the AI model.

### Print Layout & Exports
* **Preset Size Templates:** Predefined physical dimensions for India (35x45mm), USA (2x2 inch), Philippines (35x45mm), UK/Europe/Australia, Canada (50x70mm), China (33x48mm), and UAE/Saudi (40x60mm).
* **Custom Photo Size:** Input custom physical dimensions in millimeters, which propagate through the entire pipeline.
* **Standard Paper Sizes:** Print sheets for A4, A5, 3R, 4R (4x6 inch), and 5R (5x7 inch).
* **Tiling Layout Engine:** Auto-arranges multiple photo copies onto the selected paper sheet with correct print-safe margins and margins spacing (gutters).
* **Manual Slot Interaction:** Toggle photo presence in individual grid slots, auto-fill empty slots, or adjust counts.
* **Exports:** 
  * High-quality PDF sheets using precise millimeter coordinate mappings for 300 DPI printers.
  * Tiled layouts as single JPG/PNG images.
  * Single adjusted portrait photos as JPG/PNG.
  * Direct browser print spooling with CSS print media queries.

### Offline Support & Workspace Safety
* **Service Worker Caching (PWA):** Once loaded, the application operates fully offline.
* **Local Neural Inference:** All WASM binaries, face detection models, and background removal models are cached in the browser's local directories.
* **Workspace Clean Reset:** Revokes all allocated Blob URLs, clears IndexedDB and localStorage caches, and resets session states securely without forcing a browser refresh.

---

## Technology Stack

* **Frontend:** [Next.js](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) with IndexedDB custom persistence middleware
* **Face Detection:** [MediaPipe Face Detector](https://developers.google.com/mediapipe/solutions/vision/face_detector) (BlazeFace short-range local model)
* **Background Isolation:** [@imgly/background-removal](https://github.com/imgly/background-removal-js) (ONNX / WASM local runner)
* **Storage:** [idb-keyval](https://github.com/jakearchibald/idb-keyval) (IndexedDB abstraction layer)
* **PDF Compilation:** [jsPDF](https://github.com/parallax/jsPDF)

---

## Project Structure

```
passport-snap/
├── app/                      # Application route layouts and global styles
├── components/               # React UI Components
│   ├── print/                # Print layout preview and tiling controllers
│   ├── ui/                   # Reusable premium styled inputs, cards, and sliders
│   └── wizard/               # Workflow step orchestrators (Steps 1 to 5)
├── hooks/                    # Custom hooks (print, preview, background removal)
├── lib/                      # Pure business logic and configurations
│   ├── background/           # Background caching and WASM service integrations
│   ├── constants/            # Centralized default configurations
│   ├── image/                # Image preprocessing and upload helpers
│   ├── print/                # Layout tiling algorithms, registry systems, and PDF renderers
│   ├── storage.ts            # IndexedDB session management and storage pruning
│   ├── store.ts              # Zustand store definitions and object URL cleanups
│   └── config.ts             # Registry mapping hooks
├── public/                   # Public assets (manifest, local models, icons)
```

---

## Application Workflow

1. **Step 1: Choose Photo Type**  
   Select a passport size preset or input custom millimeter widths and heights.
2. **Step 2: Upload Portrait**  
   Drag and drop portrait images up to 20MB. Scaled down to a max of 2000px on upload for fast performance.
3. **Step 3: Crop & Adjust**  
   Face is centered using MediaPipe. Zoom, pan, rotate, and apply brightness/contrast/sharpness filters.
4. **Step 4: Normalize Background**  
   The background is isolated locally. Swap between solid White, Light Blue, Original, or Custom Color backdrops.
5. **Step 5: Print Sheet**  
   View the tiled layout. Adjust sheet paper size, toggle cutlines, modify copies count, and print or export.

---

## Architecture & Design Patterns

### 1. Registry System
The application utilizes centralized Registries (`PaperRegistry`, `TemplateRegistry`) as the single source of truth for all template sizes and paper configurations. Hardcoded values are prohibited; all layout calculations, crop boxes, previews, background removal pipelines, and PDF layouts resolve physical sizes dynamically.

### 2. Print Engine
The print layout engine (`calculateGrid`) performs progressive layout optimizations:
* Converts millimeters to pixels based on the target DPI (300 DPI for print, 72 DPI for previews).
* Evaluates margins and gutters, computing maximum slot fit capacities.
* Arranges coordinates and determines orientation requirements.

### 3. Memory & Resource Management
To maintain high performance and prevent browser crashes over long editing sessions, the system strictly enforces resource cleanups:
* **Object URL Lifecycles:** All object URLs are tracked and automatically revoked inside Zustand actions when overwritten or deleted.
* **Canvas Releases:** Every temporary canvas created during image uploads, rotations, filtering, and composites is wrapped in a `try...finally` block. The `finally` block sets `width = 0` and `height = 0` to release GPU memory immediately.
* **Image Event Listeners:** `onload` and `onerror` callbacks assigned to `Image()` elements are cleared immediately after the load promise resolves or rejects to prevent closure memory leaks.
* **ImageBitmaps:** Temporary ImageBitmaps created during composition are closed inside `finally` blocks using `bitmap.close()`.
* **Pruning Intervals:** The pruning timer for background removal cutouts starts only when the cache holds items and clears itself when the cache becomes empty.

---

## Development & Setup

### Installation
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```

### Typecheck Source Code
```bash
npm run typecheck
```

### Lint Checks
```bash
npm run lint
```

### Build Production Bundle
```bash
npm run build
```

---

## Future Improvements

* **Multi-Subject Batching:** Process and layout photos for different people on a single print sheet.
* **Offline Biometric Checks:** Integrate face symmetry, eye open/closed, and glasses checks using MediaPipe landmarks.
* **Advanced Cutline Styles:** Support outline bleed lines, scissor paths, and crop corner marks.