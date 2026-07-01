import { ICanvasContext } from '../../adapters/canvasAdapter';

export function applySharpen(
  ctx: ICanvasContext,
  width: number,
  height: number,
  amount: number = 0.25
): void {
  if (amount <= 0) return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const src = imgData.data;
  
  // Allocate target clamped array
  const dest = new Uint8ClampedArray(src.length);
  
  // Default fill to copy edge pixels
  dest.set(src);

  const w = width;
  const h = height;
  const a = amount;
  const centerWeight = 1 + 4 * a;
  const edgeWeight = -a;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;

      // Process R, G, B channels
      for (let c = 0; c < 3; c++) {
        const pixelIdx = idx + c;
        const sum =
          src[pixelIdx] * centerWeight +
          (src[pixelIdx - 4] + src[pixelIdx + 4] + src[pixelIdx - w * 4] + src[pixelIdx + w * 4]) * edgeWeight;
        
        dest[pixelIdx] = sum < 0 ? 0 : sum > 255 ? 255 : sum;
      }
      // Alpha channel is copied as-is
      dest[idx + 3] = src[idx + 3];
    }
  }

  imgData.data.set(dest);
  ctx.putImageData(imgData, 0, 0);
}
