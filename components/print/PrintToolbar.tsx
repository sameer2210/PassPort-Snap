import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { ToolbarState, ToolbarActions } from './types';

export interface PrintToolbarProps {
  readonly state: ToolbarState;
  readonly actions: ToolbarActions;
}

export const PrintToolbar: React.FC<PrintToolbarProps> = React.memo(({ state, actions }) => {
  const { isSinglePhotoMode, sheetSizeId, showCutlines, addBorder, paperSizes } = state;
  const {
    onSheetSizeIdChange,
    onShowCutlinesChange,
    onAddBorderChange,
    onAutoFill,
    onAddPhoto,
    onStartOver,
  } = actions;

  return (
    <>
      {!isSinglePhotoMode && (
        <>
          {/* Quick Actions */}
          <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
            <h3 className="font-semibold text-sm text-gray-700">Quick Actions</h3>
            <Button variant="default" className="w-full" onClick={onAutoFill}>
              <Plus className="w-4 h-4 mr-2" /> AutoFill Layout
            </Button>
          </div>

          {/* Layout Settings */}
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <h3 className="font-semibold text-sm text-gray-700">Layout Settings</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Paper Size</label>
              <select
                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={sheetSizeId}
                onChange={(e) => onSheetSizeIdChange(e.target.value)}
              >
                {paperSizes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCutlines}
                  onChange={(e) => onShowCutlinesChange(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Show Cutlines</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addBorder}
                  onChange={(e) => onAddBorderChange(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Add Border</span>
              </label>
            </div>
          </div>
        </>
      )}

      {/* Footer Controls */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onAddPhoto}>
          + Add Photo
        </Button>
        <Button
          variant="ghost"
          className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onStartOver}
        >
          Start Over
        </Button>
      </div>
    </>
  );
});

PrintToolbar.displayName = 'PrintToolbar';
