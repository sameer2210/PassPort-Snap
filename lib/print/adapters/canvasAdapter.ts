export interface ICanvas {
  readonly width: number;
  readonly height: number;
  getContext2D(): ICanvasContext | null;
  toDataURL(mimeType: string, quality?: number): string;
  toBlob(callback: (blob: Blob | null) => void, mimeType: string, quality?: number): void;
}

export interface ICanvasContext {
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
  drawImageCrop(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  translate(x: number, y: number): void;
  rotate(angle: number): void;
  getImageData(x: number, y: number, w: number, h: number): ImageData;
  putImageData(data: ImageData, x: number, y: number): void;
  setFilter(filterStr: string): void;
  clearFilter(): void;
  setFillStyle(color: string): void;
}

export class BrowserCanvas implements ICanvas {
  private canvas: HTMLCanvasElement;

  constructor(public readonly width: number, public readonly height: number) {
    if (typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
    } else {
      // Fallback for environment without document (e.g. Node/Workers)
      this.canvas = {} as HTMLCanvasElement;
    }
  }

  getContext2D(): ICanvasContext | null {
    if (!this.canvas.getContext) return null;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return null;
    return new BrowserCanvasContext(ctx);
  }

  toDataURL(mimeType: string, quality?: number): string {
    return this.canvas.toDataURL(mimeType, quality);
  }

  toBlob(callback: (blob: Blob | null) => void, mimeType: string, quality?: number): void {
    this.canvas.toBlob(callback, mimeType, quality);
  }
}

class BrowserCanvasContext implements ICanvasContext {
  constructor(private ctx: CanvasRenderingContext2D) {}

  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void {
    this.ctx.drawImage(image, dx, dy, dw, dh);
  }

  drawImageCrop(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void {
    this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    this.ctx.fillRect(x, y, w, h);
  }

  translate(x: number, y: number): void {
    this.ctx.translate(x, y);
  }

  rotate(angle: number): void {
    this.ctx.rotate(angle);
  }

  getImageData(x: number, y: number, w: number, h: number): ImageData {
    return this.ctx.getImageData(x, y, w, h);
  }

  putImageData(data: ImageData, x: number, y: number): void {
    this.ctx.putImageData(data, x, y);
  }

  setFilter(filterStr: string): void {
    this.ctx.filter = filterStr;
  }

  clearFilter(): void {
    this.ctx.filter = 'none';
  }

  setFillStyle(color: string): void {
    this.ctx.fillStyle = color;
  }
}
