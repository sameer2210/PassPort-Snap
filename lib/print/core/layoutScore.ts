export interface ScoringInput {
  readonly capacity: number;
  readonly marginLeft: number;
  readonly marginRight: number;
  readonly marginTop: number;
  readonly marginBottom: number;
  readonly utilization: number;
  readonly gutter: number;
  readonly preferredGutter: number;
  readonly minimumSafeGutter: number;
}

export function evaluateLayoutScore(input: ScoringInput): number {
  const {
    capacity,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    utilization,
    gutter,
    preferredGutter,
    minimumSafeGutter,
  } = input;

  // 1. Capacity (Primary Priority - capacity must always win)
  const capScore = capacity * 1000000;

  // 2. Gutter Preservation (Secondary Priority - normalized gutter retention ratio)
  let gutterRetentionRatio = 1.0;
  if (preferredGutter > minimumSafeGutter) {
    gutterRetentionRatio = (gutter - minimumSafeGutter) / (preferredGutter - minimumSafeGutter);
    gutterRetentionRatio = Math.max(0, Math.min(1, gutterRetentionRatio));
  } else {
    gutterRetentionRatio = gutter >= preferredGutter ? 1.0 : 0.0;
  }
  const gutterScore = gutterRetentionRatio * 10000;

  // 3. Printable Area Utilization (Tertiary Priority)
  const utilScore = utilization * 100;

  // 4. Grid Symmetry (Centering balance)
  const horizDiff = Math.abs(marginLeft - marginRight);
  const vertDiff = Math.abs(marginTop - marginBottom);
  const symmetry = Math.max(0, 100 - (horizDiff + vertDiff));
  const symmetryScore = symmetry * 10;

  // Note: Margins are treated strictly as constraints validated in LayoutEngine,
  // not as rewards in layoutScore, to prevent preferring large empty borders.
  return capScore + gutterScore + utilScore + symmetryScore;
}
