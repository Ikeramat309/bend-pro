import { Platform, StyleSheet } from 'react-native';

/** Electrician-focused palette — optimized for dark job-site use. */
export const CalculatorColors = {
  dark: {
    background: '#0B0E12',
    backgroundElevated: '#141A22',
    card: '#1A222D',
    cardBorder: '#2A3544',
    cardSelected: '#243040',
    text: '#F2F5F8',
    textSecondary: '#8B98A8',
    textMuted: '#5C6B7A',
    accent: '#F5A623',
    accentMuted: '#C4841C',
    accentText: '#0B0E12',
    primary: '#3B9EFF',
    primaryMuted: '#2563A8',
    success: '#3DD68C',
    danger: '#F07178',
    inputBackground: '#10161E',
    inputBorder: '#2E3A4A',
    inputBorderFocus: '#3B9EFF',
    segmentInactive: '#1E2732',
    segmentActive: '#F5A623',
    chipInactive: '#1E2732',
    chipActive: '#3B9EFF',
    resultHighlight: '#1E3A2F',
    resultHighlightBorder: '#3DD68C',
  },
  light: {
    background: '#E8ECF0',
    backgroundElevated: '#F4F6F8',
    card: '#FFFFFF',
    cardBorder: '#C5CED8',
    cardSelected: '#E2E8F0',
    text: '#0F1419',
    textSecondary: '#4A5568',
    textMuted: '#718096',
    accent: '#D97706',
    accentMuted: '#B45309',
    accentText: '#FFFFFF',
    primary: '#2563EB',
    primaryMuted: '#1D4ED8',
    success: '#059669',
    danger: '#DC2626',
    inputBackground: '#FFFFFF',
    inputBorder: '#CBD5E0',
    inputBorderFocus: '#2563EB',
    segmentInactive: '#E2E8F0',
    segmentActive: '#D97706',
    chipInactive: '#E2E8F0',
    chipActive: '#2563EB',
    resultHighlight: '#ECFDF5',
    resultHighlightBorder: '#059669',
  },
} as const;

export type CalculatorColorScheme = keyof typeof CalculatorColors;

export const CalculatorTypography = {
  title: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  subtitle: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  input: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  resultTitle: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  resultValue: { fontSize: 32, fontWeight: '700' as const, lineHeight: 38 },
  chip: { fontSize: 14, fontWeight: '600' as const, lineHeight: 18 },
  segment: { fontSize: 15, fontWeight: '600' as const, lineHeight: 20 },
};

export const CalculatorSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Minimum touch target for gloved / job-site use. */
export const TOUCH_TARGET_MIN = 48;

export const CalculatorRadii = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const calculatorSharedStyles = StyleSheet.create({
  card: {
    borderRadius: CalculatorRadii.lg,
    borderWidth: 1,
    padding: CalculatorSpacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CalculatorSpacing.md,
  },
  label: {
    ...CalculatorTypography.label,
    marginBottom: CalculatorSpacing.sm,
  },
});

export const CalculatorShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  android: { elevation: 4 },
  default: {},
});
