import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

export type WarningListProps = {
  warnings: string[];
};

/** Calculator warning messages — renders nothing when the list is empty. */
export function WarningList({ warnings }: WarningListProps) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      {warnings.map((warning) => (
        <Text key={warning} style={styles.text}>
          {warning}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  text: {
    ...typography.subtitle,
    color: colors.warning,
  },
});
