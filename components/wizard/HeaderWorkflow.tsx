"use client";

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { WIZARD_STEPS } from '@/lib/ui/uiConstants';
import { cn } from '@/lib/utils';

export const HeaderWorkflow: React.FC = () => {
  const { step } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);

  const currentStepObj = WIZARD_STEPS.find((s) => s.step === step);
  const currentLabel = currentStepObj ? currentStepObj.label : '';

  return (
    <div
      className="relative flex flex-col items-center justify-center z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Centered Page Title */}
      <button className="text-base md:text-[18px] font-semibold text-gray-800 hover:text-brand-primary transition-colors duration-150 py-1.5 focus:outline-none select-none">
        {currentLabel}
      </button>

      {/* Floating Workflow Preview Popover */}
      <div
        className={cn(
          "absolute top-full mt-2 bg-white border border-[#0b1e3a]/8 rounded-2xl shadow-lg p-5 w-[680px] max-w-[95vw] transition-all duration-150 ease-out origin-top flex flex-col gap-2.5",
          isHovered
            ? "opacity-100 translate-y-1 scale-100 visible pointer-events-auto"
            : "opacity-0 translate-y-0 scale-[0.98] invisible pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between gap-2.5 w-full select-none">
          {WIZARD_STEPS.map((s, idx) => {
            const isActive = step === s.step;
            const isCompleted = step > s.step;
            const isLast = idx === WIZARD_STEPS.length - 1;

            return (
              <React.Fragment key={s.step}>
                <div
                  className={cn(
                    "text-[14px] whitespace-nowrap transition-all duration-150",
                    isActive && "bg-brand-primary text-white font-semibold px-3.5 py-1.5 rounded-full shadow-sm shadow-brand-primary/15 scale-105",
                    isCompleted && "text-gray-700 font-medium",
                    !isActive && !isCompleted && "text-gray-400 font-normal"
                  )}
                >
                  {s.label}
                </div>
                {!isLast && (
                  <span className="text-gray-300 text-xs font-normal select-none">
                    ⟶
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

HeaderWorkflow.displayName = 'HeaderWorkflow';
export default HeaderWorkflow;
