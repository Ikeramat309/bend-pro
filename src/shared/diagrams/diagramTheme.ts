import { colors } from '@/theme';

/** Shared SVG colors and stroke sizes for pipe diagrams. */
export const diagramTheme = {
  canvas: '#080E16',
  border: 'rgba(38, 49, 66, 0.85)',
  pipe: '#5BA8C9',
  pipeCore: '#2E7FA3',
  pipeHighlight: 'rgba(246, 248, 251, 0.14)',
  pipeShadow: 'rgba(43, 127, 168, 0.1)',
  /** Bend / deduct marks on the pipe. */
  mark: colors.mark,
  markGlow: 'rgba(255, 122, 47, 0.22)',
  deduct: 'rgba(255, 122, 47, 0.1)',
  deductStroke: 'rgba(255, 122, 47, 0.55)',
  dimension: 'rgba(143, 155, 173, 0.55)',
  dimensionStrong: 'rgba(246, 248, 251, 0.65)',
  label: colors.text,
  mutedLabel: colors.muted,
  calloutFill: 'rgba(8, 14, 22, 0.94)',
  calloutStroke: 'rgba(38, 49, 66, 0.9)',
  ghostMessage: colors.muted,
  arrowFill: colors.muted,
  flowArrow: colors.primary,
  obstruction: {
    fill: 'rgba(143, 155, 173, 0.16)',
    stroke: 'rgba(143, 155, 173, 0.58)',
  },
  bendBadge: {
    fill: colors.surface2,
    stroke: colors.border,
    text: colors.text,
    primaryFill: colors.primaryMuted,
    primaryStroke: colors.primaryBorder,
    primaryText: colors.primary,
  },
  /** Empty / preview diagram chrome — shared across all calculators. */
  ghost: {
    pipeShadowOpacity: 0.55,
    markOpacity: 0.38,
    dimensionOpacity: 0.34,
    obstructionFill: 'rgba(143, 155, 173, 0.1)',
    obstructionStroke: 'rgba(143, 155, 173, 0.32)',
    calloutFill: 'rgba(8, 14, 22, 0.82)',
    calloutStroke: 'rgba(38, 49, 66, 0.75)',
    calloutInvalidStroke: 'rgba(255, 122, 47, 0.45)',
  },
} as const;

export const diagramMetrics = {
  width: 360,
  height: 300,
  pipeStroke: 11,
  markStroke: 2.5,
  dimensionStroke: 1,
  extensionStroke: 0.75,
  arrowSize: 4.5,
  ghostPipeOpacity: 0.22,
} as const;
