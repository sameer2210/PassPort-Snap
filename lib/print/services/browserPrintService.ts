import { PrintFailedError } from '../contracts/errors';

export const BrowserPrintService = {
  print: (pageWidthMm: number, pageHeightMm: number): void => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new PrintFailedError('Browser printing requires window context.');
    }

    try {
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          @page {
            size: ${pageWidthMm}mm ${pageHeightMm}mm !important;
            margin: 0 !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      window.print();
      
      // Delay removal to allow printing subsystem spooling
      setTimeout(() => {
        if (style.parentNode) {
          document.head.removeChild(style);
        }
      }, 1000);
    } catch (err) {
      throw new PrintFailedError(`Printing dialog failed: ${(err as Error).message}`);
    }
  }
} as const;
