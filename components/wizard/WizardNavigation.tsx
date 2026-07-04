"use client";

import React from 'react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

import { WIZARD_STEPS } from '@/lib/ui/uiConstants';

export const WizardNavigation: React.FC = () => {
  const { step, setStep, people } = useAppStore();

  const handleStepClick = (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
    } else if (targetStep === 2 && step === 1) {
      setStep(2);
    } else if (targetStep > 2 && people.length > 0) {
      setStep(targetStep);
    }
  };

  return (
    <>
      {/* Mobile Horizontal Navigation Header */}
      <div className="block lg:hidden w-full bg-white border border-app-border rounded-2xl p-4 shadow-sm mb-2 select-none">
        <div className="flex items-center justify-between overflow-x-auto gap-4 py-1 scrollbar-none select-none">
          {WIZARD_STEPS.map((s) => {
            const isActive = step === s.step;
            const canClick = s.step < step || (s.step === 2 && step === 1) || (s.step > 2 && people.length > 0);

            return (
              <button
                key={s.step}
                disabled={!canClick}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => canClick && handleStepClick(s.step)}
                className={cn(
                  "text-xs font-semibold pb-1 border-b-2 transition-all duration-150 flex-shrink-0",
                  isActive 
                    ? "border-brand-primary text-brand-primary font-bold" 
                    : "border-transparent text-app-text-muted hover:text-app-text-secondary",
                  !canClick && "opacity-40"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

WizardNavigation.displayName = 'WizardNavigation';
export default WizardNavigation;

