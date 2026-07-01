import { ICanvasContext } from '../../adapters/canvasAdapter';

export function applyResize(
  ctx: ICanvasContext,
  image: CanvasImageSource,
  targetWidth: number,
  targetHeight: number
): void {
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
}
