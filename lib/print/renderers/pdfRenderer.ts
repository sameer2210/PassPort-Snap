import { jsPDF } from 'jspdf';
import { RenderScene } from '../contracts/types';

export const PdfRenderer = {
  render: (scene: RenderScene): jsPDF => {
    const doc = new jsPDF({
      orientation: scene.orientation,
      unit: 'mm',
      format: [scene.paperWidthMm, scene.paperHeightMm]
    });

    PdfRenderer.drawImages(doc, scene);
    PdfRenderer.drawBorders(doc, scene);
    PdfRenderer.drawCutLines(doc, scene);

    return doc;
  },

  drawImages: (doc: jsPDF, scene: RenderScene): void => {
    scene.items.forEach(item => {
      if (item.imageRef) {
        doc.addImage(item.imageRef, 'JPEG', item.xMm, item.yMm, item.widthMm, item.heightMm);
      }
    });
  },

  drawBorders: (doc: jsPDF, scene: RenderScene): void => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    scene.borders.forEach(border => {
      doc.rect(border.xMm, border.yMm, border.widthMm, border.heightMm);
    });
  },

  drawCutLines: (doc: jsPDF, scene: RenderScene): void => {
    if (scene.cutLines.length === 0) return;

    doc.setDrawColor(150);
    doc.setLineWidth(0.2);
    
    // Safety check for dashed line capabilities in jsPDF version
    const docAny = doc as jsPDF & { setLineDash?: (dashArray: number[], start?: number) => void };
    const hasLineDash = typeof docAny.setLineDash === 'function';
    if (hasLineDash && docAny.setLineDash) {
      docAny.setLineDash([1, 1], 0);
    }

    scene.cutLines.forEach(line => {
      doc.line(line.x1Mm, line.y1Mm, line.x2Mm, line.y2Mm);
    });

    if (hasLineDash && docAny.setLineDash) {
      docAny.setLineDash([]);
    }
  }
} as const;
