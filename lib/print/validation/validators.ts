import { jsPDF } from 'jspdf';
import { LayoutResult, PaperSize } from '../contracts/types';
import { LayoutOverflowError, ValidationError } from '../contracts/errors';

export const LayoutValidator = {
  validate: (layout: LayoutResult): void => {
    const { cols, rows, capacity, requiredWidth, usableWidth, requiredHeight, usableHeight, startX, startY } = layout.geometry;
    
    if (capacity === 0 || cols === 0 || rows === 0) {
      throw new LayoutOverflowError('The photo template dimensions exceed the printable area of the sheet.');
    }
    if (requiredWidth > usableWidth || requiredHeight > usableHeight) {
      throw new ValidationError('Layout dimensions overflow usable printable bounds.');
    }
    if (startX < layout.geometry.usableWidth - requiredWidth || startY < layout.geometry.usableHeight - requiredHeight) {
      // Allow minor float tolerances, check strictly
      if (startX < 0 || startY < 0) {
        throw new ValidationError('Centering calculation resulted in negative margins.');
      }
    }
  }
} as const;

export interface PrintValidationResult {
  readonly isCompatible: boolean;
  readonly issues: readonly string[];
}

export const PrintValidator = {
  validatePrintJob: (doc: jsPDF, paper: PaperSize, layout: LayoutResult): PrintValidationResult => {
    const issues: string[] = [];
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    const expectedWidth = layout.geometry.paperWidth;
    const expectedHeight = layout.geometry.paperHeight;

    if (Math.abs(pdfWidth - expectedWidth) > 0.1 || Math.abs(pdfHeight - expectedHeight) > 0.1) {
      issues.push(`PDF MediaBox size (${pdfWidth.toFixed(1)}x${pdfHeight.toFixed(1)}mm) does not match expected size (${expectedWidth.toFixed(1)}x${expectedHeight.toFixed(1)}mm).`);
    }

    if (layout.geometry.requiredWidth > layout.geometry.paperWidth || layout.geometry.requiredHeight > layout.geometry.paperHeight) {
      issues.push('Content boundaries exceed physical paper boundaries.');
    }

    return {
      isCompatible: issues.length === 0,
      issues
    };
  }
} as const;
