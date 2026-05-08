import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { processBackground } from '@/lib/bgRemoval';

export function Step4Background() {
  const { people, activePersonId, backgroundChoice, setBackgroundChoice, setStep, updatePerson } = useAppStore();
  const person = people.find(p => p.id === activePersonId);
  const [isProcessing, setIsProcessing] = useState(false);

  const bgOptions = [
    { id: 'original', label: 'Original', color: 'transparent' },
    { id: 'white', label: 'White', color: '#ffffff' },
    { id: 'blue', label: 'Light blue', color: '#e0f2fe' },
  ] as const;

  const handleNext = async () => {
    if (!person || !person.croppedPhotoUrl) return;
    
    setIsProcessing(true);
    try {
      const selectedBg = bgOptions.find(o => o.id === backgroundChoice);
      const finalUrl = await processBackground(
        person.croppedPhotoUrl,
        selectedBg ? selectedBg.color : 'transparent'
      );

      let finalHighRes = null;
      if (person.highResFinalUrl) {
        // Process high res as well
        finalHighRes = await processBackground(
          person.highResFinalUrl,
          selectedBg ? selectedBg.color : 'transparent'
        );
      }

      updatePerson(person.id, { 
        finalPhotoUrl: finalUrl,
        highResFinalUrl: finalHighRes || person.highResFinalUrl
      });
      setStep(5);
    } catch (error) {
      console.error('Failed to process background', error);
      alert('Failed to apply background. Continuing with original.');
      updatePerson(person.id, { 
        finalPhotoUrl: person.croppedPhotoUrl 
      });
      setStep(5);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!person) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Choose Background</h2>
        <p className="text-gray-500">Select a clean background for your photo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bgOptions.map((opt) => (
          <Card 
            key={opt.id}
            className={`cursor-pointer overflow-hidden transition-all hover:border-blue-500 hover:shadow-md ${backgroundChoice === opt.id ? 'border-blue-600 ring-2 ring-blue-600' : ''}`}
            onClick={() => setBackgroundChoice(opt.id)}
          >
            <div 
              className="h-48 w-full flex items-center justify-center p-4 bg-gray-100 relative"
              style={{ backgroundColor: opt.color === 'transparent' ? '' : opt.color }}
            >
              {/* Optional: Add a subtle grid behind transparent to show it's original/transparent */}
              {opt.color === 'transparent' && (
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} />
              )}
              {person.croppedPhotoUrl && (
                <img 
                  src={person.croppedPhotoUrl} 
                  alt="Preview" 
                  className="max-h-full max-w-full object-contain shadow-sm relative z-10"
                />
              )}
            </div>
            <CardContent className="p-4 text-center border-t">
              <span className="font-medium">{opt.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8 gap-4">
        <Button variant="secondary" onClick={() => setStep(3)} disabled={isProcessing}>Back</Button>
        <Button size="lg" onClick={handleNext} className="w-48" disabled={isProcessing}>
          {isProcessing ? 'Applying...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
