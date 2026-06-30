import { rmbgEngine } from './background/backgroundService';
import { compositeColorBase64 } from './background/backgroundCanvas';

/**
 * Compatibility wrapper for background processing.
 * @deprecated Use lib/background modules instead.
 */
export async function processBackground(
  imageUrl: string,
  backgroundColor: string
): Promise<string> {
  if (backgroundColor === 'original') {
    return imageUrl;
  }

  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    
    // Ensure model is preloaded
    await rmbgEngine.ensureModel();
    await rmbgEngine.initialize();

    const transparentBlob = await rmbgEngine.remove(blob);
    return await compositeColorBase64(transparentBlob, backgroundColor, 413, 531);
  } catch (err) {
    console.error('Compatibility processBackground failed:', err);
    return imageUrl;
  }
}
