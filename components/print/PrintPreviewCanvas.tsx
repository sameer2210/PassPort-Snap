/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { UnitConverter, DpiProfile } from '@/lib/print';
import { PrintPreviewSlot } from './PrintPreviewSlot';
import type { PreviewState, PreviewActions } from './types';

export interface PrintPreviewCanvasProps {
  readonly state: PreviewState;
  readonly actions: PreviewActions;
}

export const PrintPreviewCanvas: React.FC<PrintPreviewCanvasProps> = React.memo(({ state, actions }) => {
  const {
    isSinglePhotoMode,
    previewLayout,
    layout,
    template,
    slots,
    people,
    selectedPersonId,
    addBorder,
    showCutlines,
    paperWidthPx,
    paperHeightPx,
  } = state;
  const { onSlotClick } = actions;

  return (
    <div className="flex-1 w-full flex items-center justify-center overflow-auto">
      {!isSinglePhotoMode ? (
        previewLayout && (
          <div
            className="bg-white shadow-2xl relative transition-all"
            style={{
              width: `${paperWidthPx}px`,
              height: `${paperHeightPx}px`,
              transform: `scale(2.5)`,
              transformOrigin: 'center',
            }}
          >
            {/* Print grid coordinates rendering */}
            {previewLayout.slots.map((slot, i) => {
              const personId = slots[i];
              const person = people.find((p) => p.id === personId);

              return (
                <PrintPreviewSlot
                  key={i}
                  index={i}
                  slot={slot}
                  personId={personId}
                  person={person}
                  slotWidthMm={previewLayout.slotWidthMm}
                  slotHeightMm={previewLayout.slotHeightMm}
                  addBorder={addBorder}
                  onSlotClick={onSlotClick}
                />
              );
            })}

            {/* Dashed alignment cutlines */}
            {layout && showCutlines && previewLayout.slots.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Vertical Lines */}
                {Array.from({ length: Math.max(0, layout.geometry.cols - 1) }).map((_, c) => {
                  const colIndex = c + 1;
                  const xMm =
                    layout.geometry.startX +
                    colIndex * template.widthMm +
                    colIndex * layout.metadata.gutterMm -
                    layout.metadata.gutterMm / 2;
                  const x = UnitConverter.convert(xMm, 'mm', 'px', DpiProfile.Preview);
                  const totalHMm =
                    layout.geometry.rows * template.heightMm +
                    (layout.geometry.rows - 1) * layout.metadata.gutterMm;
                  const totalH = UnitConverter.convert(totalHMm, 'mm', 'px', DpiProfile.Preview);
                  const startY = UnitConverter.convert(
                    layout.geometry.startY,
                    'mm',
                    'px',
                    DpiProfile.Preview
                  );

                  return (
                    <div
                      key={`v-${c}`}
                      className="absolute border-l border-dashed border-gray-400"
                      style={{
                        left: `${x}px`,
                        top: `${startY}px`,
                        height: `${totalH}px`,
                        borderWidth: '0.5px',
                      }}
                    />
                  );
                })}

                {/* Horizontal Lines */}
                {Array.from({ length: Math.max(0, layout.geometry.rows - 1) }).map((_, r) => {
                  const rowIndex = r + 1;
                  const yMm =
                    layout.geometry.startY +
                    rowIndex * template.heightMm +
                    rowIndex * layout.metadata.gutterMm -
                    layout.metadata.gutterMm / 2;
                  const y = UnitConverter.convert(yMm, 'mm', 'px', DpiProfile.Preview);
                  const totalWMm =
                    layout.geometry.cols * template.widthMm +
                    (layout.geometry.cols - 1) * layout.metadata.gutterMm;
                  const totalW = UnitConverter.convert(totalWMm, 'mm', 'px', DpiProfile.Preview);
                  const startX = UnitConverter.convert(
                    layout.geometry.startX,
                    'mm',
                    'px',
                    DpiProfile.Preview
                  );

                  return (
                    <div
                      key={`h-${r}`}
                      className="absolute border-t border-dashed border-gray-400"
                      style={{
                        top: `${y}px`,
                        left: `${startX}px`,
                        width: `${totalW}px`,
                        borderWidth: '0.5px',
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )
      ) : (
        // Single photo mode preview card
        selectedPersonId && (
          (() => {
            const p = people.find((person) => person.id === selectedPersonId);
            if (!p) return null;

            const photoSrc =
              p.highResFinalUrl || p.finalPhotoUrl || p.croppedPhotoUrl || p.previewPhotoUrl || '';
            const w = UnitConverter.convert(template.widthMm, 'mm', 'px', DpiProfile.Preview);
            const h = UnitConverter.convert(template.heightMm, 'mm', 'px', DpiProfile.Preview);

            return (
              <div className="bg-white p-4 rounded-lg shadow-xl flex flex-col items-center gap-4">
                <div
                  className="border shadow-inner bg-gray-50 flex items-center justify-center overflow-hidden"
                  style={{
                    width: `${w * 3}px`,
                    height: `${h * 3}px`,
                  }}
                >
                  <img src={photoSrc} className="w-full h-full object-cover" alt="Single Place" />
                </div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  {template.label}
                </span>
              </div>
            );
          })()
        )
      )}
    </div>
  );
});

PrintPreviewCanvas.displayName = 'PrintPreviewCanvas';
