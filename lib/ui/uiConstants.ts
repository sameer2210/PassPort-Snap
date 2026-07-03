export const UI_COLORS = {
  brand: {
    primary: '#1565F0',    // Main brand blue
    hover: '#0F56D9',      // Hover state blue
    pressed: '#0C47B7',    // Active/pressed state blue
    light: '#EAF3FF',      // Accent backgrounds
    background: '#F7FAFF', // Neutral page backgrounds
    border: '#D8E7FF',     // Subtle borders
    accent: '#0B3C8C',     // Dark navy accents
  },
  neutral: {
    background: '#FFFFFF', // Page content card background
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray700: '#374151',
    gray900: '#111827',
  },
  success: {
    primary: '#16A34A',
    light: '#DCFCE7',
    text: '#15803D',
  },
  warning: {
    primary: '#F59E0B',
    light: '#FEF3C7',
    text: '#B45309',
  },
  danger: {
    primary: '#DC2626',
    light: '#FEE2E2',
    text: '#B91C1C',
  },
} as const;

export const UI_RADIUS = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
} as const;

export const UI_SHADOWS = {
  sm: '0 1px 2px rgba(11, 30, 58, 0.06)',
  md: '0 4px 12px rgba(11, 30, 58, 0.08)',
  lg: '0 12px 30px rgba(11, 30, 58, 0.10)',
} as const;

export const UI_TRANSITIONS = {
  hover: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  dropdown: '200ms cubic-bezier(0.16, 1, 0.3, 1)',
  cards: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  buttons: '120ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const UI_CONTAINERS = {
  maxPageWidth: '1200px',
  maxWizardWidth: '1000px',
  maxUploadWidth: '600px',
} as const;

export const UI_Z_INDEX = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  overlay: 200,
  modal: 300,
} as const;

export const WIZARD_STEPS = [
  { step: 1, label: 'Photo Size', desc: 'Choose country sizes' },
  { step: 2, label: 'Upload Photo', desc: 'Import portrait image' },
  { step: 3, label: 'Crop & Center', desc: 'Face auto-alignment' },
  { step: 4, label: 'Background AI', desc: 'Normalize canvas color' },
  { step: 5, label: 'Print Dashboard', desc: 'Grid tiling & PDF sheet' },
] as const;
