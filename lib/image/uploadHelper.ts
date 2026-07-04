/**
 * Processes a raw uploaded portrait File:
 * 1. Creates a high-res in-memory blob URL.
 * 2. Scales the image down to a maximum of 2000px on either dimension.
 * 3. Draws the image to a canvas and exports it as a compressed base64 JPEG Data URL.
 * 4. Returns both URLs.
 */
export async function processUploadedFile(file: File): Promise<{
  readonly highResPhotoUrl: string;
  readonly previewPhotoUrl: string;
}> {
  // 1. Create high-res in-memory blob URL
  const highResPhotoUrl = URL.createObjectURL(file);

  // 2. Load into image to compress for preview
  const img = new Image();
  img.src = highResPhotoUrl;
  await new Promise<void>((resolve, reject) => {
    const handleLoad = () => {
      img.onload = null;
      img.onerror = null;
      resolve();
    };
    const handleError = () => {
      img.onload = null;
      img.onerror = null;
      reject(new Error('Failed to load image file.'));
    };
    img.onload = handleLoad;
    img.onerror = handleError;
  });

  // 3. Calculate new dimensions (max 2000px)
  const MAX_DIMENSION = 2000;
  let width = img.width;
  let height = img.height;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_DIMENSION) / width);
      width = MAX_DIMENSION;
    } else {
      width = Math.round((width * MAX_DIMENSION) / height);
      height = MAX_DIMENSION;
    }
  }

  // 4. Draw to canvas and export as compressed JPEG Data URL
  const canvas = document.createElement('canvas');
  try {
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
    }
    const previewPhotoUrl = canvas.toDataURL('image/jpeg', 0.8);
    return { highResPhotoUrl, previewPhotoUrl };
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}
