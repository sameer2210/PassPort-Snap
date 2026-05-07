import { create } from 'zustand';
import type { PhotoTemplate, BackgroundChoice, Person, SheetSize } from './types';
import { templates, sheetSizes } from './config';

interface AppState {
  step: number;
  templateId: string;
  backgroundChoice: BackgroundChoice;
  customBackgroundColor: string;
  people: Person[];
  activePersonId: string | null;
  sheetSizeId: string;

  // Actions
  setStep: (step: number) => void;
  setTemplateId: (id: string) => void;
  setBackgroundChoice: (choice: BackgroundChoice) => void;
  setCustomBackgroundColor: (color: string) => void;
  setSheetSizeId: (id: string) => void;
  
  addPerson: (id: string, originalPhotoUrl: string) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  removePerson: (id: string) => void;
  setActivePersonId: (id: string) => void;
  reorderPeople: (newOrder: Person[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  step: 1,
  templateId: templates[0].id,
  backgroundChoice: 'original',
  customBackgroundColor: '#ffffff',
  people: [],
  activePersonId: null,
  sheetSizeId: sheetSizes[0].id,

  setStep: (step) => set({ step }),
  setTemplateId: (templateId) => {
    set({ templateId });
    if (typeof window !== 'undefined') {
      localStorage.setItem('passport-snap-template', templateId);
    }
  },
  setBackgroundChoice: (backgroundChoice) => {
    set({ backgroundChoice });
    if (typeof window !== 'undefined') {
      localStorage.setItem('passport-snap-bg', backgroundChoice);
    }
  },
  setCustomBackgroundColor: (customBackgroundColor) => set({ customBackgroundColor }),
  setSheetSizeId: (sheetSizeId) => set({ sheetSizeId }),

  addPerson: (id, originalPhotoUrl) => set((state) => {
    const newPerson: Person = { id, originalPhotoUrl, croppedPhotoUrl: null, finalPhotoUrl: null, count: 4 };
    return { 
      people: [...state.people, newPerson],
      activePersonId: id
    };
  }),
  
  updatePerson: (id, updates) => set((state) => ({
    people: state.people.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  removePerson: (id) => set((state) => {
    const newPeople = state.people.filter(p => p.id !== id);
    return {
      people: newPeople,
      activePersonId: state.activePersonId === id ? (newPeople[0]?.id || null) : state.activePersonId
    };
  }),

  setActivePersonId: (activePersonId) => set({ activePersonId }),
  reorderPeople: (people) => set({ people }),
}));
