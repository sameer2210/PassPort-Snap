import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ActionGroup } from '@/components/ui/ActionGroup';
import { UploadCloud, ArrowLeft } from 'lucide-react';

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
    <div className="w-full max-w-2xl mx-auto space-y-8 py-2">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Upload Portrait Photo</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Drop your photo here. For best results, use a well-lit, front-facing portrait with a neutral background.
        </p>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`border border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 select-none
          ${isDragActive 
            ? 'border-brand-primary bg-brand-light/35 shadow-md shadow-brand-primary/5 scale-[1.01]' 
            : 'border-[#0b1e3a]/12 hover:border-brand-primary/45 hover:bg-brand-light/10 hover:shadow-sm bg-brand-background/20'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-brand-light text-brand-primary flex items-center justify-center shadow-inner">
            <UploadCloud className="w-6.5 h-6.5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-800">Drag & drop photo here, or click to browse</p>
            <p className="text-xs text-gray-400">JPG, PNG, HEIC or WebP up to 20MB</p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
        <ActionGroup>
          <Button 
            variant="outline" 
            className="border-gray-200 hover:bg-gray-50 text-gray-700 h-9 px-4 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-120"
            onClick={() => {
              // Clear choice and go back
              localStorage.removeItem('passport-snap-template');
              setTemplateId('');
              setStep(1);
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Change Template Size
          </Button>
        </ActionGroup>
      </div>
    </div>
  );
}
export default Step2Upload;
