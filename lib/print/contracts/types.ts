export enum ExportType {
  PDF = 'PDF',
  PRINT = 'PRINT',
  JPEG = 'JPEG',
  PNG = 'PNG'
}

export enum DpiProfile {
  Preview = 72,
  Print300 = 300,
  Print600 = 600
}

export interface PhysicalDimensions {
  readonly widthMm: number;
  readonly heightMm: number;
}

export interface PrintableSettings {
  readonly marginMm: number;
  readonly gutterMm: number;
}

export interface PaperSize {
  readonly id: string;
  readonly label: string;
  readonly physical: PhysicalDimensions;
  readonly printable: PrintableSettings;
  readonly supportedExports: readonly ExportType[];
  readonly displayOrder: number;
}

export interface PhotoTemplate {
  readonly id: string;
  readonly label: string;
  readonly widthMm: number;
  readonly heightMm: number;
  readonly printWidthPx: number; // 300 DPI reference
  readonly printHeightPx: number;
  readonly countries: string;
}

export interface Coordinate {
  readonly x: number;
  readonly y: number;
}

export interface BorderItem {
  readonly xMm: number;
  readonly yMm: number;
  readonly widthMm: number;
  readonly heightMm: number;
  readonly thicknessMm: number;
  readonly colorHex: string;
}

export interface CutLineItem {
  readonly x1Mm: number;
  readonly y1Mm: number;
  readonly x2Mm: number;
  readonly y2Mm: number;
  readonly thicknessMm: number;
  readonly colorHex: string;
  readonly style: 'dashed' | 'solid';
}

export interface SceneItem {
  readonly id: string;
  readonly imageRef: string; // Base64 data URL or Object URL of prepared image
  readonly xMm: number;
  readonly yMm: number;
  readonly widthMm: number;
  readonly heightMm: number;
  readonly rotationDegrees: number;
}

export interface BleedArea {
  readonly widthMm: number;
  readonly heightMm: number;
}

export interface RenderLabel {
  readonly text: string;
  readonly xMm: number;
  readonly yMm: number;
  readonly fontSizePt: number;
}

export interface RenderScene {
  readonly paperWidthMm: number;
  readonly paperHeightMm: number;
  readonly orientation: 'portrait' | 'landscape';
  readonly marginMm: number;
  readonly items: readonly SceneItem[];
  readonly borders: readonly BorderItem[];
  readonly cutLines: readonly CutLineItem[];
  readonly safeAreaMm: number;
  readonly bleedArea?: BleedArea;
  readonly labels?: readonly RenderLabel[];
  readonly metadata: {
    readonly paperId: string;
    readonly templateId: string;
    readonly engineVersion: string;
    readonly timestamp: number;
  };
}

export interface LayoutSearchConfig {
  readonly minimumMarginMm: number;
  readonly minimumGutterMm: number;
  readonly preferredGutterMm: number;
  readonly gutterStepMm: number;
  readonly allowPhotoRotation: boolean;
  readonly allowPaperRotation: boolean;
  readonly maxCandidateCount: number;
  readonly allowZeroGutterWhenNoValidLayout?: boolean;
  readonly minimumSafeGutterMm?: number;
}

export interface LayoutOptimizationStats {
  readonly generatedCandidates: number;
  readonly validatedCandidates: number;
  readonly discardedCandidates: number;
  readonly winningCapacity: number;
  readonly elapsedTimeMs: number;
  readonly winningOrientation: 'portrait' | 'landscape';
  readonly winningPhotoRotation: 'normal' | 'rotated';
}

export interface LayoutGeometryFields {
  readonly rows: number;
  readonly columns: number;
  readonly slotWidthMm: number;
  readonly slotHeightMm: number;
  readonly marginLeft: number;
  readonly marginRight: number;
  readonly marginTop: number;
  readonly marginBottom: number;
  readonly capacity: number;
  readonly utilization: number;
}

export interface LayoutResult extends LayoutGeometryFields {
  // Flattened geometry contract (single source of truth)
  readonly paperId: string;
  readonly templateId: string;
  readonly paperOrientation: 'portrait' | 'landscape';
  readonly gutterHorizontal: number;
  readonly gutterVertical: number;
  readonly photoOrientation: 'normal' | 'rotated';
  readonly photoRotation: number;
  readonly rotationRequired: boolean;
  readonly coordinates: readonly Coordinate[];
  readonly paperWidthMm: number;
  readonly paperHeightMm: number;
}

export type LayoutEngineResult = LayoutSuccess | LayoutFailure;

export interface LayoutSuccess {
  readonly success: true;
  readonly layout: LayoutResult;
  readonly stats?: LayoutOptimizationStats;
}

export interface LayoutFailure {
  readonly success: false;
  readonly reason: 'NO_PRINTABLE_AREA' | 'INVALID_PAPER' | 'INVALID_TEMPLATE' | 'NO_CANDIDATE_FITS' | 'INVALID_REGISTRY';
  readonly message: string;
  readonly recoverable: boolean;
}


