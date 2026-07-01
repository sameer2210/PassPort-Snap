import { ICanvasContext } from '../../adapters/canvasAdapter';

export function applyRotation(
  ctx: ICanvasContext,
  rotationDegrees: number,
  centerX: number,
  centerY: number
): void {
  if (rotationDegrees === 0) return;
  ctx.translate(centerX, centerY);
  ctx.rotate((rotationDegrees * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
}
