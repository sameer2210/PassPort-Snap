import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

export function Step2Upload() {
  const { setStep, addPerson, setTemplateId } = useAppStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // 1. Create high-res in-memory blob URL
      const highResPhotoUrl = URL.createObjectURL(file);
      
      // 2. Load into image to compress for preview
      const img = new Image();
      img.src = highResPhotoUrl;
      await new Promise(resolve => { img.onload = resolve; });

      // 3. Calculate new dimensions (max 2000px)
      const MAX_DIMENSION = 2000;
      let width = img.width;
      let height = img.height;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      // 4. Draw to canvas and export as compressed JPEG Data URL
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }
      const previewPhotoUrl = canvas.toDataURL('image/jpeg', 0.8);

      const newPersonId = Math.random().toString(36).substring(7);
      
      // 5. Store both in Zustand
      addPerson(newPersonId, previewPhotoUrl, highResPhotoUrl);
      
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
