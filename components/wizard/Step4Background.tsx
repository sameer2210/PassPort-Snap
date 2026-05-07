import React from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function Step4Background() {
  const { people, activePersonId, backgroundChoice, setBackgroundChoice, setStep, updatePerson } = useAppStore();
  const person = people.find(p => p.id === activePersonId);

  const handleNext = () => {
    // In part 8, this will run RMBG-1.4 model
    // For now, just save cropped photo as final
    if (person) {
      updatePerson(person.id, { 
        finalPhotoUrl: person.croppedPhotoUrl || person.previewPhotoUrl 
      });
      setStep(5);
    }
  };

  const bgOptions = [
    { id: 'original', label: 'Original', color: 'transparent' },
    { id: 'white', label: 'White', color: '#ffffff' },
    { id: 'blue', label: 'Light blue', color: '#e0f2fe' },
  ] as const;

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
              className="h-48 w-full flex items-center justify-center p-4 bg-gray-100"
              style={{ backgroundColor: opt.color === 'transparent' ? '' : opt.color }}
            >
              {person.croppedPhotoUrl && (
                <img 
                  src={person.croppedPhotoUrl} 
                  alt="Preview" 
                  className="max-h-full max-w-full object-contain shadow-sm"
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
        <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
        <Button size="lg" onClick={handleNext} className="w-48">Continue</Button>
      </div>
    </div>
  );
}
