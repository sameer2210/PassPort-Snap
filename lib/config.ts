import { PhotoTemplate, SheetSize } from './types';

// outputPixels = Math.round( (dimensionMM / 25.4) * 300 )
export const templates: PhotoTemplate[] = [
  {
    id: 'india',
    label: 'India Passport (35x45mm)',
    widthMm: 35,
    heightMm: 45,
    printWidthPx: 413,
    printHeightPx: 531,
    countries: 'India',
  },
  {
    id: 'usa',
    label: 'USA (2x2 inch)',
    widthMm: 51,
    heightMm: 51,
    printWidthPx: 602,
    printHeightPx: 602,
    countries: 'USA',
  },
  {
    id: 'philippines',
    label: 'Philippines (35x45mm)',
    widthMm: 35,
    heightMm: 45,
    printWidthPx: 413,
    printHeightPx: 531,
    countries: 'Philippines',
  },
  {
    id: 'uk-europe',
    label: 'UK, Europe, Australia',
    widthMm: 35,
    heightMm: 45,
    printWidthPx: 413,
    printHeightPx: 531,
    countries: 'UK, Germany, France, Japan, Australia',
  },
  {
    id: 'canada',
    label: 'Canada (50x70mm)',
    widthMm: 50,
    heightMm: 70,
    printWidthPx: 591,
    printHeightPx: 827,
    countries: 'Canada',
  },
  {
    id: 'china',
    label: 'China (33x48mm)',
    widthMm: 33,
    heightMm: 48,
    printWidthPx: 390,
    printHeightPx: 567,
    countries: 'China',
  },
  {
    id: 'uae-saudi',
    label: 'UAE / Saudi (40x60mm)',
    widthMm: 40,
    heightMm: 60,
    printWidthPx: 472,
    printHeightPx: 709,
    countries: 'UAE, Saudi Arabia',
  }
];

export const sheetSizes: SheetSize[] = [
  { id: '4x6', label: '4x6 inch', widthMm: 102, heightMm: 152, widthPx: 1205, heightPx: 1795 },
  { id: '5x7', label: '5x7 inch', widthMm: 127, heightMm: 178, widthPx: 1500, heightPx: 2102 },
  { id: 'A4', label: 'A4 Size', widthMm: 210, heightMm: 297, widthPx: 2480, heightPx: 3508 }
];
