import { Wizard } from '@/components/wizard/Wizard';
import { HeaderWorkflow } from '@/components/wizard/HeaderWorkflow';
import { Camera } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-background flex flex-col selection:bg-brand-light selection:text-brand-primary">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#0b1e3a]/8 px-6 py-3.5 flex items-center justify-between md:grid md:grid-cols-3">
        <div className="flex items-center gap-2.5 select-none justify-self-start">
          <div className="w-8.5 h-8.5 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-sm shadow-brand-primary/20">
            <Camera className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none tracking-tight">Passport Snap</h1>
            <span className="text-[10px] font-semibold text-brand-accent/50 uppercase tracking-widest leading-none block mt-0.5">Studio quality</span>
          </div>
        </div>
        <div className="justify-self-center hidden md:block">
          <HeaderWorkflow />
        </div>
        <div className="flex items-center gap-3 justify-self-end">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-light text-brand-accent tracking-wide uppercase select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            Offline Mode
          </span>
        </div>
      </header>
      <Wizard />
    </div>
  );
}
