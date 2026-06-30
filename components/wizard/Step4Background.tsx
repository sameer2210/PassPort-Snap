/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval';
import { BackgroundChoice } from '@/lib/types';

export function Step4Background() {
  const { 
    people, 
    activePersonId, 
    backgroundChoice, 
    setBackgroundChoice, 
    customBackgroundColor, 
    setCustomBackgroundColor, 
    setStep 
  } = useAppStore();

  const person = people.find(p => p.id === activePersonId);
  const { processPreview, processHighRes, cancelActiveTask, status, processing, error } = useBackgroundRemoval();
  
  const [customColor, setCustomColor] = useState(customBackgroundColor || '#ffffff');

  const bgOptions = [
    { id: 'original', label: 'Original', color: 'original' },
    { id: 'white', label: 'White', color: '#ffffff' },
    { id: 'blue', label: 'Light blue', color: '#e0f2fe' },
    { id: 'custom', label: 'Custom Color', color: 'custom' },
  ] as const;

  const personId = person?.id;

  // Process preview background whenever the selection or custom color changes
  useEffect(() => {
    if (!personId) return;
    
    // Trigger preview composition / background removal
    processPreview(personId, backgroundChoice, customColor);

    // Cancel active background task on cleanups/unmount
    return () => {
      cancelActiveTask();
    };
  }, [personId, backgroundChoice, customColor, processPreview, cancelActiveTask]);

  // Sync color changes to Zustand
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomColor(val);
    setCustomBackgroundColor(val);
  };

  const handleNext = async () => {
    if (!person) return;
    
    // Trigger high-res processing
    const success = await processHighRes(person.id, backgroundChoice, customColor);
    if (success) {
      setStep(5);
    } else {
      alert('Failed to process high-resolution background removal. Please retry or continue with the original photo.');
    }
  };

  if (!person) return null;

  // Get current preview image: falls back to cropped photo url
  const imgToUse = person.backgroundPreviewUrl || person.croppedPhotoUrl || person.previewPhotoUrl || '';

  // Match status strings to user-friendly progress text
  const getStatusText = () => {
    switch (status) {
      case 'checking-model':
        return 'Checking model cache...';
      case 'downloading-model':
        return 'Downloading offline AI model (this happens once)...';
      case 'initializing-model':
        return 'Initializing neural engine...';
      case 'processing-preview':
        return 'Removing background from preview...';
      case 'processing-highres':
        return 'Processing high-resolution photo...';
      case 'compositing':
        return 'Drawing composite background...';
      default:
        return 'Applying background...';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Choose Background</h2>
        <p className="text-gray-500">Select a clean background for your photo.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm flex flex-col space-y-2">
          <span>Error: {error}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-32 text-red-700 border-red-200 hover:bg-red-100" 
            onClick={() => processPreview(person.id, backgroundChoice, customColor)}
          >
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {bgOptions.map((opt) => {
          const isSelected = backgroundChoice === opt.id;
          const isCustom = opt.id === 'custom';
          const cardBgColor = opt.id === 'original' 
            ? '#f3f4f6' 
            : opt.id === 'custom' 
              ? customColor 
              : opt.color;

          return (
            <Card 
              key={opt.id}
              className={`cursor-pointer overflow-hidden transition-all hover:border-blue-500 hover:shadow-md ${isSelected ? 'border-blue-600 ring-2 ring-blue-600' : ''}`}
              onClick={() => {
                if (!processing) {
                  setBackgroundChoice(opt.id as BackgroundChoice);
                }
              }}
            >
              <div 
                className="h-32 w-full flex items-center justify-center p-2 relative"
                style={{ backgroundColor: cardBgColor }}
              >
                {/* Optional: Add a subtle grid behind original/custom to show background context */}
                {(opt.id === 'original' || opt.id === 'custom') && (
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px' }} />
                )}

                {imgToUse && (
                  <img 
                    src={imgToUse} 
                    alt={opt.label} 
                    className="max-h-full max-w-full object-contain shadow-sm relative z-10"
                  />
                )}
              </div>
              <CardContent className="p-3 text-center border-t flex flex-col items-center justify-center space-y-1">
                <span className="font-medium text-xs">{opt.label}</span>
                {isCustom && isSelected && (
                  <input 
                    type="color" 
                    value={customColor} 
                    onChange={handleCustomColorChange}
                    className="w-8 h-6 border cursor-pointer mt-1"
                    disabled={processing}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {processing && (
        <div className="flex flex-col items-center justify-center p-6 space-y-3 bg-gray-50 border rounded-lg">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-700 animate-pulse">{getStatusText()}</span>
        </div>
      )}

      {/* Main Full-Size Preview Display */}
      <div className="flex justify-center bg-gray-50 rounded-xl p-6 border shadow-inner">
        <div 
          className="relative max-w-xs aspect-[3/4] flex items-center justify-center border shadow-md p-4 rounded bg-white overflow-hidden"
          style={{ 
            backgroundColor: backgroundChoice === 'original' 
              ? '' 
              : backgroundChoice === 'custom' 
                ? customColor 
                : backgroundChoice === 'white' 
                  ? '#ffffff' 
                  : '#e0f2fe' 
          }}
        >
          {backgroundChoice === 'original' && (
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px' }} />
          )}
          {imgToUse ? (
            <img 
              src={imgToUse} 
              alt="Final Preview" 
              className="max-h-full max-w-full object-contain relative z-10"
            />
          ) : (
            <span className="text-xs text-gray-400">Loading photo...</span>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-4 gap-4">
        <Button variant="secondary" onClick={() => setStep(3)} disabled={processing}>Back</Button>
        <Button size="lg" onClick={handleNext} className="w-48" disabled={processing}>
          {processing ? 'Processing...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
