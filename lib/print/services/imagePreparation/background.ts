import { ICanvasContext } from '../../adapters/canvasAdapter';

export function applyBackground(
  ctx: ICanvasContext,
  width: number,
  height: number,
  colorHex: string = '#ffffff'
): void {
  ctx.setFillStyle(colorHex);
  ctx.fillRect(0, 0, width, height);
}
