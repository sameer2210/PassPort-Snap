/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/SectionCard';
import { PreviewContainer } from '@/components/ui/PreviewContainer';
import { ActionGroup } from '@/components/ui/ActionGroup';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval';
import { BackgroundChoice } from '@/lib/types';
import { Palette, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

export function Step4Background() {
  const {
    people,
    activePersonId,
    backgroundChoice,
    setBackgroundChoice,
    customBackgroundColor,
    setCustomBackgroundColor,
    setStep
  } = useAppStore();

  const person = people.find(p => p.id === activePersonId);
  const { processPreview, processHighRes, cancelActiveTask, status, processing, error } = useBackgroundRemoval();

  const [customColor, setCustomColor] = useState(customBackgroundColor || '#ffffff');

  const bgOptions = [
    { id: 'original', label: 'Original', color: 'original' },
    { id: 'white', label: 'White Color', color: '#ffffff' },
    { id: 'blue', label: 'Light Blue', color: '#e0f2fe' },
    { id: 'custom', label: 'Custom Color', color: 'custom' },
  ] as const;

  const personId = person?.id;

  // Process preview background whenever the selection or custom color changes
  useEffect(() => {
    if (!personId) return;
    processPreview(personId, backgroundChoice, customColor);

    return () => {
      cancelActiveTask();
    };
  }, [personId, backgroundChoice, customColor, processPreview, cancelActiveTask]);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomColor(val);
    setCustomBackgroundColor(val);
  };

  const handleNext = async () => {
    if (!person) return;
    const success = await processHighRes(person.id, backgroundChoice, customColor);
    if (success) {
      setStep(5);
    } else {
      alert('Failed to process high-resolution background removal. Please retry or continue with the original photo.');
    }
  };

  if (!person) return null;

  const imgToUse = person.backgroundPreviewUrl || person.croppedPhotoUrl || person.previewPhotoUrl || '';

  const getStatusText = () => {
    switch (status) {
      case 'checking-model':
        return 'Verifying Offline Cache';
      case 'downloading-model':
        return 'Downloading offline AI model...';
      case 'initializing-model':
        return 'Starting neural engine...';
      case 'processing-preview':
        return 'Removing background portrait...';
      case 'processing-highres':
        return 'Exporting high-resolution photo...';
      case 'compositing':
        return 'Painting canvas background...';
      default:
        return 'Applying background...';
    }
  };

  const getStatusSubText = () => {
    if (status === 'downloading-model') {
      return 'This occurs once and may take a moment. The model (~50MB) runs entirely offline in your browser.';
    }
    return 'Processing portrait image locally...';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-2">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Normalise Background</h2>
        <p className="text-sm text-gray-500 max-w-lg">
          Isolate the subject and apply a clean, compliant passport background. All processing runs locally inside your browser.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between gap-4 select-none">
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">AI Processing Error</span>
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-red-700 border-red-200 hover:bg-red-100 h-8 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-all duration-120"
            onClick={() => processPreview(person.id, backgroundChoice, customColor)}
          >
            <RotateCcw className="w-3 h-3" />
            Retry Process
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Side: Preview frame */}
        <div className="flex-1 w-full">
          <PreviewContainer
            title="Composite Output Preview"
            aspectRatio="aspect-[3/4]"
            className="h-[430px] w-full"
            loading={false} // We handle loading state custom-tailored with detailed subtexts using LoadingOverlay
          >
            {processing && (
              <LoadingOverlay
                container
                title={getStatusText()}
                subtitle={getStatusSubText()}
              />
            )}

            <div
              className="absolute inset-0 flex items-center justify-center p-4 transition-colors duration-300"
              style={{
                backgroundColor: backgroundChoice === 'original'
                  ? '#ffffff'
                  : backgroundChoice === 'custom'
                    ? customColor
                    : backgroundChoice === 'white'
                      ? '#ffffff'
                      : '#e0f2fe'
              }}
            >
              {backgroundChoice === 'original' && (
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px' }} />
              )}
              {imgToUse ? (
                <img
                  src={imgToUse}
                  alt="Final Preview"
                  className="max-h-full max-w-full object-contain rounded shadow-lg transition-transform duration-200"
                />
              ) : (
                <span className="text-xs font-medium text-gray-400">Loading composite...</span>
              )}
            </div>
          </PreviewContainer>
        </div>

        {/* Right Side: Options and buttons */}
        <div className="w-full md:w-85 space-y-6">
          <SectionCard
            title="Background Preset"
            subtitle="Choose a passport compliant backdrop"
            icon={<Palette className="w-4 h-4 text-brand-primary" />}
            className="border border-[#0b1e3a]/8 select-none"
          >
            <div className="grid grid-cols-2 gap-3">
              {bgOptions.map((opt) => {
                const isSelected = backgroundChoice === opt.id;
                const isCustom = opt.id === 'custom';
                const buttonBgColor = opt.id === 'original'
                  ? '#f3f4f6'
                  : opt.id === 'custom'
                    ? customColor
                    : opt.color;

                return (
                  <button
                    key={opt.id}
                    disabled={processing}
                    onClick={() => setBackgroundChoice(opt.id as BackgroundChoice)}
                    className={`flex flex-col items-center justify-between p-3.5 border rounded-xl cursor-pointer text-center group transition-all duration-150 focus:outline-none w-full
                      ${isSelected
                        ? 'border-brand-primary bg-brand-light/10 ring-1 ring-brand-primary'
                        : 'border-[#0b1e3a]/8 hover:border-brand-primary/45 hover:bg-gray-50/50'
                      }`}
                  >
                    {/* Tiny Color Dot preview inside card */}
                    <div
                      className="w-8 h-8 rounded-full border border-gray-200 shadow-sm flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: isCustom ? customColor : buttonBgColor }}
                    >
                      {opt.id === 'original' && (
                        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '6px 6px', backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px' }} />
                      )}
                      {isCustom && isSelected && (
                        <input
                          type="color"
                          value={customColor}
                          onChange={handleCustomColorChange}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                      )}
                    </div>

                    <span className="font-semibold text-[10px] text-gray-800 uppercase tracking-wider mt-3">
                      {opt.label}
                    </span>
                    {isCustom && isSelected && (
                      <span className="text-[9px] text-brand-primary font-bold mt-0.5">
                        {customColor.toUpperCase()}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* Navigation Action Buttons */}
          <div className="pt-2 border-t border-gray-100">
            <ActionGroup className="w-full">
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 text-gray-700 h-9 px-4 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-120"
                onClick={() => setStep(3)}
                disabled={processing}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
              <Button
                className="flex-1 bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold h-9 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-120"
                onClick={handleNext}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Continue'}
                {!processing && <ArrowRight className="w-3.5 h-3.5" />}
              </Button>
            </ActionGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Step4Background;
