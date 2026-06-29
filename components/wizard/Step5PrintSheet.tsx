/* eslint-disable @next/next/no-img-element */
import { Button } from '@/components/ui/button';
import { sheetSizes, templates } from '@/lib/config';
import { cleanupSessions } from '@/lib/storage';
import { useAppStore } from '@/lib/store';
import { jsPDF } from 'jspdf';
import { Download, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export function Step5PrintSheet() {
  const { people, templateId, sheetSizeId, setSheetSizeId, updatePerson, customTemplateMm } = useAppStore();
  const baseTemplate = templates.find(t => t.id === templateId) || templates[0];
  const template = useMemo(() => {
    return templateId === 'custom'
      ? {
          id: 'custom',
          label: 'Custom Size',
          widthMm: customTemplateMm.widthMm,
          heightMm: customTemplateMm.heightMm,
          printWidthPx: Math.round((customTemplateMm.widthMm / 25.4) * 300),
          printHeightPx: Math.round((customTemplateMm.heightMm / 25.4) * 300),
          countries: 'Custom'
        }
      : baseTemplate;
  }, [templateId, customTemplateMm, baseTemplate]);

  const sheet = sheetSizes.find(s => s.id === sheetSizeId) || sheetSizes[0];

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(people[0]?.id || null);

  // New layout settings
  const [isAutoCenter, setIsAutoCenter] = useState(true);
  const [showCutlines, setShowCutlines] = useState(false);
  const [addBorder, setAddBorder] = useState(false);

  useEffect(() => {
    if (!selectedPersonId && people.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPersonId(people[0].id);
    } else if (selectedPersonId && !people.find(p => p.id === selectedPersonId)) {
      setSelectedPersonId(people[0]?.id || null);
    }
  }, [people, selectedPersonId]);

  const gridConfig = useMemo(() => {
    let orientation = sheet.widthMm > sheet.heightMm ? 'landscape' : 'portrait';
    let cols = 0;
    let rows = 0;
    let gutterMm = 2; // Gutter 2mm

    // Hardcode specific user requests for Indian Passport Size (35x45mm)
    if (template.widthMm === 35 && template.heightMm === 45) {
      if (sheet.id === '4x6') {
        cols = 2;
        rows = 4;
        orientation = 'portrait';
        gutterMm = 3;
      } else if (sheet.id === '5x7') {
        cols = 3;
        rows = 5;
        orientation = 'portrait';
        gutterMm = 2;
      } else if (sheet.id === 'A4') {
        cols = 6;
        rows = 6;
        orientation = 'portrait';
        gutterMm = 3;
      }
    }

    const marginMm = 4;

    if (!cols || !rows) {
      const usableWidthMm = orientation === 'landscape' ? Math.max(sheet.widthMm, sheet.heightMm) - (marginMm * 2) : Math.min(sheet.widthMm, sheet.heightMm) - (marginMm * 2);
      const usableHeightMm = orientation === 'landscape' ? Math.min(sheet.widthMm, sheet.heightMm) - (marginMm * 2) : Math.max(sheet.widthMm, sheet.heightMm) - (marginMm * 2);

      cols = Math.floor((usableWidthMm + gutterMm) / (template.widthMm + gutterMm));
      rows = Math.floor((usableHeightMm + gutterMm) / (template.heightMm + gutterMm));
    }

    let paperWidth = orientation === 'landscape' ? Math.max(sheet.widthMm, sheet.heightMm) : Math.min(sheet.widthMm, sheet.heightMm);
    let paperHeight = orientation === 'landscape' ? Math.min(sheet.widthMm, sheet.heightMm) : Math.max(sheet.widthMm, sheet.heightMm);

    // Center grid on paper
    const totalGridWidth = (cols * template.widthMm) + ((cols - 1) * gutterMm);
    const totalGridHeight = (rows * template.heightMm) + ((rows - 1) * gutterMm);

    // Ensure paper visually stretches to contain grid if it exceeds physical dimensions
    paperWidth = Math.max(paperWidth, totalGridWidth + marginMm * 2);
    paperHeight = Math.max(paperHeight, totalGridHeight + marginMm * 2);

    const startX = isAutoCenter ? Math.max(0, (paperWidth - totalGridWidth) / 2) : marginMm;
    const startY = isAutoCenter ? Math.max(0, (paperHeight - totalGridHeight) / 2) : marginMm;

    return { cols, rows, capacity: cols * rows, orientation, gutterMm, startX, startY, paperWidth, paperHeight };
  }, [sheet, template, isAutoCenter]);

  const [slots, setSlots] = useState<Array<string | null>>([]);

  useEffect(() => {
    // Initialize slots with current people counts
    const newSlots = Array(gridConfig.capacity).fill(null);
    let currentIndex = 0;
    people.forEach(p => {
      for (let i = 0; i < p.count; i++) {
        if (currentIndex < gridConfig.capacity) {
          newSlots[currentIndex] = p.id;
          currentIndex++;
        }
      }
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlots(newSlots);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridConfig.capacity, people.length]); // Intentionally not dependent on people counts so manual edits aren't wiped out continuously

  const handleSlotClick = (index: number) => {
    const newSlots = [...slots];
    if (newSlots[index]) {
      newSlots[index] = null; // Remove photo
    } else if (selectedPersonId) {
      newSlots[index] = selectedPersonId; // Add photo
    }
    setSlots(newSlots);

    // Sync counts back to store
    people.forEach(p => {
      const count = newSlots.filter(s => s === p.id).length;
      if (p.count !== count) updatePerson(p.id, { count });
    });
  };

  const handleAutoFill = () => {
    if (!selectedPersonId) return;
    const newSlots = [...slots];
    for (let i = 0; i < newSlots.length; i++) {
      if (!newSlots[i]) newSlots[i] = selectedPersonId;
    }
    setSlots(newSlots);

    // Sync counts
    people.forEach(p => {
      const count = newSlots.filter(s => s === p.id).length;
      if (p.count !== count) updatePerson(p.id, { count });
    });
  };

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: gridConfig.orientation as 'landscape' | 'portrait',
        unit: 'mm',
        format: [gridConfig.paperWidth, gridConfig.paperHeight]
      });

      // Map of loaded images
      const loadedImages: Record<string, HTMLImageElement> = {};

      for (const person of people) {
        const urlToUse = person.highResFinalUrl || person.finalPhotoUrl;
        if (!urlToUse) continue;
        const img = new Image();
        img.src = urlToUse;
        await new Promise(resolve => { img.onload = resolve; });
        loadedImages[person.id] = img;
      }

      let currentIndex = 0;
      for (let row = 0; row < gridConfig.rows; row++) {
        for (let col = 0; col < gridConfig.cols; col++) {
          const personId = slots[currentIndex];
          const currentX = gridConfig.startX + (col * (template.widthMm + gridConfig.gutterMm));
          const currentY = gridConfig.startY + (row * (template.heightMm + gridConfig.gutterMm));

          if (personId && loadedImages[personId]) {
            doc.addImage(loadedImages[personId], 'JPEG', currentX, currentY, template.widthMm, template.heightMm);
          }

          if (addBorder && personId) {
            doc.setDrawColor(0);
            doc.setLineWidth(0.2);
            doc.rect(currentX, currentY, template.widthMm, template.heightMm);
          }


          currentIndex++;
        }
      }

      if (showCutlines && gridConfig.rows > 0 && gridConfig.cols > 0) {
        doc.setDrawColor(150);
        ((doc as unknown) as { setLineDash: (dashArray: number[], start: number) => void }).setLineDash([1, 1], 0);
        doc.setLineWidth(0.2);

        const totalGridW = gridConfig.cols * template.widthMm + (gridConfig.cols - 1) * gridConfig.gutterMm;
        const totalGridH = gridConfig.rows * template.heightMm + (gridConfig.rows - 1) * gridConfig.gutterMm;

        // Vertical Lines (Inner gaps only)
        for (let c = 1; c < gridConfig.cols; c++) {
          const x = gridConfig.startX + c * template.widthMm + c * gridConfig.gutterMm - gridConfig.gutterMm / 2;
          doc.line(x, gridConfig.startY, x, gridConfig.startY + totalGridH);
        }

        // Horizontal Lines (Inner gaps only)
        for (let r = 1; r < gridConfig.rows; r++) {
          const y = gridConfig.startY + r * template.heightMm + r * gridConfig.gutterMm - gridConfig.gutterMm / 2;
          doc.line(gridConfig.startX, y, gridConfig.startX + totalGridW, y);
        }
        ((doc as unknown) as { setLineDash: (dashArray: number[]) => void }).setLineDash([]); // Reset dash
      }

      doc.save(`passport-photos-${sheet.id}.pdf`);

      // Cleanup IndexDB sessions but preserve in-memory high-res image Blob URLs
      await cleanupSessions();
    } catch (err) {
      console.error(err);
      alert('Something went wrong making the PDF. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalPhotosNeeded = slots.filter(Boolean).length;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-8 items-stretch">
      <div className="w-full lg:w-96 flex flex-col space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Settings & Preview</h2>
          <p className="text-sm text-gray-500">Configure your print layout.</p>
        </div>

        <div className="space-y-6 flex-1">
          {/* Quick Actions */}
          <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
            <h3 className="font-semibold text-sm text-gray-700">Quick Actions</h3>
            <Button variant="default" className="w-full" onClick={handleAutoFill}>
              <Plus className="w-4 h-4 mr-2" /> AutoFix Layout
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
                onChange={(e) => setSheetSizeId(e.target.value)}
              >
                {sheetSizes.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoCenter}
                  onChange={(e) => setIsAutoCenter(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Auto-Center</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCutlines}
                  onChange={(e) => setShowCutlines(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Show Cutlines</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addBorder}
                  onChange={(e) => setAddBorder(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Add Border</span>
              </label>
            </div>
          </div>

          {/* Select Photo Component */}
          <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
            <h3 className="font-semibold text-sm text-gray-700">Select Photo to Place</h3>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
              {people.map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border-2 transition-all ${selectedPersonId === p.id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-gray-50'}`}
                  onClick={() => setSelectedPersonId(p.id)}
                >
                  <div className="flex items-center gap-3">
                    {p.finalPhotoUrl && <img src={p.finalPhotoUrl} className="w-10 h-10 object-cover rounded shadow-sm" alt="Person" />}
                    <span className="font-medium text-sm">Photo {idx + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{slots.filter(s => s === p.id).length}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      title="Download individual photo"
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement('a');
                        link.href = p.highResFinalUrl || p.finalPhotoUrl || p.croppedPhotoUrl || '';
                        link.download = `passport-photo-${idx + 1}.jpg`;
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => {
              const { setActivePersonId, setStep } = useAppStore.getState();
              setActivePersonId('');
              setStep(2);
            }}>+ Add Photo</Button>
            <Button variant="ghost" className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => {
              if (window.confirm("Start over with a new photo? This will clear all current photos.")) {
                const { resetStore } = useAppStore.getState();
                if (resetStore) {
                  resetStore();
                } else {
                  useAppStore.setState({ people: [], activePersonId: null, step: 1 });
                }
              }
            }}>Start Over</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-200/60 rounded-xl p-8 flex flex-col items-center justify-center min-h-[650px] overflow-hidden border shadow-inner">
        <div className="w-full flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-700">Print Preview</h3>
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-gray-500">
              {totalPhotosNeeded} / {gridConfig.capacity} Used
            </p>
            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isGenerating || totalPhotosNeeded === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              Print
            </Button>
          </div>
        </div>

        {/* Dynamic Interactive Preview Container */}
        <div className="flex-1 w-full flex items-center justify-center">
          <div
            className="bg-white shadow-2xl relative transition-all"
            style={{
              width: `${gridConfig.paperWidth}px`,
              height: `${gridConfig.paperHeight}px`,
              // Make the paper visually much bigger inside the flex container
              transform: `scale(2.5)`,
              transformOrigin: 'center'
            }}
          >
            {/* Real CSS grid of photos */}
            <div
              className="absolute"
              style={{
                left: `${gridConfig.startX}px`,
                top: `${gridConfig.startY}px`,
                display: 'grid',
                gridTemplateColumns: `repeat(${gridConfig.cols}, ${template.widthMm}px)`,
                gridTemplateRows: `repeat(${gridConfig.rows}, ${template.heightMm}px)`,
                gap: `${gridConfig.gutterMm}px`
              }}
            >
              {slots.map((personId, i) => {
                const person = people.find(p => p.id === personId);
                let borderClasses = '';
                if (addBorder) borderClasses += ' border-2 border-solid border-black ';

                return (
                  <div
                    key={i}
                    onClick={() => handleSlotClick(i)}
                    className={`relative cursor-pointer transition-colors overflow-hidden ${borderClasses} ${personId ? 'bg-white shadow-sm' : 'bg-gray-100/50 hover:bg-gray-200'}`}
                    style={{
                      width: `${template.widthMm}px`,
                      height: `${template.heightMm}px`,
                      boxSizing: 'border-box'
                    }}
                  >
                    {person && (person.finalPhotoUrl || person.croppedPhotoUrl || person.previewPhotoUrl) ? (
                      <img
                        src={person.finalPhotoUrl || person.croppedPhotoUrl || person.previewPhotoUrl || ''}
                        className="w-full h-full object-cover pointer-events-none"
                        alt={`Slot ${i}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
                        <Plus className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cutlines Overlay */}
            {showCutlines && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Vertical Lines */}
                {Array.from({ length: Math.max(0, gridConfig.cols - 1) }).map((_, c) => {
                  const x = gridConfig.startX + (c + 1) * template.widthMm + (c + 1) * gridConfig.gutterMm - gridConfig.gutterMm / 2;
                  const totalH = gridConfig.rows * template.heightMm + (gridConfig.rows - 1) * gridConfig.gutterMm;
                  return (
                    <div 
                      key={`v-${c}`} 
                      className="absolute border-l border-dashed border-gray-400" 
                      style={{ 
                        left: `${x}px`, 
                        top: `${gridConfig.startY}px`, 
                        height: `${totalH}px`,
                        borderWidth: '1px' 
                      }} 
                    />
                  );
                })}
                {/* Horizontal Lines */}
                {Array.from({ length: Math.max(0, gridConfig.rows - 1) }).map((_, r) => {
                  const y = gridConfig.startY + (r + 1) * template.heightMm + (r + 1) * gridConfig.gutterMm - gridConfig.gutterMm / 2;
                  const totalW = gridConfig.cols * template.widthMm + (gridConfig.cols - 1) * gridConfig.gutterMm;
                  return (
                    <div 
                      key={`h-${r}`} 
                      className="absolute border-t border-dashed border-gray-400" 
                      style={{ 
                        top: `${y}px`, 
                        left: `${gridConfig.startX}px`, 
                        width: `${totalW}px`,
                        borderWidth: '1px' 
                      }} 
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
