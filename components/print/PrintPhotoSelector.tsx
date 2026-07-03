/* eslint-disable @next/next/no-img-element */
import React from 'react';
import type { Person } from '@/lib/types';
import { SectionCard } from '@/components/ui/SectionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Image as ImageIcon, Camera, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PrintPhotoSelectorProps {
  readonly people: readonly Person[];
  readonly selectedPersonId: string | null;
  readonly slots: readonly (string | null)[];
  readonly isSinglePhotoMode: boolean;
  readonly onSelectPerson: (id: string) => void;
  readonly onDeletePerson: (id: string) => void;
}

export const PrintPhotoSelector: React.FC<PrintPhotoSelectorProps> = React.memo(({
  people,
  selectedPersonId,
  slots,
  isSinglePhotoMode,
  onSelectPerson,
  onDeletePerson,
}) => {
  return (
    <SectionCard
      title="Photo Selector"
      subtitle={isSinglePhotoMode ? "Select photo to export" : "Select photo to place in slots"}
      icon={<ImageIcon className="w-4 h-4 text-brand-primary" />}
      className="border border-[#0b1e3a]/8 select-none"
    >
      <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
        {people.map((p, idx) => {
          const isSelected = selectedPersonId === p.id;
          return (
            <div
              key={p.id}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer border transition-all duration-150
                ${isSelected
                  ? 'border-brand-primary bg-brand-light/30 ring-1 ring-brand-primary'
                  : 'border-[#0b1e3a]/6 hover:border-brand-primary/20 hover:bg-gray-50/50'
                }`}
              onClick={() => onSelectPerson(p.id)}
            >
              <div className="flex items-center gap-2.5">
                {p.finalPhotoUrl ? (
                  <img
                    src={p.finalPhotoUrl}
                    className="w-10 h-10 object-cover rounded-lg shadow-sm border border-[#0b1e3a]/6"
                    alt={`Portrait ${idx + 1}`}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    <Camera className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <span className="font-semibold text-xs text-gray-800">Portrait Photo {idx + 1}</span>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-none">Ready for export</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pr-1" onClick={(e) => e.stopPropagation()}>
                {!isSinglePhotoMode && (
                  <span className="text-[10px] font-bold text-brand-accent bg-brand-light px-2.5 py-0.5 rounded-full border border-brand-border select-none">
                    {slots.filter((s) => s === p.id).length} Placed
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-brand-danger hover:text-red-750 hover:bg-red-50/50 rounded-lg transition-all duration-120 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-danger focus-visible:outline-none"
                  onClick={() => onDeletePerson(p.id)}
                  aria-label={`Delete Portrait Photo ${idx + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
        {people.length === 0 && (
          <EmptyState
            icon={<Camera className="w-5 h-5 text-gray-400" />}
            title="No Photos Available"
            description="Go back and upload a photo to populate the grid sheet selector."
          />
        )}
      </div>
    </SectionCard>
  );
});

PrintPhotoSelector.displayName = 'PrintPhotoSelector';
