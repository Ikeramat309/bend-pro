import { colors } from './colors';
import { layout, radius, spacing } from './spacing';
import { fontSize, typography } from './typography';

/** Shared UI tokens for hub screens, fields, and sheets. */
export const uiTheme = {
  hub: {
    contentGap: spacing.xxl,
    sectionGap: spacing.md,
    sectionTitle: {
      ...typography.tabLabel,
      color: colors.muted,
      fontWeight: '600' as const,
      letterSpacing: 0.75,
      textTransform: 'uppercase' as const,
    },
    navCard: {
      minHeight: 68,
      borderRadius: radius.lg,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.lg,
    },
    listGroup: {
      borderRadius: radius.lg,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    listRow: {
      minHeight: 60,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    search: {
      minHeight: 48,
      borderRadius: radius.lg,
      borderColor: colors.border,
      backgroundColor: colors.surface2,
      focusBorderColor: colors.primaryBorder,
    },
    settingsCard: {
      borderRadius: radius.lg,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.lg,
      gap: spacing.md,
    },
    intro: {
      ...typography.subtitle,
      color: colors.muted,
      fontSize: fontSize.sm,
      lineHeight: 20,
    },
    chevronSize: 26,
  },
  field: {
    label: {
      fontSize: 10,
      lineHeight: 13,
      fontWeight: '600' as const,
      letterSpacing: 0.65,
      textTransform: 'uppercase' as const,
      color: colors.muted,
    },
    shell: {
      borderRadius: radius.sm,
      backgroundColor: colors.surface2,
      borderColor: colors.border,
      focusBorderColor: colors.primaryBorder,
      focusBackground: colors.surface,
    },
    defaultMinHeight: 52,
    compactMinHeight: 68,
    defaultValueSize: fontSize.xxl + 4,
    compactValueSize: fontSize.xxl,
  },
  layout: {
    maxContentWidth: layout.maxContentWidth,
    screenPadding: spacing.lg,
    sectionBottom: spacing.section,
  },
  benderCard: {
    borderRadius: radius.lg,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    activeBorderColor: colors.primaryBorder,
    activeBackgroundColor: colors.primaryMuted,
    padding: spacing.lg,
  },
  sheet: {
    backdrop: 'rgba(5, 7, 11, 0.86)',
    borderRadius: 20,
    handleColor: colors.border,
    maxHeight: '88%' as const,
    primaryBackground: colors.primary,
    secondaryBackground: colors.surface,
    intro: {
      ...typography.subtitle,
      color: colors.muted,
      fontSize: fontSize.sm,
      lineHeight: 20,
    },
    formGroupTitle: {
      fontSize: fontSize.xs,
      lineHeight: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.55,
      textTransform: 'uppercase' as const,
      color: colors.text,
    },
    formGroupHint: {
      ...typography.subtitle,
      color: colors.muted,
      fontSize: fontSize.sm,
      lineHeight: 20,
    },
  },
  chip: {
    minHeight: 44,
    borderRadius: radius.md,
    groupTitle: {
      fontSize: fontSize.xs,
      lineHeight: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.55,
      textTransform: 'uppercase' as const,
      color: colors.muted,
    },
  },
  bottomNav: {
    activeBackground: colors.primaryMuted,
    iconSize: 18,
  },
  fractionKeypad: {
    keyRadius: radius.md,
  },
} as const;
