import { PrintStrategy } from './printStrategy';
import { RenderScene, ExportType } from '../contracts/types';
import { jsPDF } from 'jspdf';
import { CanvasRenderer } from '../renderers/canvasRenderer';

export class SinglePhotoStrategy implements PrintStrategy {
  readonly supportedFormats: readonly ExportType[] = [ExportType.JPEG, ExportType.PNG] as const;

  generatePreview(scene: RenderScene): unknown {
    return scene;
  }

  generatePdf(_scene: RenderScene): jsPDF {
    if (_scene) {
      // noop
    }
    throw new Error('PDF Export is not supported in Single Photo Mode.');
  }

  generateCanvas(scene: RenderScene): Promise<HTMLCanvasElement> {
    return CanvasRenderer.render(scene);
  }
}
