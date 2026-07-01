import { PrintStrategy } from './printStrategy';
import { RenderScene, ExportType } from '../contracts/types';
import { jsPDF } from 'jspdf';
import { getPreviewLayout } from '../renderers/previewRenderer';
import { PdfRenderer } from '../renderers/pdfRenderer';
import { CanvasRenderer } from '../renderers/canvasRenderer';

export class GridPrintStrategy implements PrintStrategy {
  readonly supportedFormats: readonly ExportType[] = [ExportType.PDF, ExportType.PRINT] as const;

  generatePreview(scene: RenderScene): unknown {
    return getPreviewLayout(scene);
  }

  generatePdf(scene: RenderScene): jsPDF {
    return PdfRenderer.render(scene);
  }

  generateCanvas(scene: RenderScene): Promise<HTMLCanvasElement> {
    return CanvasRenderer.render(scene);
  }
}
