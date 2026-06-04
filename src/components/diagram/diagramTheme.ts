import { colors } from '@/theme/colors';

export const conduitDiagramTheme = {
  canvas: '#0D1520',
  border: colors.primaryBorder,
  pipe: '#6FD2F8',
  pipeCore: '#2F9DCD',
  pipeHighlight: 'rgba(246, 248, 251, 0.24)',
  pipeShadow: 'rgba(53, 189, 248, 0.14)',
  mark: colors.mark,
  deduct: 'rgba(232, 121, 249, 0.18)',
  deductStroke: 'rgba(232, 121, 249, 0.86)',
  dimension: 'rgba(143, 155, 173, 0.5)',
  dimensionStrong: colors.text,
  label: colors.text,
  mutedLabel: colors.muted,
  warning: colors.warning,
  arrowFill: colors.muted,
} as const;

export const conduitDiagramMetrics = {
  width: 360,
  height: 300,
  pipeStroke: 13,
  markStroke: 2,
  dimensionStroke: 0.95,
  arrowSize: 5,
} as const;
