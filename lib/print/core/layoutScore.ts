
export const LAYOUT_SCORE_WEIGHTS = {
  capacity: 10000,
  paperUtilization: 100,
  centering: 10,
  symmetry: 5,
  orientationPreference: 1
} as const;

export function evaluateLayoutScore(
  capacity: number,
  wastedPaperPercent: number,
  remainingW: number,
  remainingH: number,
  orientation: 'portrait' | 'landscape',
  defaultOrientation: 'portrait' | 'landscape'
): number {
  const capScore = capacity * LAYOUT_SCORE_WEIGHTS.capacity;
  const utilScore = (100 - wastedPaperPercent) * LAYOUT_SCORE_WEIGHTS.paperUtilization;
  const centeringScore = (100 - (Math.abs(remainingW) + Math.abs(remainingH))) * LAYOUT_SCORE_WEIGHTS.centering;
  const symmetryScore = (100 - Math.abs(remainingW - remainingH)) * LAYOUT_SCORE_WEIGHTS.symmetry;
  const orientScore = (orientation === defaultOrientation ? 1 : 0) * LAYOUT_SCORE_WEIGHTS.orientationPreference;

  return capScore + utilScore + centeringScore + symmetryScore + orientScore;
}
