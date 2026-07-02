import { LayoutResult, LayoutSearchConfig } from '../contracts/types';
import { CACHE_VERSION, LAYOUT_ALGORITHM_VERSION, REGISTRY_VERSION } from '../constants/printConstants';

export interface CacheKeyParams {
  readonly paperId: string;
  readonly templateId: string;
  readonly marginMm: number;
  readonly gutterMm: number;
  readonly searchConfig?: LayoutSearchConfig;
}

const cache = new Map<string, LayoutResult>();

export const LayoutCache = {
  generateKey: (params: CacheKeyParams): string => {
    const { paperId, templateId, marginMm, gutterMm, searchConfig } = params;
    const parts = [
      paperId,
      templateId,
      marginMm.toFixed(2),
      gutterMm.toFixed(2),
      `alg_${LAYOUT_ALGORITHM_VERSION}`,
      `cache_${CACHE_VERSION}`,
      `reg_${REGISTRY_VERSION}`
    ];

    if (searchConfig) {
      parts.push(
        `pr_${searchConfig.allowPhotoRotation ? '1' : '0'}`,
        `ar_${searchConfig.allowPaperRotation ? '1' : '0'}`,
        `zg_${searchConfig.allowZeroGutterWhenNoValidLayout ? '1' : '0'}`,
        `sg_${(searchConfig.minimumSafeGutterMm ?? 0.5).toFixed(2)}`,
        `gs_${(searchConfig.gutterStepMm ?? 0.5).toFixed(2)}`
      );
    }

    return parts.join('|');
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
