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

export interface GeometryResult {
  readonly cols: number;
  readonly rows: number;
  readonly capacity: number;
  readonly paperWidth: number;
  readonly paperHeight: number;
  readonly usableWidth: number;
  readonly usableHeight: number;
  readonly requiredWidth: number;
  readonly requiredHeight: number;
  readonly coordinates: readonly Coordinate[];
  readonly startX: number;
  readonly startY: number;
  readonly remainingWidth: number;
  readonly remainingHeight: number;
}

export interface LayoutMetadata {
  readonly paperId: string;
  readonly templateId: string;
  readonly orientation: 'portrait' | 'landscape';
  readonly marginMm: number;
  readonly gutterMm: number;
  readonly algorithmVersion: string;
  readonly registryVersion: string;
  readonly cacheVersion: string;
}

export interface LayoutScore {
  readonly capacity: number;
  readonly paperUtilization: number;
  readonly remainingMargins: number;
  readonly layoutSymmetry: number;
  readonly centering: number;
  readonly orientationPreference: number;
  readonly overallScore: number;
}

export interface LayoutResult {
  readonly geometry: GeometryResult;
  readonly metadata: LayoutMetadata;
  readonly score: LayoutScore;
}

export interface PreviewLayout {
  readonly paperWidthMm: number;
  readonly paperHeightMm: number;
  readonly slotWidthMm: number;
  readonly slotHeightMm: number;
  readonly slots: readonly Coordinate[];
  readonly containerWidthMm: number;
  readonly containerHeightMm: number;
}

export interface SinglePhotoLayout {
  readonly mode: 'single';
  readonly photoWidthMm: number;
  readonly photoHeightMm: number;
  readonly downloadFormats: readonly ExportType[];
}
