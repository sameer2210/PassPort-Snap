import React from 'react';
import type { ExportState } from './types';

export interface PrintHeaderProps {
  readonly state: ExportState;
}

export const PrintHeader: React.FC<PrintHeaderProps> = React.memo(({ state }) => {
  const { isSinglePhotoMode, totalPhotosPlaced, capacity } = state;

  return (
    <div className="w-full flex justify-between items-center mb-6">
      <h3 className="font-bold text-gray-700">Preview Panel</h3>
      {!isSinglePhotoMode && (
        <p className="text-sm font-medium text-gray-500">
          {totalPhotosPlaced} / {capacity} Placed
        </p>
      )}
    </div>
  );
});

PrintHeader.displayName = 'PrintHeader';
