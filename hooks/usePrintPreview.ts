import { useMemo } from 'react';
import {
  PaperSize,
  PhotoTemplate,
  LayoutResult,
  RenderScene,
  PrintController,
  RenderSceneBuilder,
  UnitConverter,
  DpiProfile,
} from '@/lib/print';

export interface PreviewSettings {
  readonly addBorder: boolean;
  readonly showCutlines: boolean;
}

export interface PreviewDimensions {
  readonly paperWidthPx: number;
  readonly paperHeightPx: number;
  readonly capacity: number;
  readonly layout: LayoutResult | null;
}

export interface UsePrintPreviewInput {
  readonly paper: PaperSize;
  readonly template: PhotoTemplate;
  readonly slots: readonly (string | null)[];
  readonly settings: PreviewSettings;
}

export interface UsePrintPreviewOutput {
  readonly previewScene: RenderScene | null;
  readonly previewScale: number;
  readonly previewDimensions: PreviewDimensions;
}

export function usePrintPreview({
  paper,
  template,
  settings,
}: UsePrintPreviewInput): UsePrintPreviewOutput {
  const { addBorder, showCutlines } = settings;

  // Layout calculations (Heavy layout computation - memoized)
  const layoutResult = useMemo(() => {
    return PrintController.getLayout(paper, template);
  }, [paper, template]);

  const layout = layoutResult.success ? layoutResult.layout : null;

  // Preview scene generation (Large preview scene generation - memoized)
  const previewScene = useMemo(() => {
    if (!layout || !layoutResult.success) return null;

    const mockSlots = Array(layout.capacity).fill(null);
    return RenderSceneBuilder.build({
      layout,
      slots: mockSlots,
      images: {},
      addBorder,
      showCutlines,
    });
  }, [layout, layoutResult.success, addBorder, showCutlines]);

  const capacity = layout ? layout.capacity : 0;

  // Visual scaling factors for millimeter preview layout inside HTML
  const paperWidthPx = previewScene
    ? UnitConverter.convert(previewScene.paperWidthMm, 'mm', 'px', DpiProfile.Preview)
    : 0;
  const paperHeightPx = previewScene
    ? UnitConverter.convert(previewScene.paperHeightMm, 'mm', 'px', DpiProfile.Preview)
    : 0;

  return {
    previewScene,
    previewScale: 2.5,
    previewDimensions: {
      paperWidthPx,
      paperHeightPx,
      capacity,
      layout,
    },
  };
}
