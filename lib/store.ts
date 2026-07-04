import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import type { BackgroundChoice, Person } from './types';
import type { BackgroundStatus } from './background/backgroundTypes';
import { templates } from './config';
import { PRINT_DEFAULTS } from './constants/printDefaults';
import { EDITOR_DEFAULTS } from './constants/editorDefaults';
import { backgroundCache } from './background/backgroundCache';

import { cleanupSessions, registerSessionUpdate, clearPassportWorkspace } from './storage';

// Safe UUID generation for session IDs
const generateSessionId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString();
};

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
        
        // Register update in the index for performance-optimized cleanup
        await registerSessionUpdate(sessionId, value);
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

  // Background states
  backgroundStatus: BackgroundStatus;
  modelLoaded: boolean;
  processing: boolean;
  backgroundError: string | null;

  // Actions
  setStep: (step: number) => void;
  setTemplateId: (id: string) => void;
  setBackgroundChoice: (choice: BackgroundChoice) => void;
  setCustomBackgroundColor: (color: string) => void;
  setSheetSizeId: (id: string) => void;
  setCustomTemplateMm: (dims: { widthMm: number; heightMm: number }) => void;
  
  setBackgroundStatus: (status: BackgroundStatus) => void;
  setModelLoaded: (loaded: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setBackgroundError: (error: string | null) => void;

  addPerson: (id: string, previewPhotoUrl: string, highResPhotoUrl: string) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  removePerson: (id: string) => void;
  setActivePersonId: (id: string) => void;
  reorderPeople: (newOrder: Person[]) => void;
  resetStore: () => void;
  resetEditor: () => void;
}

// Shared initializers to prevent duplicate reset logic
const getInitialEditorState = () => ({
  people: [] as Person[],
  activePersonId: null as string | null,
  sheetSizeId: PRINT_DEFAULTS.defaultSheetSizeId,
  backgroundChoice: EDITOR_DEFAULTS.backgroundChoice,
  customBackgroundColor: EDITOR_DEFAULTS.customBackgroundColor,
  backgroundStatus: EDITOR_DEFAULTS.backgroundStatus,
  backgroundError: EDITOR_DEFAULTS.backgroundError,
  processing: EDITOR_DEFAULTS.processing,
});

const getInitialState = () => ({
  step: 1,
  templateId: templates[0].id,
  customTemplateMm: { ...EDITOR_DEFAULTS.defaultCustomTemplateMm },
  modelLoaded: false,
  ...getInitialEditorState(),
});

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...getInitialState(),
      sessionId: generateSessionId(),

      setStep: (step) => set({ step }),
      setTemplateId: (templateId) => set({ templateId }),
      setBackgroundChoice: (backgroundChoice) => set((state) => {
        if (state.activePersonId) {
          const updatedPeople = state.people.map(p => {
            if (p.id === state.activePersonId) {
              return { ...p, backgroundChoice };
            }
            return p;
          });
          return { backgroundChoice, people: updatedPeople };
        }
        return { backgroundChoice };
      }),
      setCustomBackgroundColor: (customBackgroundColor) => set({ customBackgroundColor }),
      setSheetSizeId: (sheetSizeId) => set({ sheetSizeId }),
      setCustomTemplateMm: (customTemplateMm) => set({ customTemplateMm }),

      setBackgroundStatus: (backgroundStatus) => set((state) => {
        if (state.backgroundStatus === backgroundStatus) return {};
        if (state.activePersonId) {
          const updatedPeople = state.people.map(p => {
            if (p.id === state.activePersonId) {
              return { ...p, backgroundStatus };
            }
            return p;
          });
          return { backgroundStatus, people: updatedPeople };
        }
        return { backgroundStatus };
      }),
      setModelLoaded: (modelLoaded) => set((state) => {
        if (state.modelLoaded === modelLoaded) return {};
        return { modelLoaded };
      }),
      setProcessing: (processing) => set((state) => {
        if (state.processing === processing) return {};
        if (state.activePersonId) {
          const updatedPeople = state.people.map(p => {
            if (p.id === state.activePersonId) {
              return { ...p, processing };
            }
            return p;
          });
          return { processing, people: updatedPeople };
        }
        return { processing };
      }),
      setBackgroundError: (backgroundError) => set((state) => {
        if (state.backgroundError === backgroundError) return {};
        if (state.activePersonId) {
          const updatedPeople = state.people.map(p => {
            if (p.id === state.activePersonId) {
              return { ...p, backgroundError };
            }
            return p;
          });
          return { backgroundError, people: updatedPeople };
        }
        return { backgroundError };
      }),

      addPerson: (id, previewPhotoUrl, highResPhotoUrl) => set((state) => {
        const newPerson: Person = { 
          id, 
          previewPhotoUrl, 
          highResPhotoUrl, 
          croppedPhotoUrl: null, 
          finalPhotoUrl: null, 
          highResFinalUrl: null,
          backgroundPreviewUrl: null,
          count: PRINT_DEFAULTS.defaultPhotoCount,
          backgroundChoice: 'original',
          backgroundStatus: 'idle',
          backgroundError: null,
          processing: false,
        };
        return { 
          people: [...state.people, newPerson],
          activePersonId: id,
          backgroundChoice: 'original',
          backgroundStatus: 'idle',
          backgroundError: null,
          processing: false,
        };
      }),
      
      updatePerson: (id, updates) => set((state) => {
        const updatedPeople = state.people.map(p => {
          if (p.id === id) {
            // Revoke old highResPhotoUrl if it is being replaced/updated with a different value
            if (updates.highResPhotoUrl !== undefined && p.highResPhotoUrl && p.highResPhotoUrl !== updates.highResPhotoUrl && p.highResPhotoUrl.startsWith('blob:')) {
              URL.revokeObjectURL(p.highResPhotoUrl);
            }
            // Revoke old highResFinalUrl if it is being replaced/updated with a different value
            if (updates.highResFinalUrl !== undefined && p.highResFinalUrl && p.highResFinalUrl !== updates.highResFinalUrl && p.highResFinalUrl.startsWith('blob:')) {
              URL.revokeObjectURL(p.highResFinalUrl);
            }
            return { ...p, ...updates };
          }
          return p;
        });
        return { people: updatedPeople };
      }),

      removePerson: (id) => set((state) => {
        const person = state.people.find(p => p.id === id);
        if (person) {
          if (person.highResPhotoUrl && person.highResPhotoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(person.highResPhotoUrl);
          }
          if (person.highResFinalUrl && person.highResFinalUrl.startsWith('blob:')) {
            URL.revokeObjectURL(person.highResFinalUrl);
          }
        }
        const newPeople = state.people.filter(p => p.id !== id);
        const nextActiveId = state.activePersonId === id ? (newPeople[0]?.id || null) : state.activePersonId;
        const nextActivePerson = newPeople.find(p => p.id === nextActiveId);

        return {
          people: newPeople,
          activePersonId: nextActiveId,
          backgroundChoice: nextActivePerson?.backgroundChoice || 'original',
          backgroundStatus: nextActivePerson?.backgroundStatus || 'idle',
          backgroundError: nextActivePerson ? (nextActivePerson.backgroundError !== undefined ? nextActivePerson.backgroundError : null) : null,
          processing: nextActivePerson ? (nextActivePerson.processing !== undefined ? nextActivePerson.processing : false) : false
        };
      }),

      setActivePersonId: (activePersonId) => set((state) => {
        const person = state.people.find(p => p.id === activePersonId);
        if (person) {
          return {
            activePersonId,
            backgroundChoice: person.backgroundChoice || 'original',
            backgroundStatus: person.backgroundStatus || 'idle',
            backgroundError: person.backgroundError !== undefined ? person.backgroundError : null,
            processing: person.processing !== undefined ? person.processing : false
          };
        }
        return { activePersonId };
      }),
      reorderPeople: (people) => set({ people }),
      
      resetStore: () => set({ ...getInitialState(), sessionId: generateSessionId() }),
      resetEditor: () => {
        set((state) => {
          // 1. Revoke object URLs for all people
          state.people.forEach((p) => {
            if (p.highResPhotoUrl && p.highResPhotoUrl.startsWith('blob:')) {
              URL.revokeObjectURL(p.highResPhotoUrl);
            }
            if (p.highResFinalUrl && p.highResFinalUrl.startsWith('blob:')) {
              URL.revokeObjectURL(p.highResFinalUrl);
            }
          });

          // 2. Clear session background cache
          backgroundCache.clearAll();

          // 3. Clear IndexedDB and browser storage selectively (leaves Zustand storage key intact)
          clearPassportWorkspace();

          // 4. Return reset states with Step 2 navigation
          return {
            ...getInitialEditorState(),
            templateId: templates[0].id,
            customTemplateMm: { ...EDITOR_DEFAULTS.defaultCustomTemplateMm },
            step: 2,
            sessionId: generateSessionId()
          };
        });
      },
    }),
    {
      name: 'passport-snap-storage',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        ...state,
        backgroundStatus: EDITOR_DEFAULTS.backgroundStatus,
        processing: EDITOR_DEFAULTS.processing,
        backgroundError: EDITOR_DEFAULTS.backgroundError,
        people: state.people.map(p => ({
          ...p,
          highResPhotoUrl: null,
          highResFinalUrl: null,
          backgroundPreviewUrl: null
        }))
      }),
    }
  )
);
