import { LayoutSearchConfig } from '../contracts/types';

export const DEFAULT_SEARCH_CONFIG: LayoutSearchConfig = {
  minimumMarginMm: 2.0,      // Minimum safe margin to center the layout
  minimumGutterMm: 0.0,      // Minimum safe spacing (0mm = touching)
  preferredGutterMm: 2.0,    // Default preferred gutter from PaperRegistry
  gutterStepMm: 0.5,         // Progressive spacing reduction decrements
  allowPhotoRotation: true,
  allowPaperRotation: true,
  maxCandidateCount: 200,
  allowZeroGutterWhenNoValidLayout: true,
  minimumSafeGutterMm: 0.5,
};
