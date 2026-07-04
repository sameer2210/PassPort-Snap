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
      className="border border-app-border select-none"
    >
      <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
        {people.map((p, idx) => {
          const isSelected = selectedPersonId === p.id;
          return (
            <div
              key={p.id}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer border transition-all duration-150
                ${isSelected
                  ? 'border-brand-primary bg-brand-light/15 ring-1 ring-brand-primary/70'
                  : 'border-app-border hover:border-brand-primary/30 hover:bg-app-surface-muted/45'
                }`}
              onClick={() => onSelectPerson(p.id)}
            >
              <div className="flex items-center gap-2.5">
                {p.finalPhotoUrl ? (
                  <img
                    src={p.finalPhotoUrl}
                    className="w-10 h-10 object-cover rounded-lg shadow-sm border border-app-border"
                    alt={`Portrait photo preview selector index ${idx + 1}`}
                    decoding="async"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-app-text-muted">
                    <Camera className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <span className="font-semibold text-xs text-app-text-primary">Portrait Photo {idx + 1}</span>
                  <p className="text-[10px] text-app-text-muted mt-0.5 leading-none">Ready for export</p>
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
            icon={<Camera className="w-5 h-5 text-app-text-muted" />}
            title="No Photos Available"
            description="Go back and upload a photo to populate the grid sheet selector."
          />
        )}
      </div>
    </SectionCard>
  );
});

PrintPhotoSelector.displayName = 'PrintPhotoSelector';

