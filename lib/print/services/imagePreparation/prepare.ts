import { PhotoTemplate } from '../../contracts/types';
import { PrintProfile, PRINT_PROFILES } from '../../constants/printConstants';
import { BrowserCanvas } from '../../adapters/canvasAdapter';
import { ImageAdapter } from '../../adapters/imageAdapter';
import { UnitConverter } from '../../core/unitConverter';
import { applyBackground } from './background';
import { applyCrop, CropArea } from './crop';
import { applyRotation } from './rotate';
import { applyFilters, clearFilters } from './filters';
import { applyResize } from './resize';
import { applySharpen } from './sharpen';

export interface ImageAdjustments {
  readonly rotation: number;
  readonly brightness: number;
  readonly contrast: number;
  readonly cropArea?: CropArea;
  readonly backgroundColor?: string;
  readonly sharpenAmount?: number;
}

export async function prepareImage(
  sourceSrc: string,
  template: PhotoTemplate,
  adjustments: ImageAdjustments,
  profile: PrintProfile = PrintProfile.PhotoPrinter
): Promise<string> {
  const settings = PRINT_PROFILES[profile];


  // Calculate target physical size in pixels at print resolution
  const targetW = UnitConverter.convert(template.widthMm, 'mm', 'px', settings.dpi);
  const targetH = UnitConverter.convert(template.heightMm, 'mm', 'px', settings.dpi);

  // Load source image
  const img = await ImageAdapter.loadImage(sourceSrc);

  // Create isolated canvas
  const canvas = new BrowserCanvas(targetW, targetH);
  const ctx = canvas.getContext2D();
  if (!ctx) {
    throw new Error('Failed to obtain canvas drawing context.');
  }

  // 1. Background Fill
  applyBackground(ctx, targetW, targetH, adjustments.backgroundColor || '#ffffff');

  // 2. Adjustments Canvas (isolated temporary context for cropping and rotation)
  // For rotation & crop, we evaluate crop first, then draw rotated
  ctx.translate(targetW / 2, targetH / 2);
  applyRotation(ctx, adjustments.rotation, 0, 0);
  ctx.translate(-targetW / 2, -targetH / 2);

  // 3. Apply Filters
  applyFilters(ctx, adjustments.brightness, adjustments.contrast);

  // 4. Crop or normal resize drawing
  if (adjustments.cropArea) {
    applyCrop(ctx, img, adjustments.cropArea, targetW, targetH);
  } else {
    applyResize(ctx, img, targetW, targetH);
  }

  // Clear filters to avoid canvas state leakage
  clearFilters(ctx);

  // 5. Sharpen Filter
  applySharpen(ctx, targetW, targetH, adjustments.sharpenAmount ?? 0.15);

  // 6. Output prepared sRGB image
  return canvas.toDataURL('image/jpeg', settings.jpegQuality);
}
