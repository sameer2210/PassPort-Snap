import React, { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import { templates, sheetSizes } from '@/lib/config';
import { cleanupSessions } from '@/lib/storage';

export function Step5PrintSheet() {
  const { people, templateId, sheetSizeId, setSheetSizeId, setStep } = useAppStore();
  const template = templates.find(t => t.id === templateId) || templates[0];
  const sheet = sheetSizes.find(s => s.id === sheetSizeId) || sheetSizes[0];

  const [isGenerating, setIsGenerating] = useState(false);

  const totalPhotosNeeded = people.reduce((acc, p) => acc + p.count, 0);

  // Simplified layout math for MVP preview
  const gutterMm = 2;
  const marginMm = 4;
  
  const usableWidthMm = sheet.widthMm - (marginMm * 2);
  const usableHeightMm = sheet.heightMm - (marginMm * 2);

  const cols = Math.floor((usableWidthMm + gutterMm) / (template.widthMm + gutterMm));
  const rows = Math.floor((usableHeightMm + gutterMm) / (template.heightMm + gutterMm));
  const capacity = cols * rows;

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: sheet.widthMm > sheet.heightMm ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [sheet.widthMm, sheet.heightMm]
      });

      let currentX = marginMm;
      let currentY = marginMm;
      let col = 0;
      let row = 0;

      for (const person of people) {
        const urlToUse = person.highResFinalUrl || person.finalPhotoUrl;
        if (!urlToUse) continue;
        
        // Wait for image to load to get dimensions for jsPDF
        const img = new Image();
        img.src = urlToUse;
        await new Promise(resolve => { img.onload = resolve; });

        for (let i = 0; i < person.count; i++) {
          if (row >= rows) break; // Sheet full

          doc.addImage(img, 'JPEG', currentX, currentY, template.widthMm, template.heightMm);

          col++;
          if (col >= cols) {
            col = 0;
            row++;
            currentX = marginMm;
            currentY += template.heightMm + gutterMm;
          } else {
            currentX += template.widthMm + gutterMm;
          }
        }
      }

      doc.save('passport-photos.pdf');
      
      // Run cleanup after generating/exporting PDFs
      await cleanupSessions();
      
      // Discard heavy original from memory after successful export
      const { updatePerson } = useAppStore.getState();
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

  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col lg:flex-row gap-8">
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
            {people.map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {p.finalPhotoUrl && <img src={p.finalPhotoUrl} className="w-10 h-10 object-cover rounded" alt="Person" />}
                  <span className="font-medium text-sm">Person {idx + 1}</span>
                </div>
                <span className="text-sm text-gray-500">{p.count} photos</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center">
            {totalPhotosNeeded} of {capacity} slots filled
          </p>

          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleDownloadPdf}
            disabled={isGenerating || totalPhotosNeeded === 0}
          >
            {isGenerating ? 'Generating...' : 'Download PDF →'}
          </Button>

          <Button variant="outline" className="w-full" onClick={() => window.print()}>
            Print via Browser
          </Button>

          <div className="pt-4 flex gap-4">
            <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => {
              if (window.confirm("Start over with a new photo?")) {
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

      <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[500px]">
        {/* Simplified Preview Container */}
        <div 
          className="bg-white shadow-lg relative"
          style={{ 
            width: `${sheet.widthMm}px`, 
            height: `${sheet.heightMm}px`,
            transform: `scale(${Math.min(1, 500 / sheet.heightMm)})`,
            transformOrigin: 'center'
          }}
        >
          {/* We'd render a real grid of photos here in the final version */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
            Sheet Preview Layout Engine
          </div>
        </div>
      </div>
    </div>
  );
}
