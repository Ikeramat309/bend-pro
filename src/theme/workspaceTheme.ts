import { colors } from './colors';
import { layout, spacing } from './spacing';
import { fontSize, typography } from './typography';

/** Calculator workspace layout tokens — polish through shared shell, not per-screen. */
export const workspaceTheme = {
  header: {
    minHeight: 44,
    titleSize: fontSize.base,
    subtitleSize: fontSize.xs,
    paddingVertical: spacing.xs + 2,
  },
  trustStrip: {
    paddingVertical: spacing.xs,
    noteFontSize: fontSize.xs,
  },
  inputStrip: {
    maxHeight: 168,
    paddingVertical: spacing.xs,
    rowGap: spacing.sm,
  },
  workspace: {
    minHeight: 300,
    diagramMinHeight: 232,
    cardBorderColor: 'rgba(59, 189, 248, 0.22)',
    resultBarBackground: colors.surface2,
    resultStripMaxHeight: 50,
    resultStripPaddingHorizontal: spacing.sm + 2,
    resultStripPaddingVertical: 6,
    wrapPaddingTop: spacing.xs,
    wrapPaddingBottom: spacing.xs,
  },
  primaryResult: {
    label: typography.tabLabel,
    valueSize: fontSize.lg,
    valueLineHeight: 24,
  },
  warningStrip: {
    paddingVertical: spacing.xs,
    maxLines: 2,
  },
  dock: {
    minTopBarHeight: layout.topBarHeight - 12,
    paddingTop: spacing.xs + 2,
    actionMinHeight: 40,
    actionEmphasisBorder: colors.primaryBorder,
    actionEmphasisBackground: colors.primaryMuted,
    actionEmphasisText: colors.primary,
  },
} as const;
