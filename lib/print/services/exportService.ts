import { jsPDF } from 'jspdf';
import { ExportFailedError } from '../contracts/errors';

export const ExportService = {
  pdfToBlob: async (doc: jsPDF): Promise<Blob> => {
    try {
      const buffer = doc.output('arraybuffer');
      return new Blob([buffer], { type: 'application/pdf' });
    } catch (err) {
      throw new ExportFailedError(`PDF compile failed: ${(err as Error).message}`);
    }
  },

  canvasToBlob: async (
    canvas: HTMLCanvasElement,
    format: 'image/jpeg' | 'image/png',
    quality: number = 0.98
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (blob) resolve(blob);
          else reject(new ExportFailedError('Canvas binary generation failed.'));
        },
        format,
        quality
      );
    });
  }
} as const;
