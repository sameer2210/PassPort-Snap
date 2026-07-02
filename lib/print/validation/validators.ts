import { jsPDF } from 'jspdf';
import { LayoutResult, PaperSize } from '../contracts/types';
import { LayoutOverflowError, ValidationError } from '../contracts/errors';

export const LayoutValidator = {
  validate: (layout: LayoutResult): void => {
    const {
      columns,
      rows,
      capacity,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      slotWidthMm,
      slotHeightMm,
      gutterHorizontal,
      gutterVertical,
      paperWidthMm,
      paperHeightMm,
    } = layout;
    
    if (capacity === 0 || columns === 0 || rows === 0) {
      throw new LayoutOverflowError('The photo template dimensions exceed the printable area of the sheet.');
    }

    const requiredWidth = columns * slotWidthMm + (columns - 1) * gutterHorizontal;
    const requiredHeight = rows * slotHeightMm + (rows - 1) * gutterVertical;
    const usableWidth = paperWidthMm - (marginLeft + marginRight);
    const usableHeight = paperHeightMm - (marginTop + marginBottom);

    if (requiredWidth > usableWidth + 0.0001 || requiredHeight > usableHeight + 0.0001) {
      throw new ValidationError('Layout dimensions overflow usable printable bounds.');
    }

    if (marginLeft < 0 || marginTop < 0) {
      throw new ValidationError('Centering calculation resulted in negative margins.');
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

    const expectedWidth = layout.paperWidthMm;
    const expectedHeight = layout.paperHeightMm;

    if (Math.abs(pdfWidth - expectedWidth) > 0.1 || Math.abs(pdfHeight - expectedHeight) > 0.1) {
      issues.push(`PDF MediaBox size (${pdfWidth.toFixed(1)}x${pdfHeight.toFixed(1)}mm) does not match expected size (${expectedWidth.toFixed(1)}x${expectedHeight.toFixed(1)}mm).`);
    }

    const requiredWidth = layout.columns * layout.slotWidthMm + (layout.columns - 1) * layout.gutterHorizontal;
    const requiredHeight = layout.rows * layout.slotHeightMm + (layout.rows - 1) * layout.gutterVertical;

    if (requiredWidth > layout.paperWidthMm + 0.0001 || requiredHeight > layout.paperHeightMm + 0.0001) {
      issues.push('Content boundaries exceed physical paper boundaries.');
    }

    return {
      isCompatible: issues.length === 0,
      issues
    };
  }
} as const;
