import { RenderScene, ExportType } from '../contracts/types';
import { jsPDF } from 'jspdf';

export interface PrintStrategy {
  readonly supportedFormats: readonly ExportType[];
  generatePreview(scene: RenderScene): unknown;
  generatePdf(scene: RenderScene): jsPDF;
  generateCanvas(scene: RenderScene): Promise<HTMLCanvasElement>;
}
