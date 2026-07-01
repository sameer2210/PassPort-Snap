import { PhotoTemplate } from '../contracts/types';

export class TemplateRegistry {
  private static readonly registry = new Map<string, PhotoTemplate>([
    [
      'india',
      {
        id: 'india',
        label: 'India Passport (35x45mm)',
        widthMm: 35,
        heightMm: 45,
        printWidthPx: 413,
        printHeightPx: 531,
        countries: 'India'
      }
    ],
    [
      'usa',
      {
        id: 'usa',
        label: 'USA (2x2 inch)',
        widthMm: 51,
        heightMm: 51,
        printWidthPx: 602,
        printHeightPx: 602,
        countries: 'USA'
      }
    ],
    [
      'philippines',
      {
        id: 'philippines',
        label: 'Philippines (35x45mm)',
        widthMm: 35,
        heightMm: 45,
        printWidthPx: 413,
        printHeightPx: 531,
        countries: 'Philippines'
      }
    ],
    [
      'uk-europe',
      {
        id: 'uk-europe',
        label: 'UK, Europe, Australia',
        widthMm: 35,
        heightMm: 45,
        printWidthPx: 413,
        printHeightPx: 531,
        countries: 'UK, Germany, France, Japan, Australia'
      }
    ],
    [
      'canada',
      {
        id: 'canada',
        label: 'Canada (50x70mm)',
        widthMm: 50,
        heightMm: 70,
        printWidthPx: 591,
        printHeightPx: 827,
        countries: 'Canada'
      }
    ],
    [
      'china',
      {
        id: 'china',
        label: 'China (33x48mm)',
        widthMm: 33,
        heightMm: 48,
        printWidthPx: 390,
        printHeightPx: 567,
        countries: 'China'
      }
    ],
    [
      'uae-saudi',
      {
        id: 'uae-saudi',
        label: 'UAE / Saudi (40x60mm)',
        widthMm: 40,
        heightMm: 60,
        printWidthPx: 472,
        printHeightPx: 709,
        countries: 'UAE, Saudi Arabia'
      }
    ]
  ]);

  static get(id: string): PhotoTemplate | undefined {
    return this.registry.get(id);
  }

  static getAll(): readonly PhotoTemplate[] {
    return Array.from(this.registry.values());
  }

  static exists(id: string): boolean {
    return this.registry.has(id);
  }
}
