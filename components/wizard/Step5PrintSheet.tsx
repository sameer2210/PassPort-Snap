import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { PaperRegistry, TemplateRegistry } from '@/lib/print';
import { PrintHeader } from '@/components/print/PrintHeader';
import { PrintToolbar } from '@/components/print/PrintToolbar';
import { PrintExportActions } from '@/components/print/PrintExportActions';
import { PrintPreviewCanvas } from '@/components/print/PrintPreviewCanvas';
import { PrintPhotoSelector } from '@/components/print/PrintPhotoSelector';
import { usePrintPreview } from '@/hooks/usePrintPreview';
import { usePrintActions } from '@/hooks/usePrintActions';

export function Step5PrintSheet() {
  const {
    people,
    templateId,
    sheetSizeId,
    setSheetSizeId,
    updatePerson,
    customTemplateMm,
  } = useAppStore();

  const [isSinglePhotoMode, setIsSinglePhotoMode] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(people[0]?.id || null);
  const [showCutlines, setShowCutlines] = useState(false);
  const [addBorder, setAddBorder] = useState(false);
  const [slots, setSlots] = useState<Array<string | null>>([]);

  // Paper & template lookups (simple lookups - no useMemo as per rules)
  const paper = PaperRegistry.get(sheetSizeId) || PaperRegistry.getAll()[0];
  const baseTemplate = TemplateRegistry.get(templateId) || TemplateRegistry.getAll()[0];
  const template =
    templateId === 'custom'
      ? {
          id: 'custom',
          label: 'Custom Size',
          widthMm: customTemplateMm.widthMm,
          heightMm: customTemplateMm.heightMm,
          printWidthPx: Math.round((customTemplateMm.widthMm / 25.4) * 300),
          printHeightPx: Math.round((customTemplateMm.heightMm / 25.4) * 300),
          countries: 'Custom',
        }
      : baseTemplate;

  // Selected person synchronization
  useEffect(() => {
    if (!selectedPersonId && people.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPersonId(people[0].id);
    } else if (selectedPersonId && !people.find((p) => p.id === selectedPersonId)) {
      setSelectedPersonId(people[0]?.id || null);
    }
  }, [people, selectedPersonId]);

  // Hook 1: Preview Scene & Dimension Calculations
  const { previewScene, previewDimensions } = usePrintPreview({
    paper,
    template,
    slots,
    settings: { addBorder, showCutlines },
  });

  const { capacity, layout, paperWidthPx, paperHeightPx } = previewDimensions;

  // Sync slots capacity with layout changes
  useEffect(() => {
    if (capacity <= 0) return;
    const newSlots = Array(capacity).fill(null);
    let currentIndex = 0;
    people.forEach((p) => {
      for (let i = 0; i < p.count; i++) {
        if (currentIndex < capacity) {
          newSlots[currentIndex] = p.id;
          currentIndex++;
        }
      }
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlots(newSlots);
  }, [capacity, people]);

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
    slots,
    setSlots,
    people,
    selectedPersonId,
    addBorder,
    showCutlines,
    updatePerson,
  });

  // Action footer handlers (passed to memoized toolbar)
  const handleAddPhoto = useCallback(() => {
    const { setActivePersonId, setStep } = useAppStore.getState();
    setActivePersonId('');
    setStep(2);
  }, []);

  const handleStartOver = useCallback(() => {
    if (window.confirm('Start over with a new photo? This will clear all current photos.')) {
      const { resetStore } = useAppStore.getState();
      if (resetStore) {
        resetStore();
      } else {
        useAppStore.setState({ people: [], activePersonId: null, step: 1 });
      }
    }
  }, []);

  const handleSelectPerson = useCallback((id: string) => {
    setSelectedPersonId(id);
  }, []);

  const totalPhotosPlaced = slots.filter(Boolean).length;

  // Group props for clean interfaces (Avoid passing 20 individual props)
  const toolbarState = {
    isSinglePhotoMode,
    sheetSizeId,
    showCutlines,
    addBorder,
    paperSizes: PaperRegistry.getAll(),
  };

  const toolbarActions = {
    onSheetSizeIdChange: setSheetSizeId,
    onShowCutlinesChange: setShowCutlines,
    onAddBorderChange: setAddBorder,
    onAutoFill: handleAutoFill,
    onAddPhoto: handleAddPhoto,
    onStartOver: handleStartOver,
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
    slots,
    people,
    selectedPersonId,
    addBorder,
    showCutlines,
    paperWidthPx,
    paperHeightPx,
  };

  const previewActions = {
    onSlotClick: handleSlotClick,
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-8 items-stretch">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 flex flex-col space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Settings & Preview</h2>
          <p className="text-sm text-gray-500">Configure your output mode and layout.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              !isSinglePhotoMode
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setIsSinglePhotoMode(false)}
          >
            Print Grid Sheet
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              isSinglePhotoMode
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setIsSinglePhotoMode(true)}
          >
            Single Photo (Online)
          </button>
        </div>

        <div className="space-y-6 flex-1">
          <PrintToolbar state={toolbarState} actions={toolbarActions} />
          <PrintPhotoSelector
            people={people}
            selectedPersonId={selectedPersonId}
            slots={slots}
            isSinglePhotoMode={isSinglePhotoMode}
            onSelectPerson={handleSelectPerson}
          />
        </div>
      </div>

      {/* Main Preview & Action Panel */}
      <div className="flex-1 bg-gray-200/60 rounded-xl p-8 flex flex-col items-center justify-center min-h-[650px] overflow-hidden border shadow-inner">
        <div className="w-full flex justify-between items-center mb-6">
          <PrintHeader state={exportState} />
          <PrintExportActions state={exportState} actions={exportActions} />
        </div>
        <PrintPreviewCanvas state={previewState} actions={previewActions} />
      </div>
    </div>
  );
}
