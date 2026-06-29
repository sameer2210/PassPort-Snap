import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { templates } from '@/lib/config';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Step1PhotoType() {
  const { templateId, setTemplateId, setStep, customTemplateMm, setCustomTemplateMm } = useAppStore();
  const [showCustom, setShowCustom] = useState(templateId === 'custom');

  // Restored previously saved template via Zustand persistence automatically.


  const handleSelect = (id: string) => {
    if (id === 'custom') {
      setShowCustom(true);
      setTemplateId('custom');
    } else {
      setShowCustom(false);
      setTemplateId(id);
      localStorage.setItem('passport-snap-template', id);
      setStep(2);
    }
  };

  const handleCustomSubmit = () => {
    setTemplateId('custom');
    localStorage.setItem('passport-snap-template', 'custom');
    setStep(2);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Choose Photo Size</h2>
        <p className="text-gray-500">Select the country or size you need.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {templates.map((t) => (
          <Card 
            key={t.id} 
            className={`cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${templateId === t.id && !showCustom ? 'border-blue-600 ring-1 ring-blue-600' : ''}`}
            onClick={() => handleSelect(t.id)}
          >
            <CardHeader>
              <CardTitle>{t.label}</CardTitle>
              <CardDescription>{t.countries}</CardDescription>
            </CardHeader>
          </Card>
        ))}

        <Card 
          className={`cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${showCustom ? 'border-blue-600 ring-1 ring-blue-600' : ''}`}
          onClick={() => handleSelect('custom')}
        >
          <CardHeader>
            <CardTitle>Custom Dimensions</CardTitle>
            <CardDescription>Enter your own width and height</CardDescription>
          </CardHeader>
          {showCustom && (
            <CardContent className="space-y-4" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <label htmlFor="custom-width" className="text-sm font-medium">Width (mm)</label>
                  <input 
                    id="custom-width" 
                    type="number" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={customTemplateMm.widthMm} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTemplateMm({ ...customTemplateMm, widthMm: Number(e.target.value) })}
                    min={10} max={200}
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label htmlFor="custom-height" className="text-sm font-medium">Height (mm)</label>
                  <input 
                    id="custom-height" 
                    type="number" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={customTemplateMm.heightMm} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTemplateMm({ ...customTemplateMm, heightMm: Number(e.target.value) })}
                    min={10} max={200}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleCustomSubmit}>Continue with Custom Size</Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
