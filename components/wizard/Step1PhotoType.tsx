import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { templates } from '@/lib/config';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function Step1PhotoType() {
  const { templateId, setTemplateId, setStep } = useAppStore();

  useEffect(() => {
    // Check if user previously saved a template, if so, skip to step 2 automatically.
    const savedTemplate = localStorage.getItem('passport-snap-template');
    if (savedTemplate) {
      setTemplateId(savedTemplate);
      setStep(2);
    }
  }, [setTemplateId, setStep]);

  const handleSelect = (id: string) => {
    setTemplateId(id);
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
            className={`cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${templateId === t.id ? 'border-blue-600 ring-1 ring-blue-600' : ''}`}
            onClick={() => handleSelect(t.id)}
          >
            <CardHeader>
              <CardTitle>{t.label}</CardTitle>
              <CardDescription>{t.countries}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
