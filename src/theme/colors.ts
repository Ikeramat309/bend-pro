/**
 * FILE: src/theme/colors.ts
 *
 * Bend Pro design tokens from Figma handoff (Minimal Mobile UI System).
 * Use for new field-mode UI under src/components/bend/.
 */

export const colors = {
  background: '#05070B',
  screen: '#080C13',
  surface: '#101722',
  surface2: '#151E2B',
  border: '#263142',

  text: '#F6F8FB',
  muted: '#8F9BAD',

  primary: '#35BDF8',
  mark: '#FF7A2F',
  warning: '#FFD22E',
  success: '#4ADE80',
  error: '#EF4444',

  /** Primary at 10% — guided mode / tinted rows */
  primaryMuted: 'rgba(59, 189, 248, 0.12)',
  primaryBorder: 'rgba(59, 189, 248, 0.3)',
} as const;

export type BendColor = keyof typeof colors;
