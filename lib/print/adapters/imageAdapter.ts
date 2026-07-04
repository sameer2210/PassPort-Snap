export interface IImageLoader {
  loadImage(src: string): Promise<HTMLImageElement>;
}

export const ImageAdapter: IImageLoader = {
  loadImage: (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (typeof Image === 'undefined') {
        reject(new Error('HTMLImageElement is not supported in this environment'));
        return;
      }
      const img = new Image();
      if (src.startsWith('http') && !src.includes('localhost') && !src.includes('127.0.0.1')) {
        img.crossOrigin = 'anonymous';
      }
      const handleLoad = () => {
        img.onload = null;
        img.onerror = null;
        resolve(img);
      };
      const handleError = () => {
        img.onload = null;
        img.onerror = null;
        reject(new Error('Failed to load image resource: ' + src));
      };
      img.onload = handleLoad;
      img.onerror = handleError;
      img.src = src;
    });
  }
} as const;
