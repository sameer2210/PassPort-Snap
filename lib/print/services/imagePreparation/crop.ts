import { ICanvasContext } from '../../adapters/canvasAdapter';

export interface CropArea {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export function applyCrop(
  ctx: ICanvasContext,
  image: CanvasImageSource,
  crop: CropArea,
  destWidth: number,
  destHeight: number
): void {
  ctx.drawImageCrop(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    destWidth,
    destHeight
  );
}
