import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { templates } from '@/lib/config';
import { SectionCard } from '@/components/ui/SectionCard';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { ActionGroup } from '@/components/ui/ActionGroup';
import { Button } from '@/components/ui/button';
import { Globe, Settings2, ArrowRight } from 'lucide-react';

export function Step1PhotoType() {
  const { templateId, setTemplateId, setStep, customTemplateMm, setCustomTemplateMm } = useAppStore();
  const [showCustom, setShowCustom] = useState(templateId === 'custom');

  // Local state for width and height inputs to prevent out-of-sync typing/rendering issues
  const [widthInput, setWidthInput] = useState<string>(
    customTemplateMm.widthMm > 0 ? String(customTemplateMm.widthMm) : ''
  );
  const [heightInput, setHeightInput] = useState<string>(
    customTemplateMm.heightMm > 0 ? String(customTemplateMm.heightMm) : ''
  );

  const widthInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus width when custom section becomes active
  useEffect(() => {
    if (showCustom) {
      const timer = setTimeout(() => {
        widthInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showCustom]);

  const handleSelect = (id: string) => {
    if (id === 'custom') {
      setShowCustom(true);
      setTemplateId('custom');
      setWidthInput(customTemplateMm.widthMm > 0 ? String(customTemplateMm.widthMm) : '');
      setHeightInput(customTemplateMm.heightMm > 0 ? String(customTemplateMm.heightMm) : '');
    } else {
      setShowCustom(false);
      setTemplateId(id);
      localStorage.setItem('passport-snap-template', id);
      setStep(2);
    }
  };

  const handleWidthChange = (val: string) => {
    if (val.includes('-')) return;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      if (/^0\d+/.test(val)) return;
      setWidthInput(val);
    }
  };

  const handleHeightChange = (val: string) => {
    if (val.includes('-')) return;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      if (/^0\d+/.test(val)) return;
      setHeightInput(val);
    }
  };

  const handleCustomSubmit = () => {
    const width = parseFloat(widthInput);
    const height = parseFloat(heightInput);

    if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
      return;
    }

    setCustomTemplateMm({ widthMm: width, heightMm: height });
    setTemplateId('custom');
    localStorage.setItem('passport-snap-template', 'custom');
    setStep(2);
  };

  const widthVal = parseFloat(widthInput);
  const heightVal = parseFloat(heightInput);
  const isCustomValid = !isNaN(widthVal) && widthVal > 0 && !isNaN(heightVal) && heightVal > 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-2">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold text-app-text-primary tracking-tight">Choose Custom Size</h2>
      </div>
      {/* Custom dimensions card */}
      <div
        key="custom"
        role="button"
        tabIndex={0}
        aria-expanded={showCustom}
        onClick={() => handleSelect('custom')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect('custom');
          }
        }}
        className="group cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-2xl"
      >
        <SectionCard
          title="Custom Dimensions"
          subtitle="Configure physical millimeters size"
          icon={<Settings2 className="w-4 h-4 text-brand-primary" />}
          className={`border transition-all duration-200 hover:shadow-md hover:shadow-black/5
              ${
                showCustom
                  ? 'border-brand-primary bg-brand-light/15 ring-1 ring-brand-primary/70'
                  : 'border-app-border hover:border-brand-primary/35'
              }`}
        >
          {showCustom ? (
            <div
              className="space-y-4 pt-3 mt-2 border-t border-app-border"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <SettingsRow
                label="Width"
                description="Millimeter width of printed photo"
                control={
                  <div className="relative w-32 flex items-center">
                    <input
                      id="custom-width"
                      ref={widthInputRef}
                      type="text"
                      inputMode="decimal"
                      className="w-full h-9 rounded-xl border border-brand-border bg-white px-3 py-1.5 text-xs text-right pr-9 font-semibold text-app-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      value={widthInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleWidthChange(e.target.value)
                      }
                      placeholder="0"
                    />
                    <span className="absolute right-3 text-[10px] font-bold text-app-text-muted select-none">
                      mm
                    </span>
                  </div>
                }
              />
              <SettingsRow
                label="Height"
                description="Millimeter height of printed photo"
                control={
                  <div className="relative w-32 flex items-center">
                    <input
                      id="custom-height"
                      type="text"
                      inputMode="decimal"
                      className="w-full h-9 rounded-xl border border-brand-border bg-white px-3 py-1.5 text-xs text-right pr-9 font-semibold text-app-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      value={heightInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleHeightChange(e.target.value)
                      }
                      placeholder="0"
                    />
                    <span className="absolute right-3 text-[10px] font-bold text-app-text-muted select-none">
                      mm
                    </span>
                  </div>
                }
                divider
              />

              <ActionGroup className="pt-2">
                <Button
                  className="w-full bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold h-9 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-120"
                  onClick={handleCustomSubmit}
                  disabled={!isCustomValid}
                >
                  Continue with Custom Size
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </ActionGroup>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
              <span className="text-[10px] font-bold text-brand-accent/50 uppercase tracking-widest">
                Dimensions
              </span>
              <span className="text-xs font-semibold text-app-text-muted">Configure</span>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold text-app-text-primary tracking-tight">Choose Photo Size</h2>
        <p className="text-sm text-app-text-secondary max-w-lg">
          Select a standard country passport size template or define your own custom physical
          measurements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map(t => {
          const isSelected = templateId === t.id && !showCustom;
          return (
            <div
              key={t.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => handleSelect(t.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(t.id);
                }
              }}
              className="group cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-2xl"
            >
              <SectionCard
                title={t.label}
                subtitle={t.countries}
                icon={<Globe className="w-4 h-4 text-brand-primary" />}
                className={`h-full border transition-all duration-200 hover:shadow-md hover:shadow-black/5
                  ${
                    isSelected
                      ? 'border-brand-primary bg-brand-light/15 ring-1 ring-brand-primary/70'
                      : 'border-app-border hover:border-brand-primary/35'
                  }`}
              >
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-brand-accent/50 uppercase tracking-widest">
                    Dimensions
                  </span>
                  <span className="text-xs font-semibold text-app-text-secondary bg-slate-100 px-2 py-0.5 rounded-md">
                    {t.widthMm} x {t.heightMm} mm
                  </span>
                </div>
              </SectionCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Step1PhotoType;

