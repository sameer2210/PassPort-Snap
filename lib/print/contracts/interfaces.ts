import { PaperSize, PhotoTemplate } from './types';

export interface ILayoutEngine {
  calculateGrid(
    paper: PaperSize,
    template: PhotoTemplate,
    marginMm: number,
    gutterMm: number
  ): unknown;
}
