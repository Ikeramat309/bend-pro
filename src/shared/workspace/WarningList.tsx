import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, useTheme, workspaceTheme, type ThemePalette } from '@/theme';

export type WarningListProps = {
  warnings: string[];
};

/** Compact calculator warnings — supporting UI that must not replace the diagram. */
export function WarningList({ warnings }: WarningListProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    card: {
      gap: 2,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: c.warningTintBorder,
      backgroundColor: c.warningTint,
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: spacing.xs,
    },
    text: {
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '500',
      color: c.warning,
    },
  });
}
