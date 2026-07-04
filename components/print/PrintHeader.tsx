import React from 'react';
import type { ExportState } from './types';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface PrintHeaderProps {
  readonly state: ExportState;
}

export const PrintHeader: React.FC<PrintHeaderProps> = React.memo(({ state }) => {
  const { isSinglePhotoMode, totalPhotosPlaced, capacity } = state;

  if (isSinglePhotoMode) return null;

  const isFull = totalPhotosPlaced === capacity;

  return (
    <div className="w-full flex items-center justify-start py-0.5 select-none">
      <StatusBadge variant={isFull ? 'success' : totalPhotosPlaced > 0 ? 'processing' : 'info'}>
        {totalPhotosPlaced} of {capacity} Grid Slots Occupied
      </StatusBadge>
    </div>
  );
});

PrintHeader.displayName = 'PrintHeader';

