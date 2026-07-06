import { PrintFailedError } from '../contracts/errors';

export const BrowserPrintService = {
  print: (
    imageBlob: Blob,
    pageWidthMm: number,
    pageHeightMm: number
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        reject(new PrintFailedError('Browser printing requires window context.'));
        return;
      }

      let blobUrl: string | null = null;
      let printWindow: Window | null = null;
      let timeoutId: NodeJS.Timeout | null = null;
      let checkClosedInterval: NodeJS.Timeout | null = null;
      let cleanupDone = false;

      // Unified cleanup function for all success/failure paths
      const cleanup = (error?: Error) => {
        if (cleanupDone) return;
        cleanupDone = true;

        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (checkClosedInterval) {
          clearInterval(checkClosedInterval);
        }

        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
        }

        if (printWindow) {
          try {
            printWindow.close();
          } catch (e) {
            console.error('Failed to close print window:', e);
          }
        }

        if (error) {
          reject(error);
        } else {
          resolve();
        }
      };

      try {
        blobUrl = URL.createObjectURL(imageBlob);

        printWindow = window.open('', '_blank');
        if (!printWindow) {
          cleanup(
            new PrintFailedError(
              'Unable to open the print window. Please allow popups for this site and try again.'
            )
          );
          return;
        }

        // Setup clean minimal HTML layout in the popup document
        printWindow.document.open();
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Passport Sheet</title>
              <style>
                @page {
                  size: ${pageWidthMm}mm ${pageHeightMm}mm;
                  margin: 0;
                }
                html, body {
                  margin: 0;
                  padding: 0;
                  background: white;
                }
                img {
                  display: block;
                  width: 100%;
                  height: auto;
                  margin: 0;
                }
              </style>
            </head>
            <body>
              <img src="${blobUrl}" id="print-image" alt="Passport Sheet" />
            </body>
          </html>
        `);
        printWindow.document.close();

        // 10-second timeout protection to avoid hangs
        timeoutId = setTimeout(() => {
          cleanup(new PrintFailedError('Image loading timed out. Please try again.'));
        }, 10000);

        const img = printWindow.document.getElementById('print-image') as HTMLImageElement;
        if (!img) {
          cleanup(new PrintFailedError('Failed to find image element in print window.'));
          return;
        }

        // Wait for the image content to fully load
        img.onload = async () => {
          if (cleanupDone) return;
          try {
            // Wait for fonts to be ready (ensure all typography/styling is complete)
            if (printWindow && printWindow.document && printWindow.document.fonts) {
              await printWindow.document.fonts.ready;
            }

            if (cleanupDone) return;

            if (printWindow) {
              printWindow.focus();

              // Trigger print dialog when focus and load is confirmed
              printWindow.addEventListener('afterprint', () => {
                cleanup();
              });

              printWindow.print();

              // Setup regular interval check in case afterprint does not fire or user closes window manually
              checkClosedInterval = setInterval(() => {
                if (printWindow && printWindow.closed) {
                  cleanup();
                }
              }, 500);
            }
          } catch (e) {
            cleanup(new PrintFailedError(`Printing execution failed: ${(e as Error).message}`));
          }
        };

        img.onerror = () => {
          cleanup(new PrintFailedError('Failed to load passport sheet image in print window.'));
        };
      } catch (err) {
        cleanup(new PrintFailedError(`Printing setup failed: ${(err as Error).message}`));
      }
    });
  }
} as const;
