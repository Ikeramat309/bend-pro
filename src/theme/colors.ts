/**
 * Bend Pro design tokens.
 *
 * `colors` is the DARK palette and the backward-compatible default for any
 * component not yet migrated to the runtime theme. New / migrated components
 * should read the active palette from `useTheme()` (see `ThemeContext.tsx`) so
 * they respond to light/dark. Both palettes live in `palette.ts`.
 */
import { darkColors, type ThemePalette } from './palette';

export const colors: ThemePalette = darkColors;

export type BendColor = keyof ThemePalette;
