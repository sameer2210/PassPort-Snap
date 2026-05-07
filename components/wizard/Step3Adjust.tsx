import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { templates } from '@/lib/config';

export function Step3Adjust() {
  const { people, activePersonId, templateId, setStep, updatePerson } = useAppStore();
  const person = people.find(p => p.id === activePersonId);
  const template = templates.find(t => t.id === templateId) || templates[0];

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sharpness, setSharpness] = useState(0); // Optional filter

  const onCropComplete = useCallback((croppedArea: { x: number; y: number; width: number; height: number }, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    // In a real app we'd draw to canvas and save the croppedUrl.
    // For now we'll just mock saving the state when user clicks Save.
    console.log(croppedArea, croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    // Mocking cropped photo creation. For now we just use the original.
    if (person && person.originalPhotoUrl) {
      updatePerson(person.id, { croppedPhotoUrl: person.originalPhotoUrl });
      setStep(4);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSharpness(0);
  };

  if (!person || !person.originalPhotoUrl) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="relative h-[400px] w-full bg-black rounded-xl overflow-hidden" style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}>
          <Cropper
            image={person.originalPhotoUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={template.widthMm / template.heightMm}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      </div>
      
      <div className="w-full md:w-80 space-y-6">
        <div>
          <h3 className="text-lg font-medium">Adjust Photo</h3>
          <p className="text-sm text-gray-500">Fine-tune your passport photo.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <label>Brightness</label>
            </div>
            <Slider 
              min={50} max={150} value={brightness} 
              onChange={(e) => setBrightness(Number(e.target.value))} 
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <label>Contrast</label>
            </div>
            <Slider 
              min={50} max={150} value={contrast} 
              onChange={(e) => setContrast(Number(e.target.value))} 
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <label>Zoom</label>
            </div>
            <Slider 
              min={1} max={3} step={0.1} value={zoom} 
              onChange={(e) => setZoom(Number(e.target.value))} 
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setRotation(r => r + 90)}>■ Rotate</Button>
            <Button variant="outline" className="flex-1" onClick={handleReset}>Reset to auto</Button>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
          <Button className="flex-1" onClick={handleSave}>Save & Next</Button>
        </div>
      </div>
    </div>
  );
}
