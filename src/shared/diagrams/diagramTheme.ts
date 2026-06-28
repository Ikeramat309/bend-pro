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

/** Dark canvas palette — unchanged from the original diagramTheme. */
export const darkDiagram: DiagramTheme = {
  canvas: '#080E16',
  border: 'rgba(38, 49, 66, 0.85)',
  pipe: '#5BA8C9',
  pipeCore: '#2E7FA3',
  /** Bright steel sheen band for the metallic pipe gradient. */
  pipeSheen: '#CFE9F6',
  pipeHighlight: 'rgba(246, 248, 251, 0.14)',
  pipeShadow: 'rgba(43, 127, 168, 0.1)',
  /**
   * Metallic pipe gradient — dark edges with an offset bright sheen band so the
   * conduit reads like a lit steel tube while staying lightweight SVG.
   */
  pipeGradientStops: [
    { offset: 0, color: '#2E7FA3' },
    { offset: 0.3, color: '#CFE9F6' },
    { offset: 0.55, color: '#5BA8C9' },
    { offset: 1, color: '#256C8C' },
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

/** Light canvas palette — same keys, tuned for a white diagram well. */
export const lightDiagram: DiagramTheme = {
  canvas: lightColors.screen,
  border: 'rgba(217, 222, 230, 0.95)',
  pipe: '#3D8BB5',
  pipeCore: '#1D5A75',
  pipeSheen: '#D4EEF8',
  pipeHighlight: 'rgba(14, 17, 22, 0.08)',
  pipeShadow: 'rgba(43, 127, 168, 0.14)',
  pipeGradientStops: [
    { offset: 0, color: '#1D5A75' },
    { offset: 0.3, color: '#D4EEF8' },
    { offset: 0.55, color: '#4A9CC4' },
    { offset: 1, color: '#256C8C' },
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
  pipeStroke: 11,
  markStroke: 2.5,
  dimensionStroke: 1,
  extensionStroke: 0.75,
  arrowSize: 4.5,
  ghostPipeOpacity: 0.22,
} as const;
