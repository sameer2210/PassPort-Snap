/**
 * Applies a 3x3 convolution kernel to an ImageData object.
 */
function convolve(
  imageData: ImageData,
  kernel: number[], // 9 elements
  opaque: boolean = true
): ImageData {
  const side = 3;
  const halfSide = 1;
  const src = imageData.data;
  const sw = imageData.width;
  const sh = imageData.height;

  let output: ImageData;
  if (typeof ImageData !== 'undefined') {
    output = new ImageData(sw, sh);
  } else {
    const canvas = document.createElement('canvas');
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return imageData;
      output = ctx.createImageData(sw, sh);
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
  }
  const dst = output.data;

  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const dstOff = (y * sw + x) * 4;

      let r = 0, g = 0, b = 0, a = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = Math.min(sh - 1, Math.max(0, y + cy - halfSide));
          const scx = Math.min(sw - 1, Math.max(0, x + cx - halfSide));
          const srcOff = (scy * sw + scx) * 4;
          const wt = kernel[cy * side + cx];
          
          r += src[srcOff] * wt;
          g += src[srcOff + 1] * wt;
          b += src[srcOff + 2] * wt;
          a += src[srcOff + 3] * wt;
        }
      }

      dst[dstOff] = Math.min(255, Math.max(0, r));
      dst[dstOff + 1] = Math.min(255, Math.max(0, g));
      dst[dstOff + 2] = Math.min(255, Math.max(0, b));
      dst[dstOff + 3] = opaque ? 255 : Math.min(255, Math.max(0, a));
    }
  }
  return output;
}

/**
 * Applies sharpening or softening filter to an ImageData object
 * based on a sharpness value from 0 to 100 (50 is neutral).
 */
export function applySharpness(
  imageData: ImageData,
  sharpness: number
): ImageData {
  if (sharpness === 50) {
    return imageData;
  }

  let kernel: number[];
  if (sharpness > 50) {
    // Sharpening
    const amount = (sharpness - 50) / 50; // 0 to 1
    kernel = [
       0,      -amount,      0,
      -amount, 1 + 4 * amount, -amount,
       0,      -amount,      0
    ];
  } else {
    // Softening / Blurring
    const b = (50 - sharpness) / 50; // 0 to 1
    const c = 1 - (8 / 9) * b;
    const o = b / 9;
    kernel = [
      o, o, o,
      o, c, o,
      o, o, o
    ];
  }

  return convolve(imageData, kernel, true);
}
