/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import { templates, sheetSizes } from '@/lib/config';
import { cleanupSessions } from '@/lib/storage';
import { Download, Plus } from 'lucide-react';

export function Step5PrintSheet() {
  const { people, templateId, sheetSizeId, setSheetSizeId, updatePerson } = useAppStore();
  const template = templates.find(t => t.id === templateId) || templates[0];
  const sheet = sheetSizes.find(s => s.id === sheetSizeId) || sheetSizes[0];

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(people[0]?.id || null);

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
        cols = 4;
        rows = 2;
        orientation = 'landscape';
        gutterMm = 3;
      } else if (sheet.id === '5x7') {
        cols = 5;
        rows = 3;
        orientation = 'landscape';
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

    const paperWidth = orientation === 'landscape' ? Math.max(sheet.widthMm, sheet.heightMm) : Math.min(sheet.widthMm, sheet.heightMm);
    const paperHeight = orientation === 'landscape' ? Math.min(sheet.widthMm, sheet.heightMm) : Math.max(sheet.widthMm, sheet.heightMm);

    // Center grid on paper
    const totalGridWidth = (cols * template.widthMm) + ((cols - 1) * gutterMm);
    const totalGridHeight = (rows * template.heightMm) + ((rows - 1) * gutterMm);
    
    const startX = Math.max(0, (paperWidth - totalGridWidth) / 2);
    const startY = Math.max(0, (paperHeight - totalGridHeight) / 2);

    return { cols, rows, capacity: cols * rows, orientation, gutterMm, startX, startY, paperWidth, paperHeight };
  }, [sheet, template]);

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
          if (personId && loadedImages[personId]) {
            const currentX = gridConfig.startX + (col * (template.widthMm + gridConfig.gutterMm));
            const currentY = gridConfig.startY + (row * (template.heightMm + gridConfig.gutterMm));
            doc.addImage(loadedImages[personId], 'JPEG', currentX, currentY, template.widthMm, template.heightMm);
          }
          currentIndex++;
        }
      }

      doc.save(`passport-photos-${sheet.id}.pdf`);
      
      // Cleanup
      await cleanupSessions();
      people.forEach(p => {
        if (p.highResPhotoUrl || p.highResFinalUrl) {
          updatePerson(p.id, { highResPhotoUrl: null, highResFinalUrl: null });
        }
      });
    } catch (err) {
      console.error(err);
      alert('Something went wrong making the PDF. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalPhotosNeeded = slots.filter(Boolean).length;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-80 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Print Sheet</h2>
          <p className="text-sm text-gray-500">Configure your print layout.</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {sheetSizes.map(s => (
              <button
                key={s.id}
                onClick={() => setSheetSizeId(s.id)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${sheetSizeId === s.id ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Select Photo to Place:</h3>
            {people.map((p, idx) => (
              <div 
                key={p.id} 
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border-2 transition-all ${selectedPersonId === p.id ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                onClick={() => setSelectedPersonId(p.id)}
              >
                <div className="flex items-center gap-3">
                  {p.finalPhotoUrl && <img src={p.finalPhotoUrl} className="w-10 h-10 object-cover rounded" alt="Person" />}
                  <span className="font-medium text-sm">Person {idx + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{slots.filter(s => s === p.id).length} slots</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
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
            
            <Button variant="outline" className="w-full text-sm" onClick={handleAutoFill}>
              Auto-fill empty slots
            </Button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            {totalPhotosNeeded} of {gridConfig.capacity} slots filled
          </p>

          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleDownloadPdf}
            disabled={isGenerating || totalPhotosNeeded === 0}
          >
            {isGenerating ? 'Generating...' : 'Download Print PDF →'}
          </Button>

          <Button variant="outline" className="w-full" onClick={() => window.print()}>
            Print via Browser
          </Button>

          <div className="pt-4 flex flex-col gap-2">
            <Button variant="secondary" className="w-full" onClick={() => {
              const { setActivePersonId, setStep } = useAppStore.getState();
              setActivePersonId('');
              setStep(2);
            }}>+ Add Another Photo</Button>
            <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => {
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

      <div className="flex-1 bg-gray-100 rounded-xl p-8 flex flex-col items-center justify-center min-h-[500px] overflow-hidden">
        <p className="text-gray-500 text-sm mb-4">Click slots to add or remove selected photo</p>
        
        {/* Dynamic Interactive Preview Container */}
        <div 
          className="bg-white shadow-xl relative transition-all"
          style={{ 
            width: `${gridConfig.paperWidth}px`, 
            height: `${gridConfig.paperHeight}px`,
            // Scale dynamically to fit the container space
            transform: `scale(${Math.min(1, 600 / gridConfig.paperHeight, 800 / gridConfig.paperWidth)})`,
            transformOrigin: 'top center'
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
              return (
                <div 
                  key={i}
                  onClick={() => handleSlotClick(i)}
                  className={`relative cursor-pointer transition-colors overflow-hidden border border-dashed ${personId ? 'bg-white border-transparent shadow-sm' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}
                  style={{
                    width: `${template.widthMm}px`,
                    height: `${template.heightMm}px`
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
        </div>
      </div>
    </div>
  );
}

