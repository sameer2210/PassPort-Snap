export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false },
  brightness = 100,
  contrast = 100,
  targetWidth?: number,
  targetHeight?: number
): Promise<string | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

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
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = pixelCrop.width;
  tempCanvas.height = pixelCrop.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx?.putImageData(data, 0, 0);

  // Draw the cropped image onto the final canvas, scaling it if necessary
  ctx.drawImage(tempCanvas, 0, 0, pixelCrop.width, pixelCrop.height, 0, 0, finalWidth, finalHeight);

  // Return as base64 data URL so it can be safely persisted in IndexedDB across reloads
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  return dataUrl;
}
