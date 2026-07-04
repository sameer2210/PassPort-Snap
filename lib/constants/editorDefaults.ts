import type { BackgroundChoice } from '../types';
import type { BackgroundStatus } from '../background/backgroundTypes';

export const IMAGE_ADJUSTMENT_DEFAULTS = {
  brightness: 100,
  contrast: 100,
  zoom: 1.0,
  sharpness: 50,
} as const;

export const EDITOR_DEFAULTS = {
  backgroundChoice: 'original' as BackgroundChoice,
  customBackgroundColor: '#ffffff',
  processing: false,
  backgroundStatus: 'idle' as BackgroundStatus,
  backgroundError: null as string | null,
  defaultCustomTemplateMm: { widthMm: 35, heightMm: 45 },
} as const;
