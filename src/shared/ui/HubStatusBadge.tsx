import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme, type ThemePalette } from '@/theme';

export type HubStatusBadgeProps = {
  label: string;
  tone?: 'primary' | 'warning' | 'muted';
};

export function HubStatusBadge({ label, tone = 'primary' }: HubStatusBadgeProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={[styles.badge, tone === 'primary' && styles.primary, tone === 'warning' && styles.warning]}>
      <Text style={[styles.text, tone === 'primary' && styles.textPrimary, tone === 'warning' && styles.textWarning]}>
        {label}
      </Text>
    </View>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    badge: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface2,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    primary: {
      borderColor: c.primaryBorder,
      backgroundColor: c.background,
    },
    warning: {
      borderColor: c.warningTintBorder,
      backgroundColor: c.warningTint,
    },
    text: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '700',
      letterSpacing: 0.4,
      color: c.muted,
      textTransform: 'uppercase',
    },
    textPrimary: {
      color: c.primary,
    },
    textWarning: {
      color: c.warning,
    },
  });
}
