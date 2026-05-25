/**
 * FILE: src/theme/typography.ts
 *
 * Typography scale from Bend Pro design system.
 */

import type { TextStyle } from 'react-native';

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  result: 40,
  hero: 48,
} as const;

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const typography = {
  screenTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: 24,
  } satisfies TextStyle,
  subtitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: 20,
  } satisfies TextStyle,
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: 20,
  } satisfies TextStyle,
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: 22,
  } satisfies TextStyle,
  chip: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: 18,
  } satisfies TextStyle,
  inputLarge: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semibold,
    lineHeight: 30,
  } satisfies TextStyle,
  resultValue: {
    fontSize: fontSize.result,
    fontWeight: fontWeight.bold,
    lineHeight: 44,
  } satisfies TextStyle,
  resultUnit: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    lineHeight: 26,
  } satisfies TextStyle,
  tabLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: 16,
  } satisfies TextStyle,
} as const;
