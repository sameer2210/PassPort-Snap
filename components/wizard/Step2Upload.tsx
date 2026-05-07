import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

export function Step2Upload() {
  const { setStep, addPerson, setTemplateId } = useAppStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      const newPersonId = Math.random().toString(36).substring(7);
      
      addPerson(newPersonId, imageUrl);
      
      // In part 6 this will auto-crop, for now we go to manual step 3
      setStep(3);
    }
  }, [addPerson, setStep]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic']
    },
    maxSize: 20 * 1024 * 1024 // 20 MB
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Upload Photo</h2>
        <p className="text-gray-500">Drop a clear portrait photo here.</p>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <UploadCloud className="w-12 h-12 text-gray-400" />
          <p className="text-lg font-medium">Drop photo here, or click to choose</p>
          <p className="text-sm text-gray-500">JPG, PNG, HEIC, WebP up to 20MB</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => {
          // Clear choice and go back
          localStorage.removeItem('passport-snap-template');
          setTemplateId('');
          setStep(1);
        }}>Change Size Template</Button>
      </div>
    </div>
  );
}
