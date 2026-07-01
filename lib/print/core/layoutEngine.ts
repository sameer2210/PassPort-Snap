import { PaperSize, PhotoTemplate, LayoutResult, Coordinate } from '../contracts/types';
import { LAYOUT_ALGORITHM_VERSION, REGISTRY_VERSION, CACHE_VERSION } from '../constants/printConstants';
import { evaluateLayoutScore } from './layoutScore';
import { LayoutCache } from './layoutCache';

export type LayoutEngineResult =
  | { readonly success: true; readonly layout: LayoutResult }
  | { readonly success: false; readonly reason: 'OVERFLOW'; readonly message: string; readonly recoverable: boolean };

export function calculateGrid(
  paper: PaperSize,
  template: PhotoTemplate,
  marginMm: number,
  gutterMm: number
): LayoutEngineResult {
  // Try caching with default portrait first
  const cacheKey = LayoutCache.generateKey(
    paper.id,
    template.id,
    'portrait',
    marginMm,
    gutterMm,
    0,
    'Print300'
  );
  
  const cached = LayoutCache.get(cacheKey);
  if (cached) return { success: true, layout: cached };

  const orientations: ('portrait' | 'landscape')[] = ['portrait', 'landscape'];
  const candidates: LayoutResult[] = [];

  for (const orient of orientations) {
    const paperWidth = orient === 'landscape'
      ? Math.max(paper.physical.widthMm, paper.physical.heightMm)
      : Math.min(paper.physical.widthMm, paper.physical.heightMm);
    const paperHeight = orient === 'landscape'
      ? Math.min(paper.physical.widthMm, paper.physical.heightMm)
      : Math.max(paper.physical.widthMm, paper.physical.heightMm);

    const usableWidth = paperWidth - marginMm * 2;
    const usableHeight = paperHeight - marginMm * 2;

    const maxCols = Math.max(0, Math.floor((usableWidth + gutterMm) / (template.widthMm + gutterMm)));
    const maxRows = Math.max(0, Math.floor((usableHeight + gutterMm) / (template.heightMm + gutterMm)));

    for (let cols = 1; cols <= maxCols; cols++) {
      for (let rows = 1; rows <= maxRows; rows++) {
        const requiredWidth = cols * template.widthMm + (cols - 1) * gutterMm;
        const requiredHeight = rows * template.heightMm + (rows - 1) * gutterMm;

        if (requiredWidth <= usableWidth && requiredHeight <= usableHeight) {
          const remainingWidth = usableWidth - requiredWidth;
          const remainingHeight = usableHeight - requiredHeight;
          const capacity = cols * rows;

          const paperArea = paperWidth * paperHeight;
          const photoArea = capacity * template.widthMm * template.heightMm;
          const wastedPaperPercent = ((paperArea - photoArea) / paperArea) * 100;

          const startX = marginMm + (remainingWidth / 2);
          const startY = marginMm + (remainingHeight / 2);

          const coordinates: Coordinate[] = [];
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              coordinates.push({
                x: startX + c * (template.widthMm + gutterMm),
                y: startY + r * (template.heightMm + gutterMm)
              });
            }
          }

          const scoreValue = evaluateLayoutScore(
            capacity,
            wastedPaperPercent,
            remainingWidth,
            remainingHeight,
            orient,
            'portrait'
          );

          candidates.push({
            geometry: {
              cols,
              rows,
              capacity,
              paperWidth,
              paperHeight,
              usableWidth,
              usableHeight,
              requiredWidth,
              requiredHeight,
              coordinates,
              startX,
              startY,
              remainingWidth,
              remainingHeight
            },
            metadata: {
              paperId: paper.id,
              templateId: template.id,
              orientation: orient,
              marginMm,
              gutterMm,
              algorithmVersion: LAYOUT_ALGORITHM_VERSION,
              registryVersion: REGISTRY_VERSION,
              cacheVersion: CACHE_VERSION
            },
            score: {
              capacity,
              paperUtilization: 100 - wastedPaperPercent,
              remainingMargins: remainingWidth + remainingHeight,
              layoutSymmetry: 100 - Math.abs(remainingWidth - remainingHeight),
              centering: 100 - (Math.abs(remainingWidth) + Math.abs(remainingHeight)),
              orientationPreference: orient === 'portrait' ? 1 : 0,
              overallScore: scoreValue
            }
          });
        }
      }
    }
  }

  if (candidates.length === 0) {
    return {
      success: false,
      reason: 'OVERFLOW',
      message: `The photo template size (${template.widthMm}x${template.heightMm}mm) cannot fit within the printable bounds of paper ${paper.label}.`,
      recoverable: true
    };
  }

  candidates.sort((a, b) => b.score.overallScore - a.score.overallScore);
  const bestLayout = candidates[0];

  // Cache the result
  LayoutCache.set(cacheKey, bestLayout);

  return { success: true, layout: bestLayout };
}
