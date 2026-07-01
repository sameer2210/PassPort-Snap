/* eslint-disable @next/next/no-img-element */
import React from 'react';
import type { Person } from '@/lib/types';

export interface PrintPhotoSelectorProps {
  readonly people: readonly Person[];
  readonly selectedPersonId: string | null;
  readonly slots: readonly (string | null)[];
  readonly isSinglePhotoMode: boolean;
  readonly onSelectPerson: (id: string) => void;
}

export const PrintPhotoSelector: React.FC<PrintPhotoSelectorProps> = React.memo(({
  people,
  selectedPersonId,
  slots,
  isSinglePhotoMode,
  onSelectPerson,
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
      <h3 className="font-semibold text-sm text-gray-700">Select Photo</h3>
      <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
        {people.map((p, idx) => (
          <div
            key={p.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border-2 transition-all ${
              selectedPersonId === p.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-transparent hover:bg-gray-50'
            }`}
            onClick={() => onSelectPerson(p.id)}
          >
            <div className="flex items-center gap-3">
              {p.finalPhotoUrl && (
                <img
                  src={p.finalPhotoUrl}
                  className="w-10 h-10 object-cover rounded shadow-sm"
                  alt={`Person ${idx + 1}`}
                />
              )}
              <span className="font-medium text-sm">Photo {idx + 1}</span>
            </div>
            {!isSinglePhotoMode && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {slots.filter((s) => s === p.id).length}
                </span>
              </div>
            )}
          </div>
        ))}
        {people.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No photos available.</p>
        )}
      </div>
    </div>
  );
});

PrintPhotoSelector.displayName = 'PrintPhotoSelector';
