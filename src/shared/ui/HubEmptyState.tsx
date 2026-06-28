import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { uiTheme, useTheme, type ThemePalette } from '@/theme';

export type HubEmptyStateProps = {
  title: string;
  body?: string;
};

export function HubEmptyState({ title, body }: HubEmptyStateProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    card: {
      gap: 4,
      borderRadius: uiTheme.hub.settingsCard.borderRadius,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      padding: uiTheme.hub.settingsCard.padding,
    },
    title: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '600',
      color: c.text,
    },
    body: {
      fontSize: 14,
      lineHeight: 20,
      color: c.muted,
    },
  });
}
