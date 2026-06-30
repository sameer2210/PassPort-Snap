import { preload, removeBackground } from '@imgly/background-removal';
import { BackgroundEngine } from './backgroundTypes';
import { getModelPublicPath } from './backgroundConstants';

export class ImglyRmbgEngine implements BackgroundEngine {
  private isInitialized = false;

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;
  }

  public async ensureModel(onProgress?: (progress: number) => void): Promise<void> {
    await preload({
      publicPath: getModelPublicPath(),
      progress: (key: string, current: number, total: number) => {
        if (onProgress && total > 0) {
          onProgress(current / total);
        }
      }
    });
  }

  public async remove(source: Blob | ImageBitmap, onProgress?: (progress: number) => void): Promise<Blob> {
    const config = {
      publicPath: getModelPublicPath(),
      progress: (key: string, current: number, total: number) => {
        if (onProgress && total > 0) {
          onProgress(current / total);
        }
      }
    };
    
    // removeBackground accepts Blob or string URL. If source is ImageBitmap, we draw it to a temporary canvas and export as blob
    let blobInput: Blob;
    if (source instanceof ImageBitmap) {
      const canvas = document.createElement('canvas');
      canvas.width = source.width;
      canvas.height = source.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context creation failed in remove background');
      ctx.drawImage(source, 0, 0);
      blobInput = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas to Blob failed'));
        }, 'image/png');
      });
    } else {
      blobInput = source;
    }

    return await removeBackground(blobInput, config);
  }

  public async dispose(): Promise<void> {
    this.isInitialized = false;
  }
}

export const rmbgEngine: BackgroundEngine = new ImglyRmbgEngine();
export default rmbgEngine;
