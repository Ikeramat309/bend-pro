import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography, useTheme, type ThemePalette } from '@/theme';

export type BenderProfileContextTone = 'info' | 'warning';

export type BenderProfileContextProps = {
  message: string;
  action?: string;
  tone?: BenderProfileContextTone;
};

function toneStyles(
  c: ThemePalette,
): Record<BenderProfileContextTone, { border: string; background: string; text: string }> {
  return {
    info: {
      border: c.border,
      background: c.surface2,
      text: c.muted,
    },
    warning: {
      border: c.warning,
      background: 'rgba(255, 210, 46, 0.06)',
      text: c.warning,
    },
  };
}

/** Shows where the active bender profile's values come from for this calculator. */
export function BenderProfileContext({
  message,
  action,
  tone = 'info',
}: BenderProfileContextProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const palette = toneStyles(colors)[tone];

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

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
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
      color: c.muted,
    },
  });
}
