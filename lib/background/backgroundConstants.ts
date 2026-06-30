export const getModelPublicPath = (): string => {
  if (typeof window !== 'undefined') {
    return new URL('/assets/models/imgly/', window.location.origin).toString();
  }
  return '/assets/models/imgly/';
};

export const BACKGROUND_CONSTANTS = {
  MODEL_PUBLIC_PATH: getModelPublicPath(),
  CACHE_VERSION_KEY: 'passport-snap-rmbg-v1',
  CACHE_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes timeout for cached items
  MAX_PREVIEW_WIDTH: 1000,
  MAX_PREVIEW_HEIGHT: 1000,
};
