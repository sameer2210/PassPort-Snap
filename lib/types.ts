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
  count: number;
};

export type SheetSize = {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
};
