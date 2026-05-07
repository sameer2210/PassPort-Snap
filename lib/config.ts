import { PhotoTemplate, SheetSize } from './types';

// outputPixels = Math.round( (dimensionMM / 25.4) * 300 )
export const templates: PhotoTemplate[] = [
  {
    id: 'india-usa',
    label: 'India / USA — Most common',
    widthMm: 51,
    heightMm: 51,
    printWidthPx: 602,
    printHeightPx: 602,
    countries: 'India, USA, Philippines',
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
    label: 'Canada',
    widthMm: 50,
    heightMm: 70,
    printWidthPx: 591,
    printHeightPx: 827,
    countries: 'Canada',
  },
  {
    id: 'china',
    label: 'China',
    widthMm: 33,
    heightMm: 48,
    printWidthPx: 390,
    printHeightPx: 567,
    countries: 'China',
  },
  {
    id: 'uae-saudi',
    label: 'UAE / Saudi',
    widthMm: 35,
    heightMm: 45,
    printWidthPx: 413,
    printHeightPx: 531,
    countries: 'UAE, Saudi Arabia, Gulf countries',
  }
];

export const sheetSizes: SheetSize[] = [
  { id: 'A4', label: 'A4', widthMm: 210, heightMm: 297, widthPx: 2480, heightPx: 3508 },
  { id: '4x6', label: '4x6 inch', widthMm: 102, heightMm: 152, widthPx: 1205, heightPx: 1795 },
  { id: '5x7', label: '5x7 inch', widthMm: 127, heightMm: 178, widthPx: 1500, heightPx: 2102 }
];
