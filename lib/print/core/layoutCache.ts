import { LayoutResult } from '../contracts/types';
import { CACHE_VERSION, LAYOUT_ALGORITHM_VERSION, REGISTRY_VERSION } from '../constants/printConstants';

const cache = new Map<string, LayoutResult>();

export const LayoutCache = {
  generateKey: (
    paperId: string,
    templateId: string,
    orientation: 'portrait' | 'landscape',
    marginMm: number,
    gutterMm: number,
    rotation: number,
    dpiProfile: string
  ): string => {
    return [
      paperId,
      templateId,
      orientation,
      marginMm.toFixed(2),
      gutterMm.toFixed(2),
      rotation.toString(),
      dpiProfile,
      `alg_${LAYOUT_ALGORITHM_VERSION}`,
      `cache_${CACHE_VERSION}`,
      `reg_${REGISTRY_VERSION}`
    ].join('|');
  },

  get: (key: string): LayoutResult | null => {
    return cache.get(key) || null;
  },

  set: (key: string, layout: LayoutResult): void => {
    cache.set(key, layout);
  },

  invalidate: (): void => {
    cache.clear();
  }
} as const;
