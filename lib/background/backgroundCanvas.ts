export async function blobToImageBitmap(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof window !== 'undefined' && typeof window.createImageBitmap === 'function') {
    return await window.createImageBitmap(blob);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    const handleLoad = () => {
      img.onload = null;
      img.onerror = null;
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
      resolve(img);
    };
    const handleError = (err: unknown) => {
      img.onload = null;
      img.onerror = null;
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
      reject(err);
    };
    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = url;
  });
}

export async function composeBackground(
  cutout: ImageBitmap | HTMLImageElement,
  color: string,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context creation failed');
  }

  // Draw background color if it is not transparent or original (original is treated as no-op cutout composite)
  if (color !== 'transparent' && color !== 'original') {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw transparent cutout
  ctx.drawImage(cutout, 0, 0, width, height);
  
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string = 'image/jpeg',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas to Blob conversion failed'));
      }
    }, mimeType, quality);
  });
}

export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert Blob to base64 Data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function compositeColorBase64(
  cutoutBlob: Blob,
  color: string,
  width: number,
  height: number
): Promise<string> {
  const imageBitmap = await blobToImageBitmap(cutoutBlob);
  try {
    const canvas = await composeBackground(imageBitmap, color, width, height);
    try {
      const isTransparent = color === 'transparent' || color === 'original';
      const outBlob = await canvasToBlob(canvas, isTransparent ? 'image/png' : 'image/jpeg', 0.95);
      return await blobToDataUrl(outBlob);
    } finally {
      // Explicitly resize canvas to release GPU memory buffer allocations immediately
      canvas.width = 0;
      canvas.height = 0;
    }
  } finally {
    // Close imageBitmap to release memory immediately
    if ('close' in imageBitmap && typeof imageBitmap.close === 'function') {
      imageBitmap.close();
    }
  }
}

export async function compositeColorBlobUrl(
  cutoutBlob: Blob,
  color: string,
  width: number,
  height: number
): Promise<string> {
  const imageBitmap = await blobToImageBitmap(cutoutBlob);
  try {
    const canvas = await composeBackground(imageBitmap, color, width, height);
    try {
      const isTransparent = color === 'transparent' || color === 'original';
      const outBlob = await canvasToBlob(canvas, isTransparent ? 'image/png' : 'image/jpeg', 0.95);
      return URL.createObjectURL(outBlob);
    } finally {
      // Explicitly resize canvas to release GPU memory buffer allocations immediately
      canvas.width = 0;
      canvas.height = 0;
    }
  } finally {
    // Close imageBitmap to release memory immediately
    if ('close' in imageBitmap && typeof imageBitmap.close === 'function') {
      imageBitmap.close();
    }
  }
}
