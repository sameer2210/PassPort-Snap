import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import type { BackgroundChoice, Person } from './types';
import { templates, sheetSizes } from './config';

import { cleanupSessions } from './storage';

// Custom storage for Zustand using idb-keyval (IndexedDB)
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
    
    // Extract sessionId to save as an individual session
    try {
      const parsed = JSON.parse(value);
      const sessionId = parsed?.state?.sessionId;
      if (sessionId) {
        const sessionKey = `passport_session_${sessionId}`;
        // Save the full value under the session key
        await set(sessionKey, value);
      }
    } catch {
      // Ignore parse errors
    }

    // Run scalable cleanup strategy
    await cleanupSessions();
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface AppState {
  sessionId: string;
  step: number;
  templateId: string;
  backgroundChoice: BackgroundChoice;
  customBackgroundColor: string;
  people: Person[];
  activePersonId: string | null;
  sheetSizeId: string;
  customTemplateMm: { widthMm: number; heightMm: number };

  // Actions
  setStep: (step: number) => void;
  setTemplateId: (id: string) => void;
  setBackgroundChoice: (choice: BackgroundChoice) => void;
  setCustomBackgroundColor: (color: string) => void;
  setSheetSizeId: (id: string) => void;
  setCustomTemplateMm: (dims: { widthMm: number; heightMm: number }) => void;
  
  addPerson: (id: string, previewPhotoUrl: string, highResPhotoUrl: string) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  removePerson: (id: string) => void;
  setActivePersonId: (id: string) => void;
  reorderPeople: (newOrder: Person[]) => void;
  resetStore: () => void;
}

const initialState = {
  step: 1,
  templateId: templates[0].id,
  backgroundChoice: 'original' as BackgroundChoice,
  customBackgroundColor: '#ffffff',
  people: [],
  activePersonId: null,
  sheetSizeId: sheetSizes[0].id,
  customTemplateMm: { widthMm: 35, heightMm: 45 },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      sessionId: Date.now().toString(),

      setStep: (step) => set({ step }),
      setTemplateId: (templateId) => set({ templateId }),
      setBackgroundChoice: (backgroundChoice) => set({ backgroundChoice }),
      setCustomBackgroundColor: (customBackgroundColor) => set({ customBackgroundColor }),
      setSheetSizeId: (sheetSizeId) => set({ sheetSizeId }),
      setCustomTemplateMm: (customTemplateMm) => set({ customTemplateMm }),

      addPerson: (id, previewPhotoUrl, highResPhotoUrl) => set((state) => {
        const newPerson: Person = { 
          id, 
          previewPhotoUrl, 
          highResPhotoUrl, 
          croppedPhotoUrl: null, 
          finalPhotoUrl: null, 
          highResFinalUrl: null,
          count: 4 
        };
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
      
      resetStore: () => set({ ...initialState, sessionId: Date.now().toString() }),
    }),
    {
      name: 'passport-snap-storage',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        ...state,
        people: state.people.map(p => ({
          ...p,
          highResPhotoUrl: null,
          highResFinalUrl: null
        }))
      }),
    }
  )
);
