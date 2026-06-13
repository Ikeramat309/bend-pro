import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

export type BenderProfileContextTone = 'info' | 'warning';

export type BenderProfileContextProps = {
  message: string;
  action?: string;
  tone?: BenderProfileContextTone;
};

const toneStyles: Record<
  BenderProfileContextTone,
  { border: string; background: string; text: string }
> = {
  info: {
    border: colors.border,
    background: colors.surface2,
    text: colors.muted,
  },
  warning: {
    border: colors.warning,
    background: 'rgba(255, 210, 46, 0.06)',
    text: colors.warning,
  },
};

/** Shows where the active bender profile's values come from for this calculator. */
export function BenderProfileContext({
  message,
  action,
  tone = 'info',
}: BenderProfileContextProps) {
  const palette = toneStyles[tone];

  return (
    <View
      style={[
        styles.card,
        { borderColor: palette.border, backgroundColor: palette.background },
      ]}>
      <Text style={[styles.message, { color: palette.text }]}>{message}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  message: {
    ...typography.subtitle,
    fontWeight: '600',
  },
  action: {
    ...typography.subtitle,
    color: colors.muted,
  },
});
