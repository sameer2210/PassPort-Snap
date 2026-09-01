import { PrintExportActions } from '@/components/print/PrintExportActions';
import { PrintHeader } from '@/components/print/PrintHeader';
import { PrintPhotoSelector } from '@/components/print/PrintPhotoSelector';
import { PrintPreviewCanvas } from '@/components/print/PrintPreviewCanvas';
import { PrintToolbar } from '@/components/print/PrintToolbar';
import { PreviewContainer } from '@/components/ui/PreviewContainer';
import { usePrintActions } from '@/hooks/usePrintActions';
import { usePrintPreview } from '@/hooks/usePrintPreview';
import { PaperRegistry, TemplateRegistry, PrintController } from '@/lib/print';
import { useAppStore } from '@/lib/store';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { PRINT_DEFAULTS } from '@/lib/constants/printDefaults';
import { buildReverseFilledSlots } from '@/lib/print/utils/slotAllocator';

export function Step5PrintSheet() {
  const {
    people,
    templateId,
    sheetSizeId,
    setSheetSizeId,
    updatePerson,
    customTemplateMm,
    resetEditor,
  } = useAppStore();

  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(people[0]?.id || null);
  const [showCutlines, setShowCutlines] = useState<boolean>(PRINT_DEFAULTS.defaultShowCutlines);
  const [isSinglePhotoMode, setIsSinglePhotoMode] = useState<boolean>(PRINT_DEFAULTS.defaultSinglePhotoMode);

  // Paper & template lookups
  const paper = PaperRegistry.get(sheetSizeId) || PaperRegistry.getAll()[0];
  const template = useMemo(() => {
    return TemplateRegistry.getTemplate(templateId, customTemplateMm);
  }, [templateId, customTemplateMm]);

  // Selected person synchronization
  useEffect(() => {
    if (!selectedPersonId && people.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPersonId(people[0].id);
    } else if (selectedPersonId && !people.find(p => p.id === selectedPersonId)) {
      setSelectedPersonId(people[0]?.id || null);
    }
  }, [people, selectedPersonId]);

  // Layout calculations (Heavy layout computation - memoized)
  const layoutResult = useMemo(() => {
    return PrintController.getLayout(paper, template);
  }, [paper, template]);

  const layout = layoutResult.success ? layoutResult.layout : null;
  const capacity = layout ? layout.capacity : 0;

  // Derive allSlots for multi-page export and previewSlots for Page 1 preview
  const allSlots = useMemo(() => {
    if (capacity <= 0) return [];
    const assignedIds: string[] = [];
    people.forEach((p) => {
      for (let i = 0; i < p.count; i++) {
        assignedIds.push(p.id);
      }
    });
    return buildReverseFilledSlots(assignedIds, capacity);
  }, [capacity, people]);

  const previewSlots = useMemo(() => {
    if (capacity <= 0) return [];
    const firstPage = allSlots.slice(0, capacity);
    while (firstPage.length < capacity) {
      firstPage.push(null);
    }
    return firstPage;
  }, [capacity, allSlots]);

  // Hook 1: Preview Scene & Dimension Calculations
  const { previewScene, previewDimensions } = usePrintPreview({
    paper,
    template,
    slots: previewSlots,
    settings: { showCutlines },
  });

  const { paperWidthPx, paperHeightPx } = previewDimensions;

  // Hook 2: Export and Slot interaction callbacks
  const {
    isGenerating,
    handleSlotClick,
    handleAutoFill,
    handleDownloadPdf,
    handlePrint,
    handleDownloadSingle,
  } = usePrintActions({
    paper,
    template,
    layout,
    slots: allSlots,
    people,
    selectedPersonId,
    showCutlines,
    updatePerson,
    isSinglePhotoMode,
  });

  // Action footer handlers
  const resetPrintSettings = useCallback(() => {
    setSheetSizeId(PRINT_DEFAULTS.defaultSheetSizeId);
    setShowCutlines(PRINT_DEFAULTS.defaultShowCutlines);
    setIsSinglePhotoMode(PRINT_DEFAULTS.defaultSinglePhotoMode);
    people.forEach((p) => {
      updatePerson(p.id, { count: PRINT_DEFAULTS.defaultPhotoCount });
    });
  }, [people, setSheetSizeId, setShowCutlines, setIsSinglePhotoMode, updatePerson]);

  const handleAddPhoto = useCallback(() => {
    const { setActivePersonId, setStep } = useAppStore.getState();
    setActivePersonId('');
    setStep(2);
  }, []);

  const handleDeletePerson = useCallback((id: string) => {
    const { removePerson } = useAppStore.getState();
    removePerson(id);
  }, []);

  const handleClearWorkspace = useCallback(() => {
    resetEditor();
  }, [resetEditor]);

  const handleSelectPerson = useCallback((id: string) => {
    setSelectedPersonId(id);
  }, []);

  const totalPhotosPlaced = allSlots.filter(Boolean).length;

  // Group props for clean interfaces
  const toolbarState = {
    isSinglePhotoMode,
    sheetSizeId,
    showCutlines,
    paperSizes: PaperRegistry.getAll(),
  };

  const toolbarActions = {
    onSheetSizeIdChange: setSheetSizeId,
    onShowCutlinesChange: setShowCutlines,
    onAutoFill: handleAutoFill,
    onAddPhoto: handleAddPhoto,
    onReset: resetPrintSettings,
    onClearWorkspace: handleClearWorkspace,
  };

  const exportState = {
    isSinglePhotoMode,
    isGenerating,
    totalPhotosPlaced,
    capacity,
    selectedPersonId,
  };

  const exportActions = {
    onDownloadPdf: handleDownloadPdf,
    onPrint: handlePrint,
    onDownloadSingle: handleDownloadSingle,
  };

  const previewState = {
    isSinglePhotoMode,
    previewLayout: previewScene,
    layout,
    template,
    slots: previewSlots,
    people,
    selectedPersonId,
    showCutlines,
    paperWidthPx,
    paperHeightPx,
  };

  const previewActions = {
    onSlotClick: handleSlotClick,
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 py-2">
      <div className="space-y-2 text-center md:text-left select-none">
        <h2 className="text-2xl font-bold text-app-text-primary tracking-tight">Print Dashboard</h2>
        <p className="text-sm text-app-text-secondary max-w-lg">
          Configure sheet options, layout guidelines, and export as print-ready PDF or high quality
          PNG.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left Control Sidebar */}
        <div className="flex-1 min-h-[550px] flex flex-col items-stretch">
          <PreviewContainer
            title="Tiled Layout Canvas"
            toolbar={<PrintExportActions state={exportState} actions={exportActions} />}
            footer={<PrintHeader state={exportState} />}
            aspectRatio=""
            className="flex-1 h-full w-full select-none"
            loading={isGenerating}
          >
            <PrintPreviewCanvas state={previewState} actions={previewActions} />
          </PreviewContainer>
        </div>

        {/* Right Main Preview & Actions Workspace */}
        <div className="w-full lg:w-110 flex flex-col space-y-5">
          {/* Tab Selector inside custom premium container */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center select-none">
            <button
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl text-center transition-all duration-150 focus:outline-none cursor-pointer
                ${
                  !isSinglePhotoMode
                    ? 'bg-white text-app-text-primary shadow-sm'
                    : 'text-app-text-secondary hover:text-app-text-primary'
                }`}
              onClick={() => setIsSinglePhotoMode(false)}
            >
              Print Grid Sheet
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl text-center transition-all duration-150 focus:outline-none cursor-pointer
                ${
                  isSinglePhotoMode
                    ? 'bg-white text-app-text-primary shadow-sm'
                    : 'text-app-text-secondary hover:text-app-text-primary'
                }`}
              onClick={() => setIsSinglePhotoMode(true)}
            >
              Single Photo (Online)
            </button>
          </div>

          <div className="space-y-5 flex-1">
            <PrintToolbar state={toolbarState} actions={toolbarActions} />
            <PrintPhotoSelector
              people={people}
              selectedPersonId={selectedPersonId}
              slots={allSlots}
              isSinglePhotoMode={isSinglePhotoMode}
              onSelectPerson={handleSelectPerson}
              onDeletePerson={handleDeletePerson}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Step5PrintSheet;

