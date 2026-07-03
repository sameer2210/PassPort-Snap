import { PrintExportActions } from '@/components/print/PrintExportActions';
import { PrintHeader } from '@/components/print/PrintHeader';
import { PrintPhotoSelector } from '@/components/print/PrintPhotoSelector';
import { PrintPreviewCanvas } from '@/components/print/PrintPreviewCanvas';
import { PrintToolbar } from '@/components/print/PrintToolbar';
import { PreviewContainer } from '@/components/ui/PreviewContainer';
import { usePrintActions } from '@/hooks/usePrintActions';
import { usePrintPreview } from '@/hooks/usePrintPreview';
import { DpiProfile, PaperRegistry, TemplateRegistry } from '@/lib/print';
import { useAppStore } from '@/lib/store';
import { useCallback, useEffect, useState, useRef } from 'react';
import { PRINT_DEFAULTS } from '@/lib/constants/printDefaults';
import { processUploadedFile } from '@/lib/image/uploadHelper';

export function Step5PrintSheet() {
  const { people, templateId, sheetSizeId, setSheetSizeId, updatePerson, customTemplateMm } =
    useAppStore();

  const [isSinglePhotoMode, setIsSinglePhotoMode] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(people[0]?.id || null);
  const [showCutlines, setShowCutlines] = useState(false);
  const [slots, setSlots] = useState<Array<string | null>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paper & template lookups
  const paper = PaperRegistry.get(sheetSizeId) || PaperRegistry.getAll()[0];
  const baseTemplate = TemplateRegistry.get(templateId) || TemplateRegistry.getAll()[0];
  const template =
    templateId === 'custom'
      ? {
          id: 'custom',
          label: 'Custom Size',
          widthMm: customTemplateMm.widthMm,
          heightMm: customTemplateMm.heightMm,
          printWidthPx: Math.round((customTemplateMm.widthMm / 25.4) * DpiProfile.Print300),
          printHeightPx: Math.round((customTemplateMm.heightMm / 25.4) * DpiProfile.Print300),
          countries: 'Custom',
        }
      : baseTemplate;

  // Selected person synchronization
  useEffect(() => {
    if (!selectedPersonId && people.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPersonId(people[0].id);
    } else if (selectedPersonId && !people.find(p => p.id === selectedPersonId)) {
      setSelectedPersonId(people[0]?.id || null);
    }
  }, [people, selectedPersonId]);

  // Hook 1: Preview Scene & Dimension Calculations
  const { previewScene, previewDimensions } = usePrintPreview({
    paper,
    template,
    slots,
    settings: { showCutlines },
  });

  const { capacity, layout, paperWidthPx, paperHeightPx } = previewDimensions;

  // Sync slots capacity with layout changes
  useEffect(() => {
    if (capacity <= 0) return;
    const newSlots = Array(capacity).fill(null);
    let currentIndex = 0;
    people.forEach(p => {
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
    showCutlines,
    updatePerson,
  });

  // Action footer handlers
  const resetPrintSettings = useCallback(() => {
    setSheetSizeId(PRINT_DEFAULTS.defaultSheetSizeId);
    setShowCutlines(PRINT_DEFAULTS.defaultShowCutlines);
    setIsSinglePhotoMode(PRINT_DEFAULTS.defaultSinglePhotoMode);
    people.forEach((p) => {
      updatePerson(p.id, { count: PRINT_DEFAULTS.defaultPhotoCount });
    });
  }, [people, setSheetSizeId, updatePerson]);

  const handleAddPhoto = useCallback(() => {
    const { setActivePersonId, setStep } = useAppStore.getState();
    setActivePersonId('');
    setStep(2);
  }, []);

  const handleDeletePerson = useCallback((id: string) => {
    const { removePerson } = useAppStore.getState();
    removePerson(id);
  }, []);

  const handleNewImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        const file = files[0];
        const { highResPhotoUrl, previewPhotoUrl } = await processUploadedFile(file);
        const newPersonId = Math.random().toString(36).substring(7);

        const { addPerson } = useAppStore.getState();
        addPerson(newPersonId, previewPhotoUrl, highResPhotoUrl);
      } catch (err) {
        console.error(err);
        alert('Failed to process image file.');
      }
    }
  }, []);

  const handleTriggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, []);

  const handleSelectPerson = useCallback((id: string) => {
    setSelectedPersonId(id);
  }, []);

  const totalPhotosPlaced = slots.filter(Boolean).length;

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
    onNewImage: handleTriggerFileInput,
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
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Print Dashboard</h2>
        <p className="text-sm text-gray-500 max-w-lg">
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
          <div className="bg-gray-100 p-1 rounded-xl flex items-center select-none">
            <button
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center transition-all duration-150 focus:outline-none cursor-pointer
                ${
                  !isSinglePhotoMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              onClick={() => setIsSinglePhotoMode(false)}
            >
              Print Grid Sheet
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center transition-all duration-150 focus:outline-none cursor-pointer
                ${
                  isSinglePhotoMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
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
              slots={slots}
              isSinglePhotoMode={isSinglePhotoMode}
              onSelectPerson={handleSelectPerson}
              onDeletePerson={handleDeletePerson}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              className="hidden"
              onChange={handleNewImageUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Step5PrintSheet;
