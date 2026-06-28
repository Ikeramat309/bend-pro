import { colors } from '@/theme';
import { lightColors } from '@/theme/palette';

export type DiagramTheme = {
  canvas: string;
  border: string;
  pipe: string;
  pipeCore: string;
  pipeSheen: string;
  pipeHighlight: string;
  pipeShadow: string;
  pipeGradientStops: readonly { offset: number; color: string }[];
  mark: string;
  markGlow: string;
  deduct: string;
  deductStroke: string;
  bendZone: {
    fill: string;
    stroke: string;
  };
  dimension: string;
  dimensionStrong: string;
  label: string;
  mutedLabel: string;
  calloutFill: string;
  calloutStroke: string;
  ghostMessage: string;
  arrowFill: string;
  flowArrow: string;
  obstruction: {
    fill: string;
    stroke: string;
  };
  bendBadge: {
    fill: string;
    stroke: string;
    text: string;
    primaryFill: string;
    primaryStroke: string;
    primaryText: string;
  };
  ghost: {
    pipeShadowOpacity: number;
    markOpacity: number;
    dimensionOpacity: number;
    obstructionFill: string;
    obstructionStroke: string;
    calloutFill: string;
    calloutStroke: string;
    calloutInvalidStroke: string;
  };
};

/** Dark canvas palette — canvas matches app background for a seamless well. */
export const darkDiagram: DiagramTheme = {
  canvas: '#0B0E13',
  border: 'rgba(38, 49, 66, 0.85)',
  pipe: '#7C8896',
  pipeCore: '#39424E',
  /** Bright steel sheen band for the brushed galvanized pipe gradient. */
  pipeSheen: '#D2DAE3',
  pipeHighlight: 'rgba(246, 248, 251, 0.12)',
  pipeShadow: 'rgba(57, 66, 78, 0.14)',
  /**
   * Brushed steel pipe gradient — cool gray edges with an offset bright sheen band
   * so the conduit reads like galvanized EMT without stealing color from marks/zones.
   */
  pipeGradientStops: [
    { offset: 0, color: '#46505E' },
    { offset: 0.32, color: '#D2DAE3' },
    { offset: 0.6, color: '#7C8896' },
    { offset: 1, color: '#39424E' },
  ],
  /** Bend / deduct marks on the pipe. */
  mark: colors.mark,
  markGlow: 'rgba(255, 122, 47, 0.22)',
  deduct: 'rgba(255, 122, 47, 0.1)',
  deductStroke: 'rgba(255, 122, 47, 0.55)',
  /** Green bend-radius (take-up) zone highlight — the area the shoe forms. */
  bendZone: {
    fill: 'rgba(74, 222, 128, 0.16)',
    stroke: 'rgba(74, 222, 128, 0.62)',
  },
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
};

/** Light canvas palette — canvas matches app background for a seamless well. */
export const lightDiagram: DiagramTheme = {
  canvas: lightColors.background,
  border: 'rgba(217, 222, 230, 0.95)',
  pipe: '#9BA7B5',
  pipeCore: '#5A6573',
  pipeSheen: '#EDF1F5',
  pipeHighlight: 'rgba(14, 17, 22, 0.06)',
  pipeShadow: 'rgba(90, 100, 112, 0.12)',
  pipeGradientStops: [
    { offset: 0, color: '#6B7785' },
    { offset: 0.32, color: '#EDF1F5' },
    { offset: 0.6, color: '#9BA7B5' },
    { offset: 1, color: '#5A6573' },
  ],
  mark: lightColors.mark,
  markGlow: 'rgba(232, 89, 12, 0.22)',
  deduct: 'rgba(232, 89, 12, 0.1)',
  deductStroke: 'rgba(232, 89, 12, 0.55)',
  bendZone: {
    fill: 'rgba(22, 163, 74, 0.16)',
    stroke: 'rgba(22, 163, 74, 0.62)',
  },
  dimension: 'rgba(91, 100, 112, 0.55)',
  dimensionStrong: 'rgba(14, 17, 22, 0.75)',
  label: lightColors.text,
  mutedLabel: lightColors.muted,
  calloutFill: 'rgba(255, 255, 255, 0.94)',
  calloutStroke: 'rgba(217, 222, 230, 0.95)',
  ghostMessage: lightColors.muted,
  arrowFill: lightColors.muted,
  flowArrow: lightColors.primary,
  obstruction: {
    fill: 'rgba(91, 100, 112, 0.12)',
    stroke: 'rgba(91, 100, 112, 0.48)',
  },
  bendBadge: {
    fill: lightColors.surface2,
    stroke: lightColors.border,
    text: lightColors.text,
    primaryFill: lightColors.primaryMuted,
    primaryStroke: lightColors.primaryBorder,
    primaryText: lightColors.primary,
  },
  ghost: {
    pipeShadowOpacity: 0.55,
    markOpacity: 0.38,
    dimensionOpacity: 0.34,
    obstructionFill: 'rgba(91, 100, 112, 0.08)',
    obstructionStroke: 'rgba(91, 100, 112, 0.28)',
    calloutFill: 'rgba(255, 255, 255, 0.88)',
    calloutStroke: 'rgba(217, 222, 230, 0.85)',
    calloutInvalidStroke: 'rgba(232, 89, 12, 0.45)',
  },
};

/** Backward-compatible alias — static dark palette for unmigrated call sites. */
export const diagramTheme = darkDiagram;

export function getDiagramTheme(scheme: 'light' | 'dark'): DiagramTheme {
  return scheme === 'light' ? lightDiagram : darkDiagram;
}

export const diagramMetrics = {
  width: 360,
  height: 300,
  pipeStroke: 19,
  markStroke: 2.5,
  dimensionStroke: 1,
  extensionStroke: 0.75,
  arrowSize: 4.5,
  ghostPipeOpacity: 0.22,
} as const;
