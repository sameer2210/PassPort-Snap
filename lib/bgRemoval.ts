import { removeBackground } from '@imgly/background-removal';

export async function processBackground(
  imageUrl: string,
  backgroundColor: string // 'transparent', '#ffffff', '#e0f2fe'
): Promise<string> {
  if (backgroundColor === 'transparent') {
    return imageUrl;
  }

  try {
    // Generate image blob without background using local assets for offline PWA support
    const blob = await removeBackground(imageUrl, {
      publicPath: '/assets/models/imgly/'
    });
    
    // Draw it on a canvas with the new background color
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return imageUrl;

    const img = new Image();
    img.src = URL.createObjectURL(blob);
    await new Promise((resolve) => { img.onload = resolve; });

    canvas.width = img.width;
    canvas.height = img.height;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the cutout
    ctx.drawImage(img, 0, 0);

    // Return as base64 data URL so it can be safely persisted in IndexedDB across reloads
    const isTransparent = backgroundColor === 'transparent';
    const dataUrl = canvas.toDataURL(isTransparent ? 'image/png' : 'image/jpeg', 0.95);
    return dataUrl;
  } catch (err) {
    console.error('Failed to remove background:', err);
    return imageUrl; // Fallback to original
  }
}
