import { PaperSize, PhotoTemplate, LayoutResult, RenderScene } from '../contracts/types';
import { calculateGrid, LayoutEngineResult } from '../core/layoutEngine';
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
      template,
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
      geometry: {
        cols: 1,
        rows: 1,
        capacity: 1,
        paperWidth: template.widthMm,
        paperHeight: template.heightMm,
        usableWidth: template.widthMm,
        usableHeight: template.heightMm,
        requiredWidth: template.widthMm,
        requiredHeight: template.heightMm,
        coordinates: [{ x: 0, y: 0 }],
        startX: 0,
        startY: 0,
        remainingWidth: 0,
        remainingHeight: 0
      },
      metadata: {
        paperId: 'single',
        templateId: template.id,
        orientation: 'portrait',
        marginMm: 0,
        gutterMm: 0,
        algorithmVersion: '1.0.0',
        registryVersion: '1.0.0',
        cacheVersion: '1.0.0'
      },
      score: {
        capacity: 1,
        paperUtilization: 100,
        remainingMargins: 0,
        layoutSymmetry: 100,
        centering: 100,
        orientationPreference: 1,
        overallScore: 99999
      }
    };

    return RenderSceneBuilder.build({
      layout: mockLayout,
      template,
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
