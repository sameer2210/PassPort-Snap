"use client";

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { cleanupSessions } from '@/lib/storage';
import { Step1PhotoType } from './Step1PhotoType';
import { Step2Upload } from './Step2Upload';
import { Step3Adjust } from './Step3Adjust';
import { Step4Background } from './Step4Background';
import { Step5PrintSheet } from './Step5PrintSheet';

export function Wizard() {
  const { step } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Run storage cleanup on app startup
    cleanupSessions().catch(console.error);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch due to localStorage use in store

  return (
    <main className="flex-1 flex flex-col py-8 px-4 md:px-8">
      <div className="w-full max-w-5xl mx-auto mb-8 flex justify-between items-center text-sm font-medium text-gray-500">
        <span className={step >= 1 ? 'text-blue-600' : ''}>1. Size</span>
        <span className={step >= 2 ? 'text-blue-600' : ''}>2. Upload</span>
        <span className={step >= 3 ? 'text-blue-600' : ''}>3. Adjust</span>
        <span className={step >= 4 ? 'text-blue-600' : ''}>4. Background</span>
        <span className={step >= 5 ? 'text-blue-600' : ''}>5. Print</span>
      </div>
      
      {step === 1 && <Step1PhotoType />}
      {step === 2 && <Step2Upload />}
      {step === 3 && <Step3Adjust />}
      {step === 4 && <Step4Background />}
      {step === 5 && <Step5PrintSheet />}
    </main>
  );
}
