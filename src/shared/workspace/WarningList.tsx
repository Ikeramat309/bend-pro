import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export type WarningListProps = {
  warnings: string[];
};

/** Compact calculator warnings — supporting UI that must not replace the diagram. */
export function WarningList({ warnings }: WarningListProps) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      {warnings.map((warning) => (
        <Text key={warning} style={styles.text} numberOfLines={3}>
          {warning}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.warning,
  },
});
