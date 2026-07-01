import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import type { ExportState, ExportActions } from './types';

export interface PrintExportActionsProps {
  readonly state: ExportState;
  readonly actions: ExportActions;
}

export const PrintExportActions: React.FC<PrintExportActionsProps> = React.memo(({ state, actions }) => {
  const { isSinglePhotoMode, isGenerating, totalPhotosPlaced, selectedPersonId } = state;
  const { onDownloadPdf, onPrint, onDownloadSingle } = actions;

  return (
    <div className="flex items-center gap-3">
      {!isSinglePhotoMode ? (
        <>
          <Button
            size="sm"
            onClick={onDownloadPdf}
            disabled={isGenerating || totalPhotosPlaced === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            disabled={totalPhotosPlaced === 0}
          >
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </>
      ) : (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDownloadSingle('image/jpeg')}
            disabled={isGenerating || !selectedPersonId}
          >
            Download JPG
          </Button>
          <Button
            size="sm"
            onClick={() => onDownloadSingle('image/png')}
            disabled={isGenerating || !selectedPersonId}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Download PNG
          </Button>
        </>
      )}
    </div>
  );
});

PrintExportActions.displayName = 'PrintExportActions';
