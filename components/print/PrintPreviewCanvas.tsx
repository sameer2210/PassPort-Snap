/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect } from 'react';
import { UnitConverter, DpiProfile } from '@/lib/print';
import { PrintPreviewSlot } from './PrintPreviewSlot';
import type { PreviewState, PreviewActions } from './types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Image as ImageIcon } from 'lucide-react';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // ResizeObserver to calculate dynamic scale factor based on layout dimensions
  useEffect(() => {
    if (isSinglePhotoMode || !containerRef.current || paperWidthPx <= 0 || paperHeightPx <= 0) {
      return;
    }

    const element = containerRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const padding = 24; // Padding around sheet preview
        
        const scaleW = (width - padding) / paperWidthPx;
        const scaleH = (height - padding) / paperHeightPx;
        
        // Find min scale to fit container without overflowing
        const newScale = Math.min(scaleW, scaleH);
        // Floor at 0.15, ceiling at 1.0 (to avoid blurring elements)
        setScale(Math.max(0.15, Math.min(newScale, 1.0)));
      }
    });

    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    };
  }, [paperWidthPx, paperHeightPx, isSinglePhotoMode]);

  return (
    <div 
      ref={containerRef} 
      className="flex-1 w-full h-full flex items-center justify-center overflow-hidden min-h-[460px] relative"
    >
      {!isSinglePhotoMode ? (
        previewLayout && (
          <div
            className="bg-white shadow-md shadow-black/5 border border-app-border relative transition-all duration-150 flex-shrink-0"
            style={{
              width: `${paperWidthPx}px`,
              height: `${paperHeightPx}px`,
              transform: `scale(${scale})`,
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
                    borderLeft: isVertical ? '0.5px dashed #9ca3af' : 'none',
                    borderTop: !isVertical ? '0.5px dashed #9ca3af' : 'none',
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
              <div className="bg-white p-5 rounded-2xl shadow-md border border-app-border flex flex-col items-center gap-4 select-none max-w-sm">
                <div
                  className="border border-slate-200 shadow-inner bg-slate-50 flex items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    width: `${w * 3}px`,
                    height: `${h * 3}px`,
                  }}
                >
                  <img
                    src={photoSrc}
                    className="w-full h-full object-cover"
                    alt={`Preview of passport photo aligned to template ${template.label}`}
                    decoding="async"
                    loading="eager"
                  />
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest leading-none">Export size</span>
                  <StatusBadge variant="info" icon={<ImageIcon className="w-3.5 h-3.5" />}>
                    {template.label} ({template.widthMm}x{template.heightMm}mm)
                  </StatusBadge>
                </div>
              </div>
            );
          })()
        )
      )}
    </div>
  );
});

PrintPreviewCanvas.displayName = 'PrintPreviewCanvas';
export default PrintPreviewCanvas;


