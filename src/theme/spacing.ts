/**
 * FILE: src/theme/spacing.ts
 *
 * Spacing scale from Figma handoff — 4px base grid.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
} as const;

/** Minimum touch target for field / glove use */
export const touchTarget = 48;

export const layout = {
  maxContentWidth: 448,
  topBarHeight: 56,
  bottomNavHeight: 64,
} as const;
