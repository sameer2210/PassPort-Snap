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
  originalPhotoUrl: string | null;
  croppedPhotoUrl: string | null;
  finalPhotoUrl: string | null; // After BG removal/enhancement
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
