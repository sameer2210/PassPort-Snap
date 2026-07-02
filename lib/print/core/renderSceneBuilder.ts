import { LayoutResult, RenderScene, SceneItem, BorderItem, CutLineItem } from '../contracts/types';
import { PRINT_ENGINE_VERSION } from '../constants/printConstants';

export interface SceneBuildOptions {
  readonly layout: LayoutResult;
  readonly slots: readonly (string | null)[];
  readonly images: Record<string, string>; // Maps slot ID to prepared image reference
  readonly addBorder: boolean;
  readonly showCutlines: boolean;
}

export const RenderSceneBuilder = {
  build: (options: SceneBuildOptions): RenderScene => {
    const { layout, slots, images, addBorder, showCutlines } = options;
    const {
      paperWidthMm,
      paperHeightMm,
      slotWidthMm,
      slotHeightMm,
      marginLeft,
      marginTop,
      gutterHorizontal,
      gutterVertical,
      rows,
      columns,
      coordinates,
      photoRotation,
    } = layout;

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
        widthMm: slotWidthMm,
        heightMm: slotHeightMm,
        rotationDegrees: photoRotation
      });

      if (addBorder && slotRef) {
        borders.push({
          xMm: coord.x,
          yMm: coord.y,
          widthMm: slotWidthMm,
          heightMm: slotHeightMm,
          thicknessMm: 0.2,
          colorHex: '#000000'
        });
      }
    });

    if (showCutlines && rows > 0 && columns > 0) {
      const totalGridW = columns * slotWidthMm + (columns - 1) * gutterHorizontal;
      const totalGridH = rows * slotHeightMm + (rows - 1) * gutterVertical;

      for (let c = 1; c < columns; c++) {
        const x = marginLeft + c * slotWidthMm + c * gutterHorizontal - gutterHorizontal / 2;
        cutLines.push({
          x1Mm: x,
          y1Mm: marginTop,
          x2Mm: x,
          y2Mm: marginTop + totalGridH,
          thicknessMm: 0.2,
          colorHex: '#969696',
          style: 'dashed'
        });
      }

      for (let r = 1; r < rows; r++) {
        const y = marginTop + r * slotHeightMm + r * gutterVertical - gutterVertical / 2;
        cutLines.push({
          x1Mm: marginLeft,
          y1Mm: y,
          x2Mm: marginLeft + totalGridW,
          y2Mm: y,
          thicknessMm: 0.2,
          colorHex: '#969696',
          style: 'dashed'
        });
      }
    }

    return {
      paperWidthMm,
      paperHeightMm,
      orientation: layout.paperOrientation,
      marginMm: marginLeft,
      items,
      borders,
      cutLines,
      safeAreaMm: marginLeft,
      metadata: {
        paperId: layout.paperId,
        templateId: layout.templateId,
        engineVersion: PRINT_ENGINE_VERSION,
        timestamp: Date.now()
      }
    };
  }
};
