export const StorageAdapter = {
  get: async (key: string): Promise<string | null> => {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  },

  set: async (key: string, value: string): Promise<void> => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, value);
  },

  remove: async (key: string): Promise<void> => {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  }
} as const;
