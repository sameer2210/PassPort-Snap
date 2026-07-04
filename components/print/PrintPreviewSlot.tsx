/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Plus } from 'lucide-react';
import type { Person } from '@/lib/types';
import { UnitConverter, DpiProfile } from '@/lib/print';
import type { Coordinate } from '@/lib/print';

export interface PrintPreviewSlotProps {
  readonly index: number;
  readonly slot: Coordinate;
  readonly personId: string | null;
  readonly person: Person | undefined;
  readonly slotWidthMm: number;
  readonly slotHeightMm: number;
  readonly onSlotClick: (index: number) => void;
}

export const PrintPreviewSlot: React.FC<PrintPreviewSlotProps> = React.memo(({
  index,
  slot,
  personId,
  person,
  slotWidthMm,
  slotHeightMm,
  onSlotClick,
}) => {
  const x = UnitConverter.convert(slot.x, 'mm', 'px', DpiProfile.Preview);
  const y = UnitConverter.convert(slot.y, 'mm', 'px', DpiProfile.Preview);
  const w = UnitConverter.convert(slotWidthMm, 'mm', 'px', DpiProfile.Preview);
  const h = UnitConverter.convert(slotHeightMm, 'mm', 'px', DpiProfile.Preview);

  const imageUrl = person
    ? person.finalPhotoUrl ||
      person.croppedPhotoUrl ||
      person.previewPhotoUrl ||
      person.highResFinalUrl ||
      ''
    : '';

  return (
    <div
      onClick={() => onSlotClick(index)}
      className={`absolute cursor-pointer transition-colors overflow-hidden ${
        personId ? 'bg-white shadow-sm' : 'bg-slate-100/70 hover:bg-slate-200'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${h}px`,
        boxSizing: 'border-box',
      }}
    >
      {person && imageUrl ? (
        <img
          src={imageUrl}
          className="w-full h-full object-cover pointer-events-none"
          alt={`Tiled passport photo sheet slot position ${index + 1}`}
          decoding="async"
          loading="eager"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none">
          <Plus className="w-5 h-5" />
        </div>
      )}
    </div>
  );
});

PrintPreviewSlot.displayName = 'PrintPreviewSlot';

