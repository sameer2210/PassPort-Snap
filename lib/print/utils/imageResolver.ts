import type { Person } from '@/lib/types';
import { ImageAdapter } from '../adapters/imageAdapter';

/**
 * Asynchronously validates whether an image URL string can be loaded by the browser.
 * Returns true if the image loads successfully, false if the URL is empty, revoked, or fails to load.
 */
export async function validateImageUrl(url: string | null | undefined): Promise<boolean> {
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return false;
  }
  try {
    await ImageAdapter.loadImage(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolves the best available VALID high-resolution image URL for PDF, Print, and Single Photo exports.
 * 
 * Preservation of High-Resolution Architecture (300 DPI):
 * 1. person.highResFinalUrl (300 DPI Blob URL) - if present AND valid/loadable
 * 2. person.finalPhotoUrl (300 DPI Base64 Data URL) - if present AND valid/loadable
 * 3. person.croppedPhotoUrl (300 DPI Base64 Data URL) - if present AND valid/loadable
 * 
 * Never falls back to low-resolution previewPhotoUrl for export.
 * Returns empty string '' if no valid high-resolution print image can be loaded.
 */
export async function resolveExportPhotoUrl(person: Person | undefined | null): Promise<string> {
  if (!person) return '';

  // 1. Try highResFinalUrl (Blob URL from high-res background composite)
  if (person.highResFinalUrl && (await validateImageUrl(person.highResFinalUrl))) {
    return person.highResFinalUrl;
  }

  // 2. Fall back to finalPhotoUrl (300 DPI print-resolution Base64 Data URL)
  if (person.finalPhotoUrl && (await validateImageUrl(person.finalPhotoUrl))) {
    return person.finalPhotoUrl;
  }

  // 3. Fall back to croppedPhotoUrl (300 DPI print-resolution Base64 Data URL)
  if (person.croppedPhotoUrl && (await validateImageUrl(person.croppedPhotoUrl))) {
    return person.croppedPhotoUrl;
  }

  return '';
}
