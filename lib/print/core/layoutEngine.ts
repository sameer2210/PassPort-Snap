import {
  PaperSize,
  PhotoTemplate,
  LayoutResult,
  Coordinate,
  LayoutOptimizationStats,
  LayoutEngineResult,
  LayoutGeometryFields,
} from '../contracts/types';
import { evaluateLayoutScore } from './layoutScore';
import { LayoutCache } from './layoutCache';
import { DEFAULT_SEARCH_CONFIG } from '../constants/layoutSearchDefaults';

interface LayoutCandidate extends LayoutGeometryFields {
  readonly paperOrientation: 'portrait' | 'landscape';
  readonly photoOrientation: 'normal' | 'rotated';
  readonly gutterMm: number;
  readonly score: number;
}

export function calculateGrid(
  paper: PaperSize,
  template: PhotoTemplate,
  marginMm: number,
  gutterMm: number
): LayoutEngineResult {
  // Validate inputs
  if (!paper || !paper.physical || !paper.physical.widthMm || !paper.physical.heightMm) {
    return {
      success: false,
      reason: 'INVALID_PAPER',
      message: 'The requested paper size configuration is invalid or missing.',
      recoverable: false
    };
  }

  if (!template || !template.widthMm || !template.heightMm) {
    return {
      success: false,
      reason: 'INVALID_TEMPLATE',
      message: 'The requested photo template configuration is invalid or missing.',
      recoverable: false
    };
  }

  // Try caching with default parameters
  const cacheKey = LayoutCache.generateKey({
    paperId: paper.id,
    templateId: template.id === 'custom' ? `custom_${template.widthMm}x${template.heightMm}` : template.id,
    marginMm,
    gutterMm,
    searchConfig: DEFAULT_SEARCH_CONFIG
  });
  
  const cached = LayoutCache.get(cacheKey);
  if (cached) return { success: true, layout: cached };

  const startTime = Date.now();
  let generatedCandidatesCount = 0;
  let validatedCandidatesCount = 0;
  let discardedCandidatesCount = 0;

  const minMargin = marginMm;
  const preferredGutter = gutterMm;
  const minSafeGutter = DEFAULT_SEARCH_CONFIG.minimumSafeGutterMm ?? 0.5;
  const gutterStep = DEFAULT_SEARCH_CONFIG.gutterStepMm;

  const paperOrientations: ('portrait' | 'landscape')[] = DEFAULT_SEARCH_CONFIG.allowPaperRotation
    ? ['portrait', 'landscape']
    : ['portrait'];
  const photoOrientations: ('normal' | 'rotated')[] = DEFAULT_SEARCH_CONFIG.allowPhotoRotation
    ? ['normal', 'rotated']
    : ['normal'];

  const runSearch = (guttersToTest: number[]): LayoutCandidate[] => {
    const found: LayoutCandidate[] = [];
    for (const paperOrient of paperOrientations) {
      const paperWidth = paperOrient === 'landscape'
        ? Math.max(paper.physical.widthMm, paper.physical.heightMm)
        : Math.min(paper.physical.widthMm, paper.physical.heightMm);
      const paperHeight = paperOrient === 'landscape'
        ? Math.min(paper.physical.widthMm, paper.physical.heightMm)
        : Math.max(paper.physical.widthMm, paper.physical.heightMm);

      const printableArea = {
        x: minMargin,
        y: minMargin,
        width: paperWidth - minMargin * 2,
        height: paperHeight - minMargin * 2
      };

      for (const photoOrient of photoOrientations) {
        const photoWidth = photoOrient === 'rotated' ? template.heightMm : template.widthMm;
        const photoHeight = photoOrient === 'rotated' ? template.widthMm : template.heightMm;

        for (const gutter of guttersToTest) {
          generatedCandidatesCount++;

          const cols = Math.max(0, Math.floor((printableArea.width + gutter) / (photoWidth + gutter)));
          const rows = Math.max(0, Math.floor((printableArea.height + gutter) / (photoHeight + gutter)));
          const capacity = cols * rows;

          const usedW = cols * photoWidth + (cols - 1) * gutter;
          const usedH = rows * photoHeight + (rows - 1) * gutter;

          const remW = paperWidth - usedW;
          const remH = paperHeight - usedH;

          const marginLeft = remW / 2;
          const marginRight = remW / 2;
          const marginTop = remH / 2;
          const marginBottom = remH / 2;

          const paperArea = paperWidth * paperHeight;
          const photoArea = capacity * photoWidth * photoHeight;
          const utilization = paperArea > 0 ? (photoArea / paperArea) * 100 : 0;

          // Validation constraint check BEFORE scoring
          const isValid =
            cols > 0 &&
            rows > 0 &&
            marginLeft >= minMargin - 0.0001 &&
            marginRight >= minMargin - 0.0001 &&
            marginTop >= minMargin - 0.0001 &&
            marginBottom >= minMargin - 0.0001 &&
            usedW <= paperWidth &&
            usedH <= paperHeight &&
            !isNaN(marginLeft) && !isNaN(marginRight) && !isNaN(marginTop) && !isNaN(marginBottom) &&
            isFinite(marginLeft) && isFinite(marginRight) && isFinite(marginTop) && isFinite(marginBottom) &&
            usedW > 0 && usedH > 0;

          if (!isValid) {
            discardedCandidatesCount++;
            continue;
          }
          validatedCandidatesCount++;

          const score = evaluateLayoutScore({
            capacity,
            marginLeft,
            marginRight,
            marginTop,
            marginBottom,
            utilization,
            gutter,
            preferredGutter,
            minimumSafeGutter: minSafeGutter
          });

          found.push({
            paperOrientation: paperOrient,
            photoOrientation: photoOrient,
            rows,
            columns: cols,
            slotWidthMm: photoWidth,
            slotHeightMm: photoHeight,
            gutterMm: gutter,
            marginLeft,
            marginRight,
            marginTop,
            marginBottom,
            capacity,
            utilization,
            score
          });
        }
      }
    }
    return found;
  };

  // Build list of unique safe gutters to evaluate
  const safeGutterOptions: number[] = [];
  for (let g = preferredGutter; g >= minSafeGutter - 0.0001; g -= gutterStep) {
    safeGutterOptions.push(Math.max(minSafeGutter, g));
    if (g <= minSafeGutter) break;
  }
  const uniqueSafeGutters = Array.from(new Set(safeGutterOptions));

  // Step 1: Run Search on Safe Gutters
  let candidates = runSearch(uniqueSafeGutters);

  // Step 2: If no valid candidates found in safe range, fallback to 0 mm gutter (if allowed)
  if (candidates.length === 0 && DEFAULT_SEARCH_CONFIG.allowZeroGutterWhenNoValidLayout) {
    candidates = runSearch([DEFAULT_SEARCH_CONFIG.minimumGutterMm]);
  }

  // Stage 5: Sort Candidates
  candidates.sort((a, b) => b.score - a.score);

  // Stage 6: Select Winner
  const winner = candidates[0];

  if (!winner) {
    return {
      success: false,
      reason: 'NO_CANDIDATE_FITS',
      message: `The photo template size (${template.widthMm}x${template.heightMm}mm) cannot fit within the printable bounds of paper ${paper.label}.`,
      recoverable: true
    };
  }

  // Stage 7: Convert Winner to LayoutResult
  const startX = winner.marginLeft;
  const startY = winner.marginTop;
  const coordinates: Coordinate[] = [];
  for (let r = 0; r < winner.rows; r++) {
    for (let c = 0; c < winner.columns; c++) {
      coordinates.push({
        x: startX + c * (winner.slotWidthMm + winner.gutterMm),
        y: startY + r * (winner.slotHeightMm + winner.gutterMm)
      });
    }
  }

  const paperWidth = winner.paperOrientation === 'landscape'
    ? Math.max(paper.physical.widthMm, paper.physical.heightMm)
    : Math.min(paper.physical.widthMm, paper.physical.heightMm);
  const paperHeight = winner.paperOrientation === 'landscape'
    ? Math.min(paper.physical.widthMm, paper.physical.heightMm)
    : Math.max(paper.physical.widthMm, paper.physical.heightMm);

  const winningPhotoRotation = winner.photoOrientation === 'rotated' ? 90 : 0;

  const layoutResult: LayoutResult = {
    paperId: paper.id,
    templateId: template.id,
    paperOrientation: winner.paperOrientation,
    rows: winner.rows,
    columns: winner.columns,
    slotWidthMm: winner.slotWidthMm,
    slotHeightMm: winner.slotHeightMm,
    marginLeft: winner.marginLeft,
    marginRight: winner.marginRight,
    marginTop: winner.marginTop,
    marginBottom: winner.marginBottom,
    gutterHorizontal: winner.gutterMm,
    gutterVertical: winner.gutterMm,
    capacity: winner.capacity,
    photoOrientation: winner.photoOrientation,
    photoRotation: winningPhotoRotation,
    rotationRequired: winner.photoOrientation === 'rotated',
    coordinates,
    paperWidthMm: paperWidth,
    paperHeightMm: paperHeight,
    utilization: winner.utilization,
  };

  const elapsedTimeMs = Date.now() - startTime;
  const stats: LayoutOptimizationStats = {
    generatedCandidates: generatedCandidatesCount,
    validatedCandidates: validatedCandidatesCount,
    discardedCandidates: discardedCandidatesCount,
    winningCapacity: winner.capacity,
    elapsedTimeMs,
    winningOrientation: winner.paperOrientation,
    winningPhotoRotation: winner.photoOrientation
  };

  // Cache the layoutResult
  LayoutCache.set(cacheKey, layoutResult);

  return { success: true, layout: layoutResult, stats };
}
