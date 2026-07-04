import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ActionGroup } from '@/components/ui/ActionGroup';
import { UploadCloud, ArrowLeft } from 'lucide-react';
import { processUploadedFile } from '@/lib/image/uploadHelper';

export function Step2Upload() {
  const { setStep, addPerson, setTemplateId } = useAppStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        const file = acceptedFiles[0];
        const { highResPhotoUrl, previewPhotoUrl } = await processUploadedFile(file);
        const newPersonId = Math.random().toString(36).substring(7);
        
        addPerson(newPersonId, previewPhotoUrl, highResPhotoUrl);
        setStep(3);
      } catch (err) {
        console.error(err);
        alert('Failed to process image file.');
      }
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
        <h2 className="text-2xl font-bold text-app-text-primary tracking-tight">Upload Portrait Photo</h2>
        <p className="text-sm text-app-text-secondary max-w-md mx-auto">
          Drop your photo here. For best results, use a well-lit, front-facing portrait with a neutral background.
        </p>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`border border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 select-none
          ${isDragActive 
            ? 'border-brand-primary bg-brand-light/35 shadow-sm shadow-blue-500/10 scale-[1.01]' 
            : 'border-slate-200 hover:border-brand-primary/35 hover:bg-brand-light/10 hover:shadow-sm bg-app-background/20'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-brand-light text-brand-primary flex items-center justify-center shadow-inner">
            <UploadCloud className="w-6.5 h-6.5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-app-text-primary">Drag & drop photo here, or click to browse</p>
            <p className="text-xs text-app-text-muted">JPG, PNG, HEIC or WebP up to 20MB</p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-app-border flex justify-between items-center">
        <ActionGroup>
          <Button 
            variant="outline" 
            className="border-slate-200 hover:bg-slate-50 text-app-text-secondary h-9 px-4 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-120"
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

