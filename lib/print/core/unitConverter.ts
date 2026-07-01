import { PRINT_CONSTANTS } from '../constants/printConstants';

export type Unit = 'mm' | 'cm' | 'inch' | 'px' | 'pt';

const CONVERSION_FACTORS: Record<Exclude<Unit, 'px'>, number> = {
  mm: 1,
  cm: 0.1,
  inch: 1 / PRINT_CONSTANTS.MM_TO_INCH,
  pt: PRINT_CONSTANTS.PT_TO_INCH / PRINT_CONSTANTS.MM_TO_INCH
};

export const UnitConverter = {
  convert: (value: number, from: Unit, to: Unit, dpi: number = 300): number => {
    if (from === to) return value;

    // 1. Convert source unit to standard millimeter (mm)
    let valueMm = 0;
    if (from === 'px') {
      valueMm = (value * PRINT_CONSTANTS.MM_TO_INCH) / dpi;
    } else {
      valueMm = value / CONVERSION_FACTORS[from];
    }

    // 2. Convert standard millimeter to target unit
    if (to === 'px') {
      return Math.round((valueMm / PRINT_CONSTANTS.MM_TO_INCH) * dpi);
    }
    return valueMm * CONVERSION_FACTORS[to];
  }
} as const;
