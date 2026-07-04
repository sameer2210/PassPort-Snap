"use client";

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { cleanupSessions } from '@/lib/storage';
import dynamic from 'next/dynamic';
import { WizardNavigation } from './WizardNavigation';

const Step1PhotoType = dynamic(() => import('./Step1PhotoType'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center text-xs font-semibold text-app-text-muted">Loading Size Templates...</div>,
  ssr: false,
});
const Step2Upload = dynamic(() => import('./Step2Upload'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center text-xs font-semibold text-app-text-muted">Loading Upload Workspace...</div>,
  ssr: false,
});
const Step3Adjust = dynamic(() => import('./Step3Adjust'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center text-xs font-semibold text-app-text-muted">Loading Photo Adjuster...</div>,
  ssr: false,
});
const Step4Background = dynamic(() => import('./Step4Background'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center text-xs font-semibold text-app-text-muted">Loading Neural Background Engine...</div>,
  ssr: false,
});
const Step5PrintSheet = dynamic(() => import('./Step5PrintSheet'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center text-xs font-semibold text-app-text-muted">Loading Print Dashboard...</div>,
  ssr: false,
});

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
      <section className="flex-1 bg-white border border-app-border rounded-2xl p-5 md:p-6 shadow-sm min-h-[500px] flex flex-col justify-between">
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

