/* eslint-disable @next/next/no-img-element */
import { ActionGroup } from '@/components/ui/ActionGroup';
import { Button } from '@/components/ui/button';
import { PreviewContainer } from '@/components/ui/PreviewContainer';
import { SectionCard } from '@/components/ui/SectionCard';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { Slider } from '@/components/ui/slider';
import { IMAGE_ADJUSTMENT_DEFAULTS } from '@/lib/constants/editorDefaults';
import { getCroppedImg } from '@/lib/cropImage';
import { detectFace, initializeFaceDetector } from '@/lib/faceDetection';
import { TemplateRegistry } from '@/lib/print/registry/templateRegistry';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, ArrowRight, RotateCcw, RotateCw, Sliders, Sparkles } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Area } from 'react-easy-crop';
import Cropper from 'react-easy-crop';

export function Step3Adjust() {
  const { people, activePersonId, templateId, setStep, updatePerson, customTemplateMm } = useAppStore();
  const person = people.find(p => p.id === activePersonId);
  const template = TemplateRegistry.getTemplate(templateId, customTemplateMm);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(IMAGE_ADJUSTMENT_DEFAULTS.zoom);
  const [rotation, setRotation] = useState<number>(person?.rotation ?? 0);

  const [brightness, setBrightness] = useState<number>(person?.brightness ?? IMAGE_ADJUSTMENT_DEFAULTS.brightness);
  const [contrast, setContrast] = useState<number>(person?.contrast ?? IMAGE_ADJUSTMENT_DEFAULTS.contrast);
  const [sharpness, setSharpness] = useState<number>(person?.sharpness ?? IMAGE_ADJUSTMENT_DEFAULTS.sharpness);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(person?.croppedAreaPixels || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const photoUrlToEdit = person?.previewPhotoUrl;

  useEffect(() => {
    initializeFaceDetector();
  }, []);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsData: Area) => {
    setCroppedAreaPixels(croppedAreaPixelsData);
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (person?.croppedAreaPixels) {
      const img = e.currentTarget;
      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;
      if (imgW > 0) {
        const cap = person.croppedAreaPixels;
        const calculatedZoom = imgW / cap.width;
        const dx = (imgW / 2) - (cap.x + cap.width / 2);
        const dy = (imgH / 2) - (cap.y + cap.height / 2);

        setZoom(calculatedZoom);
        setCrop({ x: dx * calculatedZoom, y: dy * calculatedZoom });
      }
    } else {
      handleAutoAdjust();
    }
  };

  const handleAutoAdjust = async () => {
    if (!photoUrlToEdit || !imgRef.current) return;
    try {
      setIsProcessing(true);
      const detections = await detectFace(imgRef.current);
      if (detections.detections.length > 0) {
        const face = detections.detections[0].boundingBox;
        if (!face) return;

        const { width: imgW, height: imgH } = imgRef.current;
        const faceCenterX = face.originX + face.width / 2;
        const faceCenterY = face.originY + face.height / 2;

        const xOffset = (imgW / 2) - faceCenterX;
        const yOffset = (imgH / 2) - faceCenterY;

        setCrop({ x: xOffset, y: yOffset });

        const targetFaceRatio = 0.6; // Face height takes 60% of crop height
        const targetCropHeight = face.height / targetFaceRatio;
        const templateRatio = template.widthMm / template.heightMm;
        const targetCropWidth = targetCropHeight * templateRatio;

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
      const croppedUrl = await getCroppedImg(
        photoUrlToEdit,
        croppedAreaPixels,
        rotation,
        { horizontal: false, vertical: false },
        brightness,
        contrast,
        template.printWidthPx,
        template.printHeightPx,
        sharpness
      );

      let highResFinalUrl = null;
      if (person.highResPhotoUrl) {
        highResFinalUrl = croppedUrl; // Simplified. True high-res crop would scale croppedAreaPixels.
      }

      updatePerson(person.id, {
        croppedPhotoUrl: croppedUrl || person.previewPhotoUrl,
        highResFinalUrl: highResFinalUrl,
        croppedAreaPixels,
        rotation,
        brightness,
        contrast,
        sharpness
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
    setBrightness(IMAGE_ADJUSTMENT_DEFAULTS.brightness);
    setContrast(IMAGE_ADJUSTMENT_DEFAULTS.contrast);
    setZoom(IMAGE_ADJUSTMENT_DEFAULTS.zoom);
    setSharpness(IMAGE_ADJUSTMENT_DEFAULTS.sharpness);
  };

  if (!person || !photoUrlToEdit) return null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 py-2">
      <img
        ref={imgRef}
        src={photoUrlToEdit}
        alt="Hidden source"
        className="hidden"
        crossOrigin="anonymous"
        onLoad={handleImageLoad}
      />

      <div className="space-y-1.5 text-left pb-3 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Crop & Center</h2>
        <p className="text-xs text-gray-500 leading-normal max-w-2xl">
          Position your face in the center of the template box. The AI auto-detector will attempt to position it automatically.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Aspect Crop Viewport */}
        <div className="flex-grow w-full">
          <PreviewContainer
            title="Preview"
            toolbar={
              <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded select-none">
                Portrait Preview • {template.widthMm} × {template.heightMm} mm
              </span>
            }
            loading={isProcessing}
            aspectRatio="aspect-[4/3]"
            className="h-[690px] w-full shadow-md border border-gray-200 bg-[#F7FAFF]"
          >
            <div
              className="absolute inset-0 bg-neutral-950 overflow-hidden"
              style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
            >
              <Cropper
                image={photoUrlToEdit}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={template.widthMm / template.heightMm}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={false}
              />
            </div>
          </PreviewContainer>
        </div>

        {/* Right Adjustments Panel */}
        <div className="w-full lg:w-[430px] flex-shrink-0 space-y-2">
          <SectionCard
            title="Adjustments"
            subtitle="Fine tune your portrait before background processing."
            icon={<Sliders className="w-4 h-4 text-brand-primary" />}
            className="border border-[#0b1e3a]/8"
          >
            <div className="space-y-1">
              <SettingsRow
                label="Brightness"
                description="Fine tune overall lighting"
                value={`${brightness}%`}
                divider
                control={
                  <Slider
                    min={50}
                    max={150}
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    aria-label="Adjust Brightness"
                  />
                }
              />

              <SettingsRow
                label="Contrast"
                description="Increase image depth"
                value={`${contrast}%`}
                divider
                control={
                  <Slider
                    min={50}
                    max={150}
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    aria-label="Adjust Contrast"
                  />
                }
              />

              <SettingsRow
                label="Zoom"
                description="Adjust face size"
                value={`${Math.round(zoom * 100)}%`}
                divider
                control={
                  <Slider
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    aria-label="Adjust Zoom"
                  />
                }
              />

              <SettingsRow
                label="Sharpness"
                description="Improve edge clarity"
                value={`${sharpness}%`}
                divider
                control={
                  <Slider
                    min={0}
                    max={100}
                    value={sharpness}
                    onChange={(e) => setSharpness(Number(e.target.value))}
                    aria-label="Adjust Sharpness"
                  />
                }
              />

              {/* Utility buttons row */}
              <div className="pt-3 select-none">
                <ActionGroup equalWidth className="w-full">
                  <Button
                    variant="outline"
                    className="h-10 text-xs font-semibold border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-1.5 rounded-xl transition-all duration-150"
                    onClick={() => setRotation(r => (r + 90) % 360)}
                    title="Rotate 90 degrees"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-gray-500" />
                    Rotate
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 text-xs font-semibold border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-1.5 rounded-xl transition-all duration-150"
                    onClick={handleAutoAdjust}
                    disabled={isProcessing}
                    title="AI Auto Align"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    Auto Align
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 text-xs font-semibold border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-1.5 rounded-xl transition-all duration-150"
                    onClick={handleReset}
                    disabled={isProcessing}
                    title="Reset defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                    Reset Adjustments
                  </Button>
                </ActionGroup>
              </div>
            </div>
          </SectionCard>

          {/* Navigation Action Buttons */}
          <div className="pt-4 border-t border-gray-100 w-full">
            <ActionGroup className="w-full flex justify-between gap-4">
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 text-gray-700 h-10 px-5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all duration-150 shrink-0"
                onClick={() => setStep(2)}
                disabled={isProcessing}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold h-10 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10 transition-all duration-150"
                onClick={handleSave}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Save & Continue'}
                {!isProcessing && <ArrowRight className="w-4 h-4" />}
              </Button>
            </ActionGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Step3Adjust;
