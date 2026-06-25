import { colors } from './colors';
import { layout, spacing } from './spacing';
import { fontSize, typography } from './typography';

/** Calculator workspace layout tokens — polish through shared shell, not per-screen. */
export const workspaceTheme = {
  header: {
    minHeight: 48,
    titleSize: fontSize.base,
    subtitleSize: fontSize.xs,
    paddingVertical: spacing.sm,
  },
  trustStrip: {
    paddingVertical: spacing.xs + 2,
    noteFontSize: fontSize.xs,
  },
  inputStrip: {
    maxHeight: 196,
    paddingVertical: spacing.xs + 2,
  },
  workspace: {
    minHeight: 288,
    diagramMinHeight: 248,
    cardBorderColor: 'rgba(59, 189, 248, 0.22)',
    resultBarBackground: colors.surface2,
  },
  primaryResult: {
    label: typography.tabLabel,
    valueSize: fontSize.xxl + 4,
    valueLineHeight: 34,
  },
  dock: {
    minTopBarHeight: layout.topBarHeight - 8,
    actionEmphasisBorder: colors.primaryBorder,
    actionEmphasisBackground: colors.primaryMuted,
    actionEmphasisText: colors.primary,
  },
} as const;
