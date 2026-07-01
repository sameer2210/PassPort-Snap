# Verification Matrix: Paper Size × Photo Template Layout Test Cases

This document details the expected outputs for all combinations of supported paper sizes and photo templates, calculated with a margin of 4mm and gutter of 2mm (or 3mm for 35x45mm templates). These are the expected results from the optimization search of the `LayoutEngine`.

---

## 1. Supported Paper Sizes (Physical Dimensions)
- **3.5 × 5 inch (3R):** 88.9 × 127.0 mm (Usable Area: 80.9 × 119.0 mm)
- **4 × 6 inch (4R):** 101.6 × 152.4 mm (Usable Area: 93.6 × 144.4 mm)
- **5 × 7 inch (5R):** 127.0 × 177.8 mm (Usable Area: 119.0 × 169.8 mm)
- **A5 Size:** 148.0 × 210.0 mm (Usable Area: 140.0 × 202.0 mm)
- **A4 Size:** 210.0 × 297.0 mm (Usable Area: 202.0 × 289.0 mm)

---

## 2. Grid Test Cases

### 1. India / Philippines / UK-Europe Passport (35 x 45 mm) - Gutter: 3mm
* **3R (3.5 × 5 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 2 × 2 (4 photos)
  * Required Dimensions: 73.0 × 93.0 mm
  * Remaining Margins: 7.95 mm horizontal, 17.0 mm vertical
* **4R (4 × 6 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 2 × 3 (6 photos)
  * Required Dimensions: 73.0 × 141.0 mm
  * Remaining Margins: 14.3 mm horizontal, 5.7 mm vertical
* **5R (5 × 7 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 3 × 3 (9 photos)
  * Required Dimensions: 111.0 × 141.0 mm
  * Remaining Margins: 8.0 mm horizontal, 18.4 mm vertical
* **A5 Size:**
  * Expected Orientation: Portrait
  * Expected Grid: 3 × 4 (12 photos)
  * Required Dimensions: 111.0 × 189.0 mm
  * Remaining Margins: 18.5 mm horizontal, 10.5 mm vertical
* **A4 Size:**
  * Expected Orientation: Portrait
  * Expected Grid: 5 × 6 (30 photos)
  * Required Dimensions: 187.0 × 285.0 mm
  * Remaining Margins: 11.5 mm horizontal, 6.0 mm vertical

### 2. USA Passport / Visa (51 x 51 mm) - Gutter: 2mm
* **3R (3.5 × 5 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 1 × 2 (2 photos)
  * Required Dimensions: 51.0 × 104.0 mm
  * Remaining Margins: 18.95 mm horizontal, 11.5 mm vertical
* **4R (4 × 6 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 1 × 2 (2 photos)
  * Required Dimensions: 51.0 × 104.0 mm
  * Remaining Margins: 25.3 mm horizontal, 24.2 mm vertical
* **5R (5 × 7 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 2 × 3 (6 photos)
  * Required Dimensions: 104.0 × 157.0 mm
  * Remaining Margins: 11.5 mm horizontal, 10.4 mm vertical
* **A5 Size:**
  * Expected Orientation: Portrait
  * Expected Grid: 2 × 3 (6 photos)
  * Required Dimensions: 104.0 × 157.0 mm
  * Remaining Margins: 22.0 mm horizontal, 26.5 mm vertical
* **A4 Size:**
  * Expected Orientation: Portrait
  * Expected Grid: 3 × 5 (15 photos)
  * Required Dimensions: 157.0 × 263.0 mm
  * Remaining Margins: 26.5 mm horizontal, 17.0 mm vertical

### 3. Canada Passport (50 x 70 mm) - Gutter: 2mm
* **3R (3.5 × 5 inch):**
  * Expected Orientation: Landscape
  * Expected Grid: 2 × 1 (2 photos)
  * Required Dimensions: 102.0 × 70.0 mm
  * Remaining Margins: 12.5 mm horizontal, 9.45 mm vertical
* **4R (4 × 6 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 1 × 2 (2 photos)
  * Required Dimensions: 50.0 × 142.0 mm
  * Remaining Margins: 25.8 mm horizontal, 5.2 mm vertical
* **5R (5 × 7 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 2 × 2 (4 photos)
  * Required Dimensions: 102.0 × 142.0 mm
  * Remaining Margins: 12.5 mm horizontal, 17.9 mm vertical
* **A5 Size:**
  * Expected Orientation: Portrait
  * Expected Grid: 2 × 2 (4 photos)
  * Required Dimensions: 102.0 × 142.0 mm
  * Remaining Margins: 23.0 mm horizontal, 34.0 mm vertical
* **A4 Size:**
  * Expected Orientation: Portrait
  * Expected Grid: 3 × 4 (12 photos)
  * Required Dimensions: 154.0 × 286.0 mm
  * Remaining Margins: 28.0 mm horizontal, 5.5 mm vertical

### 4. China Passport (33 x 48 mm) - Gutter: 2mm
* **3R (3.5 × 5 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 2 × 2 (4 photos)
  * Required Dimensions: 68.0 × 98.0 mm
  * Remaining Margins: 10.45 mm horizontal, 14.5 mm vertical
* **4R (4 × 6 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 2 × 2 (4 photos)
  * Required Dimensions: 68.0 × 98.0 mm
  * Remaining Margins: 16.8 mm horizontal, 27.2 mm vertical
* **5R (5 × 7 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 3 × 3 (9 photos)
  * Required Dimensions: 103.0 × 148.0 mm
  * Remaining Margins: 12.0 mm horizontal, 14.9 mm vertical
* **A5 Size:**
  * Expected Orientation: Portrait
  * Expected Grid: 4 × 4 (16 photos)
  * Required Dimensions: 138.0 × 198.0 mm
  * Remaining Margins: 5.0 mm horizontal, 6.0 mm vertical
* **A4 Size:**
  * Expected Orientation: Landscape
  * Expected Grid: 8 × 4 (32 photos)
  * Required Dimensions: 278.0 × 198.0 mm
  * Remaining Margins: 9.5 mm horizontal, 6.0 mm vertical

### 5. UAE / Saudi Passport (40 x 60 mm) - Gutter: 2mm
* **3R (3.5 × 5 inch):**
  * Expected Orientation: Landscape
  * Expected Grid: 2 × 1 (2 photos)
  * Required Dimensions: 82.0 × 60.0 mm
  * Remaining Margins: 22.5 mm horizontal, 14.45 mm vertical
* **4R (4 × 6 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 2 × 2 (4 photos)
  * Required Dimensions: 82.0 × 122.0 mm
  * Remaining Margins: 9.8 mm horizontal, 15.2 mm vertical
* **5R (5 × 7 inch):**
  * Expected Orientation: Portrait
  * Expected Grid: 2 × 2 (4 photos)
  * Required Dimensions: 82.0 × 122.0 mm
  * Remaining Margins: 22.5 mm horizontal, 27.9 mm vertical
* **A5 Size:**
  * Expected Orientation: Portrait
  * Expected Grid: 3 × 3 (9 photos)
  * Required Dimensions: 124.0 × 184.0 mm
  * Remaining Margins: 12.0 mm horizontal, 13.0 mm vertical
* **A4 Size:**
  * Expected Orientation: Landscape
  * Expected Grid: 6 × 3 (18 photos)
  * Required Dimensions: 250.0 × 184.0 mm
  * Remaining Margins: 23.5 mm horizontal, 13.0 mm vertical
