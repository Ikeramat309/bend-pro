import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';

export type HubStatusBadgeProps = {
  label: string;
  tone?: 'primary' | 'warning' | 'muted';
};

export function HubStatusBadge({ label, tone = 'primary' }: HubStatusBadgeProps) {
  return (
    <View style={[styles.badge, tone === 'primary' && styles.primary, tone === 'warning' && styles.warning]}>
      <Text style={[styles.text, tone === 'primary' && styles.textPrimary, tone === 'warning' && styles.textWarning]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  primary: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.background,
  },
  warning: {
    borderColor: 'rgba(255, 210, 46, 0.35)',
    backgroundColor: 'rgba(255, 210, 46, 0.08)',
  },
  text: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  textPrimary: {
    color: colors.primary,
  },
  textWarning: {
    color: colors.warning,
  },
});
