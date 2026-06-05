/**
 * Pipe Workspace design tokens — premium dark field-tool palette.
 * Use for shared workspace UI under src/shared/.
 */
import { radius as baseRadius, spacing as baseSpacing } from './spacing';

export { layout } from './spacing';

export const workspaceColors = {
  background: '#05070B',
  surface: '#101722',
  surfaceElevated: '#151E2B',
  border: '#263142',
  borderSubtle: 'rgba(38, 49, 66, 0.65)',

  textPrimary: '#F6F8FB',
  textSecondary: '#C5CED8',
  textMuted: '#8F9BAD',

  accentBlue: '#35BDF8',
  accentBlueSoft: 'rgba(53, 189, 248, 0.14)',
  accentBlueBorder: 'rgba(53, 189, 248, 0.35)',

  accentOrange: '#FF7A2F',
  accentOrangeSoft: 'rgba(255, 122, 47, 0.14)',
  accentOrangeBorder: 'rgba(255, 122, 47, 0.4)',

  pipeSteel: '#7A8694',
  pipeDark: '#4A5568',
  pipeHighlight: 'rgba(246, 248, 251, 0.18)',

  gridLine: 'rgba(143, 155, 173, 0.08)',
  gridLineStrong: 'rgba(143, 155, 173, 0.12)',

  warning: '#FFD22E',
  warningSoft: 'rgba(255, 210, 46, 0.12)',
} as const;

export const workspaceRadius = baseRadius;
export const workspaceSpacing = baseSpacing;

export const workspaceTheme = {
  colors: workspaceColors,
  radius: workspaceRadius,
  spacing: workspaceSpacing,
} as const;

export type WorkspaceColor = keyof typeof workspaceColors;
export type MeasurementChipTone = 'default' | 'blue' | 'orange' | 'warning';
