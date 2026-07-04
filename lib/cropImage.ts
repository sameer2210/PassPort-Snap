import { IMAGE_ADJUSTMENT_DEFAULTS } from './constants/editorDefaults';
import { applySharpness } from './print/services/imagePreparation/Sharpness';

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const handleLoad = () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
      resolve(image);
    };
    const handleError = (error: ErrorEvent) => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
      reject(error);
    };
    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false },
  brightness: number = IMAGE_ADJUSTMENT_DEFAULTS.brightness,
  contrast: number = IMAGE_ADJUSTMENT_DEFAULTS.contrast,
  targetWidth?: number,
  targetHeight?: number,
  sharpness: number = IMAGE_ADJUSTMENT_DEFAULTS.sharpness
): Promise<string | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const tempCanvas = document.createElement('canvas');

  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }

    const rotRad = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rotRad));
    const sin = Math.abs(Math.sin(rotRad));
    const canvasWidth = Math.round(image.width * cos + image.height * sin);
    const canvasHeight = Math.round(image.width * sin + image.height * cos);

    // Set canvas size to match the rotated bounding box
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Translate to center of canvas, rotate, scale, and translate back by image center
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(image, 0, 0);

    // extract the cropped image using canvas
    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    // Set canvas width to final desired crop size (target or actual)
    const finalWidth = targetWidth || pixelCrop.width;
    const finalHeight = targetHeight || pixelCrop.height;

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // We need a temporary canvas to hold the cropped imageData so we can scale it
    tempCanvas.width = pixelCrop.width;
    tempCanvas.height = pixelCrop.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx?.putImageData(data, 0, 0);

    // Draw the cropped image onto the final canvas, scaling it if necessary
    ctx.drawImage(tempCanvas, 0, 0, pixelCrop.width, pixelCrop.height, 0, 0, finalWidth, finalHeight);

    // Apply sharpness filter if needed
    if (sharpness !== 50) {
      const finalImgData = ctx.getImageData(0, 0, finalWidth, finalHeight);
      const sharpenedData = applySharpness(finalImgData, sharpness);
      ctx.putImageData(sharpenedData, 0, 0);
    }

    // Return as base64 data URL so it can be safely persisted in IndexedDB across reloads
    return canvas.toDataURL('image/jpeg', 0.95);
  } finally {
    // Explicitly resize canvases to release GPU memory buffer allocations immediately
    canvas.width = 0;
    canvas.height = 0;
    tempCanvas.width = 0;
    tempCanvas.height = 0;
  }
}
