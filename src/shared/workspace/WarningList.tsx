import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, workspaceTheme } from '@/theme';

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
        <Text
          key={warning}
          style={styles.text}
          numberOfLines={workspaceTheme.warningStrip.maxLines}>
          {warning}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 46, 0.35)',
    backgroundColor: 'rgba(255, 210, 46, 0.06)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  text: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
    color: colors.warning,
  },
});
