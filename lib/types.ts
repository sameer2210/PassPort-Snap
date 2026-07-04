import type { BackgroundStatus } from './background/backgroundTypes';

export type PhotoTemplate = {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  printWidthPx: number; // at 300 DPI
  printHeightPx: number;
  countries: string;
};

export type BackgroundChoice = 'original' | 'white' | 'blue' | 'custom';

export type Person = {
  id: string;
  previewPhotoUrl: string | null; // Compressed Data URL (persisted)
  highResPhotoUrl: string | null; // Blob URL (in-memory only)
  croppedPhotoUrl: string | null;
  finalPhotoUrl: string | null;
  highResFinalUrl: string | null; // High quality blob URL for print
  backgroundPreviewUrl?: string | null; // Temporary background preview (RAM-only)
  count: number;
  // Adjustment metadata to preserve high-res quality
  croppedAreaPixels?: { x: number; y: number; width: number; height: number } | null;
  rotation?: number;
  brightness?: number;
  contrast?: number;
  sharpness?: number;
  backgroundChoice?: BackgroundChoice;
  backgroundStatus?: BackgroundStatus;
  backgroundError?: string | null;
  processing?: boolean;
};

export type SheetSize = {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
};
