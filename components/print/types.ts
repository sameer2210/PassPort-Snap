import type { Person } from '@/lib/types';
import type { RenderScene, LayoutResult, PaperSize, PhotoTemplate } from '@/lib/print';

export interface ToolbarState {
  readonly isSinglePhotoMode: boolean;
  readonly sheetSizeId: string;
  readonly showCutlines: boolean;
  readonly paperSizes: readonly PaperSize[];
}

export interface ToolbarActions {
  readonly onSheetSizeIdChange: (id: string) => void;
  readonly onShowCutlinesChange: (show: boolean) => void;
  readonly onAutoFill: () => void;
  readonly onAddPhoto: () => void;
  readonly onReset: () => void;
  readonly onClearWorkspace: () => void;
}

export interface ExportState {
  readonly isSinglePhotoMode: boolean;
  readonly isGenerating: boolean;
  readonly totalPhotosPlaced: number;
  readonly capacity: number;
  readonly selectedPersonId: string | null;
}

export interface ExportActions {
  readonly onDownloadPdf: () => void;
  readonly onPrint: () => void;
  readonly onDownloadSingle: (format: 'image/jpeg' | 'image/png') => void;
}

export interface PreviewState {
  readonly isSinglePhotoMode: boolean;
  readonly previewLayout: RenderScene | null;
  readonly layout: LayoutResult | null;
  readonly template: PhotoTemplate;
  readonly slots: readonly (string | null)[];
  readonly people: readonly Person[];
  readonly selectedPersonId: string | null;
  readonly showCutlines: boolean;
  readonly paperWidthPx: number;
  readonly paperHeightPx: number;
}

export interface PreviewActions {
  readonly onSlotClick: (index: number) => void;
}
