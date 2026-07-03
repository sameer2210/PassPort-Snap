import React, { useState } from 'react';
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

  const handleSelect = (id: string) => {
    if (id === 'custom') {
      setShowCustom(true);
      setTemplateId('custom');
    } else {
      setShowCustom(false);
      setTemplateId(id);
      localStorage.setItem('passport-snap-template', id);
      setStep(2);
    }
  };

  const handleCustomSubmit = () => {
    setTemplateId('custom');
    localStorage.setItem('passport-snap-template', 'custom');
    setStep(2);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-2">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Choose Photo Size</h2>
        <p className="text-sm text-gray-500 max-w-lg">
          Select a standard country passport size template or define your own custom physical measurements.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((t) => {
          const isSelected = templateId === t.id && !showCustom;
          return (
            <div
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className="group cursor-pointer select-none"
            >
              <SectionCard 
                title={t.label} 
                subtitle={t.countries}
                icon={<Globe className="w-4 h-4 text-brand-primary" />}
                className={`h-full border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                  ${isSelected 
                    ? 'border-brand-primary bg-brand-light/20 ring-1 ring-brand-primary' 
                    : 'border-[#0b1e3a]/8 hover:border-brand-primary/45'
                  }`}
              >
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-brand-accent/50 uppercase tracking-widest">Dimensions</span>
                  <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    {t.widthMm} x {t.heightMm} mm
                  </span>
                </div>
              </SectionCard>
            </div>
          );
        })}

        {/* Custom dimensions card */}
        <div
          onClick={() => handleSelect('custom')}
          className="group cursor-pointer select-none"
        >
          <SectionCard 
            title="Custom Dimensions" 
            subtitle="Configure physical millimeters size"
            icon={<Settings2 className="w-4 h-4 text-brand-primary" />}
            className={`border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
              ${showCustom 
                ? 'border-brand-primary bg-brand-light/10 ring-1 ring-brand-primary' 
                : 'border-[#0b1e3a]/8 hover:border-brand-primary/45'
              }`}
          >
            {showCustom ? (
              <div 
                className="space-y-4 pt-3 mt-2 border-t border-gray-100" 
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <SettingsRow
                  label="Width"
                  description="Millimeter width of printed photo"
                  control={
                    <div className="relative w-32 flex items-center">
                      <input 
                        id="custom-width" 
                        type="number" 
                        className="w-full h-9 rounded-lg border border-brand-border bg-white px-3 py-1.5 text-xs text-right pr-9 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        value={customTemplateMm.widthMm || ''} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTemplateMm({ ...customTemplateMm, widthMm: Number(e.target.value) })}
                        min={10} max={200}
                      />
                      <span className="absolute right-3 text-[10px] font-bold text-gray-400 select-none">mm</span>
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
                        type="number" 
                        className="w-full h-9 rounded-lg border border-brand-border bg-white px-3 py-1.5 text-xs text-right pr-9 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        value={customTemplateMm.heightMm || ''} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTemplateMm({ ...customTemplateMm, heightMm: Number(e.target.value) })}
                        min={10} max={200}
                      />
                      <span className="absolute right-3 text-[10px] font-bold text-gray-400 select-none">mm</span>
                    </div>
                  }
                  divider
                />

                <ActionGroup className="pt-2">
                  <Button 
                    className="w-full bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold h-9 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-120" 
                    onClick={handleCustomSubmit}
                  >
                    Continue with Custom Size
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </ActionGroup>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <span className="text-[10px] font-bold text-brand-accent/50 uppercase tracking-widest">Dimensions</span>
                <span className="text-xs font-semibold text-gray-400">Configure</span>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
export default Step1PhotoType;
