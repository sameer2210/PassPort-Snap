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
    template,
    slots,
    people,
    selectedPersonId,
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
            {previewLayout.items.map((item, i) => {
              const personId = slots[i];
              const person = people.find((p) => p.id === personId);

              return (
                <PrintPreviewSlot
                  key={i}
                  index={i}
                  slot={{ x: item.xMm, y: item.yMm }}
                  personId={personId}
                  person={person}
                  slotWidthMm={item.widthMm}
                  slotHeightMm={item.heightMm}
                  onSlotClick={onSlotClick}
                />
              );
            })}

            {/* Print grid borders rendering */}
            {previewLayout.borders.map((border, idx) => {
              const bx = UnitConverter.convert(border.xMm, 'mm', 'px', DpiProfile.Preview);
              const by = UnitConverter.convert(border.yMm, 'mm', 'px', DpiProfile.Preview);
              const bw = UnitConverter.convert(border.widthMm, 'mm', 'px', DpiProfile.Preview);
              const bh = UnitConverter.convert(border.heightMm, 'mm', 'px', DpiProfile.Preview);
              return (
                <div
                  key={`b-${idx}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${bx}px`,
                    top: `${by}px`,
                    width: `${bw}px`,
                    height: `${bh}px`,
                    border: `${border.thicknessMm}mm solid ${border.colorHex}`,
                    boxSizing: 'border-box',
                  }}
                />
              );
            })}

            {/* Dashed alignment cutlines */}
            {showCutlines && previewLayout.cutLines.map((line, idx) => {
              const x1 = UnitConverter.convert(line.x1Mm, 'mm', 'px', DpiProfile.Preview);
              const y1 = UnitConverter.convert(line.y1Mm, 'mm', 'px', DpiProfile.Preview);
              const x2 = UnitConverter.convert(line.x2Mm, 'mm', 'px', DpiProfile.Preview);
              const y2 = UnitConverter.convert(line.y2Mm, 'mm', 'px', DpiProfile.Preview);

              const isVertical = Math.abs(x1 - x2) < 0.1;
              const left = Math.min(x1, x2);
              const top = Math.min(y1, y2);
              const width = isVertical ? 0 : Math.abs(x2 - x1);
              const height = isVertical ? Math.abs(y2 - y1) : 0;

              return (
                <div
                  key={`c-${idx}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: isVertical ? '0px' : `${width}px`,
                    height: isVertical ? `${height}px` : '0px',
                    borderLeft: isVertical ? '0.5px dashed #969696' : 'none',
                    borderTop: !isVertical ? '0.5px dashed #969696' : 'none',
                  }}
                />
              );
            })}
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
