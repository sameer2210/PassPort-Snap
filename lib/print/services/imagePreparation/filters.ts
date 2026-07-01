import { ICanvasContext } from '../../adapters/canvasAdapter';

export function applyFilters(
  ctx: ICanvasContext,
  brightness: number, // 0 to 2, 1 is normal
  contrast: number // 0 to 2, 1 is normal
): void {
  if (brightness === 1 && contrast === 1) return;
  const bPercent = Math.round(brightness * 100);
  const cPercent = Math.round(contrast * 100);
  ctx.setFilter(`brightness(${bPercent}%) contrast(${cPercent}%)`);
}

export function clearFilters(ctx: ICanvasContext): void {
  ctx.clearFilter();
}
