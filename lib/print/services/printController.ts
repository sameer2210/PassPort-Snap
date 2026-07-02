import { PaperSize, PhotoTemplate, LayoutResult, RenderScene, LayoutEngineResult } from '../contracts/types';
import { calculateGrid } from '../core/layoutEngine';
import { RenderSceneBuilder } from '../core/renderSceneBuilder';
import { prepareImage, ImageAdjustments } from './imagePreparation/prepare';
import { GridPrintStrategy } from '../strategies/gridPrintStrategy';
import { SinglePhotoStrategy } from '../strategies/singlePhotoStrategy';
import { ExportService } from './exportService';

export interface PrintControllerOptions {
  readonly paper: PaperSize;
  readonly template: PhotoTemplate;
  readonly slots: readonly (string | null)[];
  readonly images: Record<string, string>; // Maps slot ID to raw image data/blobs
  readonly adjustments: Record<string, ImageAdjustments>;
  readonly addBorder: boolean;
  readonly showCutlines: boolean;
}

export const PrintController = {
  getLayout: (paper: PaperSize, template: PhotoTemplate): LayoutEngineResult => {
    return calculateGrid(paper, template, paper.printable.marginMm, paper.printable.gutterMm);
  },

  buildScene: async (options: PrintControllerOptions): Promise<RenderScene> => {
    const { paper, template, slots, images, adjustments, addBorder, showCutlines } = options;
    
    const res = PrintController.getLayout(paper, template);
    if (!res.success) {
      throw new Error(res.message);
    }

    // Process all images concurrently through preparation pipeline
    const preparedImagesMap: Record<string, string> = {};
    await Promise.all(
      slots.map(async (slotId) => {
        if (slotId && images[slotId]) {
          const adj = adjustments[slotId] || { rotation: 0, brightness: 1, contrast: 1 };
          preparedImagesMap[slotId] = await prepareImage(images[slotId], template, adj);
        }
      })
    );

    return RenderSceneBuilder.build({
      layout: res.layout,
      slots,
      images: preparedImagesMap,
      addBorder,
      showCutlines
    });
  },

  buildSinglePhotoScene: async (
    template: PhotoTemplate,
    photoSrc: string,
    adjustments: ImageAdjustments
  ): Promise<RenderScene> => {
    const prepared = await prepareImage(photoSrc, template, adjustments);
    const slots = ['single-slot'];
    const images = { 'single-slot': prepared };

    // Single photo bypass layout
    const mockLayout: LayoutResult = {
      rows: 1,
      columns: 1,
      slotWidthMm: template.widthMm,
      slotHeightMm: template.heightMm,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
      gutterHorizontal: 0,
      gutterVertical: 0,
      capacity: 1,
      photoOrientation: 'normal',
      photoRotation: 0,
      rotationRequired: false,
      coordinates: [{ x: 0, y: 0 }],
      paperWidthMm: template.widthMm,
      paperHeightMm: template.heightMm,
      utilization: 100,
      paperId: 'single',
      templateId: template.id,
      paperOrientation: 'portrait',
    };

    return RenderSceneBuilder.build({
      layout: mockLayout,
      slots,
      images,
      addBorder: false,
      showCutlines: false
    });
  },

  exportPdf: async (scene: RenderScene): Promise<Blob> => {
    const strategy = new GridPrintStrategy();
    const doc = strategy.generatePdf(scene);
    return ExportService.pdfToBlob(doc);
  },

  exportImage: async (scene: RenderScene, format: 'image/jpeg' | 'image/png'): Promise<Blob> => {
    const strategy = new SinglePhotoStrategy();
    const canvas = await strategy.generateCanvas(scene);
    return ExportService.canvasToBlob(canvas, format);
  }
} as const;
// Note: React uses this controller by reading Zustand state and calling these pure methods.
