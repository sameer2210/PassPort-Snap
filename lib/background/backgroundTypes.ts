export type BackgroundStatus = 
  | 'idle' 
  | 'checking-model' 
  | 'downloading-model' 
  | 'initializing-model' 
  | 'processing-preview' 
  | 'processing-highres' 
  | 'compositing' 
  | 'completed' 
  | 'error';

export interface BackgroundState {
  backgroundChoice: 'original' | 'white' | 'blue' | 'custom';
  customBackgroundColor: string;
  backgroundStatus: BackgroundStatus;
  modelLoaded: boolean;
  processing: boolean;
  backgroundError: string | null;
}

export interface CachedBackground {
  previewBlob?: Blob;
  previewObjectUrl?: string;
  highResBlob?: Blob;
  highResObjectUrl?: string;
  createdAt: number;
  lastAccessed: number;
}

export interface BackgroundEngine {
  initialize(): Promise<void>;
  ensureModel(onProgress?: (progress: number) => void): Promise<void>;
  remove(source: Blob | ImageBitmap, onProgress?: (progress: number) => void): Promise<Blob>;
  dispose(): Promise<void>;
}
