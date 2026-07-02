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
        const rotation = item.rotationDegrees || 0;
        if (rotation === 90) {
          // jsPDF rotates clockwise around (x, y). Offset x by width to center it in the slot.
          // Subtract (widthMm - heightMm) from yMm to offset the translation origin shift caused by rotation.
          doc.addImage(
            item.imageRef,
            'JPEG',
            item.xMm + item.widthMm,
            item.yMm - (item.widthMm - item.heightMm),
            item.heightMm,
            item.widthMm,
            undefined,
            undefined,
            90
          );
        } else {
          doc.addImage(item.imageRef, 'JPEG', item.xMm, item.yMm, item.widthMm, item.heightMm);
        }
      }
    });
  },

  drawBorders: (doc: jsPDF, scene: RenderScene): void => {
    scene.borders.forEach(border => {
      doc.setDrawColor(border.colorHex);
      doc.setLineWidth(border.thicknessMm);
      doc.rect(border.xMm, border.yMm, border.widthMm, border.heightMm);
    });
  },

  drawCutLines: (doc: jsPDF, scene: RenderScene): void => {
    if (scene.cutLines.length === 0) return;
    
    // Safety check for dashed line capabilities in jsPDF version
    const docAny = doc as jsPDF & { setLineDash?: (dashArray: number[], start?: number) => void };
    const hasLineDash = typeof docAny.setLineDash === 'function';
    if (hasLineDash && docAny.setLineDash) {
      docAny.setLineDash([1, 1], 0);
    }

    scene.cutLines.forEach(line => {
      doc.setDrawColor(line.colorHex);
      doc.setLineWidth(line.thicknessMm);
      doc.line(line.x1Mm, line.y1Mm, line.x2Mm, line.y2Mm);
    });

    if (hasLineDash && docAny.setLineDash) {
      docAny.setLineDash([]);
    }
  }
} as const;
