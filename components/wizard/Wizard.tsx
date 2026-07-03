"use client";

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { cleanupSessions } from '@/lib/storage';
import { Step1PhotoType } from './Step1PhotoType';
import { Step2Upload } from './Step2Upload';
import { Step3Adjust } from './Step3Adjust';
import { Step4Background } from './Step4Background';
import { Step5PrintSheet } from './Step5PrintSheet';
import { WizardNavigation } from './WizardNavigation';

export function Wizard() {
  const { step } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Run storage cleanup on app startup
    cleanupSessions().catch(console.error);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Navigation Stepper (Mobile Tabs) */}
      <WizardNavigation />

      {/* Workspace Area */}
      <section className="flex-1 bg-white border border-[#0b1e3a]/6 rounded-2xl p-5 md:p-6 shadow-sm min-h-[500px] flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-center">
          {step === 1 && <Step1PhotoType />}
          {step === 2 && <Step2Upload />}
          {step === 3 && <Step3Adjust />}
          {step === 4 && <Step4Background />}
          {step === 5 && <Step5PrintSheet />}
        </div>
      </section>
    </main>
  );
}
export default Wizard;
