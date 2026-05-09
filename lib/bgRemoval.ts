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

    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        if (file) {
          resolve(URL.createObjectURL(file));
        } else {
          resolve(imageUrl);
        }
      }, 'image/jpeg', 0.95);
    });
  } catch (err) {
    console.error('Failed to remove background:', err);
    return imageUrl; // Fallback to original
  }
}
