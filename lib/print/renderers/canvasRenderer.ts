import { RenderScene } from '../contracts/types';
import { UnitConverter } from '../core/unitConverter';
import { ImageAdapter } from '../adapters/imageAdapter';
import { RenderError } from '../contracts/errors';

export const CanvasRenderer = {
  render: async (scene: RenderScene, dpi: number = 300): Promise<HTMLCanvasElement> => {
    if (typeof document === 'undefined') {
      throw new RenderError('CanvasRenderer requires a browser DOM environment.');
    }

    const targetW = UnitConverter.convert(scene.paperWidthMm, 'mm', 'px', dpi);
    const targetH = UnitConverter.convert(scene.paperHeightMm, 'mm', 'px', dpi);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new RenderError('Failed to obtain HTMLCanvasElement context.');
    }

    // White base sheet
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetW, targetH);

    // 1. Draw Images
    for (const item of scene.items) {
      if (item.imageRef) {
        const img = await ImageAdapter.loadImage(item.imageRef);
        const x = UnitConverter.convert(item.xMm, 'mm', 'px', dpi);
        const y = UnitConverter.convert(item.yMm, 'mm', 'px', dpi);
        const w = UnitConverter.convert(item.widthMm, 'mm', 'px', dpi);
        const h = UnitConverter.convert(item.heightMm, 'mm', 'px', dpi);
        
        ctx.save();
        // Create clipping mask to safeguard slot boundary containment
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();

        const rotation = item.rotationDegrees || 0;
        if (rotation !== 0) {
          // Translate to the center of the slot, rotate, then draw image centered.
          // Transpose draw width and height to preserve the aspect ratio of the rotated image.
          ctx.translate(x + w / 2, y + h / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(img, -h / 2, -w / 2, h, w);
        } else {
          ctx.drawImage(img, x, y, w, h);
        }
        ctx.restore();
      }
    }

    // 2. Draw Borders
    for (const border of scene.borders) {
      ctx.strokeStyle = border.colorHex;
      ctx.lineWidth = Math.max(1, UnitConverter.convert(border.thicknessMm, 'mm', 'px', dpi));
      const x = UnitConverter.convert(border.xMm, 'mm', 'px', dpi);
      const y = UnitConverter.convert(border.yMm, 'mm', 'px', dpi);
      const w = UnitConverter.convert(border.widthMm, 'mm', 'px', dpi);
      const h = UnitConverter.convert(border.heightMm, 'mm', 'px', dpi);
      ctx.strokeRect(x, y, w, h);
    }

    // 3. Draw Cut Lines
    if (scene.cutLines.length > 0) {
      const dashLen = UnitConverter.convert(1, 'mm', 'px', dpi);
      ctx.setLineDash([dashLen, dashLen]);

      for (const line of scene.cutLines) {
        ctx.strokeStyle = line.colorHex;
        ctx.lineWidth = Math.max(1, UnitConverter.convert(line.thicknessMm, 'mm', 'px', dpi));
        const x1 = UnitConverter.convert(line.x1Mm, 'mm', 'px', dpi);
        const y1 = UnitConverter.convert(line.y1Mm, 'mm', 'px', dpi);
        const x2 = UnitConverter.convert(line.x2Mm, 'mm', 'px', dpi);
        const y2 = UnitConverter.convert(line.y2Mm, 'mm', 'px', dpi);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    return canvas;
  }
} as const;
