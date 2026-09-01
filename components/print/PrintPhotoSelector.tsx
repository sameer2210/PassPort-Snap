import React from 'react';
import type { Person } from '@/lib/types';
import { SectionCard } from '@/components/ui/SectionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Image as ImageIcon, Camera, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PrintPhotoSelectorProps {
  readonly people: readonly Person[];
  readonly selectedPersonId: string | null;
  readonly slots: readonly (string | null)[];
  readonly isSinglePhotoMode: boolean;
  readonly onSelectPerson: (id: string) => void;
  readonly onDeletePerson: (id: string) => void;
  readonly onUpdateCount: (id: string, count: number) => void;
  readonly maxCapacity?: number;
}

export const PrintPhotoSelector: React.FC<PrintPhotoSelectorProps> = React.memo(({
  people,
  selectedPersonId,
  slots: _slots,
  isSinglePhotoMode,
  onSelectPerson,
  onDeletePerson,
  onUpdateCount,
  maxCapacity = 0,
}) => {
  const totalAssignedCopies = people.reduce((acc, x) => acc + x.count, 0);
  const remainingSlots = maxCapacity > 0 ? maxCapacity - totalAssignedCopies : 0;
  const isPlusDisabled = maxCapacity > 0 && remainingSlots <= 0;

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
                    className="w-10 h-10 object-cover rounded-xl shadow-sm border border-app-border"
                    alt={`Portrait photo preview selector index ${idx + 1}`}
                    decoding="async"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-app-text-muted">
                    <Camera className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <span className="font-semibold text-xs text-app-text-primary">Portrait Photo {idx + 1}</span>
                  <p className="text-[10px] text-app-text-muted mt-0.5 leading-none">Ready for export</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pr-1" onClick={(e) => e.stopPropagation()}>
                {!isSinglePhotoMode && (
                  <div className="flex items-center bg-brand-light/60 border border-brand-border rounded-xl p-0.5 select-none">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      disabled={p.count === 0}
                      className="h-6 w-6 rounded-lg text-app-text-secondary hover:text-app-text-primary hover:bg-white/80 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (p.count > 0) {
                          onUpdateCount(p.id, p.count - 1);
                        }
                      }}
                      aria-label={`Decrease copies for Portrait Photo ${idx + 1}`}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-7 text-center font-bold text-xs text-brand-accent tabular-nums">
                      {p.count}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      disabled={isPlusDisabled}
                      className="h-6 w-6 rounded-lg text-app-text-secondary hover:text-app-text-primary hover:bg-white/80 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isPlusDisabled) {
                          onUpdateCount(p.id, p.count + 1);
                        }
                      }}
                      aria-label={`Increase copies for Portrait Photo ${idx + 1}`}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-brand-danger hover:text-red-750 hover:bg-red-50/50 rounded-xl transition-all duration-120 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-danger focus-visible:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePerson(p.id);
                  }}
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


