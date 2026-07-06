import React from 'react';
import { Button } from '@/components/ui/button';
import { ActionGroup } from '@/components/ui/ActionGroup';
import { Printer, Download, FileText } from 'lucide-react';
import type { ExportState, ExportActions } from './types';

export interface PrintExportActionsProps {
  readonly state: ExportState;
  readonly actions: ExportActions;
}

export const PrintExportActions: React.FC<PrintExportActionsProps> = React.memo(({ state, actions }) => {
  const { isSinglePhotoMode, isGenerating, totalPhotosPlaced, selectedPersonId } = state;
  const { onDownloadPdf, onPrint, onDownloadSingle } = actions;

  return (
    <div className="select-none">
      {!isSinglePhotoMode ? (
        <ActionGroup orientation="horizontal" responsiveStacking={false}>
          <Button
            variant="outline"
            className="border-slate-200 hover:bg-slate-50 text-app-text-secondary h-8.5 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-120"
            onClick={onPrint}
            disabled={totalPhotosPlaced === 0}
          >
            <Printer className="w-3.5 h-3.5" />
            Print Layout
          </Button>
          <Button
            className="bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold h-8.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-120 disabled:opacity-50"
            onClick={onDownloadPdf}
            disabled={isGenerating || totalPhotosPlaced === 0}
          >
            {isGenerating ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            Download PDF
          </Button>
        </ActionGroup>
      ) : (
        <ActionGroup orientation="horizontal" responsiveStacking={false}>
          <Button
            variant="outline"
            className="border-slate-200 hover:bg-slate-50 text-app-text-secondary h-8.5 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-120"
            onClick={() => onDownloadSingle('image/jpeg')}
            disabled={isGenerating || !selectedPersonId}
          >
            <Download className="w-3.5 h-3.5" />
            JPG
          </Button>
          <Button
            className="bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold h-8.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-120"
            onClick={() => onDownloadSingle('image/png')}
            disabled={isGenerating || !selectedPersonId}
          >
            {isGenerating ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            PNG
          </Button>
        </ActionGroup>
      )}
    </div>
  );
});

PrintExportActions.displayName = 'PrintExportActions';


