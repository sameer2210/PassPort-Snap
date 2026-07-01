import { RenderScene, PreviewLayout, Coordinate } from '../contracts/types';

export function getPreviewLayout(scene: RenderScene): PreviewLayout {
  const slots: Coordinate[] = scene.items.map(item => ({
    x: item.xMm,
    y: item.yMm
  }));

  const firstItem = scene.items[0];
  const slotWidthMm = firstItem ? firstItem.widthMm : 0;
  const slotHeightMm = firstItem ? firstItem.heightMm : 0;

  return {
    paperWidthMm: scene.paperWidthMm,
    paperHeightMm: scene.paperHeightMm,
    slotWidthMm,
    slotHeightMm,
    slots,
    containerWidthMm: scene.paperWidthMm,
    containerHeightMm: scene.paperHeightMm
  };
}
