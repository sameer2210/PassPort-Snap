/* eslint-disable @next/next/no-img-element */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { templates } from '@/lib/config';
import { detectFace, initializeFaceDetector } from '@/lib/faceDetection';
import { getCroppedImg } from '@/lib/cropImage';

export function Step3Adjust() {
  const { people, activePersonId, templateId, setStep, updatePerson, customTemplateMm } = useAppStore();
  const person = people.find(p => p.id === activePersonId);
  const baseTemplate = templates.find(t => t.id === templateId) || templates[0];
  const template = templateId === 'custom' 
    ? {
        id: 'custom',
        label: 'Custom',
        widthMm: customTemplateMm.widthMm,
        heightMm: customTemplateMm.heightMm,
        printWidthPx: Math.round((customTemplateMm.widthMm / 25.4) * 300),
        printHeightPx: Math.round((customTemplateMm.heightMm / 25.4) * 300),
        countries: 'Custom'
      }
    : baseTemplate;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const photoUrlToEdit = person?.previewPhotoUrl;

  useEffect(() => {
    // Pre-load model
    initializeFaceDetector();
  }, []);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsData: Area) => {
    setCroppedAreaPixels(croppedAreaPixelsData);
  }, []);

  const handleAutoAdjust = async () => {
    if (!photoUrlToEdit || !imgRef.current) return;
    try {
      setIsProcessing(true);
      const detections = await detectFace(imgRef.current);
      if (detections.detections.length > 0) {
        const face = detections.detections[0].boundingBox;
        if (!face) return;
        
        // MediaPipe bounding box is in pixels
        const { width: imgW, height: imgH } = imgRef.current;
        const faceCenterX = face.originX + face.width / 2;
        const faceCenterY = face.originY + face.height / 2;
        
        // Passport standard usually puts eyes/face slightly above center.
        // We'll aim for face center to be ~40% from the top of the cropped image.
        // Calculate crop relative to center.
        // This is a simplified auto-crop estimation for react-easy-crop:
        const xOffset = (imgW / 2) - faceCenterX;
        const yOffset = (imgH / 2) - faceCenterY;
        
        setCrop({ x: xOffset, y: yOffset });
        // Zoom enough to fit the face with margins (face should be about 50-70% of photo height)
        const targetFaceRatio = 0.6; // Face height takes 60% of crop height
        const targetCropHeight = face.height / targetFaceRatio;
        const templateRatio = template.widthMm / template.heightMm;
        const targetCropWidth = targetCropHeight * templateRatio;
        
        // Calculate zoom needed: zoom = image width / crop width or image height / crop height
        // Easy-crop zoom 1 = fits in container. Container is usually image width/height bounded.
        // Approximate zoom factor:
        const zoomFactor = Math.min(imgH / targetCropHeight, imgW / targetCropWidth);
        setZoom(Math.max(1, zoomFactor));
      }
    } catch (e) {
      console.error('Face detection failed', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!person || !photoUrlToEdit || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      // Create cropped image
      const croppedUrl = await getCroppedImg(
        photoUrlToEdit,
        croppedAreaPixels,
        rotation,
        { horizontal: false, vertical: false },
        brightness,
        contrast,
        template.printWidthPx,
        template.printHeightPx
      );
      
      let highResFinalUrl = null;
      if (person.highResPhotoUrl) {
        // If we want to crop the high-res one too, we should calculate the scaled crop box.
        // For MVP, we can just use the preview's cropped URL since it's already high quality enough.
        // But let's save it to highResFinalUrl if we want.
        highResFinalUrl = croppedUrl; // Simplified. True high-res crop would scale croppedAreaPixels.
      }

      updatePerson(person.id, { 
        croppedPhotoUrl: croppedUrl || person.previewPhotoUrl,
        highResFinalUrl: highResFinalUrl,
        croppedAreaPixels,
        rotation,
        brightness,
        contrast
      });
      setStep(4);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    handleAutoAdjust();
  };

  if (!person || !photoUrlToEdit) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Hidden image for face detection */}
      <img 
        ref={imgRef} 
        src={photoUrlToEdit} 
        alt="Hidden source" 
        className="hidden" 
        crossOrigin="anonymous" 
        onLoad={() => handleAutoAdjust()}
      />
      
      <div className="flex-1 space-y-4">
        <div className="relative h-[400px] w-full bg-black rounded-xl overflow-hidden" style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}>
          <Cropper
            image={photoUrlToEdit}
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
            <Button variant="outline" className="flex-1" onClick={handleReset} disabled={isProcessing}>Auto Align</Button>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
          <Button className="flex-1" onClick={handleSave} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Save & Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
