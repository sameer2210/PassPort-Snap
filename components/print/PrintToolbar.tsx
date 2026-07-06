import React from 'react';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/SectionCard';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { ActionGroup } from '@/components/ui/ActionGroup';
import { Plus, Settings2, Sparkles, RotateCcw, Trash2 } from 'lucide-react';
import type { ToolbarState, ToolbarActions } from './types';

export interface PrintToolbarProps {
  readonly state: ToolbarState;
  readonly actions: ToolbarActions;
}

export const PrintToolbar: React.FC<PrintToolbarProps> = React.memo(({ state, actions }) => {
  const { isSinglePhotoMode, sheetSizeId, showCutlines, paperSizes } = state;
  const {
    onSheetSizeIdChange,
    onShowCutlinesChange,
    onAutoFill,
    onAddPhoto,
    onReset,
    onClearWorkspace,
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
            className="border border-app-border"
          >
            <ActionGroup className="w-full">
              <Button
                className="w-full bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold h-9 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-120"
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
            className="border border-app-border"
          >
            <div className="space-y-1">
              <SettingsRow
                label="Paper Size"
                description="Target size for printing sheet"
                control={
                  <select
                    className="w-36 h-9 p-2 border border-brand-border rounded-xl text-xs font-semibold text-app-text-secondary bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all duration-150"
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
            </div>
          </SectionCard>
        </>
      )}

      {/* Footer Controls */}
      <ActionGroup className="w-full" equalWidth={true}>
        <Button
          variant="outline"
          className="h-9 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-app-text-secondary rounded-xl transition-all duration-120 cursor-pointer"
          onClick={onAddPhoto}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Another Photo
        </Button>
        <Button
          variant="outline"
          className="h-9 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-app-text-secondary rounded-xl transition-all duration-120 cursor-pointer"
          onClick={onReset}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
        <Button
          variant="outline"
          className="h-9 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-app-text-secondary rounded-xl transition-all duration-120 cursor-pointer"
          onClick={onClearWorkspace}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Clear Workspace
        </Button>
      </ActionGroup>
    </div>
  );
});

PrintToolbar.displayName = 'PrintToolbar';


