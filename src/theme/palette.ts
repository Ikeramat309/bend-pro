/**
 * Bend Pro semantic color palettes — dark and light.
 *
 * Both palettes share the SAME keys so any component can read the active
 * palette from `useTheme()` and switch cleanly. The legacy `colors` export
 * (see `colors.ts`) is the dark palette, so components not yet migrated to the
 * theme hook keep rendering in dark without changes.
 *
 * Palette philosophy (function over decoration):
 * - Neutral surfaces, soft text.
 * - One calm blue `primary` for interactive affordances only.
 * - `mark` (orange) is reserved for the cut/bend mark — the one hot color.
 * - `success` (green) is the bend / take-up zone.
 */
export type ThemePalette = {
  background: string;
  screen: string;
  surface: string;
  surface2: string;
  border: string;

  text: string;
  muted: string;

  primary: string;
  mark: string;
  warning: string;
  success: string;
  error: string;

  /** primary at low alpha — tinted rows / guided mode */
  primaryMuted: string;
  primaryBorder: string;

  /** warning at low alpha — warning strips, badges, chips */
  warningTint: string;
  warningTintBorder: string;

  /** modal sheet scrim behind bottom sheets */
  sheetBackdrop: string;
};

export const darkColors: ThemePalette = {
  background: '#0B0E13',
  screen: '#0E121A',
  surface: '#141A24',
  surface2: '#1A2230',
  border: '#263142',

  text: '#F4F6F9',
  muted: '#8A94A3',

  primary: '#4C8DFF',
  mark: '#FF7A2F',
  warning: '#FFD22E',
  success: '#4ADE80',
  error: '#EF4444',

  primaryMuted: 'rgba(76, 141, 255, 0.14)',
  primaryBorder: 'rgba(76, 141, 255, 0.32)',

  warningTint: 'rgba(255, 210, 46, 0.08)',
  warningTintBorder: 'rgba(255, 210, 46, 0.35)',

  sheetBackdrop: 'rgba(5, 7, 11, 0.86)',
};

export const lightColors: ThemePalette = {
  background: '#F5F7FA',
  screen: '#FFFFFF',
  surface: '#FFFFFF',
  surface2: '#E4E9F0',
  border: '#C8D0DA',

  text: '#0E1116',
  muted: '#566070',

  primary: '#2F6BFF',
  mark: '#E8590C',
  warning: '#B45309',
  success: '#16A34A',
  error: '#DC2626',

  primaryMuted: 'rgba(47, 107, 255, 0.10)',
  primaryBorder: 'rgba(47, 107, 255, 0.30)',

  warningTint: 'rgba(180, 83, 9, 0.12)',
  warningTintBorder: 'rgba(180, 83, 9, 0.32)',

  sheetBackdrop: 'rgba(14, 17, 22, 0.45)',
};

export type ColorScheme = 'light' | 'dark';

export function getPalette(scheme: ColorScheme): ThemePalette {
  return scheme === 'light' ? lightColors : darkColors;
}
