export const PRINT_ENGINE_VERSION = '1.0.0';
export const LAYOUT_ALGORITHM_VERSION = '1.0.0';
export const CACHE_VERSION = '1.0.0';
export const REGISTRY_VERSION = '1.0.0';

export enum PrintProfile {
  HomePrinter = 'HOME_PRINTER',
  PhotoPrinter = 'PHOTO_PRINTER',
  Borderless = 'BORDERLESS',
  ProfessionalLab = 'PROFESSIONAL_LAB'
}

export interface ProfileSettings {
  readonly dpi: number;
  readonly colorProfile: 'sRGB' | 'CMYK';
  readonly jpegQuality: number;
}

export const PRINT_PROFILES: Record<PrintProfile, ProfileSettings> = {
  [PrintProfile.HomePrinter]: { dpi: 300, colorProfile: 'sRGB', jpegQuality: 0.90 },
  [PrintProfile.PhotoPrinter]: { dpi: 300, colorProfile: 'sRGB', jpegQuality: 0.98 },
  [PrintProfile.Borderless]: { dpi: 600, colorProfile: 'sRGB', jpegQuality: 1.0 },
  [PrintProfile.ProfessionalLab]: { dpi: 600, colorProfile: 'sRGB', jpegQuality: 1.0 }
};

export const PRINT_CONSTANTS = {
  MM_TO_INCH: 25.4,
  PT_TO_INCH: 72
} as const;
