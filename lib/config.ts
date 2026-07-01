import { PaperRegistry } from './print/registry/paperRegistry';
import { TemplateRegistry } from './print/registry/templateRegistry';
import { PhotoTemplate, SheetSize } from './types';
import { UnitConverter } from './print/core/unitConverter';

export const templates: PhotoTemplate[] = TemplateRegistry.getAll().map(t => ({
  id: t.id,
  label: t.label,
  widthMm: t.widthMm,
  heightMm: t.heightMm,
  printWidthPx: t.printWidthPx,
  printHeightPx: t.printHeightPx,
  countries: t.countries,
}));

export const sheetSizes: SheetSize[] = PaperRegistry.getAll().map(p => ({
  id: p.id,
  label: p.label,
  widthMm: p.physical.widthMm,
  heightMm: p.physical.heightMm,
  widthPx: UnitConverter.convert(p.physical.widthMm, 'mm', 'px', 300),
  heightPx: UnitConverter.convert(p.physical.heightMm, 'mm', 'px', 300)
}));

