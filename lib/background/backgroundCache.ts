import { CachedBackground } from './backgroundTypes';
import { BACKGROUND_CONSTANTS } from './backgroundConstants';

class BackgroundCache {
  private cache = new Map<string, CachedBackground>();
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {}

  private startTimerIfNeeded() {
    if (typeof window !== 'undefined' && !this.intervalId) {
      this.intervalId = setInterval(() => this.pruneExpired(), 60000); // Check every minute
    }
  }

  private stopTimerIfEmpty() {
    if (this.cache.size === 0 && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public get(personId: string): CachedBackground | undefined {
    const item = this.cache.get(personId);
    if (item) {
      item.lastAccessed = Date.now();
    }
    return item;
  }

  public setPreview(personId: string, blob: Blob) {
    const existing = this.cache.get(personId) || { createdAt: Date.now(), lastAccessed: Date.now() };
    
    // Revoke old URL if it exists
    if (existing.previewObjectUrl && existing.previewObjectUrl.startsWith('blob:')) {
      URL.revokeObjectURL(existing.previewObjectUrl);
    }

    existing.previewBlob = blob;
    existing.previewObjectUrl = URL.createObjectURL(blob);
    existing.lastAccessed = Date.now();

    this.cache.set(personId, existing);
    this.startTimerIfNeeded();
  }

  public setHighRes(personId: string, blob: Blob) {
    const existing = this.cache.get(personId) || { createdAt: Date.now(), lastAccessed: Date.now() };
    
    // Revoke old URL if it exists
    if (existing.highResObjectUrl && existing.highResObjectUrl.startsWith('blob:')) {
      URL.revokeObjectURL(existing.highResObjectUrl);
    }

    existing.highResBlob = blob;
    existing.highResObjectUrl = URL.createObjectURL(blob);
    existing.lastAccessed = Date.now();

    this.cache.set(personId, existing);
    this.startTimerIfNeeded();
  }

  public revoke(personId: string) {
    const item = this.cache.get(personId);
    if (item) {
      if (item.previewObjectUrl && item.previewObjectUrl.startsWith('blob:')) URL.revokeObjectURL(item.previewObjectUrl);
      if (item.highResObjectUrl && item.highResObjectUrl.startsWith('blob:')) URL.revokeObjectURL(item.highResObjectUrl);
      this.cache.delete(personId);
      this.stopTimerIfEmpty();
    }
  }

  public clearAll() {
    this.cache.forEach((item) => {
      if (item.previewObjectUrl && item.previewObjectUrl.startsWith('blob:')) URL.revokeObjectURL(item.previewObjectUrl);
      if (item.highResObjectUrl && item.highResObjectUrl.startsWith('blob:')) URL.revokeObjectURL(item.highResObjectUrl);
    });
    this.cache.clear();
    this.stopTimerIfEmpty();
  }

  private pruneExpired() {
    const now = Date.now();
    this.cache.forEach((item, personId) => {
      if (now - item.lastAccessed > BACKGROUND_CONSTANTS.CACHE_TIMEOUT_MS) {
        if (item.previewObjectUrl && item.previewObjectUrl.startsWith('blob:')) URL.revokeObjectURL(item.previewObjectUrl);
        if (item.highResObjectUrl && item.highResObjectUrl.startsWith('blob:')) URL.revokeObjectURL(item.highResObjectUrl);
        this.cache.delete(personId);
      }
    });
    this.stopTimerIfEmpty();
  }

  public destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.clearAll();
  }
}

export const backgroundCache = new BackgroundCache();
export default backgroundCache;
