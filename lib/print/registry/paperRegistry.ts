import { PaperSize, ExportType } from '../contracts/types';

export class PaperRegistry {
  private static readonly registry = new Map<string, PaperSize>([
    [
      '3R',
      {
        id: '3R',
        label: '3.5 × 5 inch (3R)',
        physical: { widthMm: 88.9, heightMm: 127.0 },
        printable: { marginMm: 4, gutterMm: 2 },
        supportedExports: [ExportType.PDF, ExportType.PRINT],
        displayOrder: 1
      }
    ],
    [
      '4R',
      {
        id: '4R',
        label: '4 × 6 inch (4R)',
        physical: { widthMm: 101.6, heightMm: 152.4 },
        printable: { marginMm: 4, gutterMm: 2 },
        supportedExports: [ExportType.PDF, ExportType.PRINT],
        displayOrder: 2
      }
    ],
    [
      '5R',
      {
        id: '5R',
        label: '5 × 7 inch (5R)',
        physical: { widthMm: 127.0, heightMm: 177.8 },
        printable: { marginMm: 4, gutterMm: 2 },
        supportedExports: [ExportType.PDF, ExportType.PRINT],
        displayOrder: 3
      }
    ],
    [
      'A5',
      {
        id: 'A5',
        label: 'A5 Size',
        physical: { widthMm: 148.0, heightMm: 210.0 },
        printable: { marginMm: 4, gutterMm: 2 },
        supportedExports: [ExportType.PDF, ExportType.PRINT],
        displayOrder: 4
      }
    ],
    [
      'A4',
      {
        id: 'A4',
        label: 'A4 Size',
        physical: { widthMm: 210.0, heightMm: 297.0 },
        printable: { marginMm: 4, gutterMm: 2 },
        supportedExports: [ExportType.PDF, ExportType.PRINT],
        displayOrder: 5
      }
    ]
  ]);

  static get(id: string): PaperSize | undefined {
    let lookupId = id;
    if (id === '4x6') lookupId = '4R';
    if (id === '5x7') lookupId = '5R';
    return this.registry.get(lookupId);
  }

  static getAll(): readonly PaperSize[] {
    return Array.from(this.registry.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  static exists(id: string): boolean {
    return this.registry.has(id);
  }
}
