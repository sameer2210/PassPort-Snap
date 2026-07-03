import React from 'react';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/SectionCard';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { ActionGroup } from '@/components/ui/ActionGroup';
import { Plus, Settings2, Sparkles, Trash2 } from 'lucide-react';
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
    <div className="space-y-4 select-none">
      {!isSinglePhotoMode && (
        <>
          {/* Quick Actions */}
          <SectionCard
            title="Quick Autofill"
            subtitle="Fill all layout slots with selected photo"
            icon={<Sparkles className="w-4 h-4 text-brand-primary" />}
            className="border border-[#0b1e3a]/8"
          >
            <ActionGroup className="w-full">
              <Button 
                className="w-full bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold h-9 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-120"
                onClick={onAutoFill}
              >
                <Plus className="w-3.5 h-3.5" />
                AutoFill Grid
              </Button>
            </ActionGroup>
          </SectionCard>

          {/* Layout Settings */}
          <SectionCard
            title="Layout Settings"
            subtitle="Configure dimensions & border helpers"
            icon={<Settings2 className="w-4 h-4 text-brand-primary" />}
            className="border border-[#0b1e3a]/8"
          >
            <div className="space-y-1">
              <SettingsRow
                label="Paper Size"
                description="Target size for printing sheet"
                control={
                  <select
                    className="w-36 h-9 p-2 border border-brand-border rounded-lg text-xs font-semibold text-gray-700 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all duration-150"
                    value={sheetSizeId}
                    onChange={(e) => onSheetSizeIdChange(e.target.value)}
                  >
                    {paperSizes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                }
              />

              <SettingsRow
                label="Show Cutlines"
                description="Add dashed guidelines for scissors"
                control={
                  <input
                    type="checkbox"
                    checked={showCutlines}
                    onChange={(e) => onShowCutlinesChange(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary cursor-pointer accent-brand-primary"
                  />
                }
              />

              <SettingsRow
                label="Add Borders"
                description="Draw solid outline around each photo"
                control={
                  <input
                    type="checkbox"
                    checked={addBorder}
                    onChange={(e) => onAddBorderChange(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary cursor-pointer accent-brand-primary"
                  />
                }
              />
            </div>
          </SectionCard>
        </>
      )}

      {/* Footer Controls */}
      <ActionGroup className="w-full">
        <Button 
          variant="outline" 
          className="flex-1 h-9 text-xs font-semibold border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-120" 
          onClick={onAddPhoto}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Another Photo
        </Button>
        <Button
          variant="ghost"
          className="h-9 px-3 text-xs font-semibold text-brand-danger hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all duration-120"
          onClick={onStartOver}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </ActionGroup>
    </div>
  );
});

PrintToolbar.displayName = 'PrintToolbar';
