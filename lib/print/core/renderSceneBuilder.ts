import { LayoutResult, PhotoTemplate, RenderScene, SceneItem, BorderItem, CutLineItem } from '../contracts/types';
import { PRINT_ENGINE_VERSION } from '../constants/printConstants';

export interface SceneBuildOptions {
  readonly layout: LayoutResult;
  readonly template: PhotoTemplate;
  readonly slots: readonly (string | null)[];
  readonly images: Record<string, string>; // Maps slot ID to prepared image reference
  readonly addBorder: boolean;
  readonly showCutlines: boolean;
}

export const RenderSceneBuilder = {
  build: (options: SceneBuildOptions): RenderScene => {
    const { layout, template, slots, images, addBorder, showCutlines } = options;
    const { paperWidth, paperHeight, coordinates, cols, rows, startX, startY } = layout.geometry;
    const { marginMm, gutterMm } = layout.metadata;

    const items: SceneItem[] = [];
    const borders: BorderItem[] = [];
    const cutLines: CutLineItem[] = [];

    coordinates.forEach((coord, idx) => {
      const slotRef = slots[idx];
      const imageRef = (slotRef && images[slotRef]) ? images[slotRef] : '';

      items.push({
        id: `item-${idx}`,
        imageRef,
        xMm: coord.x,
        yMm: coord.y,
        widthMm: template.widthMm,
        heightMm: template.heightMm,
        rotationDegrees: 0
      });

      if (addBorder && slotRef) {
        borders.push({
          xMm: coord.x,
          yMm: coord.y,
          widthMm: template.widthMm,
          heightMm: template.heightMm,
          thicknessMm: 0.2,
          colorHex: '#000000'
        });
      }
    });

    if (showCutlines && rows > 0 && cols > 0) {
      const totalGridW = cols * template.widthMm + (cols - 1) * gutterMm;
      const totalGridH = rows * template.heightMm + (rows - 1) * gutterMm;

      for (let c = 1; c < cols; c++) {
        const x = startX + c * template.widthMm + c * gutterMm - gutterMm / 2;
        cutLines.push({
          x1Mm: x,
          y1Mm: startY,
          x2Mm: x,
          y2Mm: startY + totalGridH,
          thicknessMm: 0.2,
          colorHex: '#969696',
          style: 'dashed'
        });
      }

      for (let r = 1; r < rows; r++) {
        const y = startY + r * template.heightMm + r * gutterMm - gutterMm / 2;
        cutLines.push({
          x1Mm: startX,
          y1Mm: y,
          x2Mm: startX + totalGridW,
          y2Mm: y,
          thicknessMm: 0.2,
          colorHex: '#969696',
          style: 'dashed'
        });
      }
    }

    return {
      paperWidthMm: paperWidth,
      paperHeightMm: paperHeight,
      orientation: layout.metadata.orientation,
      marginMm,
      items,
      borders,
      cutLines,
      safeAreaMm: marginMm,
      metadata: {
        paperId: layout.metadata.paperId,
        templateId: layout.metadata.templateId,
        engineVersion: PRINT_ENGINE_VERSION,
        timestamp: Date.now()
      }
    };
  }
};
